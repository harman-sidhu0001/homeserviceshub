import express from "express";
import {
  getProviderById,
  getServiceProviders,
} from "../controllers/providerController.js";

const router = express.Router();

router.route("/").get(getServiceProviders);
router.route("/:id").get(getProviderById);
export default router;
