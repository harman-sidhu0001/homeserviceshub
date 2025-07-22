import express from "express";
import {
  getAllServices,
  getRandomTrendingServices,
  getAllTrendingServices,
  getTrendingServiceById,
  createTrendingService,
  updateTrendingService,
  deleteTrendingService,
  createService,
  updateService,
  deleteService,
} from "../controllers/servicesController.js";

const router = express.Router();

router.route("/").get(getAllServices).post(createService);
router.route("/:id").put(updateService).delete(deleteService);
router.route("/trending").get(getRandomTrendingServices);

// Admin CRUD for trending services
router
  .route("/trending-services")
  .get(getAllTrendingServices)
  .post(createTrendingService);
router
  .route("/trending-services/:id")
  .get(getTrendingServiceById)
  .put(updateTrendingService)
  .delete(deleteTrendingService);

export default router;
