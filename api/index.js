const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");


const app = express();
const port = 9000;

const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const jwt = require("jsonwebtoken");

mongoose
  .connect(
    `mongodb+srv://chaminduwn:180517Wn@food-resturant.rk5sl.mongodb.net/?retryWrites=true&w=majority&appName=food-resturant`,
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

app.listen(port, () => {
  console.log(`Server is running on Port ${port}`);
});

app.post("/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      const newUser = new User({ name, email, password });
  
      newUser.verificationToken = crypto.randomBytes(20).toString("hex");
  
      await newUser.save();
  
      sendVerificationEmail(newUser.email, newUser.verificationToken);
  
      res.status(201).json({
        message:
          "Registration successful. Please check your email for verification.",
      });
    } catch (error) {
      console.log("Email already registered:", email); // Debugging statement
      return res.status(500).json({ message: "Email already registered" });
    }
  });
  
  
  //endpoint to verify the email
  app.get("/verify/:token", async (req, res) => {
      try {
        const token = req.params.token;
    
        //Find the user witht the given verification token
        const user = await User.findOne({ verificationToken: token });
        if (!user) {
          return res.status(404).json({ message: "Invalid verification token" });
        }
    
        //Mark the user as verified
        user.verified = true;
        user.verificationToken = undefined;
    
        await user.save();
    
        res.status(200).json({ message: "Email verified successfully" });
      } catch (error) {
        res.status(500).json({ message: "Email Verificatioion Failed" });
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