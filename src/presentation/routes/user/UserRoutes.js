import { Router } from "express";
import { makeCreateUserController } from "../../../factories/user/makeCreateUserController.js";

const router = Router();

router.post("/user/register", (req, res, next) => {
    const controller = makeCreateUserController();
    return controller.handle(req, res, next);
});

export default router;
