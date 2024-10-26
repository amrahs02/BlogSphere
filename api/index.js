require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
const Post = require("./models/Post");
const multer = require("multer");
const fs = require("fs"); // to rename the file / image
const uploadMiddleware = multer({ dest: "uploads/" });

const cookieParser = require("cookie-parser");
const { hash } = require("crypto");

const secret = process.env.SECRET;
const salt = bcrypt.genSaltSync(10);
app.use(express.json()); // middleware to parse json data from the request body

app.use(
  cors(
    // { credentials: true, origin: process.env.CORS_ORIGIN  }
    // { credentials: true, origin: "http://localhost:5173" }
    {credentials: true, origin: 'https://blogsphereapp.onrender.com'}
  )
);

app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Database Connection failed", error);
  });

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    // check if the username already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        error: true,
        statusCode: 400,
        message: "Username already exists",
        details:
          "The username you entered is already in use. Please try a different one.",
      });
    }
    // password hashing
    const hashedPassword = bcrypt.hashSync(password, salt);
    // create a new user
    const userDoc = await User.create({
      username,
      password: hashedPassword,
    });
    res.json(userDoc);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid data" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists in the database
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
      return res.status(400).json({
        error: true,
        statusCode: 400,
        message: "Login failed",
        details: "User does not exist",
      });
    }

    // Check if the password is correct
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      // Sign JWT token
      jwt.sign({ username, id: userDoc._id }, secret, (err, token) => {
        if (err) {
          return res.status(500).json({
            error: true,
            statusCode: 500,
            message: "Login failed",
            details: "Token generation failed",
          });
        }

        // Send success response with token in a cookie
        res
          .cookie("token", token, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
          })
          .json({
            error: false,
            statusCode: 200,
            message: "Login successful",
            data: {
              id: userDoc._id,
              username,
            },
          });
      });
    } else {
      res.status(400).json({
        error: true,
        statusCode: 400,
        message: "Login failed",
        details: "Incorrect password",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: true,
      statusCode: 500,
      message: "Server error",
      details: "An error occurred during login",
    });
  }
});

app.get("/profile", async (req, res) => {
    const { token } = req.cookies;
    
    // Verify the token
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) {
        return res.status(400).json({ message: "You are not authenticated" });
      }
      
      // Check if the user exists in the database
      try {
        const user = await User.findById(info.id); // Assuming info.id contains the user ID
        
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        
        // If user exists, return user info
        const { password, ...userWithoutPassword } = user._doc; // Exclude password from the response
        res.json({ message: "User profile", user: userWithoutPassword });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
      }
    });
  });
  

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("Logged out");
});

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(req.cookies.token, secret, {}, async (err, info) => {
    if (err) {
      res.status(400).json({ message: "Invalid token" });
    } else {
      const { title, summary, content } = req.body;
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath,
        author: info.id,
      });
      res.json(postDoc);
    }
  });
});

app.put("/post/:id", uploadMiddleware.single("file"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }

  const { id } = req.params; // Get the post ID from the route parameter
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res
        .status(400)
        .json({ message: "You are not the author of this post" });
    }

    // Update the post, either with a new cover or keep the existing one
    await postDoc.updateOne({
      title: req.body.title,
      summary: req.body.summary,
      content: req.body.content,
      cover: newPath ? newPath : postDoc.cover,
    });

    res.json(postDoc);
  });
});

app.get("/post", async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});