/**
 * AE Script Manager — 阶段 3 (已修复中文编码、Hover 与自适应布局)
 * Adobe After Effects 可停靠脚本管理器面板
 * 兼容 AE 2020 ~ 2025，基于 ExtendScript (ES3)
 */

var SM = SM || {};

// =========================================================================
// 模块：SM.Util —— 通用工具
// =========================================================================
SM.Util = (function () {
    var util = {};

    util.safe = function (fn, fallback) {
        try {
            return fn();
        } catch (e) {
            return fallback;
        }
    };

    util.joinPath = function (base, sub) {
        if (!base) { return sub; }
        var last = base.charAt(base.length - 1);
        if (last === "/" || last === "\\") {
            return base + sub;
        }
        return base + "/" + sub;
    };

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

    util.containsCI = function (haystack, needle) {
        if (!needle) { return true; }
        return (haystack.toLowerCase().indexOf(needle.toLowerCase()) >= 0);
    };

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

    var DEFAULT_SETTINGS = {
        version: "1.0",
        viewMode: "grid",
        sortBy: "name",
        iconSize: 64,
        pageSize: 30
    };

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

    // 安全获取解码后的文件名，修复中文乱码
    function getDecodedName(f) {
        return SM.Util.safe(function () { return decodeURI(f.name); }, f.name);
    }

    scanner.scan = function () {
        var result = [];
        var dir = scanner.getScriptDir();
        if (!dir.exists) { return result; }

        var entries = SM.Util.safe(function () { return dir.getFiles(); }, []) || [];
        var i, len, f, baseName, fName;
        var iconMap = {};
        var iconURIMap = {};

        // 第一遍：扫描 PNG，建立映射
        for (i = 0, len = entries.length; i < len; i++) {
            f = entries[i];
            if (f instanceof File) {
                fName = getDecodedName(f);
                if (SM.Util.getExtension(fName) === "png") {
                    baseName = SM.Util.getBaseName(fName);
                    iconMap[baseName] = f.fsName;
                    iconURIMap[baseName] = f.absoluteURI;
                }
            }
        }

        // 第二遍：收集脚本，配对图标
        for (i = 0, len = entries.length; i < len; i++) {
            f = entries[i];
            if (f instanceof File) {
                fName = getDecodedName(f);
                if (VALID_EXTS[SM.Util.getExtension(fName)] === true) {
                    baseName = SM.Util.getBaseName(fName);
                    var iconPath = iconMap[baseName] || null;
                    result.push({
                        name: fName,  // 使用解码后的名称作为唯一标识
                        baseName: baseName,
                        path: f.fsName,
                        iconPath: iconPath,
                        iconURI: iconURIMap[baseName] || null,
                        iconExists: (iconPath !== null)
                    });
                }
            }
        }

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

    icon.placeholderText = function (baseName, maxLen) {
        if (!baseName || baseName.length === 0) { return "?"; }
        var n = maxLen || 2;
        return baseName.length >= n ? baseName.substring(0, n) : baseName;
    };

    icon.load = function (iconPath, iconURI) {
        if (!iconPath && !iconURI) { return null; }
        return SM.Util.safe(function () {
            var img = null;
            if (!img && iconURI) {
                try { img = ScriptUI.newImage(new File(iconURI)); } catch (e1) { img = null; }
            }
            if (!img && iconPath) {
                try { img = ScriptUI.newImage(iconPath); } catch (e2) { img = null; }
            }
            if (!img && iconPath) {
                var f = new File(iconPath);
                if (f.exists) {
                    try { img = ScriptUI.newImage(f); } catch (e3) { img = null; }
                }
            }
            return img;
        }, null);
    };

    return icon;
})();

// =========================================================================
// 模块：SM.Meta —— 脚本元数据管理
// =========================================================================
SM.Meta = (function () {
    var meta = {};
    var M = null;
    meta.CATEGORIES = ["动画", "工具", "渲染"];

    meta.init = function () {
        M = SM.Storage.loadMeta();
    };

    function ensureEntry(name) {
        if (!M.scripts[name]) {
            M.scripts[name] = { favorite: false, usageCount: 0, lastUsed: 0, firstAdded: (new Date()).getTime(), category: "" };
        }
        if (typeof M.scripts[name].category !== "string") { M.scripts[name].category = ""; }
        return M.scripts[name];
    }

    meta.get = function (name) {
        if (M.scripts[name]) {
            if (typeof M.scripts[name].category !== "string") { M.scripts[name].category = ""; }
            return M.scripts[name];
        }
        return { favorite: false, usageCount: 0, lastUsed: 0, firstAdded: 0, category: "" };
    };

    meta.isFavorite = function (name) {
        var m = M.scripts[name];
        return m && m.favorite === true;
    };

    meta.getCategory = function (name) {
        var m = M.scripts[name];
        if (!m || typeof m.category !== "string") { return ""; }
        return m.category;
    };

    meta.setCategory = function (name, cat) {
        var m = ensureEntry(name);
        m.category = (cat === undefined) ? "" : cat;
        meta.save();
        return m.category;
    };

    meta.toggleFavorite = function (name) {
        var m = ensureEntry(name);
        m.favorite = !m.favorite;
        meta.save();
        return m.favorite;
    };

    meta.recordUsage = function (name) {
        var m = ensureEntry(name);
        var now = (new Date()).getTime();
        m.usageCount = (m.usageCount || 0) + 1;
        m.lastUsed = now;
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
    var S = null;

    var UI_FONT_NAME = ($.os === "Macintosh") ? "PingFang SC" : "Microsoft YaHei";

    ui.applyFont = function (el, size) {
        if (!el) { return el; }
        SM.Util.safe(function () {
            var f = ScriptUI.newFont(UI_FONT_NAME, "Regular", size || 12);
            if (f) { el.graphics.font = f; }
        }, null);
        return el;
    };

    // [重写] 兼容底层的 Hover 逻辑
    ui.addHover = function (el) {
        if (!el) return el;
        SM.Util.safe(function () {
            // ScriptUI 中 BrushType.SOLID_COLOR = 0
            // 建立带有 30% 透明度的蓝色高亮（兼容深色/浅色模式）
            var hoverBrush = el.graphics.newBrush(0, [0.4, 0.6, 0.8, 0.3]);
            var origBrush = el.graphics.backgroundColor; 
            
            el.addEventListener("mouseover", function () {
                SM.Util.safe(function () { el.graphics.backgroundColor = hoverBrush; }, null);
            });
            
            el.addEventListener("mouseout", function () {
                SM.Util.safe(function () {
                    if (origBrush) {
                        el.graphics.backgroundColor = origBrush;
                    } else if (el.parent && el.parent.graphics && el.parent.graphics.backgroundColor) {
                        // 借用父容器颜色还原，防止变成黑色方块
                        el.graphics.backgroundColor = el.parent.graphics.backgroundColor;
                    } else {
                        // 最差的兜底：画一个全透明的 brush
                        el.graphics.backgroundColor = el.graphics.newBrush(0, [1, 1, 1, 0]);
                    }
                }, null);
            });
        }, null);
        return el;
    };

    ui.init = function (settings, scripts) {
        var i, len, m;
        for (i = 0, len = scripts.length; i < len; i++) {
            m = SM.Meta.get(scripts[i].name);
            scripts[i].favorite = m.favorite || false;
            scripts[i].usageCount = m.usageCount || 0;
            scripts[i].lastUsed = m.lastUsed || 0;
            scripts[i].category = m.category || "";
        }

        S = {
            panel: null,
            settings: settings,
            allScripts: scripts,
            filtered: scripts.slice(),
            keyword: "",
            scrollPos: 0,
            visibleCount: 30,
            cols: 3,
            viewMode: settings.viewMode || "grid",
            sortBy: settings.sortBy || "name",
            activeCategory: "all",
            controls: {}
        };
    };

    ui.computeColumns = function () {
        var w = 380;
        if (S.panel && S.panel.size && S.panel.size[0] > 0) {
            w = S.panel.size[0];
        }
        var cell = (S.settings.iconSize || 64) + 24;
        var cols = Math.floor((w - 24) / cell);
        return (cols < 1) ? 1 : cols;
    };

    ui.sortFiltered = function () {
        var mode = S.sortBy;
        if (mode === "lastUsed") {
            S.filtered.sort(function (a, b) { return (b.lastUsed || 0) - (a.lastUsed || 0); });
        } else if (mode === "usageCount") {
            S.filtered.sort(function (a, b) {
                var d = (b.usageCount || 0) - (a.usageCount || 0);
                if (d !== 0) { return d; }
                if (a.baseName < b.baseName) { return -1; }
                if (a.baseName > b.baseName) { return 1; }
                return 0;
            });
        } else if (mode === "favorite") {
            S.filtered.sort(function (a, b) {
                var af = a.favorite ? 1 : 0;
                var bf = b.favorite ? 1 : 0;
                if (af !== bf) { return bf - af; }
                if (a.baseName < b.baseName) { return -1; }
                if (a.baseName > b.baseName) { return 1; }
                return 0;
            });
        } else {
            S.filtered.sort(function (a, b) {
                if (a.baseName < b.baseName) { return -1; }
                if (a.baseName > b.baseName) { return 1; }
                return 0;
            });
        }
    };

    ui.applySearch = function () {
        var kw = S.keyword;
        var cat = S.activeCategory;
        S.filtered = [];
        var i, len, item;
        for (i = 0, len = S.allScripts.length; i < len; i++) {
            item = S.allScripts[i];
            if (cat === "favorites") {
                if (!item.favorite) { continue; }
            } else if (cat && cat !== "all") {
                if (item.category !== cat) { continue; }
            }
            if (!SM.Util.containsCI(item.baseName, kw)) { continue; }
            S.filtered.push(item);
        }
        ui.sortFiltered();
        S.scrollPos = 0;
        ui.updateScrollBar();
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

    ui.addGridCell = function (parent, item) {
        var cell = parent.add("group");
        cell.orientation = "column";
        cell.alignment = ["center", "top"];
        cell.alignChildren = ["center", "top"];
        cell.margins = [4, 4, 4, 4];
        cell.spacing = 2;
        var size = S.settings.iconSize || 64;
        cell.preferredSize = [size + 16, size + 52];

        var btn;
        if (item.iconExists) {
            var img = SM.Icon.load(item.iconPath, item.iconURI);
            if (img) { btn = cell.add("iconbutton", undefined, img); } 
            else { btn = cell.add("button", undefined, SM.Icon.placeholderText(item.baseName, 2)); }
        } else {
            btn = cell.add("button", undefined, SM.Icon.placeholderText(item.baseName, 2));
        }
        btn.preferredSize = [size, size];
        btn.helpTip = item.baseName + "（点击运行）";
        ui.applyFont(btn, 11);
        var target = item;
        btn.onClick = function () { ui.runScript(target); };

        var markRow = cell.add("group");
        markRow.orientation = "row";
        markRow.alignment = ["center", "top"];
        markRow.alignChildren = ["center", "center"];
        markRow.margins = 0;
        markRow.spacing = 2;

        var star = markRow.add("button", undefined, item.favorite ? "★" : "☆");
        star.preferredSize = [22, 18];
        star.helpTip = item.favorite ? "取消收藏" : "添加收藏";
        ui.applyFont(star, 13);
        star.onClick = function () { ui.toggleFavorite(target); };

    // 【修改】分类按钮：改为显示2个汉字，未分类显示「··」
        var catLabel = item.category ? item.category.substring(0, 2) : "··";
        var catBtn = markRow.add("button", undefined, catLabel);
        // 【修改】宽度从 22 增加到 36 以容纳2个汉字
        catBtn.preferredSize = [36, 18]; 
        var catTip = item.category ? ("分类: " + item.category + "（点击修改）") : "设置分类";
        catBtn.helpTip = catTip;
        ui.applyFont(catBtn, 11);
        catBtn.onClick = function () { ui.assignCategory(target); };

        var lbl = cell.add("statictext", undefined, item.baseName);
        lbl.preferredSize = [size + 12, 18];
        lbl.alignment = ["center", "top"];
        lbl.justify = "center";
        lbl.helpTip = item.baseName;
        ui.applyFont(lbl, 11);

        ui.addHover(cell);
        return cell;
    };

    ui.addListRow = function (parent, item) {
        var row = parent.add("group");
        row.orientation = "row";
        row.alignment = ["fill", "top"];
        row.alignChildren = ["left", "center"];
        row.margins = [4, 2, 4, 2];
        row.spacing = 6;

        var star = row.add("button", undefined, item.favorite ? "★" : "☆");
        star.preferredSize = [24, 22];
        star.helpTip = item.favorite ? "取消收藏" : "添加收藏";
        ui.applyFont(star, 13);

        // 【修改】分类按钮：改为显示2个汉字，未分类显示「··」
        var catLabel = item.category ? item.category.substring(0, 2) : "··";
        var catBtn = row.add("button", undefined, catLabel);
        // 【修改】宽度从 40 增加到 52 以容纳2个汉字
        catBtn.preferredSize = [52, 22];
        var catTip = item.category ? ("分类: " + item.category + "（点击修改）") : "设置分类";
        catBtn.helpTip = catTip;
        ui.applyFont(catBtn, 11);

        var iconBtn;
        if (item.iconExists) {
            var img = SM.Icon.load(item.iconPath, item.iconURI);
            if (img) { iconBtn = row.add("iconbutton", undefined, img); } 
            else { iconBtn = row.add("button", undefined, SM.Icon.placeholderText(item.baseName, 1)); }
        } else {
            iconBtn = row.add("button", undefined, SM.Icon.placeholderText(item.baseName, 1));
        }
        iconBtn.preferredSize = [22, 22];
        iconBtn.helpTip = item.baseName + "（点击运行）";
        ui.applyFont(iconBtn, 10);

        var name = row.add("statictext", undefined, item.baseName);
        name.alignment = ["fill", "center"];
        name.helpTip = item.baseName;
        ui.applyFont(name, 11);

        var usage = row.add("statictext", undefined, "×" + (item.usageCount || 0));
        usage.preferredSize = [36, 20];
        usage.alignment = ["right", "center"];
        usage.justify = "right";
        usage.helpTip = "使用次数: " + (item.usageCount || 0);
        ui.applyFont(usage, 11);

        var lastTxt = SM.Util.formatDate(item.lastUsed || 0);
        var last = row.add("statictext", undefined, lastTxt);
        last.preferredSize = [76, 20];
        last.alignment = ["right", "center"];
        last.justify = "right";
        last.helpTip = "最近使用: " + lastTxt;
        ui.applyFont(last, 11);

        var target = item;
        star.onClick = function () { ui.toggleFavorite(target); };
        catBtn.onClick = function () { ui.assignCategory(target); };
        iconBtn.onClick = function () { ui.runScript(target); };

        ui.addHover(row);
        return row;
    };

    ui.computeVisibleCount = function () {
        var h = 0;
        if (S.controls.grid && S.controls.grid.size && S.controls.grid.size[1] > 0) {
            h = S.controls.grid.size[1];
        }
        if (h < 100) { return S.settings.pageSize || 30; }
        if (S.viewMode === "list") {
            var rowH = 26;
            return Math.max(1, Math.floor(h / rowH));
        } else {
            var cellH = (S.settings.iconSize || 64) + 52 + 6;
            var rows = Math.max(1, Math.floor(h / cellH));
            return rows * S.cols;
        }
    };

    // 滚动到指定 item 索引（带边界裁剪，网格模式强制按行对齐）
    ui.scrollTo = function (pos) {
        var total = S.filtered.length;
        var visible = ui.computeVisibleCount();
        var maxPos = Math.max(0, total - visible);

        // 【新增】网格视图强制按“行”对齐，避免滚动后图标排版错乱
        if (S.viewMode === "grid") {
            pos = Math.floor(pos / S.cols) * S.cols;
            maxPos = Math.floor(maxPos / S.cols) * S.cols;
        }

        if (pos < 0) { pos = 0; }
        if (pos > maxPos) { pos = maxPos; }
        if (pos === S.scrollPos) { return; }
        
        S.scrollPos = pos;
        if (S.controls.scrollBar) { S.controls.scrollBar.value = pos; }
        ui.renderPage();
        ui.updateStatus();
    };

    // 同步滚动条属性
    ui.updateScrollBar = function () {
        if (!S.controls.scrollBar) { return; }
        var total = S.filtered.length;
        var visible = ui.computeVisibleCount();
        S.visibleCount = visible;
        var maxPos = Math.max(0, total - visible);

        // 【新增】网格视图的最大值也要按行对齐
        if (S.viewMode === "grid") {
            maxPos = Math.floor(maxPos / S.cols) * S.cols;
        }

        S.controls.scrollBar.min = 0;
        S.controls.scrollBar.max = maxPos;
        // 【修改】网格模式的 step 为当前列数，列表模式为 1
        S.controls.scrollBar.step = (S.viewMode === "grid") ? S.cols : 1;
        S.controls.scrollBar.jump = Math.max(1, Math.floor(visible / 2));
        
        if (S.scrollPos > maxPos) { S.scrollPos = maxPos; }
        S.controls.scrollBar.value = S.scrollPos;
    };

    ui.renderPage = function () {
        ui.clearGrid();
        var g = S.controls.grid;
        var visible = S.visibleCount || ui.computeVisibleCount();
        var start = S.scrollPos;
        var end = Math.min(start + visible, S.filtered.length);

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
        var visible = S.visibleCount || ui.computeVisibleCount();
        if (!S.controls.status) { return; }
        if (total === 0) {
            S.controls.status.text = "无脚本";
            return;
        }
        var start = S.scrollPos + 1;
        var end = Math.min(S.scrollPos + visible, total);
        S.controls.status.text = "显示 " + start + "-" + end + " / 共 " + total + " 个";
    };

    ui.refresh = function () {
        SM.Util.safe(function () {
            var newScripts = SM.Scanner.scan();
            var i, len, m;
            for (i = 0, len = newScripts.length; i < len; i++) {
                m = SM.Meta.get(newScripts[i].name);
                newScripts[i].favorite = m.favorite || false;
                newScripts[i].usageCount = m.usageCount || 0;
                newScripts[i].lastUsed = m.lastUsed || 0;
                newScripts[i].category = m.category || "";
            }
            S.allScripts = newScripts;
        }, null);
        ui.applySearch();
    };

    ui.toggleFavorite = function (item) {
        SM.Util.safe(function () {
            var newFav = SM.Meta.toggleFavorite(item.name);
            item.favorite = newFav;
            if (S.sortBy === "favorite") { ui.sortFiltered(); }
            ui.renderPage();
            ui.updateStatus();
        }, null);
    };

    ui.assignCategory = function (item) {
        SM.Util.safe(function () {
            var cats = SM.Meta.CATEGORIES;
            var labels = ["（未分类）"];
            var i, len;
            for (i = 0, len = cats.length; i < len; i++) { labels.push(cats[i]); }
            var dlg = new Window("dialog", "设置分类 — " + item.baseName, undefined);
            dlg.orientation = "column";
            dlg.alignChildren = ["fill", "top"];
            dlg.margins = 16;
            dlg.spacing = 10;
            ui.applyFont(dlg, 12);

            var hint = dlg.add("statictext", undefined, "为该脚本选择一个分类：");
            hint.alignment = ["left", "center"];

            var dd = dlg.add("dropdownlist", undefined, labels);
            dd.alignment = ["fill", "center"];
            dd.preferredSize = [200, 22];
            ui.applyFont(dd, 12);
            
            var selIdx = 0;
            if (item.category) {
                for (i = 0, len = cats.length; i < len; i++) {
                    if (cats[i] === item.category) { selIdx = i + 1; break; }
                }
            }
            dd.selection = selIdx;

            var btns = dlg.add("group");
            btns.alignment = ["right", "center"];
            btns.orientation = "row";
            btns.spacing = 8;
            var cancelBtn = btns.add("button", undefined, "取消", { name: "cancel" });
            var okBtn = btns.add("button", undefined, "确定", { name: "ok" });
            ui.applyFont(cancelBtn, 12);
            ui.applyFont(okBtn, 12);

            var committed = false;
            okBtn.onClick = function () { committed = true; dlg.close(); };
            cancelBtn.onClick = function () { dlg.close(); };

            dlg.show();
            if (committed) {
                var idx = (dd.selection && typeof dd.selection.index === "number") ? dd.selection.index : 0;
                var newCat = (idx > 0) ? cats[idx - 1] : "";
                SM.Meta.setCategory(item.name, newCat);
                item.category = newCat;
                ui.renderPage();
                ui.updateStatus();
            }
        }, null);
    };

    ui.runScript = function (item) {
        SM.Util.safe(function () {
            var f = new File(item.path);
            if (!f.exists) {
                alert("脚本文件不存在：\n" + item.path);
                return;
            }
            SM.Meta.recordUsage(item.name);
            item.usageCount = (item.usageCount || 0) + 1;
            item.lastUsed = (new Date()).getTime();

            f.encoding = "UTF-8";
            $.evalFile(f);

            if (S.sortBy === "lastUsed" || S.sortBy === "usageCount") {
                ui.sortFiltered();
                ui.renderPage();
                ui.updateStatus();
            }
        }, null);
    };

    ui.setViewMode = function (mode) {
        if (mode === S.viewMode) { return; }
        S.viewMode = mode;
        S.settings.viewMode = mode;
        SM.Storage.saveSettings(S.settings);
        ui.updateTabStates();
        ui.updateScrollBar();
        ui.renderPage();
        ui.updateStatus();
    };

    ui.setCategory = function (cat) {
        if (cat === S.activeCategory) { return; }
        S.activeCategory = cat;
        ui.updateTabStates();
        ui.applySearch();
    };

    ui.updateTabStates = function () {
        if (S.controls.gridBtn) { S.controls.gridBtn.enabled = (S.viewMode !== "grid"); }
        if (S.controls.listBtn) { S.controls.listBtn.enabled = (S.viewMode !== "list"); }
        var i, len, btn, key;
        var cats = ["all"].concat(SM.Meta.CATEGORIES).concat(["favorites"]);
        for (i = 0, len = cats.length; i < len; i++) {
            key = "catBtn_" + cats[i];
            btn = S.controls[key];
            if (btn) { btn.enabled = (S.activeCategory !== cats[i]); }
        }
    };

    ui.openHomepage = function () {
        SM.Util.safe(function () {
            var url = "https://vinofx.com/";
            if ($.os === "Macintosh") {
                system.callSystem("open " + url);
            } else {
                system.callSystem('cmd /c start "" "' + url + '"');
            }
        }, null);
    };

    ui.openScriptDir = function () {
        SM.Util.safe(function () {
            var dir = SM.Scanner.getScriptDir();
            if (dir && dir.exists) {
                dir.execute();
            } else {
                alert("ScriptFile 目录不存在");
            }
        }, null);
    };

    ui.openSettings = function () {
        SM.Util.safe(function () {
            var dlg = new Window("dialog", "设置", undefined);
            dlg.orientation = "column";
            dlg.alignChildren = ["fill", "top"];
            dlg.margins = 16;
            dlg.spacing = 10;
            ui.applyFont(dlg, 12);

            var sizeLbl = dlg.add("statictext", undefined, "图标尺寸：");
            sizeLbl.alignment = ["left", "center"];

            var SIZES = [
                { label: "小 (48px)", value: 48 },
                { label: "中 (64px)", value: 64 },
                { label: "大 (80px)", value: 80 },
                { label: "特大 (96px)", value: 96 }
            ];
            var labels = [];
            var i, len, curSel = 1;
            var cur = S.settings.iconSize || 64;
            for (i = 0, len = SIZES.length; i < len; i++) {
                labels.push(SIZES[i].label);
                if (SIZES[i].value === cur) { curSel = i; }
            }
            var dd = dlg.add("dropdownlist", undefined, labels);
            dd.alignment = ["fill", "center"];
            dd.preferredSize = [180, 22];
            dd.selection = curSel;
            ui.applyFont(dd, 12);

            var info = dlg.add("statictext", undefined, "视图模式：" + (S.viewMode === "list" ? "列表" : "网格"));
            info.alignment = ["left", "center"];
            ui.applyFont(info, 11);

            var btns = dlg.add("group");
            btns.alignment = ["right", "center"];
            btns.orientation = "row";
            btns.spacing = 8;
            var cancelBtn = btns.add("button", undefined, "取消", { name: "cancel" });
            var okBtn = btns.add("button", undefined, "确定", { name: "ok" });
            ui.applyFont(cancelBtn, 12);
            ui.applyFont(okBtn, 12);

            var committed = false;
            okBtn.onClick = function () { committed = true; dlg.close(); };
            cancelBtn.onClick = function () { dlg.close(); };

            dlg.show();
            if (committed) {
                var idx = (dd.selection && typeof dd.selection.index === "number") ? dd.selection.index : curSel;
                var newSize = SIZES[idx].value;
                if (newSize !== cur) {
                    S.settings.iconSize = newSize;
                    SM.Storage.saveSettings(S.settings);
                    S.cols = ui.computeColumns();
                    ui.updateScrollBar();
                    ui.renderPage();
                    ui.updateStatus();
                }
            }
        }, null);
    };

    ui.loadLogo = function () {
        return SM.Util.safe(function () {
            var root = SM.Util.getScriptDir();
            var f = new File(SM.Util.joinPath(root.fsName, "logo.png"));
            if (!f.exists) { return null; }
            var img = ScriptUI.newImage(f);
            return img || null;
        }, null);
    };

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
        SM.Util.safe(function () {
            var f = ScriptUI.newFont(UI_FONT_NAME, "Regular", 12);
            if (f) { panel.graphics.font = f; }
        }, null);

        // ---- 工具栏 ----
        var toolbar = panel.add("group");
        toolbar.orientation = "row";
        toolbar.alignment = ["fill", "top"];
        toolbar.alignChildren = ["left", "center"]; // 改为左对齐避免极限拉扯
        toolbar.margins = 0;
        toolbar.spacing = 6;

        var logoImg = ui.loadLogo();
        var logoBtn;
        if (logoImg) { logoBtn = toolbar.add("iconbutton", undefined, logoImg); } 
        else { 
            logoBtn = toolbar.add("button", undefined, "V"); 
            ui.applyFont(logoBtn, 13);
        }
        logoBtn.preferredSize = [28, 28];
        logoBtn.helpTip = "vinofx.com — 点击打开作者首页";
        logoBtn.onClick = function () { ui.openHomepage(); };
        S.controls.logo = logoBtn;

        var searchBox = toolbar.add("edittext", undefined, "");
        searchBox.alignment = ["fill", "center"];
        searchBox.helpTip = "输入脚本名称进行过滤";
        // [修改] 删除写死的 characters，赋予 minimumSize，让其能在停靠时被挤压，不把右侧按钮顶出去
        searchBox.minimumSize = [40, 24]; 
        ui.applyFont(searchBox, 12);
        searchBox.onChanging = function () {
            S.keyword = this.text;
            ui.applySearch();
        };
        S.controls.search = searchBox;

        var gridBtn = toolbar.add("button", undefined, "网格");
        gridBtn.preferredSize = [48, 24];
        gridBtn.helpTip = "网格视图";
        ui.applyFont(gridBtn, 12);
        gridBtn.onClick = function () { ui.setViewMode("grid"); };
        S.controls.gridBtn = gridBtn;

        var listBtn = toolbar.add("button", undefined, "列表");
        listBtn.preferredSize = [48, 24];
        listBtn.helpTip = "列表视图";
        ui.applyFont(listBtn, 12);
        listBtn.onClick = function () { ui.setViewMode("list"); };
        S.controls.listBtn = listBtn;

        // ---- 分类标签栏 ----
        var categoryBar = panel.add("group");
        categoryBar.orientation = "row";
        categoryBar.alignment = ["fill", "top"];
        categoryBar.alignChildren = ["left", "center"];
        categoryBar.margins = 0;
        categoryBar.spacing = 4;

        var CAT_DEFS = [
            { label: "全部", key: "all" },
            { label: "动画", key: "动画" },
            { label: "工具", key: "工具" },
            { label: "渲染", key: "渲染" },
            { label: "★ 收藏", key: "favorites" }
        ];
        var ci, clen, cbtn;
        for (ci = 0, clen = CAT_DEFS.length; ci < clen; ci++) {
            cbtn = categoryBar.add("button", undefined, CAT_DEFS[ci].label);
            // [修改] 解除原先 preferredSize = [54, 22] 的写死逻辑，允许窄面板自适应收缩
            cbtn.preferredSize = [-1, 22]; 
            cbtn.helpTip = "按分类筛选：" + CAT_DEFS[ci].label;
            ui.applyFont(cbtn, 11);
            (function (k) { cbtn.onClick = function () { ui.setCategory(k); }; })(CAT_DEFS[ci].key);
            S.controls["catBtn_" + CAT_DEFS[ci].key] = cbtn;
        }

        // ---- 排序与状态条 ----
        var sortStatusBar = panel.add("group");
        sortStatusBar.orientation = "row";
        sortStatusBar.alignment = ["fill", "top"];
        sortStatusBar.alignChildren = ["left", "center"];
        sortStatusBar.margins = 0;
        sortStatusBar.spacing = 6;

        var sortLbl = sortStatusBar.add("statictext", undefined, "排序:");
        ui.applyFont(sortLbl, 11);
        var SORT_LABELS = ["名称", "最近", "次数", "收藏优先"];
        var SORT_KEYS = ["name", "lastUsed", "usageCount", "favorite"];
        var sortDD = sortStatusBar.add("dropdownlist", undefined, SORT_LABELS);
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
                var idx = (sortDD.selection && typeof sortDD.selection.index === "number") ? sortDD.selection.index : 0;
                var newSort = SORT_KEYS[idx] || "name";
                if (newSort !== S.sortBy) {
                    S.sortBy = newSort;
                    S.settings.sortBy = newSort;
                    SM.Storage.saveSettings(S.settings);
                    ui.sortFiltered();
                    S.scrollPos = 0;
                    ui.updateScrollBar();
                    ui.renderPage();
                    ui.updateStatus();
                }
            }, null);
        };
        S.controls.sortDD = sortDD;

        var status = sortStatusBar.add("statictext", undefined, "就绪");
        status.alignment = ["fill", "center"];
        status.justify = "right";
        // [修改] 删除 characters=24，允许停靠时压缩
        status.minimumSize = [30, -1]; 
        ui.applyFont(status, 11);
        S.controls.status = status;

        // ---- 内容区 ----
        var contentWrap = panel.add("group");
        contentWrap.orientation = "row";
        contentWrap.alignment = ["fill", "fill"];
        contentWrap.alignChildren = ["fill", "fill"];
        contentWrap.margins = 0;
        contentWrap.spacing = 4;

        var grid = contentWrap.add("group");
        grid.orientation = "column";
        grid.alignment = ["fill", "fill"];
        grid.alignChildren = ["fill", "top"];
        grid.margins = 0;
        grid.spacing = 6;
        S.controls.grid = grid;

        var scrollBar = contentWrap.add("scrollbar", undefined, 0, 0, 0);
        scrollBar.preferredSize = [16, -1];
        scrollBar.alignment = ["right", "fill"];
        scrollBar.helpTip = "拖动或点击滚动浏览脚本";
        scrollBar.onChanging = function () {
            // 【修改】必须取整，防止 AE 将浮点数传给数组切割逻辑导致崩溃或无反应
            ui.scrollTo(Math.round(this.value));
        };
        S.controls.scrollBar = scrollBar;

        // 【修改】尝试将鼠标滚轮事件挂载到顶层 panel 上，提高触发率
        SM.Util.safe(function () {
            panel.addEventListener("mousewheel", function (e) {
                var delta = 0;
                if (e) {
                    if (typeof e.delta === "number") { delta = e.delta; }
                    else if (typeof e.wheelDelta === "number") { delta = e.wheelDelta; }
                    else if (typeof e.detail === "number") { delta = -e.detail; }
                }
                if (delta !== 0) {
                    // 网格每次滚 1 行 (S.cols)，列表每次滚 3 项
                    var step = (S.viewMode === "grid") ? S.cols : 3;
                    if (delta > 0) {
                        ui.scrollTo(S.scrollPos - step);
                    } else if (delta < 0) {
                        ui.scrollTo(S.scrollPos + step);
                    }
                }
            });
        }, null);
        S.controls.scrollBar = scrollBar;

        // ---- 底部状态栏 ----
        var footer = panel.add("group");
        footer.orientation = "row";
        footer.alignment = ["fill", "bottom"];
        footer.alignChildren = ["left", "center"];
        footer.margins = 0;
        footer.spacing = 6;

        var refreshBtn = footer.add("button", undefined, "刷新");
        refreshBtn.preferredSize = [48, 24]; // 稍微缩小
        ui.applyFont(refreshBtn, 12);
        refreshBtn.onClick = function () { ui.refresh(); };

        var settingsBtn = footer.add("button", undefined, "设置");
        settingsBtn.preferredSize = [48, 24]; // 稍微缩小
        ui.applyFont(settingsBtn, 12);
        settingsBtn.onClick = function () { ui.openSettings(); };

        var openDirBtn = footer.add("button", undefined, "目录"); // 缩短文字
        openDirBtn.preferredSize = [56, 24];
        ui.applyFont(openDirBtn, 12);
        openDirBtn.onClick = function () { ui.openScriptDir(); };

        var versionLbl = footer.add("statictext", undefined, "v1.0");
        versionLbl.alignment = ["fill", "center"];
        versionLbl.justify = "right";
        versionLbl.minimumSize = [20, -1];
        ui.applyFont(versionLbl, 11);

        SM.Util.safe(function () { panel.layout.layout(true); }, null);
        S.cols = ui.computeColumns();

        // [修改] 强化调整大小的事件捕获，兼顾实时拖动(onResizing)与最终释放(onResize)
        panel.onResizing = panel.onResize = function () {
            SM.Util.safe(function () { S.panel.layout.layout(true); }, null);
            var oldCols = S.cols;
            var oldVisible = S.visibleCount;
            if (S.viewMode === "grid") {
                var newCols = ui.computeColumns();
                if (newCols !== oldCols) { S.cols = newCols; }
            }
            ui.updateScrollBar();
            if (S.cols !== oldCols || S.visibleCount !== oldVisible) {
                ui.renderPage();
                ui.updateStatus();
            }
        };

        panel.onClose = function () {
            SM.Util.safe(function () { SM.Storage.saveSettings(S.settings); }, null);
            return true;
        };

        ui.updateTabStates();
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
            SM.Meta.init();
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

SM.Bootstrap.start(this);