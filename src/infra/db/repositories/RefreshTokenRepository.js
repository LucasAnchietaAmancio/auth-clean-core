import IRefreshTokenRepository from "../../../domain/contracts/repositories/IRefreshTokenRepository.js";
import PrismaErrorTranslator from "../prisma/PrismaErrorTranslator.js";
import RefreshTokenMapper from "../mappers/RefreshTokenMapper.js";

export default class RefreshTokenRepository extends IRefreshTokenRepository {
    constructor({ db }) {
        super();
        this.db = db;
    }

    async create({ refreshTokenEntity }) {
        try {
            const record = await this.db.refresh_tokens.create({
                data: {
                    userId: refreshTokenEntity.userId,
                    token: refreshTokenEntity.token,
                    jti: refreshTokenEntity.jti,
                    expiresAt: refreshTokenEntity.expiresAt
                }
            });

            return RefreshTokenMapper.toDomain(record);

        } catch (error) {
            throw PrismaErrorTranslator.translate({
                error,
                message: "Erro ao persistir Refresh Token",
                description: "Não foi possível salvar o Refresh Token no banco de dados."
            });
        }
    }

    async findByToken({ token }) {
        try {
            const record = await this.db.refresh_tokens.findUnique({
                where: { token }
            });

            if (!record) return null;

            return RefreshTokenMapper.toDomain(record);

        } catch (error) {
            throw PrismaErrorTranslator.translate({
                error,
                message: "Erro ao buscar Refresh Token",
                description: "Não foi possível buscar o Refresh Token no banco de dados."
            });
        }
    }

    async deleteByUserId({ userId }) {
        try {
            await this.db.refresh_tokens.deleteMany({
                where: { userId }
            });
        } catch (error) {
            throw PrismaErrorTranslator.translate({
                error,
                message: "Erro ao revogar tokens do usuário",
                description: "Não foi possível revogar os Refresh Tokens do usuário."
            });
        }
    }

    async deleteByToken({ token }) {
        try {
            await this.db.refresh_tokens.delete({
                where: { token }
            });
        } catch (error) {
            throw PrismaErrorTranslator.translate({
                error,
                message: "Erro ao revogar token",
                description: "Não foi possível revogar o Refresh Token."
            });
        }
    }
}
