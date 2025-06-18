/* eslint-disable @typescript-eslint/no-require-imports */
const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	transform: {
		...tsJestTransformCfg,
	},
	testMatch: ["**/tests/**/*.test.ts"],
	setupFiles: ["dotenv/config"],
	setupFilesAfterEnv: ["<rootDir>/src/tests/setup.ts"],
	modulePathIgnorePatterns: ["dist"],
};
