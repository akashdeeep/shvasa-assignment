import mongoose, { Schema, Document, Model } from "mongoose";

// Define the IUser interface, extending Document for Mongoose documents
interface IUser extends Document {
	name: string;
	email: string;
	password: string;
	googleCalendarSync?: boolean;
	googleCalendarToken?: string;
}

// Create a schema for the user model
const userSchema = new Schema<IUser>(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		googleCalendarSync: { type: Boolean, default: false },
		googleCalendarToken: { type: String },
	},
	{
		timestamps: true,
	}
);

// Create and export the User model with the correct type
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export { IUser };
export default User;
