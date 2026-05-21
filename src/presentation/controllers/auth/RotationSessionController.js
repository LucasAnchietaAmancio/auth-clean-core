import RotationSessionRequestDTO from "../../../application/use-cases/auth/dtos/RotationSessionRequestDTO.js";

export default class RotationSessionController {
    constructor({ rotationSessionUseCase, envs }) {
        this.rotationSessionUseCase = rotationSessionUseCase;
        this.envs = envs;
    }

    async handle(req, res, next) {
        try {
            const refreshToken = req.cookies?.refreshToken;
            const rotationSessionRequestDTO = new RotationSessionRequestDTO({ refreshToken });

            const result = await this.rotationSessionUseCase.execute({ rotationSessionRequestDTO });

            const accessTokenMaxAge = this.envs?.jwt?.accessTokenCookieMaxAgeMs || 15 * 60 * 1000;
            const refreshTokenMaxAge = this.envs?.jwt?.refreshTokenCookieMaxAgeMs || 7 * 24 * 60 * 60 * 1000;

            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: refreshTokenMaxAge
            });

            return res.status(200).json({
                success: true,
                message: "Sessão rotacionada com sucesso",
                metadata: {
                    idUser: result.user,
                    acessToken: result.acessToken
                }
            });

        } catch (error) {
            next(error);
        }
    }
}