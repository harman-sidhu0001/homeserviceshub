import express from "express";
import { getAllServices } from "../controllers/servicesController.js";

const router = express.Router();

router.route("/").get(getAllServices);

export default router;
