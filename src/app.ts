import { Hono } from "hono";
import { cors } from "hono/cors";

import {
	getContacts,
	createContact,
	updateContactField,
	deleteContact,
	getContact,
} from "@/controllers/contacts";
import { errorHandler } from "@/middlewares/errorHandler";

const app = new Hono();

app.use(cors());

app.get("/", (c) => c.text("Hello World"));

app.route("/contacts").get(getContacts).post(createContact);
app
	.route("/contacts/:id")
	.patch(updateContactField)
	.delete(deleteContact)
	.get(getContact)
	.put(updateContactField);

// Route not found handler, must be the last route and before the global error handler, It will handle all routes that are not found
app.all("*", async (c) => {
	c.status(404);
	c.json({ message: "Route not found" });
});

// Global error handler, must be the last middleware, It will handle all errors
// app.use(errorHandler);
export default app;
