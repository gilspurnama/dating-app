import httpStatus from 'http-status';
import { findUserById } from '../db/users';
import { ErroHandler } from '../config/errorHandler';
import { USER_NOT_FOUND } from '../utils/constant';
import { createMessage, findMessageToUserId } from '../db/messages';

const addNewMessage = async (from: string, to: string, message: string) => {
	const fromUser = await findUserById(from);
	const toUser = await findUserById(to);

	if (!fromUser || !toUser) {
		throw new ErroHandler({ name: httpStatus['404_NAME'], message: USER_NOT_FOUND, code: httpStatus.NOT_FOUND });
	}

	return await createMessage({
		fromUserId: from,
		toUserId: to,
		message,
		timestamp: new Date()
	});
};

const getConversations = async (from: string, to: string, page: number) => {
	const fromMessage = await findMessageToUserId(from, to, page, 10 * page);
	const toMessage = await findMessageToUserId(to, from, page, 10 * page);

	const combineMessage = [...fromMessage, ...toMessage];
	logging.info(combineMessage);
	return combineMessage.sort(function (a, b) {
		return a.timestamp!.getTime() - b.timestamp!.getTime();
	});
};

export const messageServices = {
	addNewMessage,
	getConversations
};
