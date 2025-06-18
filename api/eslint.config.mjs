import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default defineConfig([
	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
		plugins: { js, typescriptEslint },
		extends: ["js/recommended"],
	},
	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
		languageOptions: { globals: globals.node },
	},
	globalIgnores([
		"node_modules/**",
		"dist/**",
		"generated/**",
		"eslint.config.mjs",
	]),
	tseslint.configs.recommended,
	eslintConfigPrettier,
]);
