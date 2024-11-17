const swaggerJsdoc = require("swagger-jsdoc");

const options = {
	definition: {
		openapi: "3.0.0", // OpenAPI version
		info: {
			title: "Event Management API", // Your API title
			version: "1.0.0", // Your API version
			description: "An API to manage events and sync with Google Calendar.", // API description
		},
		servers: [
			{
				url: "http://localhost:3000", // Update with your server URL
				description: "Development server",
			},
		],
		components: {
			schemas: {
				Event: {
					type: "object",
					properties: {
						_id: {
							type: "string",
							description: "The event ID",
						},
						name: {
							type: "string",
							description: "The name of the event",
						},
						datetime: {
							type: "string",
							format: "date-time",
							description: "The date and time of the event",
						},
						duration: {
							type: "integer",
							description: "Duration of the event in minutes",
						},
						tag: {
							type: "string",
							description: "The tag/category of the event",
						},
						user: {
							type: "string",
							description: "The ID of the user who created the event",
						},
					},
				},
				User: {
					type: "object",
					properties: {
						_id: {
							type: "string",
							description: "The user ID",
						},
						name: {
							type: "string",
							description: "The name of the user",
						},
						email: {
							type: "string",
							description: "The email address of the user",
						},
						password: {
							type: "string",
							description: "The hashed password for the user",
						},
					},
				},
			},
		},
	},
	apis: ["./src/routes/*.ts"], // Path to the route files you want to document (adjust the path based on your project structure)
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
