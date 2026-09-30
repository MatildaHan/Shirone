import type { AboutConfig } from "@/types/aboutConfig.ts";
import { withUserConfig } from "@/utils/config-overlay.ts";

export const aboutConfig: AboutConfig = withUserConfig("about", {
	enable: true,
	title: "关于北冥",
	description: "心向稻妻，与影同行。在须臾之间，记录提瓦特与生活。",
});
