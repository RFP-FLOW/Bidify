import express from "express";

import {
  refreshTokenController,
  logoutController,
} from "../controllers/commonauth.controller.js";

const router = express.Router();

router.post("/refresh-token", refreshTokenController);

router.post("/logout", logoutController);

export default router;