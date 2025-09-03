import dotenv from "dotenv";
dotenv.config();

import * as z from "zod";
import bcrypt from "bcrypt";
import { Router } from "express";
import User from "../data/store.js"
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

const usersRoutes = Router();

usersRoutes.post("/signup", async (req, res) => {
  const { email, password, username } = req.body;
  
  const requireBody = z.object({
    email : z.string().email("Invalid email address, please add correct email address"),
    password: z.string().min(8).max(16),
    username: z.string().min(8).max(14),
  }) 

  const parsedUserDetails = requireBody.safeParse(req.body);

  if (!parsedUserDetails.success) {
    return res.status(400).json({
      message: "Required fields missing"
    })
  }

  const hashedPassword = await bcrypt.hash(password, 6);

  try{
    await User.create({
      email: email,
      password: hashedPassword,
      username: username
    })
    res.status(200).json({ message: "Successfully signed up" })
  } catch(e) {
    res.status(400).json({
      message: "Signup failed",
      error: e.message
    })
  }
})

usersRoutes.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  
  const existingUser = await User.findOne({ email });

  if(!existingUser) {
    res.status(400).json({
      message: "User does not exist"
    })
  }

  const matchPassword = await bcrypt.compare(password, existingUser.password);

  if(matchPassword){
    const token = jwt.sign({
      id : existingUser._id.toString()
    }, secret)
    res.status(200).json({
      token: token
    })
  } else {
    res.status(400).json({
      message: "Incorrect credentials"
    })
  }
})

export default usersRoutes;