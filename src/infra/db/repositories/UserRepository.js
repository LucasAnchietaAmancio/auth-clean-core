import IUserRepository from "../../../domain/contracts/repositories/IUserRepository.js";
import UserMapper from "../mappers/UserMapper.js";
import DatabaseError from "../../errors/DatabaseError.js";

export default class UserRepository extends IUserRepository {
    constructor({ db }) {
        super();
        this.db = db;
    };

    async create({ user }) {
        try {
            const db = await this.db.getClient();
            const userRecord = await db.users.create({
                data: {
                    email: user.email.value,
                    password: user.password.value,
                    name: user.name.value
                }
            });

            return UserMapper.toDomain(userRecord);

        } catch (error) {
            throw DatabaseError.handle({
                error,
                message: "Erro ao criar usuário"
            });
        };
    };

    async findByEmail({ email }) {
        try {
            const db = await this.db.getClient();
            const userRecord = await db.users.findUnique({
                where: { email },
                select: {
                    id_user: true,
                    email: true,
                    name: true,
                    password: true
                }
            });

            return UserMapper.toDomain(userRecord);

        } catch (error) {
            throw DatabaseError.handle({
                error,
                message: "Erro ao buscar usuário"
            });
        };
    };

    async findAuthByEmail({ email }) {
        try {
            const db = await this.db.getClient();
            const userRecord = await db.users.findUnique({
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
            throw DatabaseError.handle({
                error,
                message: "Erro ao buscar usuário para autenticação"
            });
        }
    };
};
