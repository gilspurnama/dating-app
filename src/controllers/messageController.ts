import { Request, Response } from 'express';
import { ErroHandler } from '../config/errorHandler';
import { messageServices } from '../services/messageService';

const addMessage = async (req: Request, res: Response) => {
	const { from, to, message } = req.body;

	try {
		const newMessage = await messageServices.addNewMessage(from, to, message);
		return res.status(200).json(newMessage);
	} catch (error) {
		if (error instanceof ErroHandler) {
			return res.status(error.code).json(error.message);
		}
		logging.error(error);
		return res.status(400).json(error);
	}
};

const conversations = async (req: Request, res: Response) => {
	const { from, to } = req.params;
	const { page } = req.query;

	try {
		const messages = await messageServices.getConversations(from, to, Number(page));
		return res.status(200).json(messages);
	} catch (error) {
		if (error instanceof ErroHandler) {
			return res.status(error.code).json(error.message);
		}
		logging.error(error);
		return res.status(400).json(error);
	}
};

export const messageController = {
	addMessage,
	conversations
};
