import dotenv from "dotenv";
dotenv.config();

import express, { json } from "express";
import cors from "cors";
import { v4 as uuid4 } from 'uuid';
import usersRoutes from "./backend/routes/auth.js";
import { connectDB } from "./backend/db/conn.mjs";


const app = express();
app.use(express.json()); 
app.use(cors());


app.use("/todo/users", usersRoutes);

let todos = [];
let requestCount = 0;

function todosAuthMiddleware(req, res, next) {
  console.log("Auth middleware triggered", req.method, req.url)
  if (req.query.auth !== "true") {
    return res.status(403).json({error: "not authorized"})
  }
  next();
}


app.use(function (req, res, next) {
  requestCount += 1;
  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} ${req.url} Request count is ${requestCount}`)
  next();
})

async function startServer() {
  await connectDB();
  app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
  });
}

startServer();
