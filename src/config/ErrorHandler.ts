export class ErroHandler extends Error {
	name: string;
	message: string;
	code: number;

	constructor({ name, message, code }: { name: string; message: string; code: number }) {
		super();
		this.name = name;
		this.message = message;
		this.code = code;
	}
}
