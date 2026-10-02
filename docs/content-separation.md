# 配置与内容分离

配置与界面在 [Shirone](https://github.com/MatildaHan/Shirone)，内容在 [Shirone-content](https://github.com/MatildaHan/Shirone-content)。本机分别是 `/Users/matildahan/Blog/Shirone` 与 `/Users/matildahan/Blog/Shirone-content`。内容仓每个区的字段、示例和对应配置见[内容使用指南](https://github.com/MatildaHan/Shirone-content/blob/main/docs/content-guide.md)。

## 两个仓库的职责

主仓保留所有 `shirones/config/*Config.ts` 与其他功能配置、`src/` 组件/样式/字体、依赖与锁文件、构建脚本。域名、站点标题、副标题、栏目标题/说明、导航、分类定义、功能开关、配色和动效属于站点设置，继续在配置里管理。品牌图 `public/assets/raiden/`、favicon、logo 和界面音效 `public/assets/audio/` 也保留主仓；内容可以引用这些稳定的站点路径。

内容仓负责 Markdown、MDX、所有 9 个列表数据模块、作者资料、公告文字、页脚 HTML 和内容媒体。原文件名、slug、元数据及媒体路径保持不变。迁移后的镜像关系如下：

| 内容仓源 | 主仓构建镜像 | 配置入口 |
| --- | --- | --- |
| `content/posts/` | `shirones/content/posts/` | `articleConfig.ts`、`postListConfig.ts`、`permalinkConfig.ts` |
| `content/moments/` | `shirones/content/moments/` | `momentsConfig.ts` |
| `content/series/` | `shirones/content/series/` | `seriesConfig.ts` |
| `content/spec/about.md` | `shirones/content/spec/about.md` | `aboutConfig.ts` |
| `content/snippets/` | `shirones/content/snippets/` | 使用片段的文章或独立内容 |
| `data/{friends,projects,timeline,skills,devices,games,anime,music,compass}.ts` | `shirones/data/` | 对应名称的 `*Config.ts` |
| `blocks/profile.ts`、`blocks/announcement.ts` | `shirones/blocks/` | `profileConfig.ts`、`announcementConfig.ts`、`sidebarConfig.ts` |
| `footer.html` | `shirones/config/FooterConfig.html` | `footerConfig.ts` |
| `public/` | 相同相对路径的 `public/` 文件 | 引用它的内容区或配置 |

栏目开关、导航入口、侧栏可见性是不同设置，详细对应关系见内容使用指南。配置中的 `items` 或音乐 `tracks` 兼容字段不作为第二份内容清单。

## 本机写作与预览

在主仓根目录创建不提交的 `.env`：

```dotenv
CONTENT_DIR="../Shirone-content"
```

该相对路径从主仓根目录计算，也可以使用绝对路径。首次使用可按 README 克隆内容仓。同步读取该仓库已跟踪及尚未提交的文件，遵循内容仓 `.gitignore`，因此可以预览工作稿。TS 数据的主题类型与 `@/` 别名在主仓环境中检查，不需要给内容仓单独安装主题。

在主仓运行：

```sh
pnpm content:sync
pnpm dev
```

边写边预览时在第二个终端运行 `pnpm content:watch`，它每秒同步本地保存的变化；Astro 会重新加载镜像。停止任一服务时按 Ctrl+C。`pnpm dev`、`pnpm build`、`pnpm astro check` 均先自动同步一次，单独的 `pnpm preview` 只预览已有构建。

只编辑内容仓的源文件。主仓的镜像被 Git 忽略，直接改镜像会在下次同步时产生冲突并停止整批写入。先把需要的改动保存回内容源，再让镜像与源一致；不要删同步记录来绕过保护。源删除文件时，只清除上次同步记录且没有独立修改的对应文件，不清空 `public/` 或整个内容目录。

## 固定版本与新环境

没有 `CONTENT_DIR` 时，脚本根据主仓 `shirone.content.json` 的 `repository` 和完整 `revision` 获取内容到 `.content-src/`，再准备镜像。首次获取需要网络与 Git 读取权限，后续同一版本可直接使用缓存。远端 `main` 有新提交不会改变构建内容；缓存存在未提交改动时同步报错，避免把手改缓存混入固定版本。

新环境只需克隆主仓、安装依赖并使用 README 中的标准命令，不需要 Git submodule 或独立的手动复制步骤。需要认证时使用 Git 的认证机制，不将令牌写入 URL、文档或配置。

更新固定版本按以下顺序进行：

1. 在内容仓完成编辑，在主仓执行必要检查及预览。
2. 仅暂存本次内容，提交并推送内容仓的 `main`。记录 `git rev-parse HEAD` 的完整 40 位提交哈希，确认已经推送。
3. 在主仓把 `shirone.content.json` 的 `revision` 改为该哈希；需要的新分类或功能设置同时在主仓修改。
4. 用 `CONTENT_DIR= pnpm astro check` 和 `CONTENT_DIR= pnpm build` 检查远端固定版本，避免本地未提交内容掩盖问题。环境变量空值优先于 `.env` 的本地设置。
5. 按维护指南验收后提交、推送主仓。内容仓和主仓各自保留提交历史，主仓固定内容提交可定位该版本使用的全部内容。

这里只更新 GitHub 源码。当前未增加部署工作流，推送成功不代表站点已经部署。未来构建平台仍使用 `pnpm build`；私有内容仓需要平台提供 Git 读取权限。

## 兼容性与验收

主题自带 `paths.data` 接入列表数据，Astro 四个集合仍从 `shirones/content/` 加载。相册扫描、Markdown 引用、图片尺寸解析和自定义页脚依赖固定主仓路径，因此保留生成镜像，不改主题源码或复制整套组件。内容目录、文章 ID、相册 ID 和资源 URL 不因仓库迁移变化。

按[维护指南](maintenance.md#按改动影响验收)运行 Astro/TypeScript 检查、构建与相关页面预览。内容分离本身还需比较迁移前后文件和路由，验证本地源与无本地环境的固定版本都能构建。同步脚本保护行为可用临时仓库验证；不引入测试框架。

动漫抓取与瞬间缩略图的旧注释包含本项目不存在的同步命令，当前不能将它们当作可执行流程。快照读取目录现在是 `shirones/data/anime-snapshots/`，未来若需要提交快照，应在内容仓 `data/anime-snapshots/` 管理，再更新版本。构建生成的媒体不自动回写内容仓。
