import LoginRequestDTO from "../../../application/dtos/auth/LoginRequestDTO.js";

export default class LoginController {
    constructor({ loginUseCase }) {
        this.loginUseCase = loginUseCase;
    }

    async handle(req, res, next) {
        try {
            const { email, password } = req.body;
            const loginRequestDTO = new LoginRequestDTO({ email, password });
            const responseDTO = await this.loginUseCase.execute({ loginRequestDTO });

            return res.status(200).json({
                success: true,
                data: responseDTO
            });

        } catch (error) {
            next(error);
        }
    }
}