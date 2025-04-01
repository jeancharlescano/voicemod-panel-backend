import { Router } from "express";
const router = Router();

import {
  getSoundBoards,
  playSoundById,
} from "../controller/voicemod.controller.js";
router.get("/", getSoundBoards);
router.get("/:id", playSoundById);

export default router;
