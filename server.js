import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connect from "./config/connectDB.js";
import eventRoutes from "./routes/eventRoutes.js";
import path from "path";

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

//routes
app.use("/api/v3/app", eventRoutes);

const PORT = process.env.PORT;

app.listen(PORT, async () => {
  await connect();
  console.log(`Server is listening at ${PORT}`);
});
