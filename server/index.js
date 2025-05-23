import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("SpainStore API is working!");
});
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use(express.urlencoded({ extended: true }));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
