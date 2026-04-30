import UserEntity from "../../../domain/UserEntity.js";
import ApplicationErrors from "../../errors/ApplicationErros.js";
import CreateUserResponseDto from "../../dtos/user/CreateUserResponseDTO.js";

export default class CreateUserUseCase {
    constructor({ userRepository, hashProvider }) {
        this.userRepository = userRepository;
        this.hashProvider = hashProvider;
    };

    async execute({ createUserRequestDto }) {
        const userEntity = new UserEntity({ 
            email: createUserRequestDto.email, 
            password: createUserRequestDto.password, 
            name: createUserRequestDto.name 
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

        const savedUser = await this.userRepository.create({ userEntity });

        return new CreateUserResponseDto({
            id: savedUser.id,
            name: savedUser.name,
            email: savedUser.email
        });
    };
};