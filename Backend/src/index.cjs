import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import {connectDB} from "./lib/db.js"
import cors from "cors";
import { app, server } from "./lib/socket.js";

dotenv.config();
const PORT = process.env.PORT;

app.use(cookieParser());
app.use(express.json());
//app.use(express.urlencoded({ extended: true })); // For URL-encoded data
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))


app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../Frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend", "dist", "index.html"));
  });
}

server.listen(PORT,()=>{
    console.log("Server is running at Port:",PORT);
    connectDB();
})  