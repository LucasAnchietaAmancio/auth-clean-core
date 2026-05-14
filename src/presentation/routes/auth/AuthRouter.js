export default class AuthRouter {
    constructor({ router, rateLimit, validateSchema, controller }) {
        this.router = router;
        this.rateLimit = rateLimit;
        this.validateSchema = validateSchema;
        this.controller = controller;
    }

    init() {
        this.router.post("/login", 
            this.rateLimit.execute({ limit: 10, minutes: 1, prefix: "login" }), 
            this.validateSchema.execute({ schemaName: "USER_LOGIN" }),
            (req, res, next) => this.controller.handle(req, res, next)
        );

        return this.router;
    }
}