
export default class RefreshRouter {
    constructor({ router, rateLimit, validateSchema, controller }) {
        this.router = router;
        this.rateLimit = rateLimit;
        this.validateSchema = validateSchema;
        this.controller = controller;
    }

    init() {
        this.router.post("/refresh",
            this.rateLimit.execute({ limit: 10, minutes: 1, prefix: "refresh" }),
            (req, res, next) => this.controller.handle(req, res, next)
        );

        return this.router;
    }
}