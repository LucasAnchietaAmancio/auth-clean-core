import UserEntity from "../../../domain/UserEntity.js";
import ApplicationErrors from "../../errors/ApplicationErros.js";

export default class CreateUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    };

    async execute({ email, password, name }) {
        const user = new UserEntity({ email, password, name });

        const emailUserAlreadyExists = await this.userRepository.findByEmail(user.email.value);

        if (emailUserAlreadyExists) {
            throw ApplicationErrors.conflict(
                "E-mail já cadastrado",
                "O e-mail informado já está em uso por outra conta."
            );
        }

        return await this.userRepository.create(user);
    };
};