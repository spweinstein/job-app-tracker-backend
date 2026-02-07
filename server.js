import express from "express";
import db from "./db/connection.js";
import routes from "./routes/index.js";
import logger from "morgan";
import cors from "cors";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(cors());

app.use("/", routes);

db.on("connected", () => {
  app.listen(process.env.PORT, () => {
    console.log(`Express server running on port ${process.env.PORT}`);
  });
});
