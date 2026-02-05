const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/mern_task1")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/api/products", productRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
