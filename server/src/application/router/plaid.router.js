import express from "express";
import { createPlaidController } from "../controllers/plaid.controller.js";
import { authMiddleware } from "../middleware/auth.js";

export const router = (container) => {
  const router = express.Router();

  const plaidController = createPlaidController(container);

  router.use(authMiddleware(container));
  router.post("/create-link-token", plaidController.createLinkToken);
  router.post("/set-access-token", plaidController.setAccessToken);
  router.get("/accounts", plaidController.getAccounts);

  return router;
};
