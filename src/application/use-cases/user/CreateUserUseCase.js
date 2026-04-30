import UserEntity from "../../../domain/entities/UserEntity.js";
import ApplicationErrors from "../../errors/ApplicationErrors.js";
import CreateUserResponseDTO from "../../dtos/user/CreateUserResponseDTO.js";

export default class CreateUserUseCase {
    constructor({ userRepository, hashProvider }) {
        this.userRepository = userRepository;
        this.hashProvider = hashProvider;
    };

    async execute({ createUserRequestDTO }) {
        const user = new UserEntity({
            email: createUserRequestDTO.email,
            password: createUserRequestDTO.password,
            name: createUserRequestDTO.name
        });

        const emailUserAlreadyExists = await this.userRepository.findByEmail({ email: user.email.value });

        if (emailUserAlreadyExists) {
            throw ApplicationErrors.conflict({
                message: "E-mail já cadastrado",
                description: "O e-mail informado já está em uso por outra conta."
            });
        };

        const passwordHash = await this.hashProvider.hash({ value: user.password.value });

        if (!passwordHash || passwordHash.length === 0) {
            throw ApplicationErrors.internalError({
                message: "Erro interno do servidor",
                description: "Ocorreu um erro ao processar a sua senha."
            });
        };

        user.updatePassword({ hashedPassword: passwordHash });

        const savedUser = await this.userRepository.create({ user });

        return new CreateUserResponseDTO({
            id: savedUser.id,
            name: savedUser.name.value,
            email: savedUser.email.value
        });
    };
};