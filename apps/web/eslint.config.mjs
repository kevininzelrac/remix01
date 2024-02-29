import preset from "@app/config/eslint/preset";
import tseslint from "typescript-eslint";

export default tseslint.config(...preset, {
  ignores: ["build/*"],
});
