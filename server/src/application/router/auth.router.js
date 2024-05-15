import express from "express";
import { createUserController } from "../controllers/user.controller.js";

export const router = (container) => {
  const router = express.Router();

  const userController = createUserController(container);

  router.post("/sign-up", userController.create);
  router.post("/sign-in", userController.signIn);

  return router;
};
