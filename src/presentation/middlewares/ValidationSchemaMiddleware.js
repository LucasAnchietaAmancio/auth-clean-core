export default class ValidationSchemaMiddleware {
    constructor({ validatorProvider }) {
        this.validatorProvider = validatorProvider;
    };

    execute({ schemaName }) {
        return (req, res, next) => {
            try {
                req.body = this.validatorProvider.validate({
                    value: req.body,
                    schemaName
                });
                next();
            } catch (error) {
                next(error);
            }
        };
    };
}