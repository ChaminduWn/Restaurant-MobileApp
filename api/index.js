import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

import bcryptjs from "bcryptjs";
import cors from "cors";
import { errorHandler } from "./utils/error.js";  // Adjust the path as needed
import User from "./models/user.js"
import FoodItem from "./models/foodCategory.model.js"
import Cart from "./models/cart.model.js";
import PaymentShop from "./models/checkoutShop.model.js";
import Payment from "./models/Payment.model.js";




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


// Add item to cart

 app.post('/addToCart', async (req, res, next) => {
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

 app.get('/getCart/:userId', async (req, res, next) => {
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


// save Payment Shop

app.post("/addPayment", async (req, res, next) => {
  try {
    const requiredFields = [
      "paymentId",
      "email",
      "phoneNumber",
      "firstName",
      "lastName",
      "address",
      "city",
      "postalCode",
      "shippingMethod",
    ];

    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).send({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const {
      paymentId,
      email,
      phoneNumber,
      firstName,
      lastName,
      address,
      city,
      postalCode,
      shippingMethod,
    } = req.body;

    // Additional validation (like regex checks) can be performed here

    const newPaymentShop = {
      paymentId,
      email,
      phoneNumber,
      firstName,
      lastName,
      address,
      city,
      postalCode,
      shippingMethod,
    };

    const createdPaymentShop = await PaymentShop.create(newPaymentShop);
    console.log("Data Added Successfully");

    return res.status(201).send(createdPaymentShop);
  } catch (error) {
    console.error("Failed to add payment shop data:", error);
    next(errorHandler(500, { message: error.message }));
  }
});

//Get All Data from PaymentShop Collection

app.get("/getPayments", async (req, res, next) => {
  try {
    const createdPaymentShop = await PaymentShop.find({});

    return res.status(200).json({
      count: createdPaymentShop.length,
      data: createdPaymentShop,
    });
  } catch (error) {
    console.log(error.message);
    next(errorHandler(500, { message: error.message }));
  }
});

//Get data according to the ID

app.get("/paymentshopID/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const createdPaymentShop = await PaymentShop.findById(id);

    if (!createdPaymentShop) {
      return res
        .status(404)
        .json({ message: "According to the ID transaction not found (404)" });
    }
    return res.status(200).json(createdPaymentShop);
  } catch (error) {
    console.log(error.message);
    next(errorHandler(500, { message: error.message }));
  }
});

// Get data according to the Email
app.get("/paymentshopEmail/:email", async (req, res, next) => {
  try {
    const { email } = req.params;
    const paymentShop = await PaymentShop.findOne({ email: email });

    if (!paymentShop) {
      return res
        .status(404)
        .json({ message: "No transaction found for the provided email." });
    }
    return res.status(200).json(paymentShop);
  } catch (error) {
    console.log(error.message);
    next(errorHandler(500, { message: error.message }));
  }
});




export const checkout = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get the user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart is empty" });
    }

    // Populate the checkout form with cart items
    const paymentData = {
      userId,
      items: cart.items,
      totalPrice: cart.totalPrice,
      address: req.body.address, // Address passed from the front-end
      shippingMethod: req.body.shippingMethod, // Shipping method from front-end
    };

    // Remove unnecessary discount logic here

    // Save the payment data (PaymentShop)
    const paymentShop = await PaymentShop.create(paymentData);

    // Clear cart after successful checkout
    await Cart.deleteOne({ userId });

    return res.status(200).json(paymentShop);
  } catch (error) {
    console.error(error);
    next(errorHandler(500, { message: error.message }));
  }
};


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
      tokenNumber,  // Save token number for order identification
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
