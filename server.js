import express from "express";
import db from "./db/connection.js";
import routes from "./routes/index.js";
import logger from "morgan";
import cors from "cors";
import "dotenv/config";

const app = express();

const frontendUrl = process.env.FRONTEND_URL;
if (!frontendUrl) {
  throw new Error("FRONTEND_URL is not set");
}

app.use(logger("dev"));
app.use(express.json());
app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/", routes);

db.on("connected", () => {
  app.listen(process.env.PORT, () => {
    console.log(`Express server running on port ${process.env.PORT}`);
  });
});
