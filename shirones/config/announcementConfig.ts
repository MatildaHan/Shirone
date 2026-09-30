import type { AnnouncementConfig } from "@/types/announcementConfig";
import { withUserConfig } from "@/utils/config-overlay.ts";

/**
 * 公告栏配置
 * 组件显示由 sidebarConfig 统一控制
 */
export const announcementConfig: AnnouncementConfig = withUserConfig(
	"announcement",
	{
		title: "鸣神手记",
		content: "旅行者，欢迎来到「须臾之间」。我是北冥，在这里记录提瓦特的见闻，也收藏稻妻的雷光与日常。愿你我都能在须臾之中，找到值得珍藏的永恒。", // 公告内容
		closable: true, // 允许用户关闭公告
		link: {
			enable: true, // 启用链接
			text: "走进提瓦特", // 链接文本
			url: "https://ys.mihoyo.com/", // 链接 URL
			external: true, // 外部链接
		},
	},
);
