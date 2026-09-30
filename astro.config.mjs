import { defineConfig } from "astro/config";
import shirones from "shirones";

// Site-level settings (site URL, base, title, theme colour, fonts, …) live in
// `shirones/config/` so they stay typed and version-controlled with your
// content. This file only wires the theme in.
export default defineConfig({
  integrations: [
    shirones({
      // Keep the visual customization in the project so theme updates do not
      // overwrite it. All existing theme widgets and routes remain available.
      components: {
        "layouts/MainGridLayout": "./src/layouts/MainGridLayout.astro",
      },
    }),
  ],
});
