import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { postSchema, momentSchema, specSchema, seriesSchema } from "shirones/collections";

/**
 * Shirone content collections — inline schemas for full type safety and Astro
 * typegen support (a schema hidden behind a helper call cannot be
 * introspected). Edit the `base` paths if you moved the content directory;
 * the schemas themselves come from the theme.
 *
 * Generated from the theme's `src/integration/collections.manifest.json`.
 */
const posts = defineCollection({
	loader: glob({ base: "./shirones/content/posts", pattern: "**/*.{md,mdx}" }),
	// Apply the visual theme to covers without changing Markdown frontmatter.
	// A stable title-based choice keeps list, detail and sharing images in sync.
	schema: postSchema.transform((post) => ({
		...post,
		image: Array.from(post.title).reduce((sum, character) => sum + character.codePointAt(0)!, 0) % 2
			? "/assets/raiden/quiet.webp"
			: "/assets/raiden/sakura.webp",
	})),
});

const moments = defineCollection({
	loader: glob({ base: "./shirones/content/moments", pattern: "**/*.md" }),
	schema: momentSchema,
});

const spec = defineCollection({
	loader: glob({ base: "./shirones/content/spec", pattern: "**/*.{md,mdx}" }),
	schema: specSchema,
});

const series = defineCollection({
	loader: glob({ base: "./shirones/content/series", pattern: "**/*.md" }),
	schema: seriesSchema,
});

export const collections = { posts, moments, spec, series } as const;
