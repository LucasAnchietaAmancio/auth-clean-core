export default class LogOffController {
    constructor({ logOffUseCase }) {
        this.logOffUseCase = logOffUseCase;
    }

    async handle(req, res, next) {
        try {

            await this.logOffUseCase.execute({ refreshToken });

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


