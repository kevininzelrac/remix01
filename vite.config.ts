import { unstable_vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
//import viteGraphQLPlugin from "./viteGraphQlPlugin";

export default defineConfig({
  plugins: [
    remix({ ignoredRouteFiles: [".*", "**/__tests__/**"] }),
    tsconfigPaths(),
  ],
});
