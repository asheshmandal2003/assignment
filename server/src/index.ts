import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth";
import profileRoutes from "./routes/profile";
import courseRoutes from "./routes/course";
import morgan from "morgan";
import helmet from "helmet";
import bodyParser from "body-parser";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();
const port = process.env.PORT || 8000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

app.use(express.json());
app.use(morgan("common"));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(bodyParser.json({ limit: "30mb" }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", profileRoutes);
app.use("/api/v1", courseRoutes);

app.listen(port, () => {
  return console.log(`App is listening on port ${port}`);
});
