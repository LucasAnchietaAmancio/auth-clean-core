
export default class CreateUserRouter {
    constructor({ router, rateLimit, controller, validator }) {
        this.router = router;
        this.rateLimit = rateLimit;
        this.controller = controller;
        this.validator = validator;
    }

    init() {
        this.router.post("/user/register",
            this.rateLimit.execute({ limit: 5, minutes: 5, prefix: "register" }),
            this.validator.bodyValidation({ schemaName: "USER_REGISTER"}),
            (req, res, next) => this.controller.handle(req, res, next)
        );

        return this.router;
    }
}
