import express from "express";
import { createUserController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.js";

export const router = (container) => {
  const router = express.Router();
  const userController = createUserController(container);

  router.use(authMiddleware(container))
  router.post("/btc/buy", userController.buyBtc);
  router.get("/btc", userController.getBtcAccount);
  router.get("/", userController.getById);

  return router;
};
