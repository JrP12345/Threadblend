import { User } from "../models/user.js";
import { sendCookie } from "../utilities/sendCookies.js";
import { validationResult } from 'express-validator';

import bcrypt from "bcrypt";
export const userRegister = async (req, res) => {
  try {
    // Validation using express-validator
    const errors = validationResult(req);
    console.log("Validation Errors:", errors); // Add this line
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Destructuring
    const { username, email, mobileNumber, password } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ success: false, message: 'User Already Exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: username,
      email,
      mobile: mobileNumber,
      password: hashedPassword,
    });

    // Ensure that newUser is not null before sending cookies
    if (newUser) {
      sendCookie(newUser, res, 'Registered Successfully', 201);
    } else {
      // Handle the case where user creation failed
      res.status(500).json({ success: false, message: 'Failed to register user' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
  
  export const userLogin = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      const user = await User.findOne({ email }).select("+password");
  
      if (!user) {
        // Handle the case where user is not found
        return res.status(400).json({ success: false, message: "Invalid Email or Password" });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        // Handle the case where password doesn't match
        return res.status(400).json({ success: false, message: "Invalid Email or Password" });
      }
  
      // Handle successful login
      sendCookie(user, res, `Welcome back, ${user.name}`, 200);
    } catch (error) {
      // Handle other errors
      console.log(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
  
  export const userProfile = async (req, res) => {
    try {
      // Assuming you have a user ID stored in the user's cookie
      const userId = req.user.id;
  
      // Log the user ID to help with debugging
      console.log("User ID:", userId);
  
      // Fetch additional user details from the database based on the user ID
      const user = await User.findById(userId);
  
      if (!user) {
        // Log an error message to help with debugging
        console.error("User not found");
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // Log the retrieved user details to help with debugging
      console.log("User Details:", user);
  
      // Send user details to the client
      res.status(200).json({ success: true, user });
    } catch (error) {
      // Log the error to help with debugging
      console.error(error);
  
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
  export const userLogout = (req, res) => {
    res
      .status(200)
      .cookie('token', '', {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .json({
        success: true,
        user: req.user,
      });
  };
  