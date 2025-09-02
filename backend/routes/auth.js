import * as z from "zod";
import bcrypt from "bcrypt";
import { Router } from "express";
import User from "../data/store.js"

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

export default usersRoutes;