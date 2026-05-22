export default class LogoutController {
    constructor({ logoutUseCase }) {
        this.logoutUseCase = logoutUseCase;
    }

    async handle (req, res, next) {
        try {
            const refreshToken = req.cookies?.refreshToken

            await this.logoutUseCase.execute({ refreshToken });

            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: true,
                sameSite: "strict"
            });

            return res.status(200).json({
                success: true,
                message: "Logoff realizado com sucesso"
            });
        } catch (error) {
            next(error);
        }
    }
}


