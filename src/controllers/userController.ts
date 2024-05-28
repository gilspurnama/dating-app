import { Request, Response } from 'express';
import { userServices } from '../services/userService';
import { encrypt, random } from '../utils';
import { ErroHandler } from '../config/errorHandler';

const getUserById = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const user = await userServices.getUserById(id, false);
		return res.status(200).json({ user: user });
	} catch (error) {
		if (error instanceof ErroHandler) {
			return res.status(error.code).json(error.message);
		}
		logging.error(error);
		return res.status(400).json(error);
	}
};

const register = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	try {
		const user = await userServices.registreUser(email, password);
		return res.status(200).json({ user: user });
	} catch (error) {
		if (error instanceof ErroHandler) {
			return res.status(error.code).json(error.message);
		}
		logging.error(error);
		return res.status(400).json(error);
	}
};

const updateUser = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { firstName, lastName, bio, passions, gender, preferredGender } = req.body;

	try {
		const user = await userServices.updateUserDetail(id, firstName, lastName, bio, passions, gender, preferredGender);
		return res.status(200).json({ user: user });
	} catch (error) {
		if (error instanceof ErroHandler) {
			return res.status(error.code).json(error.message);
		}
		logging.error(error);
		return res.status(400).json(error);
	}
};

const getUserByPreferredGender = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { page } = req.query;

	try {
		const user = await userServices.getPreferredUser(id, Number(page) || 0);
		return res.status(200).json({ user: user });
	} catch (error) {
		if (error instanceof ErroHandler) {
			return res.status(error.code).json(error.message);
		}
		logging.error(error);
		return res.status(400).json(error);
	}
};

const swipeAction = async (req: Request, res: Response) => {
	const { isLike, userMatchId } = req.body;
	const { id } = req.params;
	try {
		await userServices.swipeUser(id, isLike, userMatchId);
		return res.status(200).json();
	} catch (error) {
		if (error instanceof ErroHandler) {
			return res.status(error.code).json(error.message);
		}
		logging.error(error);
		return res.status(400).json(error);
	}
};

const updateSubscriptions = async (req: Request, res: Response) => {
	const { subscription } = req.body;
	const { id } = req.params;
	try {
		await userServices.updateSubscription(id, subscription);
		return res.status(200).json();
	} catch (error) {
		if (error instanceof ErroHandler) {
			return res.status(error.code).json(error.message);
		}
		logging.error(error);
		return res.status(400).json(error);
	}
};

const populateUsers = async (req: Request, res: Response) => {
	try {
		await userServices.populateDbWithUser();
		return res.status(200).json();
	} catch (error) {
		if (error instanceof ErroHandler) {
			return res.status(error.code).json(error.message);
		}
		logging.error(error);
		return res.status(400).json(error);
	}
};

export const userController = {
	register,
	getUserById,
	updateUser,
	populateUsers,
	getUserByPreferredGender,
	swipeAction,
	updateSubscriptions
};
