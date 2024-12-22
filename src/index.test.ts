import {test, expect, describe} from "@jest/globals";
import {quickerr} from "./index";

enum EnumError {
    Unsupported = 'operation is unsupported',
}
const UnsupportedError = quickerr(EnumError.Unsupported);

describe("singular", () => {
    test('is()', () => {
        expect(UnsupportedError.is(UnsupportedError)).toBe(true)
        const anotherUnsupportedError = quickerr(EnumError.Unsupported);
        expect(UnsupportedError.is(anotherUnsupportedError)).toBe(false)
    });

    test('toString()', () => {
        expect(UnsupportedError.toString()).toBe(EnumError.Unsupported)
    })
})

describe("chained", () => {
    test('is()', () => {
        expect(UnsupportedError.ctx({"a": 1}).is(UnsupportedError)).toBe(true)
        const anotherUnsupportedError = quickerr(EnumError.Unsupported);
        expect(UnsupportedError.ctx({"a": 1}).is(anotherUnsupportedError)).toBe(false)
    })

    test('toString()', () => {
        expect(UnsupportedError.ctx({"a": 1}).toString()).toBe(`{"a":1}: operation is unsupported`)
    })
})