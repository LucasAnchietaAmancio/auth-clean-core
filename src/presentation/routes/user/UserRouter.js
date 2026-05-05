import { Router } from "express";
import validateSchema from "../../middlewares/schema/ValidationSchema.js";
import { registerSchema } from "../../schemas/UserSchemas.js";
import { makeCreateUserController } from "../../../factories/user/makeCreateUserController.js";

const router = Router();

router.post("/user/register", validateSchema(registerSchema), (req, res, next) => {
    const controller = makeCreateUserController();
    return controller.handle(req, res, next);
});

export default router;
