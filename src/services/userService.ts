import httpStatus from 'http-status';
import { createUser, findPreferredUser, findUserByEmail, findUserById, populateDummyUser, updateUserById } from '../db/users';
import { encrypt, random, sanitizeEmail } from '../utils';
import { MISSING_PARAMETER, SWIPE_LIMIT_REACHED, USER_ALREADY_EXIST, USER_NOT_FOUND } from '../utils/constant';
import { dummyData } from '../utils/dummyData';
import { ErroHandler } from '../config/errorHandler';

const getUserById = async (id: string, getPassword: boolean) => {
	if (getPassword) {
		return await findUserById(id).select('+authentication.salt +authentication.password +subscription.name +subscription.id');
	}
	return await findUserById(id).select('+subscription.name +subscription.id');
};

const getUserByEmail = async (email: string, getPassword: boolean) => {
	if (getPassword) {
		return await findUserByEmail(email).select('+authentication.salt +authentication.password +subscription.name +subscription.id');
	}
	return await findUserByEmail(email).select('+subscription.name +subscription.id');
};

const updateUserDetail = async (
	id: string,
	firstName: string,
	lastName: string,
	bio: string,
	passions: string,
	gender: string,
	preferredGender: string
) => {
	if (!id) {
		throw new ErroHandler({ name: httpStatus['400_NAME'], message: MISSING_PARAMETER, code: httpStatus.BAD_REQUEST });
	}
	const user = await findUserById(id);
	if (!user) {
		throw new ErroHandler({ name: httpStatus['404_NAME'], message: USER_NOT_FOUND, code: httpStatus.NOT_FOUND });
	}
	return await updateUserById(user._id.toString(), {
		firstName,
		lastName,
		bio,
		passions,
		gender,
		preferredGender
	}).select('+firstName +lastname +bio +passsions +gender +preferredGender');
};

const registreUser = async (email: string, password: string) => {
	if (!email || !password) {
		throw new ErroHandler({ name: httpStatus['400_NAME'], message: MISSING_PARAMETER, code: httpStatus.BAD_REQUEST });
	}

	const sanitizedEmail = sanitizeEmail(email);
	const extUser = await userServices.getUserById(sanitizedEmail, false);
	if (extUser) {
		throw new ErroHandler({ name: httpStatus['400_NAME'], message: USER_ALREADY_EXIST, code: httpStatus.BAD_REQUEST });
	}

	const salt = random();
	const hashPassword = encrypt(salt, password);
	return await createUser({
		email,
		authentication: {
			salt,
			password: hashPassword
		},
		subscription: {
			name: 'free'
		}
	});
};

const getPreferredUser = async (id: string, page: number) => {
	if (!id) {
		throw new ErroHandler({ name: httpStatus['400_NAME'], message: MISSING_PARAMETER, code: httpStatus.BAD_REQUEST });
	}

	const user = await findUserById(id).select('+subscription.name +matches.id +unmatches.id +matches.updatedAt +unmatches.updatedAt');
	if (!user) {
		throw new ErroHandler({ name: httpStatus['404_NAME'], message: USER_NOT_FOUND, code: httpStatus.NOT_FOUND });
	}

	const excludeId: [string] = [user._id.toString()];
	const viewedUser = [...user.matches, ...user.unmatches];

	if (viewedUser.length > 0) {
		const expiredMatch: Array<any> = [];
		viewedUser.forEach((user) => {
			if (user!.updatedAt!.setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0)) {
				expiredMatch.push(user);
				excludeId.push(user.id);
			}
		});

		viewedUser.filter((user) => !expiredMatch.includes(user.id));
	}

	const limit = 10;
	const verified: [boolean] = [false];
	if (user.subscription!.name !== 'free' && user.subscription!.name !== 'swipe') {
		verified.push(true);
	}
	return await findPreferredUser(excludeId, verified, user!.preferredGender!, limit, page * limit);
};

const swipeUser = async (id: string, isLike: boolean, userMatchId: string) => {
	if (!id) {
		throw new ErroHandler({ name: httpStatus['400_NAME'], message: MISSING_PARAMETER, code: httpStatus.BAD_REQUEST });
	}

	const user = await findUserById(id).select('+subscription.name');
	if (!user) {
		throw new ErroHandler({ name: httpStatus['404_NAME'], message: USER_NOT_FOUND, code: httpStatus.NOT_FOUND });
	}

	const totalSwipe = user.swipes || 0;
	const dailySwipe = user.dailySwipe || 0;

	if ((user.subscription!.name === 'free' || user.subscription!.name !== 'swipe') && dailySwipe === 10) {
		throw new ErroHandler({ name: httpStatus['400_NAME'], message: SWIPE_LIMIT_REACHED, code: httpStatus.BAD_REQUEST });
	}

	const userMatches = [...user.matches];
	const userUnmatches = [...user.unmatches];

	if (isLike) {
		userMatches.push({
			id: userMatchId,
			updatedAt: new Date()
		});
		await updateUserById(user._id.toString(), {
			swipes: totalSwipe + 1,
			dailySwipe: dailySwipe + 1,
			dailySwipeUpdatedAt: new Date(),
			matches: userMatches
		});
	} else {
		userUnmatches.push({
			id: userMatchId,
			updatedAt: new Date()
		});
		await updateUserById(user._id.toString(), {
			swipes: totalSwipe + 1,
			dailySwipe: dailySwipe + 1,
			dailySwipeUpdatedAt: new Date(),
			unmatches: userUnmatches
		});
	}
	return;
};

const updateSubscription = async (id: string, subscription: string) => {
	if (!id) {
		throw new ErroHandler({ name: httpStatus['400_NAME'], message: MISSING_PARAMETER, code: httpStatus.BAD_REQUEST });
	}

	const user = await findUserById(id).select('+subscription.name');
	if (!user) {
		throw new ErroHandler({ name: httpStatus['404_NAME'], message: USER_NOT_FOUND, code: httpStatus.NOT_FOUND });
	}

	if (subscription === 'verified' || subscription === 'both') {
		await updateUserById(user._id.toString(), {
			subscription: {
				name: subscription,
				id: random()
			},
			verified: true
		});
	} else {
		await updateUserById(user._id.toString(), {
			subscription: {
				name: subscription,
				id: random()
			}
		});
	}
};

const populateDbWithUser = async () => {
	return await populateDummyUser(dummyData);
};

export const userServices = {
	getUserById,
	getUserByEmail,
	registreUser,
	updateUserDetail,
	populateDbWithUser,
	getPreferredUser,
	swipeUser,
	updateSubscription
};
