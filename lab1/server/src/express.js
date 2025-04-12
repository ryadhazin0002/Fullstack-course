import express from "express";
import logger from "morgan";
import { router } from "./route/index.js";
import cors from "cors";

// Create Express app
export const app = express();

// Morgan middleware for logging
app.use(logger("dev"));

// CORS middleware for cross-origin requests
app.use(cors())

// Middleware to parse JSON requests
app.use(express.json());

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something broke!" });
  });

// Middleware to parse URL-encoded data
app.use('/', router);