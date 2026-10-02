import { defineConfig } from "astro/config";
import shirones from "shirones";
import { readFileSync } from "node:fs";

// The theme scans collections/config/data for font subsetting. These content
// blocks live outside those roots, so include their characters explicitly.
const blockCharacters = [
  "./shirones/blocks/profile.ts",
  "./shirones/blocks/announcement.ts",
  "./shirones/config/FooterConfig.html",
].map((path) => readFileSync(new URL(path, import.meta.url), "utf8")).join("\n");

// Site-level settings (site URL, base, title, theme colour, fonts, …) live in
// `shirones/config/`. Content is prepared from the separate repository by
// `scripts/content-sync.mjs`; this file only wires the theme in.
export default defineConfig({
  integrations: [
    shirones({
      paths: {
        data: "./shirones/data",
      },
      fonts: {
        extraCharacters: blockCharacters,
      },
      // Keep the visual customization in the project so theme updates do not
      // overwrite it. All existing theme widgets and routes remain available.
      components: {
        "layouts/MainGridLayout": "./src/layouts/MainGridLayout.astro",
        "molecules/TimelineCard": "./src/components/molecules/TimelineCard.svelte",
      },
    }),
  ],
});
