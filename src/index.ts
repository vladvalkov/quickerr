export interface QuickErr {
    withCtx(ctx: any): (err: QuickErr) => QuickErr;
    ctx(ctx: any): QuickErr;

    is(t: QuickErr): boolean;
    toString(): string;
    debug(): string;
}

class SimpleError implements QuickErr {
    message: string;

    constructor(message: any) {
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

    withCtx(ctx: any): (err: QuickErr) => QuickErr {
        return (err: QuickErr) =>  new ChainError([err]).ctx(ctx);
    }


    toString(): string {
        return this.message;
    }

    debug(): string {
        return this.message;
    }
}

class ChainError implements QuickErr {
    causes: QuickErr[]

    constructor(
        causes: QuickErr[]
    ) {
        if (causes.length == 0) {
            throw new Error("ChainError requires at least 2 causes");
        }
        this.causes = causes;
    }

    chain(err: QuickErr): QuickErr {
        return new ChainError(this.causes.concat([err]));
    }

    ctx(ctx: any): QuickErr {
        const contextErr = new SimpleError(JSON.stringify(ctx));
        return this.chain(contextErr);
    }

    withCtx(ctx: any): (err: QuickErr) => QuickErr {
        return (err: QuickErr) =>  err.ctx(ctx);
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

class JoinError implements QuickErr {
    constructor(
        private readonly errors: QuickErr[] = []
    ) {}

    ctx(ctx: any): QuickErr {
        const contextErr = new SimpleError(JSON.stringify(ctx));
        return new ChainError([this]).chain(contextErr);
    }

    is(t: QuickErr): boolean {
        return Object.is(this, t) || this.errors.some(error => error.is(t));
    }

    withCtx(ctx: any): (err: QuickErr) => QuickErr {
        return (err => err.ctx(ctx));
    }

    toString(): string {
        return this.errors.map(error => error.toString()).join("\n");
    }

    debug(): string {
        return this.errors.map(error => error.debug()).join("\n");
    }
}

export const quickerr = (message: string): QuickErr => new SimpleError(message);
export const joinerr = (errors: QuickErr[]): QuickErr => new JoinError(errors);