import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import morgan from "morgan";

const app = express();
const port = 8080;

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.urlencoded({ extended: true, limit: "30mb" }));
app.use(express.json({ limit: "30mb" }));
app.use(morgan("common"));

app.use("/api/v1/auth", authRoutes);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});