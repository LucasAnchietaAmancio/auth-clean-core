import { Router } from "express";
import { makeValidationSchemaMiddleware } from "../../../main/factories/middlewares/makeValidationSchemaMiddleware.js";
import { loginSchema } from "../../schemas/users/LoginSchema.js";
import { makeLoginController } from "../../../main/factories/controllers/makeLoginController.js";
import { makeRateLimitMiddleware } from "../../../main/factories/middlewares/makeRateLimitMiddleware.js";

const router = Router();
const rateLimit = makeRateLimitMiddleware();
const validateSchema = makeValidationSchemaMiddleware();
const controller = makeLoginController();

router.post("/login", rateLimit.execute({ limit: 10, minutes: 1, prefix: "login" }), validateSchema.execute({ schema: loginSchema }),
    (req, res, next) => {
        return controller.handle(req, res, next);
    }
);

export default router;
