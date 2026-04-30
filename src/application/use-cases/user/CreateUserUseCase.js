import UserEntity from "../../../domain/entities/UserEntity.js";
import ApplicationErrors from "../../errors/ApplicationErrors.js";
import CreateUserResponseDTO from "../../dtos/user/CreateUserResponseDTO.js";

export default class CreateUserUseCase {
    constructor({ userRepository, hashProvider }) {
        this.userRepository = userRepository;
        this.hashProvider = hashProvider;
    };

    async execute({ createUserRequestDTO }) {
        const userEntity = new UserEntity({
            email: createUserRequestDTO.email,
            password: createUserRequestDTO.password,
            name: createUserRequestDTO.name
        });

        const emailUserAlreadyExists = await this.userRepository.findByEmail({ email: userEntity.email.value });

        if (emailUserAlreadyExists) {
            throw ApplicationErrors.conflict({
                message: "E-mail já cadastrado",
                description: "O e-mail informado já está em uso por outra conta."
            });
        };

        const passwordHash = await this.hashProvider.hash({ password: userEntity.password.value });

        if (!passwordHash || passwordHash.length === 0) {
            throw ApplicationErrors.internalError({
                message: "Erro interno do servidor",
                description: "Ocorreu um erro ao processar a sua senha."
            });
        };

        userEntity.updatePassword({ hashedPassword: passwordHash });

        const savedUserEntity = await this.userRepository.create({ userEntity });

        return new CreateUserResponseDTO({
            id: savedUserEntity.id,
            name: savedUserEntity.name.value,
            email: savedUserEntity.email.value
        });
    };
};