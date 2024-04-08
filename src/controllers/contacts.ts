import { RequestHandler } from "express";
import prisma from "@/configs/prisma";
import z from "zod";
import { formatZodErrors } from "@/utils";
import { createContactSchema, contactSchema } from "@/schemas/contacts.schema";

export const getContacts: RequestHandler = async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

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
      return res.status(400).json({ message: "Invalid data", errors: formatZodErrors(error) });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateContact: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(parseInt(id))) return res.status(400).json({ message: "Invalid contact id" });
    const { address, ...contactData } = createContactSchema.parse(req.body);
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
      return res.status(200).json(contact);
    }
    return res.status(500).json({ message: "Failed to update contact" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid data", errors: formatZodErrors(error) });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteContact: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(parseInt(id))) return res.status(400).json({ message: "Invalid contact id" });
    const contact = await prisma.contact.delete({
      where: {
        id: parseInt(id),
      },
    });
    if (contact) {
      return res.status(200).json({ message: "Contact deleted successfully" });
    }
    return res.status(500).json({ message: "Failed to delete contact" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateContactField: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(parseInt(id))) return res.status(400).json({ message: "Invalid contact id" });
    const contactData = contactSchema.parse(req.body);
    if (Object.keys(contactData).length === 0) return res.status(400).json({ message: "No fields to update" });
    const contact = await prisma.contact.update({
      where: {
        id: parseInt(id),
      },
      data: {
        ...contactData,
      },
    });
    if (contact) {
      return res.status(200).json(contact);
    }
    return res.status(500).json({ message: "Failed to update contact" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid data", errors: formatZodErrors(error) });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getContact: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(parseInt(id))) return res.status(400).json({ message: "Invalid contact id" });
    const contact = await prisma.contact.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        address: true,
      },
    });
    if (contact) {
      return res.status(200).json({
        contact,
      });
    }
    return res.status(404).json({ message: "Contact not found" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
