import {SimpleError} from "./simple";
import {ChainError} from "./chain";
import {QuickErr} from "./base";

export class JoinError extends QuickErr {
    constructor(
        private readonly errors: QuickErr[] = []
    ) {
        super();
    }

    ctx(ctx: any): QuickErr {
        const contextErr = new SimpleError(ctx);
        return new ChainError([this]).chain(contextErr);
    }

    is(t: QuickErr): boolean {
        return Object.is(this, t) || this.errors.some(error => error.is(t));
    }

    toString(): string {
        return this.errors.map(error => error.toString()).join("\n");
    }

    debug(): string {
        return this.errors.map(error => error.debug()).join("\n");
    }
}

