
export default class GetProfileRouter {
    constructor({ router, rateLimit, controller, validator, auth }) {
        this.router = router;
        this.rateLimit = rateLimit;
        this.controller = controller;
        this.validator = validator;
        this.auth = auth;
    }

    init() {
        this.router.get("/user/me",
            this.rateLimit.execute({ limit: 5, minutes: 5, prefix: "profile" }),
            this.auth.execute(),
            (req, res, next) => {
                req.body = { idUser: req.user.idUser };
                next();
            },
            this.validator.bodyValidation({ schemaName: "USER_PROFILE" }),
            (req, res, next) => this.controller.handle(req, res, next)
        );

        return this.router;
    }
}
