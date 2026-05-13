import IRefreshTokenRepository from "../../../domain/contracts/repositories/IRefreshTokenRepository.js";
import DatabaseError from "../../errors/DatabaseError.js";
import RefreshTokenMapper from "../mappers/RefreshTokenMapper.js";

export default class RefreshTokenRepository extends IRefreshTokenRepository {
    constructor({ db }) {
        super();
        this.db = db;
    }

    async create({ refreshTokenEntity }) {
        try {
            const db = await this.db.getClient();
            const record = await db.refresh_tokens.create({
                data: {
                    userId: refreshTokenEntity.userId,
                    token: refreshTokenEntity.token,
                    jti: refreshTokenEntity.jti,
                    expiresAt: refreshTokenEntity.expiresAt
                }
            });

            return RefreshTokenMapper.toDomain(record);

        } catch (error) {
            throw DatabaseError.handle({
                error,
                message: "Erro ao persistir Refresh Token"
            });
        }
    }

    async findByToken({ token }) {
        try {
            const db = await this.db.getClient();
            const record = await db.refresh_tokens.findUnique({
                where: { token }
            });

            if (!record) return null;

            return RefreshTokenMapper.toDomain(record);

        } catch (error) {
            throw DatabaseError.handle({
                error,
                message: "Erro ao buscar Refresh Token"
            });
        }
    }

    async deleteByUserId({ userId }) {
        try {
            const db = await this.db.getClient();
            await db.refresh_tokens.deleteMany({
                where: { userId }
            });
        } catch (error) {
            throw DatabaseError.handle({
                error,
                message: "Erro ao revogar tokens do usuário"
            });
        }
    }

    async deleteByToken({ token }) {
        try {
            const db = await this.db.getClient();
            await db.refresh_tokens.delete({
                where: { token }
            });
        } catch (error) {
            throw DatabaseError.handle({
                error,
                message: "Erro ao revogar token"
            });
        }
    }
}

