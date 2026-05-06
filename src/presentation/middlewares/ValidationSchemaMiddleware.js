export default class ValidationSchemaMiddleware {
    static execute({ schema }) {
        return (req, res, next) => {
            try {
                req.body = schema.parse(req.body);
                next();
            } catch (error) {
                next(error);
            }
        };
    }
}
