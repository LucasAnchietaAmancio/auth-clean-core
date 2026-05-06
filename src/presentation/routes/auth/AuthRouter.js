import { Router } from "express";
import validateSchema from "../../middlewares/ValidationSchema.middleware.js";
import { loginSchema } from "../../schemas/User.schema.js";
import { makeLoginController } from "../../../factories/auth/makeLoginController.js";

const router = Router();

router.post("/login", validateSchema({ loginSchema }), (req, res, next) => {
    const controller = makeLoginController();
    return controller.handle(req, res, next);
});

export default router;
