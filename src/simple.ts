import {ChainError} from "./chain";
import {QuickErr} from "./base";

export class SimpleError extends QuickErr {
    message: string;

    constructor(message: any) {
        super();
        if (typeof message === "string") {
            this.message = message;
        }
        else if (message.toString() !== "[object Object]") {
            this.message = message.toString();
        } else {
            try {
                this.message = JSON.stringify(message);
            } catch (e) {
                this.message = "[unserializable]";
            }
        }
    }

    is(t: QuickErr): boolean {
        return Object.is(this, t);
    }

    ctx(ctx: any): QuickErr {
        return new ChainError([this]).ctx(ctx);
    }

    toString(): string {
        return this.message;
    }

    debug(): string {
        return this.message;
    }
}