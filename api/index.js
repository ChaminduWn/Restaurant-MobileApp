import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import cors from "cors";
import { errorHandler } from "./utils/error.js"; // Adjust the path as needed
import User from "./models/user.js";
import FoodItem from "./models/foodCategory.model.js";
import Cart from "./models/cart.model.js";
import PaymentShop from "./models/checkoutShop.model.js";
import Payment from "./models/Payment.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const app = express();
const port = 9000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://chaminduwn:180517Wn@food-resturant.rk5sl.mongodb.net/?retryWrites=true&w=majority&appName=food-resturant",
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

  //register
  app.post("/register", async (req, res, next) => {
    const { username, email, password } = req.body;
  
    if (!username || !email || !password) {
      return next(errorHandler(400, "All fields are required"));
    }
  
    const hashedPassword = bcryptjs.hashSync(password, 10); // Hash password
    const newUser = new User({
      username,
      email,
      password: hashedPassword, // Store hashed password
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

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verify the password
    const isPasswordValid = bcryptjs.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a token
    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: "1h" });

    res.status(200).json({
      token,
      userId: user._id,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login Failed", error: error.message });
  }
});


app.get("/getAllFoods", async (req, res) => {
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

// Add item to cart
app.post("/addToCart", async (req, res, next) => {
  try {
    const { foodId, quantity, price } = req.body;
    const userId = req.user._id;
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create a new cart for the user
      cart = new Cart({
        userId,
        items: [{ foodId, quantity, price }],
        totalPrice: price * quantity,
      });
    } else {
      // If cart exists, add/update the item
      const itemIndex = cart.items.findIndex(
        (item) => item.foodId.toString() === foodId
      );

      if (itemIndex > -1) {
        // Update quantity if item exists
        cart.items[itemIndex].quantity += quantity;
        cart.items[itemIndex].price = price;
      } else {
        // Add new item to cart
        cart.items.push({ foodId, quantity, price });
      }
      // Recalculate total price
      cart.totalPrice += price * quantity;
    }
    await cart.save();
    return res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    next(errorHandler(500, { message: error.message }));
  }
});

// Get cart for a specific user
app.get("/getCart/:userId", async (req, res, next) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId }).populate("items.foodId");

    if (!cart) {
      return res.status(404).json({ message: "Cart is empty" });
    }
    return res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    next(errorHandler(500, { message: error.message }));
  }
});

// Save payment details to database

app.post("/savepayment", async (req, res, next) => {
  const { userId, cartItems, totalPrice, paymentInfo, tokenNumber } = req.body;

  try {
    const payment = new Payment({
      userId,
      cartItems,
      totalPrice,
      paymentInfo: {
        ...paymentInfo, // Include cardType from paymentInfo
      },
      tokenNumber, // Save token number for order identification
    });

    await payment.save();
    res.status(201).json({ message: "Payment successful", payment });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, { message: "Payment failed" }));
  }
});
// Start Server
app.listen(port, () => {
  console.log(`Server is running on Port ${port}`);
});
