import express, { Request, Response, Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

const userRouter: Router = express.Router();
const JWT_SECRET: string = process.env.JWT_SECRET || "your_jwt_secret";

userRouter.post(
	"/register",
	async (req: Request, res: Response): Promise<void> => {
		const { name, email, password } = req.body;
		console.log("oerifnero");
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

export default userRouter;
