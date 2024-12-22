import type { Config } from "jest";

const config: Config = {
    modulePathIgnorePatterns: ["<rootDir>/dist/"],
    transform: {
        "^.+.tsx?$": ["ts-jest", {}],
    },
    testEnvironment: "node",
};

export default config;
