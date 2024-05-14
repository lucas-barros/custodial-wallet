import express from "express";
import { createUserController } from "../controllers/user.controller.js";

export const router = (container) => {
  const router = express.Router();

  const userController = createUserController(container);

  router.post("/", userController.create);
  router.get("/:id/btc", userController.getBtcAccount);
  router.get("/:id", userController.getById);
  router.post("/sign-in", userController.signIn);

  return router;
};
