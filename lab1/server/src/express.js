import express from "express";
import logger from "morgan";
import { router } from "./route/index.js";
import cors from "cors";
export const app = express();

app.use(logger("dev"));

app.use(cors())

// Middleware
app.use(express.json());

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something broke!" });
  });

app.use('/', router);