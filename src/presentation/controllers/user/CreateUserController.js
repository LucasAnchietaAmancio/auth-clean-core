import CreateUserRequestDTO from "../../../application/dtos/user/CreateUserRequestDTO.js";

export default class CreateUserController {
    constructor({ createUserUseCase }) {
        this.createUserUseCase = createUserUseCase;
    }

    async handle(req, res, next) {
        try {
            const { name, email, password } = req.body;
            const createUserRequestDTO = new CreateUserRequestDTO({ name, email, password });
            const responseDTO = await this.createUserUseCase.execute({ createUserRequestDTO });

            return res.status(201).json({
                success: true,
                data: responseDTO
            });

        } catch (error) {
            next(error);
        }
    }
}
