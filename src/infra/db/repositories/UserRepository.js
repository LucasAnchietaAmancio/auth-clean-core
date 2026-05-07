import IUserRepository from "../../../application/interfaces/repositories/IUserRepository.js";
import UserMapper from "../mappers/UserMapper.js";
import PrismaErrorTranslator from "../prisma/PrismaErrorTranslator.js";

export default class UserRepository extends IUserRepository {
    constructor({ db }) {
        super();
        this.db = db;
    };

    async create({ user }) {
        try {
            const userRecord = await this.db.users.create({
                data: {
                    email: user.email.value,
                    password: user.password.value,
                    name: user.name.value
                }
            });

            return UserMapper.toDomain(userRecord);

        } catch (error) {
            throw PrismaErrorTranslator.translate({
                error,
                message: "Erro ao criar usuário",
                description: "O e-mail informado já está em uso por outra conta."
            });
        };
    };

    async findByEmail({ email }) {
        try {
            const userRecord = await this.db.users.findUnique({
                where: { email },
                select: {
                    id_user: true,
                    email: true,
                    name: true,
                }
            });

            return UserMapper.toDomain(userRecord);

        } catch (error) {
            throw PrismaErrorTranslator.translate({
                error,
                message: "Erro ao buscar usuário"
            });
        };
    };

    async findAuthByEmail({ email }) {
        try {
            const userRecord = await this.db.users.findUnique({
                where: { email },
                select: {
                    id_user: true,
                    email: true,
                    name: true,
                    password: true
                }
            });

            return UserMapper.toAuth(userRecord);

        } catch (error) {
            throw PrismaErrorTranslator.translate({
                error,
                message: "Erro ao buscar usuário para autenticação"
            });
        }
    };
};