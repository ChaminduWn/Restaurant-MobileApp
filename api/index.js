import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import crypto from "crypto";

import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import { errorHandler } from "./utils/error.js";  // Adjust the path as needed
import User from "./models/user.js"

const app = express();
const port = 9000;

// Middleware
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.json("Signup successful");
  } catch (error) {
    next(error);
  }
});

// Signin Controller
app.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "All fields are required"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"));
    }
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET
    );

    const { password: pass, ...rest } = validUser._doc;

    res.status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
});

// Error Handler Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ message });
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on Port ${port}`);
});
