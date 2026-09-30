import type { ProfileConfig } from "@/types/config";
import { withUserConfig } from "@/utils/config-overlay.ts";

/**
 * 博主资料：头像 / 名称 / 简介 / 社交链接（侧栏 Profile 卡片、页脚、RSS 作者等消费）。
 * 类型见 src/types/config.ts。
 */
export const profileConfig: ProfileConfig = withUserConfig("profile", {
	avatar: "/assets/raiden/avatar.png",
	name: "北冥",
	bio: "心向稻妻，钟情雷电将军。在须臾之间，珍藏旅途中的每一刻。",
	links: [
		{
			name: "原神",
			icon: "material-symbols:sports-esports-outline-rounded",
			url: "https://ys.mihoyo.com/",
		},
		{
			name: "雷电将军",
			icon: "material-symbols:bolt-rounded",
			url: "https://wiki.hoyolab.com/pc/genshin/entry/49?lang=zh-cn",
		},
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/MatildaHan",
		},
	],
});
