import SessionEntity from "../../../domain/entities/SessionEntity.js";

export default class SessionMapper {
    static toDomain(sessionRecord) {
        if (!sessionRecord) return null;

        return SessionEntity.restore({
            id: sessionRecord.id_session,
            userId: sessionRecord.user_id,
            token: sessionRecord.token,
            jti: sessionRecord.jti,
            expiresAt: sessionRecord.expires_at
        });
    }
};