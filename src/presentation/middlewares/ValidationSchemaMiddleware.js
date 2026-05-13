export default class ValidationSchemaMiddleware {
    constructor({ validatorProvider }) {
        this.validatorProvider = validatorProvider;
    };

    execute({ schema }) {
        return (req, res, next) => {
            try {
                req.body = this.validatorProvider.validate({
                    value: req.body,
                    schema
                });
                next();
            } catch (error) {
                next(error);
            }
        };
    };
}