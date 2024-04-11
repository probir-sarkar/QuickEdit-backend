import { Hono } from "hono";
import { cors } from "hono/cors";
import { jsxRenderer, useRequestContext } from "hono/jsx-renderer";
import getHome from "@/views/home";

import {
	getContacts,
	createContact,
	updateContactField,
	deleteContact,
	getContact,
	updateContact,
} from "@/controllers/contacts";

const app = new Hono();

app.use(cors());
app.get("/", getHome);

app.route("/contacts").get(getContacts).post(createContact);
app
	.route("/contacts/:id")
	.patch(updateContactField)
	.delete(deleteContact)
	.get(getContact)
	.put(updateContact);

// Route not found handler, must be the last route and before the global error handler, It will handle all routes that are not found
app.onError((err, c) => {
	console.error(`${err}`);
	return c.text("Something went wrong!", 500);
});

export default app;
