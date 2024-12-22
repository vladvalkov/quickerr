"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinerr = exports.quickerr = void 0;
class SimpleError {
    constructor(message) {
        if (typeof message === "string") {
            this.message = message;
        }
        else if (message.toString() !== "[object Object]") {
            this.message = message.toString();
        }
        else {
            try {
                this.message = JSON.stringify(message);
            }
            catch (e) {
                this.message = "[unserializable]";
            }
        }
    }
    is(t) {
        return Object.is(this, t);
    }
    ctx(ctx) {
        return new ChainError([this]).ctx(ctx);
    }
    withCtx(ctx) {
        return (err) => new ChainError([err]).ctx(ctx);
    }
    toString() {
        return this.message;
    }
    debug() {
        return this.message;
    }
}
class ChainError {
    constructor(causes) {
        if (causes.length == 0) {
            throw new Error("ChainError requires at least 2 causes");
        }
        this.causes = causes;
    }
    chain(err) {
        return new ChainError(this.causes.concat([err]));
    }
    ctx(ctx) {
        const contextErr = new SimpleError(JSON.stringify(ctx));
        return this.chain(contextErr);
    }
    withCtx(ctx) {
        return (err) => err.ctx(ctx);
    }
    is(t) {
        return Object.is(this, t) || this.causes.some(cause => cause.is(t));
    }
    toString() {
        if (this.causes.length == 1) {
            return this.causes[0].toString();
        }
        let message = this.causes[this.causes.length - 1].toString();
        for (let i = this.causes.length - 2; i >= 0; i--) {
            message += ": " + this.causes[i].toString();
        }
        return message;
    }
    debug() {
        return `Caused by:
        ${this.causes.map((cause, i) => `\t${i}:\t${cause.debug()}`).join("\n")}`;
    }
}
class JoinError {
    constructor(errors = []) {
        this.errors = errors;
    }
    ctx(ctx) {
        const contextErr = new SimpleError(JSON.stringify(ctx));
        return new ChainError([this]).chain(contextErr);
    }
    is(t) {
        return Object.is(this, t) || this.errors.some(error => error.is(t));
    }
    withCtx(ctx) {
        return (err => err.ctx(ctx));
    }
    toString() {
        return this.errors.map(error => error.toString()).join("\n");
    }
    debug() {
        return this.errors.map(error => error.debug()).join("\n");
    }
}
const quickerr = (message) => new SimpleError(message);
exports.quickerr = quickerr;
const joinerr = (errors) => new JoinError(errors);
exports.joinerr = joinerr;
