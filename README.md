# AE Script Manager

> Adobe After Effects 可停靠脚本管理器面板（ScriptUI Panel）
> 让上百个 .jsx / .jsxbin 脚本一站管理、即点即用。

[![Version](https://img.shields.io/badge/Version-v0.2.0%20(Phase%202)-success?style=flat-square)](./ae-script-manager.jsx)
[![Status](https://img.shields.io/badge/Status-开发中-orange?style=flat-square)](#)
[![License](https://img.shields.io/badge/License-MIT-informational?style=flat-square)](#许可证)

[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS-blue?style=flat-square)](#)
[![After Effects](https://img.shields.io/badge/After%20Effects-2020~2025-blueviolet?style=flat-square)](#兼容性)
[![Language](https://img.shields.io/badge/Language-ExtendScript%20(ES3)-yellow?style=flat-square)](#技术规范)
[![Dependencies](https://img.shields.io/badge/Dependencies-None-success?style=flat-square)](#技术规范)

[![Phase 1](https://img.shields.io/badge/Phase_1-核心可用-brightgreen?style=flat-square)](#开发路线)
[![Phase 2](https://img.shields.io/badge/Phase_2-数据交互-brightgreen?style=flat-square)](#开发路线)
[![Phase 3](https://img.shields.io/badge/Phase_3-组织能力-yellow?style=flat-square)](#开发路线)
[![Phase 4](https://img.shields.io/badge/Phase_4-优化打磨-lightgrey?style=flat-square)](#开发路线)

---

## 简介

`ae-script-manager.jsx` 是一个为 Adobe After Effects 设计的可停靠 ScriptUI 面板。它会自动扫描同目录下 `ScriptFile/` 文件夹中的所有 `.jsx` / `.jsxbin` 脚本，并配对同名 `.png` 图标，以网格或列表方式呈现，单击即可运行。

所有用户配置（视图模式、排序方式、收藏、使用次数、最近使用记录等）都持久化到本地 JSON 文件，重启 AE 后状态保留。代码基于 ExtendScript (ES3) 严格编写，不依赖任何第三方库，兼容 AE 2020 ~ 2025。

## 功能特性

### ✅ 阶段 1 — 核心可用（MVP）

- 可停靠 ScriptUI 面板（自动识别 `Panel` / `palette` 模式）
- 自动扫描 `ScriptFile/` 下的 `.jsx` / `.jsxbin` 脚本
- 同名 `.png` 图标自动配对，缺失时显示前缀占位按钮
- 网格视图（列数随面板宽度自适应）
- 单击图标运行脚本（`$.evalFile`，兼容 `.jsxbin`）
- 搜索框实时过滤
- 分页加载（默认每页 30，上百脚本不卡顿）
- 全程 try/catch 兜底，避免 AE 崩溃

### ✅ 阶段 2 — 数据与交互

- 脚本元数据持久化（`scripts-meta.json`：收藏 / 使用次数 / 最近使用时间）
- 收藏切换（网格单元 / 列表行首 ★/☆ 按钮，即时存盘）
- 运行脚本时累计使用次数 + 刷新最近使用时间 + 维护最近使用列表
- 列表视图（网格 / 列表可切换，状态持久化）
- 排序：名称 / 最近使用 / 使用次数 / 收藏优先（状态持久化）
- 跨平台中文字体（消除 ScriptUI 默认主题不渲染中文导致的乱码）
- 鼠标悬停高亮（单元格淡蓝背景色）+ 完整 tooltip 提示

### 🚧 阶段 3 — 组织能力（规划中）

- 分类标签系统（默认 + 自定义颜色）
- 分类筛选标签栏
- 置顶功能（`pinned` + `pinOrder`）
- 自定义脚本别名
- 右键上下文菜单
- 设置面板（图标大小、面板宽度等）

### ⏳ 阶段 4 — 优化打磨（规划中）

- 性能优化（虚拟滚动 / 防抖搜索）
- 图标缓存与缩略图
- 异常路径全面兜底
- 兼容性测试（AE 2020–2025 各版本 ScriptUI 差异）
- 视觉细节打磨

## 安装

### 方式 1：作为可停靠面板（推荐）

1. 将 `ae-script-manager.jsx` 复制到：
   ```
   AE 安装目录\Support Files\Scripts\ScriptUI Panels\
   ```
2. 重启 After Effects。
3. 菜单 `窗口` 中勾选 `ae-script-manager.jsx`，面板可停靠到任意位置。

### 方式 2：作为临时脚本运行

1. 菜单 `文件 → 脚本 → 运行脚本文件...`
2. 选择 `ae-script-manager.jsx`
3. 会弹出独立 palette 窗口（不可停靠）。

## 使用说明

| 操作 | 效果 |
|------|------|
| 单击网格图标 / 列表小图标 | 运行该脚本 |
| 点击 ★ / ☆ | 切换收藏（即时保存） |
| 搜索框输入 | 实时按名称过滤（忽略大小写） |
| 「视图」下拉 | 切换网格 / 列表 |
| 「排序」下拉 | 切换排序方式 |
| 「上一页 / 下一页」 | 翻页（每页 30 项） |
| 「刷新」按钮 | 重新扫描 `ScriptFile/` 目录 |
| 鼠标悬停单元格 | 背景变淡蓝 + 显示脚本名 tooltip |

首次运行会在主脚本同级自动创建 `ScriptManagerConfig/` 配置目录。

## 目录结构

```
[根]/
├── ae-script-manager.jsx          ← 主程序（单文件）
├── ScriptFile/                     ← 脚本与图标存放处
│   ├── 动画工具.jsx
│   ├── 动画工具.png                ← 同名 .png 作为图标
│   ├── 渲染助手.jsxbin
│   ├── 渲染助手.png
│   └── ...
└── ScriptManagerConfig/            ← 首次运行自动创建
    ├── settings.json               ← 通用设置
    └── scripts-meta.json           ← 脚本元数据
```

**约定**：
- 脚本文件扩展名为 `.jsx` 或 `.jsxbin`，其他扩展名会被忽略。
- 图标扩展名固定为 `.png`，文件名（不含扩展名）需与脚本完全一致。
- 仅扫描 `ScriptFile/` 顶层文件，子目录会被忽略（避免误识别资源子目录）。

## 配置文件

### settings.json

| 字段 | 类型 | 说明 |
|------|------|------|
| `viewMode` | string | 视图模式：`grid` / `list` |
| `sortBy` | string | 排序方式：`name` / `lastUsed` / `usageCount` / `favorite` |
| `iconSize` | number | 图标尺寸（默认 64） |
| `pageSize` | number | 每页脚本数（默认 30） |

### scripts-meta.json

```json
{
  "version": "1.0",
  "scripts": {
    "动画工具.jsx": {
      "favorite": false,
      "usageCount": 0,
      "lastUsed": 0,
      "firstAdded": 1693526400000
    }
  },
  "recent": [
    { "file": "动画工具.jsx", "ts": 1693526400000 }
  ]
}
```

元数据按文件名为键，避免路径变化导致失效；仅在交互（收藏切换 / 运行）时落盘，扫描阶段不写入。

## 代码结构

主文件按模块组织（均为 ES3 对象 / IIFE，无 `class`）：

| 模块 | 职责 |
|------|------|
| `SM.Util` | 通用工具（safe、路径、时间格式化、字符串包含） |
| `SM.Storage` | JSON 读写、配置目录管理 |
| `SM.Scanner` | 扫描 `ScriptFile/`，脚本与图标配对 |
| `SM.Icon` | 图标加载与占位文本生成 |
| `SM.Meta` | 元数据管理（收藏 / 使用次数 / 最近使用） |
| `SM.UI` | 界面构建与渲染（含字体、hover 高亮） |
| `SM.Bootstrap` | 启动入口 |

## 技术规范

- 严格 ES3 兼容：禁止 `let` / `const` / 箭头函数 / 模板字符串 / 解构 / `class` / `Promise` / `async-await`
- UI 使用 ScriptUI，作为可停靠 `palette` / `Panel` 模式
- 文件操作仅使用 `File` / `Folder` 对象，不依赖 Node.js 或外部库
- 所有用户配置持久化到本地 JSON，不写死代码
- 界面默认中文，关键操作有 tooltip
- 代码模块化 + 中文注释
- 全局 try/catch 兜底，避免 AE 崩溃

## 兼容性

- After Effects 2020 ~ 2025
- Windows / macOS（自动按 `$.os` 切换中文字体）
- 字体：Windows 用 `Microsoft YaHei`，macOS 用 `PingFang SC`

> 若 Windows 为纯英文版未装东亚语言包，可能仍无中文字体，需安装「中文语言包」或更换为系统中已存在的 CJK 字体（如 `SimSun`）。

## 开发路线

| 阶段 | 内容 | 状态 |
|------|------|------|
| 1 | 核心可用（MVP） | ✅ 完成 |
| 2 | 数据与交互 | ✅ 完成 |
| 3 | 组织能力（分类 / 标签 / 置顶 / 右键菜单） | 🚧 规划中 |
| 4 | 优化打磨（性能 / 兼容性 / 视觉） | ⏳ 待开始 |

## 许可证

MIT License — 可自由使用、修改、分发。
