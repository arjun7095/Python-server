const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/productsDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Product Schema & Model
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
});

const Product = mongoose.model("Product", productSchema);

// Route to add product via URL query parameters
app.get("/product/add", async (req, res) => {
  try {
    const { name, price, description } = req.query;

    if (!name || !price || !description) {
      return res
        .status(400)
        .json({ message: "Missing name, price, or description" });
    }

    const newProduct = new Product({ name, price, description });
    await newProduct.save();

    res.json({ message: "Product added!", product: newProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch all products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
