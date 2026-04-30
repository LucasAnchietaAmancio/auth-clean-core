import IUserRepository from "../../../application/interfaces/IUserRepository.js";
import InfrastructureErrors from "../../errors/InfrastructureErrors.js";
import UserMapper from "../mappers/UserMapper.js";
import ApplicationErrors from "../../../application/errors/ApplicationErrors.js";

export default class UserRepository extends IUserRepository {
    constructor({ db }) {
        super();
        this.db = db;
    };

    async create({ userEntity }) {
        try {

            const userRecord = await this.db.user.create({
                data: {
                    email: userEntity.email.value,
                    password: userEntity.password.value,
                    name: userEntity.name.value
                }
            });

            return UserMapper.toDomain(userRecord);

        } catch (error) {
            if (error.code === "P2002") {
                throw ApplicationErrors.conflict({
                    message: "E-mail já cadastrado",
                    description: "O e-mail informado já está em uso por outra conta."
                });
            }

            throw InfrastructureErrors.databaseError({
                message: "Erro ao criar usuário",
                description: "Houve uma falha ao criar o usuário no banco de dados.",
                errorClientCode: error.code,
                originalError: error
            });
        };
    };

    async findByEmail({ email }) {
        try {

            const userRecord = await this.db.user.findUnique({
                where: { email }
            });

            return UserMapper.toDomain(userRecord);

        } catch (error) {
            throw InfrastructureErrors.databaseError({
                message: "Erro ao buscar usuário",
                description: "Falha ao realizar a busca no banco de dados.",
                errorClientCode: error.code,
                originalError: error
            });
        };
    };
};