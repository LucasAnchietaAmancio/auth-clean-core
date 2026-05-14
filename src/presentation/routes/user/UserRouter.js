export default class UserRouter {
    constructor({ router, rateLimit, validateSchema, controller }) {
        this.router = router;
        this.rateLimit = rateLimit;
        this.validateSchema = validateSchema;
        this.controller = controller;
    }

    init() {
        this.router.post("/register", 
            this.rateLimit.execute({ limit: 5, minutes: 15, prefix: "register" }), 
            this.validateSchema.execute({ schemaName: "USER_REGISTER" }),
            (req, res, next) => this.controller.handle(req, res, next)
        );

        return this.router;
    }
}
