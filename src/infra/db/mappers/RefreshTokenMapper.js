import RefreshTokenEntity from "../../../domain/entities/RefreshTokenEntity.js";

export default class RefreshTokenMapper {
    static toDomain(refreshTokenRecord) {
        if (!refreshTokenRecord) return null;

        return new RefreshTokenEntity({
            id: refreshTokenRecord.id_refresh_token,
            userId: refreshTokenRecord.userId,
            token: refreshTokenRecord.token,
            jti: refreshTokenRecord.jti,
            expiresAt: refreshTokenRecord.expiresAt
        });
    }
};