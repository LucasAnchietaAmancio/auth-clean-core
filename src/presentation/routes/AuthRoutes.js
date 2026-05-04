import { Router } from "express";
import CreateUserController from "../controllers/user/CreateUserController.js";

const router = Router();

router.post("/register", CreateUserController.handle);

// router.post("/login", LoginController.execute);

export default router;
