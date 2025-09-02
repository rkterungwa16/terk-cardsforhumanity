import express from "express";

import home from "./home";

const router = express.Router();

router.use("/", home);
// router.use("/api/v1", home);

export default router;

