import prismaGenerate from "@/configs/prisma";
import z from "zod";
import { formatZodErrors } from "@/utils";
import { createContactSchema, contactSchema } from "@/schemas/contacts.schema";
import { Handler } from "hono";
import { env } from "hono/adapter";

export const getContacts: Handler = async (c) => {
	try {
		const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
		const prisma = prismaGenerate(DATABASE_URL);
		const contacts = await prisma.contact.findMany();
		return c.json(contacts);
	} catch (error) {
		console.log(error);
		c.json({ message: "Internal server error" }, 500);
	}
};

export const createContact: Handler = async (c) => {
	try {
		const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
		const prisma = prismaGenerate(DATABASE_URL);
		const body = await c.req.json();
		const { address, ...contactData } = createContactSchema.parse(body);
		const exisingContact = await prisma.contact.findUnique({
			where: {
				email_phone: {
					email: contactData.email,
					phone: contactData.phone,
				},
			},
		});
		if (exisingContact) {
			return c.json({ message: "Contact already exists" }, 400);
		}

		const contact = await prisma.contact.create({
			data: {
				...contactData,
				address: {
					create: {
						...address,
					},
				},
			},
		});
		if (contact) {
			return c.json(contact);
		}
		c.status(500);
		return c.json({ message: "Failed to create contact" });
	} catch (error) {
		if (error instanceof z.ZodError) {
			c.status(400);
			return c.json({
				message: "Invalid data",
				errors: formatZodErrors(error),
			});
		}
		c.status(500);
		return c.json({ message: "Internal server error" });
	}
};

export const updateContact: Handler = async (c) => {
	try {
		const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
		const prisma = prismaGenerate(DATABASE_URL);
		const id = c.req.param("id");
		if (!id || isNaN(parseInt(id))) {
			c.status(400);
			return c.json({ message: "Invalid contact id" });
		}
		const body = await c.req.json();
		const { address, ...contactData } = createContactSchema.parse(body);
		const contact = await prisma.contact.update({
			where: {
				id: parseInt(id),
			},
			data: {
				...contactData,
				address: {
					update: {
						...address,
					},
				},
			},
		});
		if (contact) {
			return c.json(contact);
		}
		c.status(500);
		return c.json({ message: "Failed to update contact" });
	} catch (error) {
		if (error instanceof z.ZodError) {
			c.status(400);
			return c.json({
				message: "Invalid data",
				errors: formatZodErrors(error),
			});
		}
		c.status(500);
		return c.json({ message: "Internal server error" });
	}
};

export const deleteContact: Handler = async (c) => {
	try {
		const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
		const prisma = prismaGenerate(DATABASE_URL);
		const id = c.req.param("id");
		if (!id || isNaN(parseInt(id))) {
			c.status(400);
			return c.json({ message: "Invalid contact id" });
		}
		const contact = await prisma.contact.delete({
			where: {
				id: parseInt(id),
			},
		});
		if (contact) {
			return c.json(contact);
		}
		c.status(500);
		return c.json({ message: "Failed to delete contact" });
	} catch (error) {
		console.log(error);
		c.status(500);
		return c.json({ message: "Internal server error" });
	}
};

export const updateContactField: Handler = async (c) => {
	try {
		const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
		const prisma = prismaGenerate(DATABASE_URL);
		const id = c.req.param("id");
		if (!id || isNaN(parseInt(id))) {
			c.status(400);
			return c.json({ message: "Invalid contact id" });
		}
		const body = await c.req.json();
		const contactData = contactSchema.parse(body);
		if (Object.keys(contactData).length === 0) {
			c.status(400);
			return c.json({ message: "No data provided" });
		}
		const contact = await prisma.contact.update({
			where: {
				id: parseInt(id),
			},
			data: {
				...contactData,
			},
		});
		if (contact) {
			return c.json(contact);
		}
		c.status(500);
		return c.json({ message: "Failed to update contact" });
	} catch (error) {
		if (error instanceof z.ZodError) {
			c.status(400);
			return c.json({
				message: "Invalid data",
				errors: formatZodErrors(error),
			});
		}
		c.status(500);
		return c.json({ message: "Internal server error" });
	}
};

export const getContact: Handler = async (c) => {
	try {
		const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);
		const prisma = prismaGenerate(DATABASE_URL);
		const id = c.req.param("id");
		if (!id || isNaN(parseInt(id))) {
			c.status(400);
			return c.json({ message: "Invalid contact id" });
		}
		const contact = await prisma.contact.findUnique({
			where: {
				id: parseInt(id),
			},
			include: {
				address: true,
			},
		});
		if (contact) {
			return c.json(contact);
		}
		c.status(404);
		return c.json({ message: "Contact not found" });
	} catch (error) {
		c.status(500);
		return c.json({ message: "Internal server error" });
	}
};
