import express, { Application } from "express";
import { homeGetController } from "server/controllers/home/get";

const router = express.Router();

// Get Home Page
router.get("/", homeGetController.getHomePage as Application);

// Get Play Page
router.get("/play", homeGetController.getPlayPage as Application);

export default router;
