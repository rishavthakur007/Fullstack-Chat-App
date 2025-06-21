import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {getMessages, getUserForSidebar, sendMessages } from "../controllers/message.controllers.js"
const router = express.Router();

router.get("/user",protectRoute,getUserForSidebar);
router.get("/:id",protectRoute,getMessages);
router.post("/send/:id",protectRoute,sendMessages);

export default router;