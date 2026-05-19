import InvalidTokenError from "../../../application/errors/InvalidTokenError.js";

export default class AuthMiddleware {
    constructor({ tokenProvider, userRepository }) {
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
    };

    execute() {
        return async (req, res, next) => {
            try {

                const authHeader = req.headers.authorization;
                if (!authHeader || !authHeader.startsWith("Bearer ")) {
                    throw new InvalidTokenError({ originalError: "Token de acesso não fornecido ou formato inválido." });
                }

                const accessToken = authHeader.split(" ")[1];

                const decoded = await this.tokenProvider.verifyAccessToken({ accessToken });
                
                if (!decoded || !decoded.email) {
                    throw new InvalidTokenError({ originalError: "Token de acesso inválido." });
                }

                const user = await this.userRepository.findByEmail({ email: decoded.email });

                if (!user) {
                    throw new InvalidTokenError({ originalError: "Usuário não encontrado ou inativo." });
                }

                req.user = {
                    id: user.id,
                    email: user.email.value
                };

                next();
            } catch (error) {
                next(error);
            }
        };
    };
}