import UserEntity from "../../../domain/UserEntity.js";
import ApplicationErrors from "../../errors/ApplicationErros.js";

export default class CreateUserUseCase {
    constructor(userRepository, hashProvider) {
        this.userRepository = userRepository;
        this.hashProvider = hashProvider;
    };

    async execute({ email, password, name }) {
        const user = new UserEntity({ email, password, name });

        const emailUserAlreadyExists = await this.userRepository.findByEmail(user.email.value);

        if (emailUserAlreadyExists) {
            throw ApplicationErrors.conflict(
                "E-mail já cadastrado",
                "O e-mail informado já está em uso por outra conta."
            );
        };

        const passwordHash = await this.hashProvider.hash({ password: user.password.value });

        if (!passwordHash || passwordHash.length === 0) {
            throw ApplicationErrors.internalError(
                "Erro interno do servidor",
                "Ocorreu um erro ao processar a sua senha."
            );
        };

        user.updatePassword({ hashedPassword: passwordHash });

        return await this.userRepository.create(user);
    };
};