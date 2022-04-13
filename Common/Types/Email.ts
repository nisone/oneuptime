import BadDataException from './Exception/BadDataException';

export default class Email {
    private _email: string = '';
    public get email(): string {
        return this._email;
    }
    public set email(v: string) {
        this._email = v;
    }

    constructor(email: string) {
        const re =
            /^(([^<>()[\].,;:\s@"]+(.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+.)+[^<>()[\].,;:\s@"]{2,})$/i;
        const isValid = re.test(email);
        if (!isValid) {
            throw new BadDataException('Email is not in valid format.');
        }
        this.email = email;
    }

    toString(): string {
        return this.email;
    }
}