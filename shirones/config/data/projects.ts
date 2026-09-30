/**
 * 项目页数据源（纯内容）。
 * 页面展示与筛选规则由 src/config/projectsConfig.ts 控制。
 */
import type { ProjectItem } from "@/types/projectsConfig";

export const projectsData: ProjectItem[] = [
	{
		key: "shirone",
		title: "Shirone",
		summary:
			"An Astro blog theme shaped around an M3E component system, expressive content, and resilient client navigation.",
		category: "theme",
		phase: "building",
		technologies: ["静态站点", "界面组件", "类型检查", "样式工具"],
		icon: "material-symbols:deployed-code-outline-rounded",
		cover: "/assets/projects/shirone.webp",
		coverAlt: "Shirone theme homepage preview",
		featured: true,
		repository: "https://github.com/LyraVoid/Shirone",
		year: "2026",
	},
	{
		key: "folkpatch",
		title: "FolkPatch",
		summary: "A kernel-level root solution for Android, built on APatch.",
		category: "android",
		phase: "building",
		technologies: ["移动开发", "内核补丁", "安卓系统"],
		icon: "material-symbols:terminal-rounded",
		repository: "https://github.com/LyraVoid/FolkPatch",
	},
	{
		key: "kernelpatch",
		title: "KernelPatch",
		summary:
			"A kernel patch framework that powers APatch-style root on Android by loading code into the running kernel.",
		category: "android",
		phase: "shipped",
		technologies: ["系统编程", "系统内核", "安卓系统"],
		icon: "material-symbols:extension-outline-rounded",
		repository: "https://github.com/lyravoid/KernelPatch",
	},
];

/** 获取所有项目数据列表 */
export function getProjectsList(): ProjectItem[] {
	return projectsData;
}
