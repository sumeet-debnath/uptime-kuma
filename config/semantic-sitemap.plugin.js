import { readFileSync } from "node:fs";
import { parseAst } from "rollup/parseAst";

const ROUTER = new URL("../src/router.js", import.meta.url);

/**
 * The value of a literal AST node; anything else (a component, a function) is undefined.
 * @param {object} node an AST node
 * @returns {any} its value
 */
function literal(node) {
    switch (node?.type) {
        case "Literal":
            return node.value;
        case "ArrayExpression":
            return node.elements.map(literal);
        case "ObjectExpression":
            return Object.fromEntries(node.properties.map((p) => [p.key.name ?? p.key.value, literal(p.value)]));
        default:
            return undefined;
    }
}

/**
 * The route table of src/router.js as plain objects: { path, children, meta }
 * @returns {object[]} the routes
 */
function readRoutes() {
    const ast = parseAst(readFileSync(ROUTER, "utf8"));
    const declaration = ast.body.flatMap((s) => s.declarations ?? []).find((d) => d.id.name === "routes");
    return literal(declaration.init);
}

/**
 * Put a page at its segments under the node of the longest path it starts with.
 * @param {object} node the sitemap node to put it under
 * @param {string[]} segments the page's path segments, from that node
 * @param {string|undefined} name the page's name
 * @returns {void}
 */
function place(node, segments, name) {
    for (const child of node.children ?? []) {
        const own = child.path.split("/");
        if (own.length < segments.length && own.every((s, i) => s === segments[i])) {
            return place(child, segments.slice(own.length), name);
        }
    }
    node.children ??= [];
    node.children.push({ path: segments.join("/"), ...(name ? { name } : {}) });
}

/**
 * The sitemap: one node per page (a route with meta.screen), nested by path. A child path that
 * starts with "/" is placed by that full path, as vue-router does; ":id" becomes
 * "{<meta.sitemap.params.id>}"; meta.sitemap === false leaves a page out.
 * @param {object[]} routes the route table
 * @returns {object} the sitemap's root node
 */
export function buildSitemap(routes) {
    const root = { path: "/" };
    const params = {};
    const walk = (list, parentPath) => {
        for (const route of list ?? []) {
            const full = route.path.startsWith("/") ? route.path : `${parentPath}/${route.path}`.replace(/\/+$/, "");
            Object.assign(params, route.meta?.sitemap?.params);
            if (route.meta?.screen && route.meta?.sitemap !== false) {
                const segments = full
                    .replace(/^\//, "")
                    .split("/")
                    .map((s) => (s.startsWith(":") ? `{${params[s.slice(1)] ?? s.slice(1)}}` : s));
                place(root, segments, route.meta.sitemap?.name);
            }
            walk(route.children, full);
        }
    };
    walk(routes, "");
    return root;
}

/**
 * A Vite plugin: the semantic sitemap, served in dev and written into the build
 * @returns {import("vite").Plugin} the plugin
 */
export default function semanticSitemap() {
    const source = () => JSON.stringify(buildSitemap(readRoutes()), null, 4);
    return {
        name: "semantic-sitemap",
        configureServer(server) {
            server.middlewares.use("/semantic-sitemap.json", (req, res) => {
                res.setHeader("Content-Type", "application/json");
                res.end(source());
            });
        },
        generateBundle() {
            this.emitFile({ type: "asset", fileName: "semantic-sitemap.json", source: source() });
        },
    };
}
