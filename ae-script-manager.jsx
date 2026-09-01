/**
 * AE Script Manager — 阶段 2
 * Adobe After Effects 可停靠脚本管理器面板
 * 兼容 AE 2020 ~ 2025，基于 ExtendScript (ES3)
 *
 * 阶段 2 已实现功能（在阶段 1 基础上递增）：
 *   阶段 1：
 *     1. 可停靠 ScriptUI 面板（自动识别 Panel / palette 模式）
 *     2. 自动扫描 ScriptFile 目录下的 .jsx / .jsxbin 脚本
 *     3. 同名 .png 图标自动配对；图标缺失时使用占位按钮
 *     4. 网格视图（列数随面板宽度自适应）
 *     5. 单击图标运行对应脚本（$.evalFile）
 *     6. 搜索框实时过滤
 *     7. 分页加载（默认每页 30 个）
 *     8. 设置持久化到本地 JSON
 *     9. 全程 try/catch 兜底，避免 AE 崩溃
 *   阶段 2 新增：
 *     10. 脚本元数据持久化（scripts-meta.json：收藏 / 使用次数 / 最近使用时间）
 *     11. 收藏切换（单元格内 ★/☆ 按钮，点击即时保存）
 *     12. 运行脚本时自动累计使用次数、刷新最近使用时间
 *     13. 列表视图（网格/列表可切换）
 *     14. 排序：名称 / 最近使用 / 使用次数 / 收藏优先
 *
 * 安装与运行：
 *   - 作为可停靠面板：将本文件复制到
 *       AE 安装目录\Support Files\Scripts\ScriptUI Panels\
 *     重启 AE，菜单「窗口」中即可看到「ae-script-manager.jsx」
 *   - 作为临时脚本：菜单「文件 → 脚本 → 运行脚本文件...」选择本文件
 *
 * 目录约定：
 *   [根]/
 *   ├── ae-script-manager.jsx        ← 本文件
 *   ├── ScriptFile/                  ← 脚本与图标存放处
 *   │   ├── 脚本A.jsx
 *   │   ├── 脚本A.png
 *   │   └── ...
 *   └── ScriptManagerConfig/        ← 首次运行自动创建
 *       ├── settings.json            ← 通用设置
 *       └── scripts-meta.json        ← 脚本元数据
 */

// ==================== 全局命名空间 ====================
var SM = SM || {};


// =========================================================================
// 模块：SM.Util —— 通用工具
// =========================================================================
SM.Util = (function () {
    var util = {};

    // 安全执行：捕获异常并返回回退值，避免任何运行时错误中断主流程
    util.safe = function (fn, fallback) {
        try {
            return fn();
        } catch (e) {
            return fallback;
        }
    };

    // 路径拼接（统一使用 / 分隔，ExtendScript 在 Win/Mac 均可识别）
    util.joinPath = function (base, sub) {
        if (!base) { return sub; }
        var last = base.charAt(base.length - 1);
        if (last === "/" || last === "\\") {
            return base + sub;
        }
        return base + "/" + sub;
    };

    // 获取本脚本（ae-script-manager.jsx）所在目录
    util.getScriptDir = function () {
        var dir = util.safe(function () {
            var f = new File($.fileName);
            if (f.exists) { return f.parent; }
            return null;
        }, null);
        if (!dir) { dir = Folder.app; }
        return dir;
    };

    util.getBaseName = function (fileName) {
        var idx = fileName.lastIndexOf(".");
        return (idx > 0) ? fileName.substring(0, idx) : fileName;
    };

    util.getExtension = function (fileName) {
        var idx = fileName.lastIndexOf(".");
        return (idx >= 0) ? fileName.substring(idx + 1).toLowerCase() : "";
    };

    // 字符串包含（忽略大小写）；needle 为空时返回 true
    util.containsCI = function (haystack, needle) {
        if (!needle) { return true; }
        return (haystack.toLowerCase().indexOf(needle.toLowerCase()) >= 0);
    };

    // 时间戳格式化为 YYYY-MM-DD；0 或无效返回 "未使用"
    util.formatDate = function (ts) {
        if (!ts) { return "未使用"; }
        var d = util.safe(function () { return new Date(ts); }, null);
        if (!d || isNaN(d.getTime())) { return "未使用"; }
        var pad = function (n) { return (n < 10) ? "0" + n : "" + n; };
        return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
    };

    return util;
})();


// =========================================================================
// 模块：SM.Storage —— 数据持久化（JSON 读写）
// =========================================================================
SM.Storage = (function () {
    var storage = {};

    var CONFIG_DIR_NAME = "ScriptManagerConfig";
    var SETTINGS_FILE = "settings.json";
    var META_FILE = "scripts-meta.json";

    // 默认设置；与已保存设置合并，保证字段完整
    var DEFAULT_SETTINGS = {
        version: "1.0",
        viewMode: "grid",        // grid | list
        sortBy: "name",          // name | lastUsed | usageCount | favorite
        iconSize: 64,
        pageSize: 30
    };

    // 获取/创建配置目录（与主脚本同级）
    storage.getConfigDir = function () {
        var root = SM.Util.getScriptDir();
        var dir = new Folder(SM.Util.joinPath(root.fsName, CONFIG_DIR_NAME));
        if (!dir.exists) {
            SM.Util.safe(function () { dir.create(); }, false);
        }
        return dir;
    };

    storage.readJSON = function (filePath, defaultVal) {
        return SM.Util.safe(function () {
            var f = new File(filePath);
            if (!f.exists) { return defaultVal; }
            f.encoding = "UTF-8";
            f.open("r");
            var content = f.read();
            f.close();
            if (!content || content.length === 0) { return defaultVal; }
            return JSON.parse(content);
        }, defaultVal);
    };

    storage.writeJSON = function (filePath, obj) {
        return SM.Util.safe(function () {
            var f = new File(filePath);
            f.encoding = "UTF-8";
            f.open("w");
            f.write(JSON.stringify(obj, null, 2));
            f.close();
            return true;
        }, false);
    };

    // ---- 设置 ----
    storage.loadSettings = function () {
        var path = SM.Util.joinPath(storage.getConfigDir().fsName, SETTINGS_FILE);
        var saved = storage.readJSON(path, {}) || {};
        var merged = {};
        var k;
        for (k in DEFAULT_SETTINGS) { merged[k] = DEFAULT_SETTINGS[k]; }
        for (k in saved) { merged[k] = saved[k]; }
        return merged;
    };

    storage.saveSettings = function (settings) {
        var path = SM.Util.joinPath(storage.getConfigDir().fsName, SETTINGS_FILE);
        return storage.writeJSON(path, settings);
    };

    // ---- 元数据 ----
    storage.loadMeta = function () {
        var path = SM.Util.joinPath(storage.getConfigDir().fsName, META_FILE);
        var saved = storage.readJSON(path, null);
        if (!saved || typeof saved !== "object") {
            return { version: "1.0", scripts: {}, recent: [] };
        }
        if (!saved.scripts) { saved.scripts = {}; }
        if (!saved.recent) { saved.recent = []; }
        return saved;
    };

    storage.saveMeta = function (meta) {
        var path = SM.Util.joinPath(storage.getConfigDir().fsName, META_FILE);
        return storage.writeJSON(path, meta);
    };

    return storage;
})();


// =========================================================================
// 模块：SM.Scanner —— 脚本目录扫描
// =========================================================================
SM.Scanner = (function () {
    var scanner = {};

    var SCRIPT_DIR_NAME = "ScriptFile";
    var VALID_EXTS = { jsx: true, jsxbin: true };

    scanner.getScriptDir = function () {
        var root = SM.Util.getScriptDir();
        return new Folder(SM.Util.joinPath(root.fsName, SCRIPT_DIR_NAME));
    };

    // 扫描脚本：返回 [{ name, baseName, path, iconPath, iconExists }]
    // 仅扫描顶层文件，不递归子目录（避免把资源子目录里的 .js 误识别为脚本）
    scanner.scan = function () {
        var result = [];
        var dir = scanner.getScriptDir();
        if (!dir.exists) { return result; }

        var entries = SM.Util.safe(function () { return dir.getFiles(); }, []) || [];
        var i, len, f, baseName;

        // 第一遍：建立图标映射表 baseName -> 图标绝对路径
        var iconMap = {};
        for (i = 0, len = entries.length; i < len; i++) {
            f = entries[i];
            if (f instanceof File && SM.Util.getExtension(f.name) === "png") {
                baseName = SM.Util.getBaseName(f.name);
                iconMap[baseName] = f.fsName;
            }
        }

        // 第二遍：收集脚本并配对图标
        for (i = 0, len = entries.length; i < len; i++) {
            f = entries[i];
            if (f instanceof File && VALID_EXTS[SM.Util.getExtension(f.name)] === true) {
                baseName = SM.Util.getBaseName(f.name);
                var iconPath = iconMap[baseName] || null;
                result.push({
                    name: f.name,
                    baseName: baseName,
                    path: f.fsName,
                    iconPath: iconPath,
                    iconExists: (iconPath !== null)
                });
            }
        }

        // 按名称升序排序（作为默认顺序）
        result.sort(function (a, b) {
            var x = a.baseName, y = b.baseName;
            if (x < y) { return -1; }
            if (x > y) { return 1; }
            return 0;
        });

        return result;
    };

    return scanner;
})();


// =========================================================================
// 模块：SM.Icon —— 图标加载与占位处理
// =========================================================================
SM.Icon = (function () {
    var icon = {};

    // 占位文本：取脚本名前 N 个字符；为空时返回 "?"
    icon.placeholderText = function (baseName, maxLen) {
        if (!baseName || baseName.length === 0) { return "?"; }
        var n = maxLen || 2;
        return baseName.length >= n ? baseName.substring(0, n) : baseName;
    };

    // 尝试加载图标，返回 ScriptUI Image 对象；失败返回 null
    icon.load = function (iconPath) {
        if (!iconPath) { return null; }
        return SM.Util.safe(function () {
            var f = new File(iconPath);
            if (!f.exists) { return null; }
            return ScriptUI.newImage(f);
        }, null);
    };

    return icon;
})();


// =========================================================================
// 模块：SM.Meta —— 脚本元数据管理（收藏 / 使用次数 / 最近使用）
// =========================================================================
SM.Meta = (function () {
    var meta = {};
    var M = null;  // 元数据对象 { version, scripts:{}, recent:[] }

    // 初始化：从磁盘加载，缺失字段补默认值
    meta.init = function () {
        M = SM.Storage.loadMeta();
    };

    // 内部：确保某脚本的元数据条目存在（写入前调用）
    function ensureEntry(name) {
        if (!M.scripts[name]) {
            M.scripts[name] = {
                favorite: false,
                usageCount: 0,
                lastUsed: 0,
                firstAdded: (new Date()).getTime()
            };
        }
        return M.scripts[name];
    }

    // 读取单脚本元数据（不存在则返回临时默认对象，不写入）
    meta.get = function (name) {
        if (M.scripts[name]) { return M.scripts[name]; }
        return { favorite: false, usageCount: 0, lastUsed: 0, firstAdded: 0 };
    };

    meta.isFavorite = function (name) {
        var m = M.scripts[name];
        return m && m.favorite === true;
    };

    // 切换收藏状态；返回新状态（true=已收藏）
    meta.toggleFavorite = function (name) {
        var m = ensureEntry(name);
        m.favorite = !m.favorite;
        meta.save();
        return m.favorite;
    };

    // 记录一次使用：累计次数 + 刷新 lastUsed + 更新 recent 列表（最多 10 条）
    meta.recordUsage = function (name) {
        var m = ensureEntry(name);
        var now = (new Date()).getTime();
        m.usageCount = (m.usageCount || 0) + 1;
        m.lastUsed = now;

        // 维护最近使用列表（去重后置顶，最多保留 10 条）
        var i;
        for (i = M.recent.length - 1; i >= 0; i--) {
            if (M.recent[i].file === name) { M.recent.splice(i, 1); }
        }
        M.recent.unshift({ file: name, ts: now });
        if (M.recent.length > 10) { M.recent.length = 10; }

        meta.save();
    };

    meta.save = function () {
        SM.Storage.saveMeta(M);
    };

    return meta;
})();


// =========================================================================
// 模块：SM.UI —— 界面构建与渲染
// =========================================================================
SM.UI = (function () {
    var ui = {};
    var S = null;  // 运行期状态

    // 跨平台中文字体名（解决 ScriptUI 默认主题字体不渲染中文导致的乱码）
    var UI_FONT_NAME = ($.os === "Macintosh") ? "PingFang SC" : "Microsoft YaHei";
    // hover 高亮背景色（淡蓝）
    var HOVER_BG = [0.92, 0.95, 1.0];

    // 为元素设置中文字体；size 默认 12
    ui.applyFont = function (el, size) {
        if (!el) { return el; }
        SM.Util.safe(function () {
            var f = ScriptUI.newFont(UI_FONT_NAME, "Regular", size || 12);
            if (f) { el.graphics.font = f; }
        }, null);
        return el;
    };

    // 为容器元素添加 hover 高亮（鼠标悬停时改变背景色）
    ui.addHover = function (el) {
        if (!el) { return el; }
        var origBg = null;
        SM.Util.safe(function () { origBg = el.graphics.backgroundColor; }, null);
        el.addEventListener("mouseover", function () {
            SM.Util.safe(function () { el.graphics.backgroundColor = HOVER_BG; }, null);
        });
        el.addEventListener("mouseout", function () {
            SM.Util.safe(function () { el.graphics.backgroundColor = origBg; }, null);
        });
        return el;
    };

    // 初始化：合并元数据到脚本项，设置运行期状态
    ui.init = function (settings, scripts) {
        // 把元数据字段合并到每个脚本项，便于直接读取/渲染
        var i, len, m;
        for (i = 0, len = scripts.length; i < len; i++) {
            m = SM.Meta.get(scripts[i].name);
            scripts[i].favorite = m.favorite || false;
            scripts[i].usageCount = m.usageCount || 0;
            scripts[i].lastUsed = m.lastUsed || 0;
        }

        S = {
            panel: null,
            settings: settings,
            allScripts: scripts,
            filtered: scripts.slice(),
            keyword: "",
            page: 0,
            cols: 3,
            viewMode: settings.viewMode || "grid",
            sortBy: settings.sortBy || "name",
            controls: {}
        };
    };

    // 计算当前列数（基于面板宽度与图标尺寸，仅网格视图使用）
    ui.computeColumns = function () {
        var w = 380;
        if (S.panel && S.panel.size && S.panel.size[0] > 0) {
            w = S.panel.size[0];
        }
        var cell = (S.settings.iconSize || 64) + 24;
        var cols = Math.floor((w - 24) / cell);
        return (cols < 1) ? 1 : cols;
    };

    // 对 filtered 数组按当前排序模式排序
    ui.sortFiltered = function () {
        var mode = S.sortBy;
        if (mode === "lastUsed") {
            // 最近使用优先（时间戳大的在前；从未使用的排最后）
            S.filtered.sort(function (a, b) {
                return (b.lastUsed || 0) - (a.lastUsed || 0);
            });
        } else if (mode === "usageCount") {
            // 使用次数多者优先；并列时按名称
            S.filtered.sort(function (a, b) {
                var d = (b.usageCount || 0) - (a.usageCount || 0);
                if (d !== 0) { return d; }
                if (a.baseName < b.baseName) { return -1; }
                if (a.baseName > b.baseName) { return 1; }
                return 0;
            });
        } else if (mode === "favorite") {
            // 收藏优先，其次按名称
            S.filtered.sort(function (a, b) {
                var af = a.favorite ? 1 : 0;
                var bf = b.favorite ? 1 : 0;
                if (af !== bf) { return bf - af; }
                if (a.baseName < b.baseName) { return -1; }
                if (a.baseName > b.baseName) { return 1; }
                return 0;
            });
        } else {
            // 默认按名称升序
            S.filtered.sort(function (a, b) {
                if (a.baseName < b.baseName) { return -1; }
                if (a.baseName > b.baseName) { return 1; }
                return 0;
            });
        }
    };

    // 应用搜索过滤 + 排序 + 重置到第 1 页 + 渲染
    ui.applySearch = function () {
        var kw = S.keyword;
        if (!kw) {
            S.filtered = S.allScripts.slice();
        } else {
            S.filtered = [];
            var i, len, item;
            for (i = 0, len = S.allScripts.length; i < len; i++) {
                item = S.allScripts[i];
                if (SM.Util.containsCI(item.baseName, kw)) {
                    S.filtered.push(item);
                }
            }
        }
        ui.sortFiltered();
        S.page = 0;
        ui.renderPage();
        ui.updateStatus();
    };

    ui.clearGrid = function () {
        var g = S.controls.grid;
        if (!g) { return; }
        while (g.children.length > 0) {
            g.remove(g.children[0]);
        }
    };

    // ---- 网格视图单元格 ----
    ui.addGridCell = function (parent, item) {
        var cell = parent.add("group");
        cell.orientation = "column";
        cell.alignment = ["center", "top"];
        cell.alignChildren = ["center", "top"];
        cell.margins = [4, 4, 4, 4];
        cell.spacing = 2;
        var size = S.settings.iconSize || 64;
        cell.preferredSize = [size + 16, size + 52];

        // 图标按钮；图标加载失败时使用文字占位按钮
        var btn;
        if (item.iconExists) {
            var img = SM.Icon.load(item.iconPath);
            if (img) {
                btn = cell.add("iconbutton", undefined, img);
            } else {
                btn = cell.add("button", undefined, SM.Icon.placeholderText(item.baseName, 2));
            }
        } else {
            btn = cell.add("button", undefined, SM.Icon.placeholderText(item.baseName, 2));
        }
        btn.preferredSize = [size, size];
        btn.helpTip = item.baseName + "（点击运行）";
        ui.applyFont(btn, 11);
        var target = item;
        btn.onClick = function () { ui.runScript(target); };

        // 收藏按钮（★/☆）
        var star = cell.add("button", undefined, item.favorite ? "★" : "☆");
        star.preferredSize = [size + 8, 18];
        star.alignment = ["center", "top"];
        star.helpTip = item.favorite ? "取消收藏" : "添加收藏";
        ui.applyFont(star, 13);
        star.onClick = function () { ui.toggleFavorite(target); };

        // 名称标签
        var lbl = cell.add("statictext", undefined, item.baseName);
        lbl.preferredSize = [size + 12, 18];
        lbl.alignment = ["center", "top"];
        lbl.justify = "center";
        lbl.helpTip = item.baseName;
        ui.applyFont(lbl, 11);

        // 单元格 hover 高亮
        ui.addHover(cell);

        return cell;
    };

    // ---- 列表视图行 ----
    ui.addListRow = function (parent, item) {
        var row = parent.add("group");
        row.orientation = "row";
        row.alignment = ["fill", "top"];
        row.alignChildren = ["left", "center"];
        row.margins = [2, 2, 2, 2];
        row.spacing = 6;

        // 收藏星
        var star = row.add("button", undefined, item.favorite ? "★" : "☆");
        star.preferredSize = [24, 22];
        star.helpTip = item.favorite ? "取消收藏" : "添加收藏";
        ui.applyFont(star, 13);

        // 小图标（单击运行）
        var iconBtn;
        if (item.iconExists) {
            var img = SM.Icon.load(item.iconPath);
            if (img) {
                iconBtn = row.add("iconbutton", undefined, img);
            } else {
                iconBtn = row.add("button", undefined, SM.Icon.placeholderText(item.baseName, 1));
            }
        } else {
            iconBtn = row.add("button", undefined, SM.Icon.placeholderText(item.baseName, 1));
        }
        iconBtn.preferredSize = [22, 22];
        iconBtn.helpTip = item.baseName + "（点击运行）";
        ui.applyFont(iconBtn, 10);

        // 名称（填充剩余宽度）
        var name = row.add("statictext", undefined, item.baseName);
        name.alignment = ["fill", "center"];
        name.characters = 20;
        name.helpTip = item.baseName;
        ui.applyFont(name, 11);

        // 使用次数
        var usage = row.add("statictext", undefined, "×" + (item.usageCount || 0));
        usage.preferredSize = [36, 20];
        usage.alignment = ["right", "center"];
        usage.justify = "right";
        usage.helpTip = "使用次数: " + (item.usageCount || 0);
        ui.applyFont(usage, 11);

        // 最近使用时间
        var lastTxt = SM.Util.formatDate(item.lastUsed || 0);
        var last = row.add("statictext", undefined, lastTxt);
        last.preferredSize = [76, 20];
        last.alignment = ["right", "center"];
        last.justify = "right";
        last.helpTip = "最近使用: " + lastTxt;
        ui.applyFont(last, 11);

        var target = item;
        star.onClick = function () { ui.toggleFavorite(target); };
        iconBtn.onClick = function () { ui.runScript(target); };

        // 行 hover 高亮
        ui.addHover(row);

        return row;
    };

    // 渲染当前页（按 viewMode 分派）
    ui.renderPage = function () {
        ui.clearGrid();
        var g = S.controls.grid;
        var pageSize = S.settings.pageSize || 30;
        var start = S.page * pageSize;
        var end = Math.min(start + pageSize, S.filtered.length);

        if (S.viewMode === "list") {
            var i;
            for (i = start; i < end; i++) {
                ui.addListRow(g, S.filtered[i]);
            }
        } else {
            var cols = S.cols;
            var row, idxInRow;
            for (i = start; i < end; i++) {
                idxInRow = (i - start) % cols;
                if (idxInRow === 0) {
                    row = g.add("group");
                    row.orientation = "row";
                    row.alignment = ["left", "top"];
                    row.alignChildren = ["left", "top"];
                    row.margins = 0;
                    row.spacing = 6;
                }
                ui.addGridCell(row, S.filtered[i]);
            }
        }

        SM.Util.safe(function () { S.panel.layout.layout(true); }, null);
    };

    ui.updateStatus = function () {
        var total = S.filtered.length;
        var pageSize = S.settings.pageSize || 30;
        var pages = (total === 0) ? 0 : Math.ceil(total / pageSize);
        var cur = (pages === 0) ? 0 : (S.page + 1);
        if (S.controls.status) {
            S.controls.status.text = "共 " + total + " 个  第 " + cur + "/" + pages + " 页";
        }
        if (S.controls.prevBtn) { S.controls.prevBtn.enabled = (S.page > 0); }
        if (S.controls.nextBtn) { S.controls.nextBtn.enabled = (S.page < pages - 1); }
    };

    ui.goPage = function (delta) {
        var pageSize = S.settings.pageSize || 30;
        var pages = (S.filtered.length === 0) ? 0 : Math.ceil(S.filtered.length / pageSize);
        var np = S.page + delta;
        if (np < 0) { np = 0; }
        if (np > pages - 1) { np = pages - 1; }
        if (np === S.page) { return; }
        S.page = np;
        ui.renderPage();
        ui.updateStatus();
    };

    // 重新扫描并刷新界面（保留当前视图与排序设置）
    ui.refresh = function () {
        SM.Util.safe(function () {
            var newScripts = SM.Scanner.scan();
            // 合并元数据
            var i, len, m;
            for (i = 0, len = newScripts.length; i < len; i++) {
                m = SM.Meta.get(newScripts[i].name);
                newScripts[i].favorite = m.favorite || false;
                newScripts[i].usageCount = m.usageCount || 0;
                newScripts[i].lastUsed = m.lastUsed || 0;
            }
            S.allScripts = newScripts;
        }, null);
        ui.applySearch();
    };

    // 切换收藏：更新元数据 + 即时保存 + 重渲当前页
    ui.toggleFavorite = function (item) {
        SM.Util.safe(function () {
            var newFav = SM.Meta.toggleFavorite(item.name);
            item.favorite = newFav;
            // 若排序依赖收藏，重新排序；否则直接重渲当前页
            if (S.sortBy === "favorite") {
                ui.sortFiltered();
            }
            ui.renderPage();
            ui.updateStatus();
        }, null);
    };

    // 运行脚本：记录使用 + 执行 + 必要时重排
    ui.runScript = function (item) {
        SM.Util.safe(function () {
            var f = new File(item.path);
            if (!f.exists) {
                alert("脚本文件不存在：\n" + item.path);
                return;
            }
            // 记录使用
            SM.Meta.recordUsage(item.name);
            item.usageCount = (item.usageCount || 0) + 1;
            item.lastUsed = (new Date()).getTime();

            // 执行（UTF-8 以正确处理含中文注释的脚本）
            f.encoding = "UTF-8";
            $.evalFile(f);

            // 若排序依赖使用记录，重排重渲
            if (S.sortBy === "lastUsed" || S.sortBy === "usageCount") {
                ui.sortFiltered();
                ui.renderPage();
                ui.updateStatus();
            }
        }, null);
    };

    // 构建主面板
    ui.buildPanel = function (thisObj) {
        var panel = null;
        SM.Util.safe(function () {
            if (thisObj instanceof Panel) {
                panel = thisObj;
            } else {
                panel = new Window("palette", "AE 脚本管理器", undefined, { resizeable: true });
            }
        }, null);
        if (!panel) { return null; }

        S.panel = panel;
        panel.orientation = "column";
        panel.alignChildren = ["fill", "top"];
        panel.margins = [8, 8, 8, 8];
        panel.spacing = 6;
        // 在面板上设置中文字体，工具栏/底部栏等子元素多数会继承（消除中文乱码）
        SM.Util.safe(function () {
            var f = ScriptUI.newFont(UI_FONT_NAME, "Regular", 12);
            if (f) { panel.graphics.font = f; }
        }, null);

        // ---- 工具栏：搜索框 + 刷新 ----
        var toolbar = panel.add("group");
        toolbar.orientation = "row";
        toolbar.alignment = ["fill", "top"];
        toolbar.alignChildren = ["fill", "center"];
        toolbar.margins = 0;
        toolbar.spacing = 6;

        var searchBox = toolbar.add("edittext", undefined, "");
        searchBox.alignment = ["fill", "center"];
        searchBox.helpTip = "输入脚本名称进行过滤";
        searchBox.characters = 12;
        ui.applyFont(searchBox, 12);
        searchBox.onChanging = function () {
            S.keyword = this.text;
            ui.applySearch();
        };
        S.controls.search = searchBox;

        var refreshBtn = toolbar.add("button", undefined, "刷新");
        refreshBtn.alignment = ["right", "center"];
        refreshBtn.preferredSize = [56, 24];
        refreshBtn.helpTip = "重新扫描 ScriptFile 目录";
        ui.applyFont(refreshBtn, 12);
        refreshBtn.onClick = function () { ui.refresh(); };
        S.controls.refresh = refreshBtn;

        // ---- 过滤栏：视图切换 + 排序 ----
        var filterBar = panel.add("group");
        filterBar.orientation = "row";
        filterBar.alignment = ["fill", "top"];
        filterBar.alignChildren = ["left", "center"];
        filterBar.margins = 0;
        filterBar.spacing = 6;

        var viewLbl = filterBar.add("statictext", undefined, "视图:");
        ui.applyFont(viewLbl, 11);
        var viewDD = filterBar.add("dropdownlist", undefined, ["网格", "列表"]);
        viewDD.preferredSize = [56, 22];
        viewDD.selection = (S.viewMode === "list") ? 1 : 0;
        viewDD.helpTip = "切换视图模式";
        ui.applyFont(viewDD, 11);
        viewDD.onChange = function () {
            SM.Util.safe(function () {
                var idx = (viewDD.selection && typeof viewDD.selection.index === "number")
                    ? viewDD.selection.index : 0;
                var newMode = (idx === 1) ? "list" : "grid";
                if (newMode !== S.viewMode) {
                    S.viewMode = newMode;
                    S.settings.viewMode = newMode;
                    SM.Storage.saveSettings(S.settings);
                    ui.renderPage();
                }
            }, null);
        };
        S.controls.viewDD = viewDD;

        var sortLbl = filterBar.add("statictext", undefined, "排序:");
        ui.applyFont(sortLbl, 11);
        var SORT_LABELS = ["名称", "最近", "次数", "收藏优先"];
        var SORT_KEYS = ["name", "lastUsed", "usageCount", "favorite"];
        var sortDD = filterBar.add("dropdownlist", undefined, SORT_LABELS);
        sortDD.preferredSize = [76, 22];
        var initSel = 0;
        var k;
        for (k = 0; k < SORT_KEYS.length; k++) {
            if (SORT_KEYS[k] === S.sortBy) { initSel = k; break; }
        }
        sortDD.selection = initSel;
        sortDD.helpTip = "排序方式";
        ui.applyFont(sortDD, 11);
        sortDD.onChange = function () {
            SM.Util.safe(function () {
                var idx = (sortDD.selection && typeof sortDD.selection.index === "number")
                    ? sortDD.selection.index : 0;
                var newSort = SORT_KEYS[idx] || "name";
                if (newSort !== S.sortBy) {
                    S.sortBy = newSort;
                    S.settings.sortBy = newSort;
                    SM.Storage.saveSettings(S.settings);
                    ui.sortFiltered();
                    S.page = 0;
                    ui.renderPage();
                    ui.updateStatus();
                }
            }, null);
        };
        S.controls.sortDD = sortDD;

        // ---- 网格内容区 ----
        var grid = panel.add("group");
        grid.orientation = "column";
        grid.alignment = ["fill", "fill"];
        grid.alignChildren = ["fill", "top"];
        grid.margins = 0;
        grid.spacing = 6;
        S.controls.grid = grid;

        // ---- 底部分页栏 ----
        var footer = panel.add("group");
        footer.orientation = "row";
        footer.alignment = ["fill", "bottom"];
        footer.alignChildren = ["left", "center"];
        footer.margins = 0;
        footer.spacing = 6;

        var prevBtn = footer.add("button", undefined, "上一页");
        prevBtn.preferredSize = [64, 22];
        ui.applyFont(prevBtn, 12);
        prevBtn.onClick = function () { ui.goPage(-1); };
        S.controls.prevBtn = prevBtn;

        var status = footer.add("statictext", undefined, "就绪");
        status.alignment = ["fill", "center"];
        status.characters = 28;
        ui.applyFont(status, 11);
        S.controls.status = status;

        var nextBtn = footer.add("button", undefined, "下一页");
        nextBtn.preferredSize = [64, 22];
        nextBtn.alignment = ["right", "center"];
        ui.applyFont(nextBtn, 12);
        nextBtn.onClick = function () { ui.goPage(1); };
        S.controls.nextBtn = nextBtn;

        // ---- 初始布局与列数 ----
        SM.Util.safe(function () { panel.layout.layout(true); }, null);
        S.cols = ui.computeColumns();

        // ---- 调整大小：仅网格视图需重算列数 ----
        panel.onResizing = function () {
            SM.Util.safe(function () { S.panel.layout.layout(true); }, null);
            if (S.viewMode !== "grid") { return; }
            var newCols = ui.computeColumns();
            if (newCols !== S.cols) {
                S.cols = newCols;
                ui.renderPage();
            }
        };

        // ---- 关闭时保存设置 ----
        panel.onClose = function () {
            SM.Util.safe(function () { SM.Storage.saveSettings(S.settings); }, null);
            return true;
        };

        // ---- 首次渲染 ----
        ui.applySearch();

        return panel;
    };

    return ui;
})();


// =========================================================================
// 模块：SM.Bootstrap —— 启动入口
// =========================================================================
SM.Bootstrap = (function () {
    var boot = {};

    boot.start = function (thisObj) {
        SM.Util.safe(function () {
            var settings = SM.Storage.loadSettings();
            SM.Meta.init();                       // 加载元数据
            var scripts = SM.Scanner.scan();
            SM.UI.init(settings, scripts);
            var panel = SM.UI.buildPanel(thisObj);
            if (panel && !(thisObj instanceof Panel)) {
                panel.show();
            }
        }, null);
    };

    return boot;
})();


// ==================== 启动 ====================
SM.Bootstrap.start(this);
