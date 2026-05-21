export default class ValidationSchemaMiddleware {
    constructor({ validatorProvider }) {
        this.validatorProvider = validatorProvider;
    };

    bodyValidation({ schemaName }) {
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

    cookiesValidation({ schemaName }) {
        return (req, res, next) => {
            try {
                req.body = this.validatorProvider.validate({
                    value: req.cookies,
                    schemaName
                });
                next();
            } catch (error) {
                next(error);
            }
        };
    };
}