import express from "express";
import {
  addBookmark,
  removeBookmark,
  isBookmarked,
} from "../controllers/bookmarkController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", authenticate, addBookmark);
router.post("/remove", authenticate, removeBookmark);
router.get("/check", authenticate, isBookmarked);

export default router;
