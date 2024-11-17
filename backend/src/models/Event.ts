import mongoose, { Schema, Document } from "mongoose";

interface IEvent extends Document {
	name: string;
	datetime: Date;
	duration: number;
	tag?: string;
	user: mongoose.Schema.Types.ObjectId; // Reference to the user
}

const eventSchema = new Schema<IEvent>(
	{
		name: { type: String, required: true },
		datetime: { type: Date, required: true },
		duration: { type: Number, required: true },
		tag: { type: String },
		user: { type: Schema.Types.ObjectId, ref: "User", required: true },
	},
	{
		timestamps: true,
	}
);

// Unique constraint to prevent overlapping events for the same user at the same time
eventSchema.index({ user: 1, datetime: 1 }, { unique: true });

const Event = mongoose.model<IEvent>("Event", eventSchema);
export default Event;
