import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
	timestamp: { type: Date },
	fromUserId: { type: String },
	toUserId: { type: String },
	message: { type: String }
});

export const MessageModel = mongoose.model('Message', messageSchema);

export const findMessageToUserId = (fromUserId: string, toUserId: string, limit: number, skip: number) =>
	MessageModel.find({
		fromUserId: fromUserId,
		toUserId: toUserId
	})

		.limit(limit)
		.skip(skip)
		.sort({ timestamp: -1 });

export const createMessage = (values: Record<string, any>) => new MessageModel(values).save();
