import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import userRouter from "./routes/userRoutes";
import eventRouter from "./routes/eventRoutes";

dotenv.config();
connectDB();					

const app = express();
app.use(express.json());

// Routes
app.use("/user", userRouter);
app.use("/event", eventRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
