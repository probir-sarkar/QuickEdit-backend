import { ErrorRequestHandler } from "express";



export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(500).json({ message: "Internal server error" });
};