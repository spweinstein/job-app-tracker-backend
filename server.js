import express from "express";
import db from "./db/connection.js";
import routes from "./routes/index.js";
import logger from "morgan";
import cors from "cors";
import "dotenv/config";
import chalk from "chalk";

const app = express();

const frontendUrl = process.env.PRODUCTION
  ? process.env.FRONTEND_URL_PROD
  : process.env.FRONTEND_URL_DEV;
if (!frontendUrl) {
  throw new Error("FRONTEND_URL is not set");
} else if (process.env.PRODUCTION) {
  console.log(chalk.green("Production mode"));
} else {
  console.log(chalk.green("Development mode"));
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
