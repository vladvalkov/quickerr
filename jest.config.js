"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    modulePathIgnorePatterns: ["<rootDir>/dist/"],
    transform: {
        "^.+.tsx?$": ["ts-jest", {}],
    },
    testEnvironment: "node",
};
exports.default = config;
