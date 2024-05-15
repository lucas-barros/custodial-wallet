import express from "express";
import { createRateController } from "../controllers/rate.controller.js";
import { authMiddleware } from "../middleware/auth.js";

export const router = (container) => {
  const router = express.Router();

  const rateController = createRateController(container);

  router.use(authMiddleware(container))
  router.get("/btc/usd", rateController.getBtcInUsd);

  return router;
};
