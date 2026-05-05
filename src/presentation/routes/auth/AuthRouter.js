import { Router } from "express";
import validateSchema from "../../middlewares/schema/ValidationSchema.js";
import { loginSchema } from "../../schemas/UserSchemas.js";
import { makeLoginController } from "../../../factories/auth/makeLoginController.js";

const router = Router();

router.post("/login", validateSchema(loginSchema), (req, res, next) => {
    const controller = makeLoginController();
    return controller.handle(req, res, next);
});

export default router;
