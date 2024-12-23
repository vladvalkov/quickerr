import {test, expect, describe} from "@jest/globals";
import {quickerr} from "./index";
import {ChainError} from "./chain";
import {SimpleError} from "./simple";

enum EnumError {
    Unsupported = 'operation is unsupported',
}
const UnsupportedError = quickerr(EnumError.Unsupported);
const SomethingFailed = quickerr("something failed");
const SomethingElseFailed = quickerr("something else failed");

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

    test("ctx(QuickErr)", () => {
        const finalErr = UnsupportedError
            .ctx("some context")
            .ctx(SomethingFailed)
            .ctx(SomethingElseFailed)

        expect(finalErr.is(UnsupportedError)).toBe(true)
        expect(finalErr.is(SomethingFailed)).toBe(true)
        expect(finalErr.is(SomethingElseFailed)).toBe(true)

        expect(finalErr.toString()).toBe(`something else failed: something failed: some context: operation is unsupported`)
    })
})
