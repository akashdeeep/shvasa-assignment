import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

// Create an interface extending Request with the user property
interface AuthenticatedRequest extends Request {
	user?: IUser; // Type representing a Mongoose document instance of 		IUser
}

const authMiddleware = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
): Promise<void> => {
	const token = req.header("authorization")?.replace("Bearer ", "");

	if (!token) {
		res
			.status(401)
			.json({ message: "No token provided, authorization denied" });
		return;
	}

	try {
		const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
		console.log(decoded);
		const user = await User.findById(decoded.id);

		if (!user) {
			res.status(401).json({ message: "User not found, authorization denied" });
			return;
		}

		req.user = user; // Attach user to the request
		next(); // Move to the next middleware
	} catch (error) {		
		res.status(401).json({ message: "Token is not valid" });
	}
};

export { AuthenticatedRequest };
export default authMiddleware;
