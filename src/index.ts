import express from "express";
import dotenv from "dotenv";
import apiRouter from "./routes";

dotenv.config();

const port = process.env.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1", apiRouter);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
