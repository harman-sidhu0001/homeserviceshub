import express from "express";
import { getServiceProviders } from "../controllers/providerController.js";

const router = express.Router();

router.route("/").get(getServiceProviders);

export default router;
