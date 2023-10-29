import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
import UseRouter from "./routes/user.js";
import { registrationValidation } from "./middlewares/validationMiddleware.js";
export const app = express();

// Middleware
import dotenv from 'dotenv';

app.use(cors({ origin: true, credentials: true })); // Allow requests from all origins
app.use(express.json());
app.use(cookieParser());
app.use("/user", registrationValidation,UseRouter);
