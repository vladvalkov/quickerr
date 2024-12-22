"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const index_1 = require("./index");
var EnumError;
(function (EnumError) {
    EnumError["Unsupported"] = "operation is unsupported";
})(EnumError || (EnumError = {}));
const UnsupportedError = (0, index_1.quickerr)(EnumError.Unsupported);
(0, globals_1.describe)("singular", () => {
    (0, globals_1.test)('is()', () => {
        (0, globals_1.expect)(UnsupportedError.is(UnsupportedError)).toBe(true);
        const anotherUnsupportedError = (0, index_1.quickerr)(EnumError.Unsupported);
        (0, globals_1.expect)(UnsupportedError.is(anotherUnsupportedError)).toBe(false);
    });
    (0, globals_1.test)('toString()', () => {
        (0, globals_1.expect)(UnsupportedError.toString()).toBe(EnumError.Unsupported);
    });
});
(0, globals_1.describe)("chained", () => {
    (0, globals_1.test)('is()', () => {
        (0, globals_1.expect)(UnsupportedError.ctx({ "a": 1 }).is(UnsupportedError)).toBe(true);
        const anotherUnsupportedError = (0, index_1.quickerr)(EnumError.Unsupported);
        (0, globals_1.expect)(UnsupportedError.ctx({ "a": 1 }).is(anotherUnsupportedError)).toBe(false);
    });
    (0, globals_1.test)('toString()', () => {
        (0, globals_1.expect)(UnsupportedError.ctx({ "a": 1 }).toString()).toBe(`{"a":1}: operation is unsupported`);
    });
});
