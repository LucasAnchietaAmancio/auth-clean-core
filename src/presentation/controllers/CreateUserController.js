import { z } from "zod";
import CreateUserRequestDTO from "../../application/dtos/user/CreateUserRequestDTO.js";

export default class CreateUserController {
    constructor(createUserUseCase) {
        this.createUserUseCase = createUserUseCase;
    }

    handle = async (req, res, next) => {
        try {
            const schema = z.object({
                name: z.string().min(3).max(100),
                email: z.string().email().max(255),
                password: z.string().min(8).max(100)
            });

            const { name, email, password } = schema.parse(req.body);
            const createUserRequestDTO = new CreateUserRequestDTO({ name, email, password });
            const responseDTO = await this.createUserUseCase.execute({ createUserRequestDTO });

            return res.status(201).json({
                success: true,
                data: responseDTO
            });

        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: "P400",
                        message: "Dados de entrada inválidos",
                        description: error.errors.map(err => `${err.path}: ${err.message}`).join(", ")
                    }
                });
            }
            next(error);
        }
    }
}
