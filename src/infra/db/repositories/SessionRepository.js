import ISessionRepository from "../../../domain/contracts/repositories/ISessionRepository.js";
import DatabaseError from "../../errors/DatabaseError.js";
import SessionMapper from "../mappers/SessionMapper.js";

export default class SessionRepository extends ISessionRepository {
    constructor({ db }) {
        super();
        this.db = db;
    }

    async save({ sessionEntity }) {
        try {
            const db = await this.db.getClient();
            const record = await db.sessions.create({
                data: {
                    user_id: sessionEntity.userId,
                    token: sessionEntity.token,
                    jti: sessionEntity.jti,
                    expires_at: sessionEntity.expiresAt
                }
            });

            return SessionMapper.toDomain(record);

        } catch (error) {
            throw DatabaseError.handle({
                error,
                message: "Erro ao persistir sessão"
            });
        }
    }

    async update({ sessionEntity }) {
        try {
            const db = await this.db.getClient();
            const record = await db.sessions.update({
                where: { id_session: sessionEntity.id },
                data: {
                    token: sessionEntity.token,
                    jti: sessionEntity.jti,
                    expires_at: sessionEntity.expiresAt
                }
            });

            return SessionMapper.toDomain(record);

        } catch (error) {
            throw DatabaseError.handle({
                error,
                message: "Erro ao atualizar sessão"
            });
        }
    }

    async findByJti({ jti }) {
        try {
            const db = await this.db.getClient();
            const record = await db.sessions.findUnique({
                where: { jti }
            });

            if (!record) return null;

            return SessionMapper.toDomain(record);

        } catch (error) {
            throw DatabaseError.handle({
                error,
                message: "Erro ao buscar sessão por JTI"
            });
        }
    }

    async deleteByJti({ jti }) {
        try {
            const db = await this.db.getClient();
            await db.sessions.delete({
                where: { jti }
            });
        } catch (error) {
            throw DatabaseError.handle({
                error,
                message: "Erro ao revogar sessão"
            });
        }
    }

    async deleteAllByUserId({ userId }) {
        try {
            const db = await this.db.getClient();
            await db.sessions.deleteMany({
                where: { user_id: userId }
            });
        } catch (error) {
            throw DatabaseError.handle({
                error,
                message: "Erro ao revogar todas as sessões do usuário"
            });
        }
    }
}
