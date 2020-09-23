export class ServerError extends Error {
    readonly rootcause: any;

    constructor(message: string, rootcause?: any) {
        super(message);
        this.rootcause = rootcause;

        // see: typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html
        Object.setPrototypeOf(this, new.target.prototype);

        this.name = ServerError.name;
    }
}