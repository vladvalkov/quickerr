import {SimpleError} from "./simple";
import {QuickErr} from "./base";
export class ChainError extends QuickErr {
    causes: QuickErr[]

    constructor(
        causes: QuickErr[]
    ) {
        super();
        if (causes.length == 0) {
            throw new Error("ChainError requires at least 2 causes");
        }
        this.causes = causes;
    }

    chain(err: QuickErr): QuickErr {
        if (err instanceof ChainError) {
            return new ChainError(this.causes.concat(err.causes));
        }
        return new ChainError(this.causes.concat([err]));
    }

    ctx(ctx: any): QuickErr {
        if (ctx instanceof QuickErr) {
            return this.chain(ctx);
        }
        const contextErr = new SimpleError(ctx);
        return this.chain(contextErr);
    }

    is(t: QuickErr): boolean {
        return Object.is(this, t) || this.causes.some(cause => cause.is(t));
    }

    toString(): string {
        if (this.causes.length == 1) {
            return this.causes[0].toString();
        }

        let message = this.causes[this.causes.length - 1].toString();
        for (let i = this.causes.length - 2; i >= 0; i--) {
            message += ": " + this.causes[i].toString();
        }
        return message
    }

    debug(): string {
        return `Caused by:
        ${this.causes.map((cause, i) => `\t${i}:\t${cause.debug()}`).join("\n")}`;
    }
}