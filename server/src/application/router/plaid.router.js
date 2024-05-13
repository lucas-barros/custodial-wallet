import express from "express";
import { createPlaidController } from "../controllers/plaid.controller.js";

export const router = (container) => {
  const router = express.Router();

  const plaidController = createPlaidController(container);

  router.post("/create-link-token", plaidController.createLinkToken);
  router.post("/set-access-token", plaidController.setAccessToken);
  router.get("/balance/:userId", plaidController.getBalance);

  return router;
};
