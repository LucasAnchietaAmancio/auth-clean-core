import UnauthorizedError from "../../errors/UnauthorizedError.js";

export default class AuthMiddleware {
    constructor({ tokenProvider, userRepository, cacheProvider }) {
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
        this.cacheProvider = cacheProvider;
    }

    execute() {
        return async (req, res, next) => {
            try {
                const authHeader = req.headers.authorization;

                if (!authHeader || !authHeader.startsWith("Bearer ")) {
                    throw new UnauthorizedError({ originalError: "Token de acesso não fornecido ou formato inválido." });
                }

                const accessToken = authHeader.split(" ")[1];

                const decoded = await this.tokenProvider.verifyAccessToken({ accessToken });

                if (!decoded || !decoded.email || !decoded.jti) {
                    throw new UnauthorizedError({ originalError: "Token de acesso inválido." });
                }

                const blacklistedToken = await this.cacheProvider.get({
                    key: `auth:blacklist:${decoded.jti}`
                });

                if (blacklistedToken) {
                    throw new UnauthorizedError({ originalError: "Token de acesso revogado." });
                }

                const user = await this.userRepository.findByEmail({ email: decoded.email });

                if (!user) {
                    throw new UnauthorizedError({ originalError: "Usuário não encontrado ou inativo." });
                }

                req.user = {
                    idUser: user.idUser,
                    email: user.email.value
                };

                next();
            } catch (error) {
                next(error);
            }
        };
    }
}
