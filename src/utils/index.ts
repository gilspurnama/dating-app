import crypto from 'crypto';

const SECRET = 'DAT!NG_APP5';

export const random = () => crypto.randomBytes(128).toString('base64');
export const encrypt = (salt: string, password: string) => {
	return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
};

export const sanitizeEmail = (email: string) => {
	return decodeURI(email).toLowerCase();
};
