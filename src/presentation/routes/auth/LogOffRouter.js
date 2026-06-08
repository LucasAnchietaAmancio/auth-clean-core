export default class LogOffRouter {
    constructor({ router, controller, validator }) {
        this.router = router;
        this.controller = controller;
        this.validator = validator;
    }

    init() {
        this.router.post("/logout",
            this.validator.cookiesValidation({ schemaName:"REFRESH" }),
            (req, res, next) => this.controller.handle(req, res, next)
        );

        return this.router;
    }
}
