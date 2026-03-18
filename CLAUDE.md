# CLAUDE.md — AI 协作规范

本文件定义了在此项目中使用 Claude Code 的规范、可用工具及编码约定。

---

## 项目概况

- **项目类型**：Svelte 5 前端博客应用
- **路由**：svelte-spa-router（Hash 路由）
- **API 请求**：axios，统一封装在 `src/services/`
- **Mock Server**：tinyhttp + lowdb，入口为 `server.js`
- **测试框架**：Vitest + @testing-library/svelte
- **代码检查**：ESLint + eslint-plugin-svelte

---

## 常用命令

```bash
npm run dev          # 启动 Vite 开发服务器（端口 5173）
npm run mock         # 启动 Mock API 服务器（端口 3000）
npm run mock:dev     # 同时启动 mock + dev（推荐开发时使用）
npm run test         # 运行单元测试
npm run lint         # ESLint 检查
npm run lint:fix     # 自动修复 lint 问题
npm run build        # 生产构建
```

---

## 项目结构

```
src/
├── components/      # 通用组件（Loading、ErrorMessage、Header、Footer 等）
├── pages/           # 页面组件（Articles、Home、MyBlog、Popular 等）
├── services/        # API 封装（api.js、request.js）
├── config/          # 配置（api.js 存放所有接口 URL）
└── App.svelte       # 根组件，路由注册

.claude/
├── agents/          # 自定义 Agent（code-review.md）
├── commands/        # Slash 命令（gen-mock.md、unit-test.md）
├── skills/          # 技能规范（svelte-data-fetching.md）
└── settings.json    # 项目级权限与 hook 配置
```

---

## 可用 AI 工具

### Slash 命令

| 命令 | 用途 |
|------|------|
| `/gen-mock [数量]` | 生成 `db.json` mock 数据和 `server.js` 路由 |
| `/unit-test [文件路径]` | 为指定文件生成 Vitest 单元测试 |

### 自定义 Agent

| Agent | 触发方式 | 用途 |
|-------|---------|------|
| `code-review` | 自动（git commit 前）或手动调用 | 对 Svelte 代码进行全面审查 |

> Code Review Agent 会在每次 `git commit` 前自动运行。存在 🔴 严重问题时将阻断提交。

### Skills（自动激活）

| Skill | 激活时机 |
|-------|---------|
| `svelte-data-fetching` | 创建/修改含 API 调用的 Svelte 组件时 |

---

## 编码规范

### API 调用（必须遵守）

所有涉及 API 的组件**必须**按 `svelte-data-fetching` skill 中定义的模式编写：

- 状态变量：`loading = true`、`error = null`
- 函数结构：`loading = true` → `try/catch/finally` → `loading = false`
- 多接口并行：使用 `Promise.all`
- 模板三态：`{#if loading}` / `{:else if error}` / `{:else}`
- 组件：必须使用 `Loading.svelte` 和 `ErrorMessage.svelte`

### 组件规范

- 单文件组件不超过 300 行，超出则拆分
- Props 必须有合理默认值
- 使用 `onDestroy` 清理事件监听和定时器
- 避免在模板中使用 `{@html}`，必须使用时需先通过 DOMPurify 转义

### 安全要求

- 禁止硬编码 token、密码等敏感信息
- 所有用户输入在渲染前必须经过校验或转义
- API 请求敏感操作需携带必要的认证信息

---

## Git 工作流

### 分支约定

- `master`：主分支，PR 合并目标
- 功能分支：`add-xxx-branch` / `fix-xxx-branch`

### 提交前自动检查（hooks）

每次 `git commit` 会依次触发：

1. **ESLint 检查**（`setting.json`）：lint 失败则阻断提交
2. **Code Review**（`settings.local.json`）：agent 审查暂存区变更，存在严重问题则阻断提交

### 提交信息规范

```
<类型> <简要说明>

类型：新增 | 修复 | 重构 | 优化 | 测试 | 配置
```

---

## 权限边界

### AI 可以自由执行

- 读取所有文件（`Read`）
- 编辑/写入 `src/` 下的文件
- 运行 `npm run *`、`npm install`
- 常规 git 操作（status、diff、log、add、commit、push、pull、checkout、branch）

### 需要用户确认

- 修改 `server.js`、`vite.config.js`、`package.json` 等配置文件
- 安装新依赖
- 写入 `src/` 以外的文件

### 禁止执行

- `rm -rf *`
- `git push --force`
- `git reset --hard`

---

## 注意事项

- `.env` 中的 `VITE_API_BASE_URL` 使用相对路径 `/api`，通过 Vite proxy 转发到 `localhost:3000`
- Mock server 和 Vite dev server 需同时启动（推荐 `npm run mock:dev`）
- `db.json` 是运行时数据文件，AI 可读取但修改前需确认
- `settings.local.json` 已在 `.gitignore` 中，不提交到远程
