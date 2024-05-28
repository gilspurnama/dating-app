import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	email: { type: String, required: true, select: false },
	firstName: { type: String },
	lastName: { type: String },
	gender: { type: String },
	bio: { type: String },
	passions: { type: String },
	preferredGender: { type: String },
	swipes: { type: Number },
	dailySwipe: { type: Number },
	dailySwipeUpdatedAt: { type: Date },
	verified: { type: Boolean },
	authentication: {
		password: { type: String, required: true, select: false },
		salt: { type: String, select: false },
		sessionToken: { type: String, select: false }
	},
	subscription: {
		name: { type: String, select: false },
		id: { type: String, select: false }
	},
	matches: {
		type: Array,
		items: {
			type: Object,
			properties: {
				id: { type: String, select: false },
				updatedAt: { type: Date, select: false }
			}
		}
	},
	unmatches: {
		type: Array,
		items: {
			type: Object,
			properties: {
				id: { type: String, select: false },
				updatedAt: { type: Date, select: false }
			}
		}
	}
});

export const UserModel = mongoose.model('User', userSchema);

export const findUsers = () => UserModel.find();
export const findPreferredUser = (id: [string], verified: [boolean], preferred: string, limit: number, skip: number) =>
	UserModel.find({
		_id: { $nin: id },
		verified: { $in: verified },
		gender: preferred
	})

		.limit(limit)
		.skip(skip)
		.sort({ verified: -1 })
		.select('+_id +firstName +lastName +bio +passions');
export const findUserByEmail = (email: string) => UserModel.findOne({ email });
export const findUserBySessionToken = (sessionToken: string) =>
	UserModel.findOne({
		'authentication.sessionToken': sessionToken
	}).select('+authentication.sessionToken');

export const findUserById = (id: string) => UserModel.findById(id);
export const createUser = (values: Record<string, any>) => new UserModel(values).save();
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, value: Record<string, any>) => UserModel.findByIdAndUpdate(id, { $set: value });
export const populateDummyUser = (values: Array<object>) =>
	UserModel.insertMany(values)
		.then(function () {
			console.log('Data inserted'); // Success
		})
		.catch(function (error) {
			console.log(error); // Failure
		})
		.finally();
