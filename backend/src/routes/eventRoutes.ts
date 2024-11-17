import express, { Request, Response } from "express";
import Event from "../models/Event";
import authMiddleware from "../middleware/authMiddleware";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import { SortOrder } from "mongoose";

const eventRouter = express.Router();

/**
 * @openapi
 * /create:
 *   post:
 *     summary: Create a new event
 *     description: Create a new event for a user. The event must not overlap with existing events.
 *                  Duration is in minutes, and a unique time slot is required for each event.
 *     tags:
 *       - Events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the event
 *               datetime:
 *                 type: string
 *                 format: date-time
 *                 description: The start date and time of the event
 *               duration:
 *                 type: integer
 *                 description: Duration of the event in minutes
 *               tag:
 *                 type: string
 *                 description: The tag or category of the event
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event created successfully"
 *                 event:
 *                   $ref: '#/components/schemas/Event'
 *       400:
 *         description: Time slot is already occupied
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Time slot is already occupied"
 *       500:
 *         description: Internal server error
 */

eventRouter.post(
	"/create",
	authMiddleware,
	async (req: AuthenticatedRequest, res: Response): Promise<void> => {
		const { name, datetime, tag, duration } = req.body;
		const userId = req.user?._id; // Properly typed user ID

		try {
			// Convert datetime to a JavaScript Date object
			const startTime = new Date(datetime);
			const endTime = new Date(startTime.getTime() + duration * 60000); // duration in minutes converted to milliseconds

			// Check for overlapping events
			const overlappingEvent = await Event.findOne({
				user: userId,
				$or: [
					{
						datetime: { $lt: endTime },
						endTime: { $gt: startTime },
					}, // Event starts before new event ends and ends after new event starts
					{
						datetime: { $gte: startTime, $lt: endTime },
					}, // Event starts during the new event
				],
			});

			if (overlappingEvent) {
				res.status(400).json({ message: "Time slot is already occupied" });
				return;
			}

			const event = new Event({
				name,
				datetime: startTime,
				duration,
				tag,
				user: userId,
			});

			await event.save();
			res.status(201).json({ message: "Event created successfully", event });
		} catch (error) {
			res.status(500).json({ message: "Error creating event", error });
		}
	}
);

/**
 * @openapi
 * /getEvents:
 *   get:
 *     summary: Get all events for a user
 *     description: Fetch all events for a user with optional filtering, sorting, and pagination.
 *     tags:
 *       - Events
 *     parameters:
 *       - in: query
 *         name: tag
 *         required: false
 *         description: Filter events by tag
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         required: false
 *         description: Sort events by datetime ('asc' or 'desc')
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Limit the number of events returned
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: A list of events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *       500:
 *         description: Internal server error
 */
eventRouter.get(
	"/getEvents",
	authMiddleware,
	async (req: AuthenticatedRequest, res: Response): Promise<void> => {
		const userId = req.user?._id;
		const { tag, sort, limit } = req.query;
		try {
			// Initialize the query object
			const query: Record<string, any> = { user: userId };

			// If tag is provided, filter for exact match on the tag (case-insensitive)
			if (tag) {
				query["tag"] = { $regex: new RegExp(`^${tag}$`, "i") }; // Case-insensitive regex for exact match
			}

			// Parse the sort parameter into a valid sort object
			const sortOption: Record<string, SortOrder> | undefined = sort
				? { datetime: sort === "asc" || sort === "1" ? 1 : -1 }
				: undefined;

			// Fetch events from the database
			const events = await Event.find(query)
				.sort(sortOption) // Apply sorting if necessary
				.limit(Number(limit) || 10); // Apply limit with default fallback to 10

			// Respond with the fetched events
			res.status(200).json({ events });
		} catch (error) {
			// Handle any errors that occur during the fetch
			res.status(500).json({ message: "Error fetching events", error });
		}
	}
);

export default eventRouter;
