# 须臾之间 · Shirone

个人博客，基于 Astro、Svelte、TypeScript 和 `shirones` 主题。本仓库维护站点配置与界面；文章、列表数据和内容媒体保存在独立的 [Shirone-content](https://github.com/MatildaHan/Shirone-content) 仓库。

## 本地运行

当前 Astro 依赖要求 Node.js `>=22.12.0`；pnpm 版本以 `package.json` 的 `packageManager` 为准，目前为 `12.6.0`。升级依赖后重新核对运行环境要求。

在仓库根目录运行：

```sh
pnpm install --frozen-lockfile
pnpm dev
```

开发服务默认地址为 `http://localhost:4321`，实际地址以终端输出为准。启动和检查前会自动准备内容；首次运行需要 Git 和内容仓库的读取权限。未设置环境变量时使用 `shirone.content.json` 固定的内容提交，不自动跟随内容仓库 `main`。

在本机写作，将 `CONTENT_DIR="../Shirone-content"` 写入不提交的 `.env`，然后在第二个终端运行 `pnpm content:watch`。当前内容源目录是 `/Users/matildahan/Blog/Shirone-content`。完整流程见[内容分离说明](docs/content-separation.md)，每个内容区的字段、操作和配置对应关系见[内容使用指南](https://github.com/MatildaHan/Shirone-content/blob/main/docs/content-guide.md)。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `pnpm install --frozen-lockfile` | 按已提交的锁文件安装依赖，不更新锁文件 |
| `pnpm dev` | 启动开发服务 |
| `pnpm astro check` | 检查 Astro 与 TypeScript 诊断 |
| `pnpm build` | 构建站点，输出到 `dist/` |
| `pnpm preview` | 预览已有构建结果，需先完成构建 |
| `pnpm content:sync` | 将指定的本地内容或固定远端版本准备到构建镜像 |
| `pnpm content:watch` | 监听内容源并同步保存后的改动，配合开发服务使用 |

依赖调整与主题升级的操作见[维护指南](docs/maintenance.md#主题升级)。

## 项目地图

| 路径 | 用途 |
| --- | --- |
| `shirones/config/` | 站点、导航、字体、评论及功能配置 |
| `shirone.content.json` | 内容仓库地址及固定的 Git 提交版本 |
| `scripts/content-sync.mjs` | 内容获取、镜像和冲突保护；不修改内容源 |
| `../Shirone-content/` | 本机的内容源仓库，日常写作和素材管理入口 |
| `.content-src/` | 未指定本地源时获取的固定版本缓存，不直接编辑 |
| `shirones/data/`、`shirones/blocks/` | 自动准备的列表与作者/公告数据镜像，不提交、不直接编辑 |
| `shirones/content/` | 自动准备的文章、瞬间、系列、关于与引用片段镜像，不直接编辑 |
| `src/components/`、`src/layouts/` | 本地组件与布局定制 |
| `src/styles/` | 本地样式，目前由 `personal-theme.css` 承载视觉定制 |
| `src/assets/` | 源资源，例如字体；图片能否经过构建优化取决于使用方式 |
| `src/content.config.ts` | 内容集合接入及本地转换，目前统一覆盖文章封面 |
| `public/` | 品牌图、favicon、logo 与界面音效留在本站；`images/` 及动漫/音乐/项目/瞬间媒体由内容仓库镜像，保持 URL |
| `astro.config.mjs` | 主题集成与显式组件覆盖，目前注册本地 `MainGridLayout` 与中文标记版 `TimelineCard` |
| `tsconfig.json` | 类型配置；现有 `@/`、`@components/` 等别名指向主题依赖内部 |

`dist/` 是构建输出，`.astro/` 和 `.shirones/` 是生成类型与集成缓存，`node_modules/` 是安装的依赖。这些目录不是日常修改入口，不提交其生成文件；其他生成目录以 `.gitignore` 为准。

## 项目规范

- [AI 工作与代码约定](AGENTS.md)：修改边界、协作方式及结果报告。
- [维护指南](docs/maintenance.md)：内容与素材管理、主题升级、按影响验收、发布与恢复。
- [内容分离说明](docs/content-separation.md)：两个仓库的职责、同步与版本更新流程。
- [相册数据说明](https://github.com/MatildaHan/Shirone-content/blob/main/public/images/albums/README.md)和[相册目录规则](https://github.com/MatildaHan/Shirone-content/blob/main/public/images/albums/AGENTS.md)：相册的局部约定；当前测试可用性见维护指南。

## 文档维护

新增或改变目录用途、命令、修改入口或维护流程时，更新对应文档。项目事实与命令维护在本文件，AI 工作规则维护在 `AGENTS.md`，操作步骤与验收维护在 `docs/maintenance.md`，其他位置链接引用。日常文章编辑无需更新规范。
