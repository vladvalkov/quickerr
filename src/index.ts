import {SimpleError} from "./simple";
import {JoinError} from "./join";
import {QuickErr} from "./base";

export const quickerr = (message: string): QuickErr => new SimpleError(message);
export const joinerr = (errors: QuickErr[]): QuickErr => new JoinError(errors);

export const ErrNotImplemented = quickerr("not implemented");

export {QuickErr};