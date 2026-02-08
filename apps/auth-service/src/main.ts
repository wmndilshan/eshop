import 'dotenv/config'
import express from "express";
import cors from "cors";
import { errorMiddleware } from "../../../packages/error-handler/error-middleware";
import cookieParser from "cookie-parser";
import router from "./routes/auth.router";
import swaggerUI from "swagger-ui-express";
import path from "path";

// Load swagger document deterministically
const swaggerPath = process.env.NODE_ENV === "production"
  ? path.join(__dirname, "swagger-output.json")
  : path.join(process.cwd(), "apps", "auth-service", "src", "swagger-output.json");
// This will throw in dev if missing, which is desired (fail fast)
const swaggerDocument = require(swaggerPath);
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send({ message: "Hello 2" });
});

// Docs
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.get("/docs-json", (req, res) => {
  res.json(swaggerDocument);
});

// Routes
app.use("/api", router);

app.use(errorMiddleware);

const port = process.env.PORT || 6001;

const server = app.listen(port, () => {
  console.log(`Auth service is running at http://localhost:${port}/api`);
  console.log(`Swagger Docs available at http://localhost:${port}/api-docs`);
});

server.on("error", (err) => {
  console.error("Server error:", err);
});
