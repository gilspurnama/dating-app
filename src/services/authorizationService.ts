import httpStatus from 'http-status';
import { updateUserById } from '../db/users';
import { MISSING_PARAMETER, USER_NOT_FOUND, WRONG_CREDENTIALS } from '../utils/constant';
import { ErroHandler } from '../config/errorHandler';
import { userServices } from './userService';
import { encrypt, random, sanitizeEmail } from '../utils';

const userLogin = async (email: string, password: string) => {
	if (!email || !password) {
		throw new ErroHandler({ name: httpStatus['400_NAME'], message: MISSING_PARAMETER, code: httpStatus.BAD_REQUEST });
	}
	const sanitizedEmail = sanitizeEmail(email);
	const user = await userServices.getUserByEmail(sanitizedEmail, true);

	if (!user) {
		throw new ErroHandler({ name: httpStatus['404_NAME'], message: USER_NOT_FOUND, code: httpStatus.NOT_FOUND });
	}

	const expectedHash = encrypt(user!.authentication!.salt!, password);
	if (expectedHash !== user!.authentication!.password) {
		throw new ErroHandler({ name: httpStatus['403_NAME'], message: WRONG_CREDENTIALS, code: httpStatus.UNAUTHORIZED });
	}

	const salt = random();
	const sessionToken = encrypt(salt, user._id.toString());
	const newAuthData = { ...user.authentication };
	newAuthData.sessionToken = sessionToken;
	logging.info(newAuthData);
	await updateUserById(user._id.toString(), {
		authentication: newAuthData
	});
	return {
		sessionToken
	};
};

export const authorizationService = {
	userLogin
};
