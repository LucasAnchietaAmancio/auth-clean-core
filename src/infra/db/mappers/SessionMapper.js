import SessionEntity from "../../../domain/entities/SessionEntity.js";

export default class SessionMapper {
    static toDomain(sessionRecord) {
        if (!sessionRecord) return null;

        return SessionEntity.restore({
            idSession: sessionRecord.id_session,
            idUser: sessionRecord.id_user,
            token: sessionRecord.token,
            jti: sessionRecord.jti,
            expiresAt: sessionRecord.expires_at
        });
    }
};
