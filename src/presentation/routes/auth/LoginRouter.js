export default class LoginRouter {
    constructor({ router, rateLimit, controller, validator }) {
        this.router = router;
        this.rateLimit = rateLimit;
        this.controller = controller;
        this.validator = validator;
    }

    init() {
        this.router.post("/login",
            this.rateLimit.execute({ limit: 10, minutes: 1, prefix: "login" }),
            this.validator.bodyValidation({ schemaName:"LOGIN" }),
            (req, res, next) => this.controller.handle(req, res, next)
        );

        return this.router;
    }
}
