import express, { Express } from "express";
import env from "@/env";
import cors from "cors";
import { getContacts, createContact, updateContactField, deleteContact, getContact } from "@/controllers/contacts";
import { errorHandler } from "@/middlewares/errorHandler";

const app: Express = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => res.send("Hello World from QuickEdit"));

app.route("/contacts").get(getContacts).post(createContact);
app.route("/contacts/:id").patch(updateContactField).delete(deleteContact).get(getContact).put(updateContactField);

// Route not found handler, must be the last route and before the global error handler, It will handle all routes that are not found
app.all("*", (req, res) => res.status(404).json({ message: "Route not found" }));

// Global error handler, must be the last middleware, It will handle all errors
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Server is running on port ${env.port}`);
});
