import UserEntity from "../../../domain/entities/UserEntity.js";
import EmailAlreadyInUseError from "../../errors/EmailAlreadyInUseError.js";
import InternalApplicationError from "../../errors/InternalApplicationError.js";
import CreateUserResponseDTO from "./dtos/CreateUserResponseDTO.js";

export default class CreateUserUseCase {
    constructor({ userRepository, hashProvider }) {
        this.userRepository = userRepository;
        this.hashProvider = hashProvider;
    };

    async execute({ createUserRequestDTO }) {

        const user = UserEntity.create({ email: createUserRequestDTO.email, password: createUserRequestDTO.password, name: createUserRequestDTO.name });

        const emailUserAlreadyExists = await this.userRepository.findByEmail({ email: user.email.value });

        if (emailUserAlreadyExists) throw new EmailAlreadyInUseError({ originalError: "E-mail já está em uso" });

        const hashedPassword = await this.hashProvider.hash({ value: user.password.value });

        if (!hashedPassword || hashedPassword.length === 0) throw new InternalApplicationError({ originalError: "Falha na geração do hash" });

        user.updatePassword({ hashedPassword });

        const savedUser = await this.userRepository.save({ user });

        return new CreateUserResponseDTO({
            idUser: savedUser.idUser,
            name: savedUser.name.value,
            email: savedUser.email.value
        });
    };
};  