import { Router } from "express";

import voicemod from "./voicemod.routes.js";

const router = Router();

router.use("/voicemod", voicemod);

export default router;
