export abstract class QuickErr {
    static withCtx(ctx: any): (err: QuickErr) => QuickErr {
        return (err: QuickErr) => err.ctx(ctx);
    }

    abstract ctx(ctx: any): QuickErr;
    abstract is(t: QuickErr): boolean;
    abstract toString(): string;
    abstract debug(): string;
}
