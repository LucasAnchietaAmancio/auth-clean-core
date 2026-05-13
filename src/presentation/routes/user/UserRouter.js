import { Router } from "express";
import { makeValidationSchemaMiddleware } from "../../../main/factories/middlewares/makeValidationSchemaMiddleware.js";
import { registerSchema } from "../../schemas/users/RegisterSchema.js";
import { makeCreateUserController } from "../../../main/factories/controllers/makeCreateUserController.js";

import { makeRateLimitMiddleware } from "../../../main/factories/middlewares/makeRateLimitMiddleware.js";

const router = Router();
const validateSchema = makeValidationSchemaMiddleware();
const rateLimit = makeRateLimitMiddleware();
const controller = makeCreateUserController();

router.post("/user/register", rateLimit.execute({ limit: 5, minutes: 15, prefix: "register" }), validateSchema.execute({ schema: registerSchema }),
    (req, res, next) => {
        return controller.handle(req, res, next);
    }
);

export default router;
