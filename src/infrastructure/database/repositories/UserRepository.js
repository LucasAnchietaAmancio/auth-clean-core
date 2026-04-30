import IUserRepository from "../../../application/interfaces/IUserRepository.js";
import InfrastructureErrors from "../../errors/InfrastructureErrors.js";
import UserMapper from "../mappers/UserMapper.js";

export default class UserRepository extends IUserRepository {
    constructor({ databaseClient }) {
        super();
        this.db = databaseClient;
    };

    async create({ userEntity }) {
        try {

            const prismaUser = await this.db.user.create({
                data: {
                    email: userEntity.email.value,
                    password: userEntity.password.value,
                    name: userEntity.name.value
                }
            });

            return UserMapper.toDomainView(prismaUser);

        } catch (error) {
            throw InfrastructureErrors.databaseError({
                message: "Erro ao criar usuário",
                description: "Houve uma falhar ao criar o usuário no banco de dados.",
                errorClientCode: error.code,
                originalError: error
            });
        };
    };

    async findByEmail({ email }) {
        try {

            const prismaUser = await this.db.user.findUnique({
                where: { email }
            });

            return UserMapper.toPublicView(prismaUser);

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