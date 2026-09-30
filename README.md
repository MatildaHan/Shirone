# 须臾之间 · Shirone

个人博客，基于 Astro、Svelte、TypeScript 和 `shirones` 主题。站点配置与文章保存在本仓库，界面通过本地布局和样式进行定制，维护时保留跟随主题升级的能力。

## 本地运行

当前 Astro 依赖要求 Node.js `>=22.12.0`；pnpm 版本以 `package.json` 的 `packageManager` 为准，目前为 `12.6.0`。升级依赖后重新核对运行环境要求。

在仓库根目录运行：

```sh
pnpm install --frozen-lockfile
pnpm dev
```

开发服务默认地址为 `http://localhost:4321`，实际地址以终端输出为准。普通本地预览无需配置环境变量；启用需要凭据的功能时，参照 `.env.example` 设置本地 `.env`，不要提交凭据。示例中部分脚本来自上游模板，是否可用以本项目 `package.json` 为准。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `pnpm install --frozen-lockfile` | 按已提交的锁文件安装依赖，不更新锁文件 |
| `pnpm dev` | 启动开发服务 |
| `pnpm astro check` | 检查 Astro 与 TypeScript 诊断 |
| `pnpm build` | 构建站点，输出到 `dist/` |
| `pnpm preview` | 预览已有构建结果，需先完成构建 |

依赖调整与主题升级的操作见[维护指南](docs/maintenance.md#主题升级)。

## 项目地图

| 路径 | 用途 |
| --- | --- |
| `shirones/config/` | 站点、导航、字体、评论及功能配置 |
| `shirones/config/data/` | 友链、项目、时间线等配置数据 |
| `shirones/content/posts/` | Markdown / MDX 文章，可使用文章目录存放配图 |
| `shirones/content/moments/` | 瞬间内容 |
| `shirones/content/series/` | 系列定义 |
| `shirones/content/spec/` | 关于等独立内容 |
| `shirones/content/snippets/` | Markdown 引用片段 |
| `src/components/`、`src/layouts/` | 本地组件与布局定制 |
| `src/styles/` | 本地样式，目前由 `personal-theme.css` 承载视觉定制 |
| `src/assets/` | 源资源，例如字体；图片能否经过构建优化取决于使用方式 |
| `src/content.config.ts` | 内容集合接入及本地转换，目前统一覆盖文章封面 |
| `public/` | 原样发布的静态文件；例如 `/assets/raiden/sakura.webp` 对应此目录下文件 |
| `astro.config.mjs` | 主题集成与显式组件覆盖，目前注册本地 `MainGridLayout` |
| `tsconfig.json` | 类型配置；现有 `@/`、`@components/` 等别名指向主题依赖内部 |

`dist/` 是构建输出，`.astro/` 和 `.shirones/` 是生成类型与集成缓存，`node_modules/` 是安装的依赖。这些目录不是日常修改入口，不提交其生成文件；其他生成目录以 `.gitignore` 为准。

## 项目规范

- [AI 工作与代码约定](AGENTS.md)：修改边界、协作方式及结果报告。
- [维护指南](docs/maintenance.md)：内容与素材管理、主题升级、按影响验收、发布与恢复。
- [相册数据说明](public/images/albums/README.md)和[相册目录规则](public/images/albums/AGENTS.md)：相册的局部约定；当前测试可用性见维护指南。

## 文档维护

新增或改变目录用途、命令、修改入口或维护流程时，更新对应文档。项目事实与命令维护在本文件，AI 工作规则维护在 `AGENTS.md`，操作步骤与验收维护在 `docs/maintenance.md`，其他位置链接引用。日常文章编辑无需更新规范。
