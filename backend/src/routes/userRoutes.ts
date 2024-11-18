import express, { Request, Response, Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import authMiddleware from "../middleware/authMiddleware";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

const userRouter: Router = express.Router();
const JWT_SECRET: string = process.env.JWT_SECRET || "your_jwt_secret";

/**
 * @openapi
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Allows a user to register with their name, email, and password.
 *                  The email must be unique, and the password will be hashed before storing.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user
 *               email:
 *                 type: string
 *                 description: The email address of the user
 *               password:
 *                 type: string
 *                 description: The password for the user account
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *       400:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User already exists"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error registering user"
 */
userRouter.post(
	"/register",
	async (req: Request, res: Response): Promise<void> => {
		const { name, email, password } = req.body;
		console.log("email:", email);
		try {
			const existingUser = await User.findOne({ email });
			if (existingUser) {
				res.status(400).json({ message: "User already exists" });
				return;
			}

			const hashedPassword = await bcrypt.hash(password, 10);
			const newUser = new User({ name, email, password: hashedPassword });
			await newUser.save();

			res.status(201).json({ message: "User registered successfully" });
		} catch (error) {
			console.error("Error registering user:", error);
			res.status(500).json({ message: "Error registering user", error });
		}
	}
);

/**
 * @openapi
 * /login:
 *   post:
 *     summary: Login a user
 *     description: Allows a user to log in with their email and password. If valid, a JWT token will be generated.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user
 *               password:
 *                 type: string
 *                 description: The password for the user account
 *     responses:
 *       200:
 *         description: Login successful, returns a JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 token:
 *                   type: string
 *                   description: JWT token for user authentication
 *       400:
 *         description: Invalid credentials or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error logging in"
 */
userRouter.post(
	"/login",
	async (req: Request, res: Response): Promise<void> => {
		const { email, password } = req.body;
		// console.log("email:", email);

		try {
			// Check if 	the user exists
			const user = await User.findOne({ email });
			if (!user) {
				res.status(400).json({ message: "User not found" });
				return;
			}

			// Compare the password
			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
				res.status(400).json({ message: "Invalid credentials" });
				return;
			}

			// Generate JWT token
			const payload = {
				userId: user._id,
				email: user.email,
			};

			const token = jwt.sign(
				{ id: user._id },
				process.env.JWT_SECRET as string,
				{
					expiresIn: "1h",
				}
			);

			// Respond with the token
			res.status(200).json({ message: "Login successful", token });
		} catch (error) {
			console.error("Error logging in:", error);
			res.status(500).json({ message: "Error logging in", error });
		}
	}
);

userRouter.get(
	"/getUser",
	authMiddleware,
	async (req: AuthenticatedRequest, res: Response): Promise<void> => {
		try {
			const user = await User.findById(req.user?._id as string);
			if (!user) {
				res.status(400).json({ message: "User not found" });
				return;
			}
			res.status(200).json({ user });
		} catch (error) {
			console.error("Error getting user:", error);
			res.status(500).json({ message: "Error getting user", error });
		}
	}
);

export default userRouter;
