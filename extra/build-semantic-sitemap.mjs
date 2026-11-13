// Writes public/semantic-sitemap.json (the Agent Object Model's semantic sitemap) from the
// routes in src/router.js, and fails when the map isn't valid.
//
// A route is on the map when it, or the route it sits in, renders a page: each record's
// `meta.sitemap` is `false` to leave it out, or `{ name, params }` to name the page and its
// params ("id" → "monitorId"). Records without `meta` (layouts) add nothing of their own.
// router.js can't be imported in Node (it creates the browser history and loads the pages),
// so its `routes` array is read as data: components become their names.
import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";
import { validateSitemap } from "@agent-om/core/sitemap";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = fs.readFileSync(path.join(root, "src/router.js"), "utf8");

const start = source.indexOf("const routes = [");
if (start < 0) {
    throw new Error("src/router.js: no `const routes = [`");
}
let depth = 0;
let end = -1;
for (let i = source.indexOf("[", start); i < source.length; i++) {
    if (source[i] === "[") {
        depth++;
    } else if (source[i] === "]") {
        depth--;
        if (depth === 0) {
            end = i + 1;
            break;
        }
    }
}
const text = source.slice(source.indexOf("[", start), end);
const sandbox = {};
for (const [, name] of text.matchAll(/component:\s*(\w+)/g)) {
    sandbox[name] = name;
}
const routes = vm.runInNewContext(`(${text})`, sandbox);

// Every page: its full path as segments, with its name
const pages = [];
const walk = (records, parentPath, parentLeftOut) => {
    for (const record of records) {
        const full = record.path.startsWith("/")
            ? record.path
            : `${parentPath.replace(/\/$/, "")}/${record.path}`.replace(/\/$/, "") || "/";
        const sitemap = record.meta?.sitemap;
        const leftOut = sitemap === false || (sitemap === undefined && parentLeftOut);
        if (record.meta && !leftOut && record.path !== "/") {
            const params = sitemap?.params ?? {};
            const segments = full
                .split("/")
                .filter(Boolean)
                .map((s) => (s.startsWith(":") ? `{${params[s.slice(1)] ?? s.slice(1)}}` : s));
            pages.push({ segments, name: sitemap?.name });
        }
        if (record.children) {
            // A child of a left-out record (Settings' tabs) is on the map only when it says so;
            // its tabs have no `sitemap` of their own, so they inherit nothing.
            walk(record.children, full, false);
        }
    }
};
walk(routes, "/", false);

// A trie of segments; a segment with no page of its own folds into its children
const trie = { children: new Map() };
for (const page of pages) {
    let node = trie;
    for (const segment of page.segments) {
        if (!node.children.has(segment)) {
            node.children.set(segment, { children: new Map() });
        }
        node = node.children.get(segment);
    }
    node.page = page;
}
const emit = (node, prefix) => {
    const out = [];
    for (const [segment, child] of node.children) {
        const at = [...prefix, segment];
        if (child.page) {
            const entry = { path: at.join("/") };
            if (child.page.name) {
                entry.name = child.page.name;
            }
            const children = emit(child, []);
            if (children.length) {
                entry.children = children;
            }
            out.push(entry);
        } else {
            out.push(...emit(child, at));
        }
    }
    return out;
};
const map = { path: "/", name: "Uptime Kuma", children: emit(trie, []) };

const warnings = validateSitemap(map);
if (warnings.length) {
    for (const w of warnings) {
        console.error(`semantic-sitemap: ${w.code}: ${w.message}`);
    }
    process.exit(1);
}
const out = path.join(root, "public/semantic-sitemap.json");
fs.writeFileSync(out, JSON.stringify(map, null, 4) + "\n");
console.log(`semantic-sitemap: ${pages.length} pages written to public/semantic-sitemap.json`);
