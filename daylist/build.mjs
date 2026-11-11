import { build } from "esbuild";
import { fileURLToPath } from "node:url";
await build({
  entryPoints: ["src/main.tsx"],
  outfile: "js/script.js",
  bundle: true,
  format: "iife",
  platform: "browser",
  jsx: "automatic",
  minify: false,
  alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  define: { "process.env.NODE_ENV": '"production"' },
  legalComments: "eof",
});
