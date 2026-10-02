import type { AnnouncementConfig } from "@/types/announcementConfig";
import { withUserConfig } from "@/utils/config-overlay.ts";
import { announcementData } from "../blocks/announcement.ts";

/**
 * 公告栏配置
 * 组件显示由 sidebarConfig 统一控制
 */
export const announcementConfig: AnnouncementConfig = withUserConfig(
	"announcement",
	{
		...announcementData,
		closable: true, // 允许用户关闭公告
		link: {
			...announcementData.link,
			enable: true, // 启用链接
			external: true, // 外部链接
		},
	},
);
