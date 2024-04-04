import { RequestHandler } from "express";
import prisma from "@/configs/prisma";
import z from "zod";

export const getContacts: RequestHandler = async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const createContactSchema = z.object({
  firstName: z.string().min(3).max(14),
  lastName: z.string().min(3).max(14),
  email: z.string().email(),
  phone: z.string().min(6).max(14),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  other: z.object({}).optional(),
  address: z.object({
    line1: z.string().min(1).max(255),
    line2: z.string().max(255).optional(),
    city: z.string().min(1).max(255),
    state: z.string().min(1).max(255),
    country: z.string().min(1).max(255),
    zipCode: z.string().min(1).max(255),
  }),
});

export const createContact: RequestHandler = async (req, res) => {
  try {
    const { address, ...contactData } = createContactSchema.parse(req.body);
    const exisingContact = await prisma.contact.findUnique({
      where: {
        email_phone: {
          email: contactData.email,
          phone: contactData.phone,
        },
      },
    });
    if (exisingContact) {
      return res.status(400).json({ message: "Contact already exists" });
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
      return res.status(200).json(contact);
    }
    return res.status(500).json({ message: "Failed to create contact" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid data", errors: error.errors });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
