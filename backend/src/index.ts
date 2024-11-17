import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import userRouter from "./routes/userRoutes";
import eventRouter from "./routes/eventRoutes";
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../swaggerOptions");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Routes
app.use("/user", userRouter);
app.use("/event", eventRouter);

// Serve the Swagger UI for your API documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Define your routes
app.get("/api", (req, res) => {
	res.send("Welcome to the Event API!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
