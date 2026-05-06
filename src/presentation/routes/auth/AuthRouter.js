import { Router } from "express";
import ValidationSchemaMiddleware from "../../middlewares/ValidationSchemaMiddleware.js";
import { loginSchema } from "../../schemas/User.schema.js";
import { makeLoginController } from "../../../main/factories/controllers/makeLoginController.js";
import { makeRateLimitMiddleware } from "../../../main/factories/middlewares/makeRateLimitMiddleware.js";

const router = Router();
const rateLimit = makeRateLimitMiddleware();

router.post("/login",
    rateLimit.execute({ limit: 10, minutes: 1, prefix: "login" }),
    ValidationSchemaMiddleware.execute({ schema: loginSchema }),
    (req, res, next) => {
        const controller = makeLoginController();
        return controller.handle(req, res, next);
    }
);

export default router;
