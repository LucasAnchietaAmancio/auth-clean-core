
export default class RefreshRouter {
    constructor({ router, rateLimit, validator, controller }) {
        this.router = router;
        this.rateLimit = rateLimit;
        this.validator = validator;
        this.controller = controller;
    }

    init() {
        this.router.post("/refresh",
            this.rateLimit.execute({ limit: 10, minutes: 1, prefix: "refresh" }),
            this.validator.cookiesValidation({ schemaName:"REFRESH" }),
            (req, res, next) => this.controller.handle(req, res, next)
        );

        return this.router;
    }
}
