import LoginRequestDTO from "../../../application/use-cases/auth/dtos/LoginRequestDTO.js";

export default class LoginController {
    constructor({ loginUseCase, envs }) {
        this.loginUseCase = loginUseCase;
        this.envs = envs;
    }

    async handle (req, res, next) {
        try {
            const { email, password } = req.body;

            const loginRequestDTO = new LoginRequestDTO({ email, password });

            const result = await this.loginUseCase.execute({ loginRequestDTO });

            const refreshTokenMaxAge = this.envs?.jwt?.refreshTokenCookieMaxAgeMs || 7 * 24 * 60 * 60 * 1000;

            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: refreshTokenMaxAge
            });

            return res.status(200).json({
                success: true,
                message: "Login realizado com sucesso",
                metadata: {
                    idUser: result.user.idUser,
                    accessToken: result.accessToken
                }
            });

        } catch (error) {
            next(error);
        }
    }
}
