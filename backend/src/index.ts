import express, { Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import userRouter from "./routes/userRoutes";
import eventRouter from "./routes/eventRoutes";
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../swaggerOptions");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();

app.use(cors()); // Enable CORS
app.use(express.json());
// Your existing routes and middleware here

// Routes
app.use("/user", userRouter);
app.use("/event", eventRouter);

// Serve the Swagger UI for your API documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Define your routes
app.get("/api", (req: Request, res: Response) => {
	res.send("Welcome to the Event API!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
