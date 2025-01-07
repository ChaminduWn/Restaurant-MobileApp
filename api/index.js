import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import bcryptjs from "bcryptjs";
import cors from "cors";
import { errorHandler } from "./utils/error.js";  // Adjust the path as needed
import User from "./models/user.js"
import FoodItem from "./models/foodCategory.model.js"


import crypto from "crypto";

const app = express();
const port = 9000;

// Middleware
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

import jwt  from "jsonwebtoken";


// MongoDB Connection
mongoose
  .connect(
    'mongodb+srv://chaminduwn:180517Wn@food-resturant.rk5sl.mongodb.net/?retryWrites=true&w=majority&appName=food-resturant',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

// // Test API Endpoint
// app.get("/test", (req, res) => {
//   res.json({ message: "API is working!" });
// });

// Signup Controller
app.post("/register", async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password || username === "" || email === "" || password === "") {
    next(errorHandler(400, "All fields are required"));
  }

  // const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password,
  });

  try {
    await newUser.save();
    res.json("Signup successful");
  } catch (error) {
    next(error);
  }
});

const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");

  return secretKey;
};

const secretKey = generateSecretKey();

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    //check if the password is correct
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    //generate a token
    const token = jwt.sign({ userId: user._id }, secretKey);

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login Failed" });
  }
});


app.get('/getAllFoods', async (req, res) => {
  try {
    const foodItems = await FoodItem.find(); // No query params, just get all items
    res.json({ foodItems });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch food items" });
  }
});
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ message });
});



// Start Server
app.listen(port, () => {
  console.log(`Server is running on Port ${port}`);
});
