import { Router } from "express";
import ValidationSchemaMiddleware from "../../middlewares/ValidationSchemaMiddleware.js";
import { registerSchema } from "../../schemas/User.schema.js";
import { makeCreateUserController } from "../../../main/factories/controllers/makeCreateUserController.js";

const router = Router();

router.post("/user/register", ValidationSchemaMiddleware.execute({ schema: registerSchema }), (req, res, next) => {
    const controller = makeCreateUserController();
    return controller.handle(req, res, next);
});

export default router;
