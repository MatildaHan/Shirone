import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, lstatSync, mkdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const statePath = resolve(projectRoot, ".shirones/content-sync.json");
const mappings = [
	["content/", "shirones/content/"],
	["data/", "shirones/data/"],
	["blocks/", "shirones/blocks/"],
	["public/", "public/"],
	["footer.html", "shirones/config/FooterConfig.html"],
];

if (existsSync(resolve(projectRoot, ".env"))) {
	process.loadEnvFile(resolve(projectRoot, ".env"));
}

function git(cwd, args) {
	const result = spawnSync("git", ["-C", cwd, ...args], { encoding: "utf8" });
	if (result.error) throw result.error;
	if (result.status !== 0) throw new Error(`git ${args[0]} 失败：${result.stderr.trim()}`);
	return result.stdout.trim();
}

function resolveSource() {
	const manifest = JSON.parse(readFileSync(resolve(projectRoot, "shirone.content.json"), "utf8"));
	if (!/^[a-f0-9]{40}$/.test(manifest.revision)) {
		throw new Error("shirone.content.json 的 revision 必须是已推送的完整 Git 提交哈希。");
	}
	if (process.env.CONTENT_DIR) {
		const source = realpathSync(resolve(projectRoot, process.env.CONTENT_DIR));
		if (realpathSync(git(source, ["rev-parse", "--show-toplevel"])) !== source || source === projectRoot) {
			throw new Error("CONTENT_DIR 必须指向独立内容仓库的根目录。");
		}
		return source;
	}
	const source = resolve(projectRoot, ".content-src");
	if (!existsSync(resolve(source, ".git"))) {
		if (existsSync(source)) throw new Error(".content-src 已存在但不是 Git 仓库，请先检查该目录。");
		mkdirSync(source);
		git(source, ["init", "--initial-branch=main"]);
		git(source, ["remote", "add", "origin", manifest.repository]);
	}
	if (git(source, ["remote", "get-url", "origin"]) !== manifest.repository) {
		throw new Error(".content-src 的 origin 与 shirone.content.json 不一致，请先检查内容仓库。");
	}
	if (git(source, ["status", "--porcelain"])) {
		throw new Error(".content-src 有未提交改动，不能作为固定内容版本。请先保存内容或使用 CONTENT_DIR。");
	}
	const head = spawnSync("git", ["-C", source, "rev-parse", "--verify", "HEAD"], { encoding: "utf8" });
	if (head.stdout.trim() !== manifest.revision) {
		console.log(`[content] 获取固定版本 ${manifest.revision.slice(0, 12)}`);
		git(source, ["fetch", "--depth=1", "origin", manifest.revision]);
		git(source, ["checkout", "--detach", manifest.revision]);
	}
	return source;
}

function digest(bytes) {
	return createHash("sha256").update(bytes).digest("hex");
}

function destinationFor(file) {
	for (const [source, destination] of mappings) {
		if (source.endsWith("/") ? file.startsWith(source) : file === source) {
			return destination + file.slice(source.length);
		}
	}
	return undefined;
}

// Never follow links out of the managed tree or overwrite hand-edited mirrors.
function safePath(root, file) {
	const full = resolve(root, file);
	const rel = relative(root, full);
	if (!rel || isAbsolute(rel) || rel === ".." || rel.startsWith(`..${sep}`)) {
		throw new Error(`不安全的内容路径：${file}`);
	}
	let current = full;
	while (current !== root) {
		if (existsSync(current)) {
			const stat = lstatSync(current);
			if (stat.isSymbolicLink()) throw new Error(`内容镜像不支持符号链接：${current}`);
			if (current !== full && !stat.isDirectory()) throw new Error(`内容路径的父级不是目录：${current}`);
		}
		current = dirname(current);
	}
	return full;
}

function synchronize(source, quiet = false) {
	const directories = ["content/posts", "content/moments", "content/series", "content/spec", "content/snippets", "data", "blocks"];
	const requiredFiles = ["content/spec/about.md", "blocks/profile.ts", "blocks/announcement.ts", "footer.html"];
	for (const file of [...directories, ...requiredFiles]) {
		const input = safePath(source, file);
		if (!existsSync(input)) throw new Error(`内容仓库缺少 ${file}，同步未执行。`);
		const stat = lstatSync(input);
		if (directories.includes(file) ? !stat.isDirectory() : !stat.isFile()) {
			throw new Error(`内容仓库的 ${file} 类型错误，同步未执行。`);
		}
	}
	const oldState = existsSync(statePath) ? JSON.parse(readFileSync(statePath, "utf8")) : { files: {} };
	const trackedFiles = existsSync(resolve(projectRoot, ".git"))
		? new Set(git(projectRoot, ["ls-files", "-z"]).split("\0"))
		: new Set();
	const entries = new Map();
	// Include local drafts, while respecting the content repository's .gitignore.
	const files = git(source, ["ls-files", "-z", "--cached", "--others", "--exclude-standard"]).split("\0");
	for (const file of files) {
		const destination = destinationFor(file);
		if (!destination || file.endsWith("/.DS_Store")) continue;
		const input = safePath(source, file);
		if (!existsSync(input)) continue;
		if (!lstatSync(input).isFile()) throw new Error(`内容不是普通文件：${file}`);
		const bytes = readFileSync(input);
		entries.set(destination, { bytes, hash: digest(bytes) });
	}
	const writes = [];
	const removals = [];
	const conflicts = [];
	for (const file of new Set([...Object.keys(oldState.files), ...entries.keys()])) {
		if (trackedFiles.has(file)) throw new Error(`内容不能覆盖或移除主仓跟踪的文件：${file}`);
		if (!mappings.some(([, destination]) => destination.endsWith("/") ? file.startsWith(destination) : file === destination)) {
			throw new Error(`镜像记录含未知路径：${file}`);
		}
		const output = safePath(projectRoot, file);
		if (existsSync(output) && !lstatSync(output).isFile()) throw new Error(`镜像目标不是普通文件：${file}`);
		const actual = existsSync(output) ? digest(readFileSync(output)) : undefined;
		const incoming = entries.get(file);
		if (actual && actual !== incoming?.hash && actual !== oldState.files[file]) {
			conflicts.push(file);
		} else if (incoming && actual !== incoming.hash) {
			writes.push([output, incoming.bytes]);
		} else if (!incoming && actual) {
			removals.push(output);
		}
	}
	if (conflicts.length) {
		throw new Error(`以下镜像文件有独立改动，同步未执行。请将需要的改动保存到内容仓库：\n${conflicts.join("\n")}`);
	}
	for (const [output, bytes] of writes) {
		mkdirSync(dirname(output), { recursive: true });
		writeFileSync(output, bytes);
	}
	for (const output of removals) rmSync(output);
	const head = spawnSync("git", ["-C", source, "rev-parse", "--verify", "HEAD"], { encoding: "utf8" });
	const state = { source, revision: head.status === 0 ? head.stdout.trim() : null, files: Object.fromEntries([...entries].map(([file, entry]) => [file, entry.hash])) };
	mkdirSync(dirname(statePath), { recursive: true });
	const stateJSON = JSON.stringify(state, null, 2) + "\n";
	if (!existsSync(statePath) || readFileSync(statePath, "utf8") !== stateJSON) writeFileSync(statePath, stateJSON);
	if (!quiet || writes.length || removals.length) {
		console.log(`[content] ${source} → ${entries.size} 文件；更新 ${writes.length}，移除 ${removals.length}`);
	}
}

try {
	const source = resolveSource();
	synchronize(source);
	if (process.argv.includes("--watch")) {
		console.log("[content] 正在监听本地内容，按 Ctrl+C 结束。远端版本更新后请重新启动。");
		let lastError = "";
		setInterval(() => {
			try {
				synchronize(source, true);
				lastError = "";
			} catch (error) {
				if (error.message !== lastError) console.error(`[content] ${error.message}`);
				lastError = error.message;
			}
		}, 1000);
	}
} catch (error) {
	console.error(`[content] ${error.message}`);
	process.exitCode = 1;
}
