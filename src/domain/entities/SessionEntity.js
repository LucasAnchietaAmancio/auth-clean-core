import InvalidDomainParams from "../errors/InvalidDomainParams.js";

export default class SessionEntity {
    constructor({ idSession, idUser, token, jti, expiresAt }) {
        this.idSession = idSession || null;
        this.idUser = idUser;
        this.token = token;
        this.jti = jti;
        this.expiresAt = expiresAt;
    }

    updateSessionData({ newTokenHash, newJti, newExpiresAt }) {
        if (!newTokenHash || !newJti || !newExpiresAt) {
            throw new InvalidDomainParams({ originalError: "Dados inválidos para atualizar a sessão." });
        }
        this.token = newTokenHash;
        this.jti = newJti;
        this.expiresAt = newExpiresAt;
    }

    isExpired() {
        const now = Math.floor(Date.now() / 1000);
        return this.expiresAt < now;
    }

    isOwnedBy(idUser) {
        return this.idUser === idUser;
    }

    static create({ idUser, token, jti, expiresAt }) {
        if (!idUser || !token || !jti || !expiresAt) throw new InvalidDomainParams({ originalError: "Dados insuficientes para reconstrução da entidade" });
        return new SessionEntity({ idUser, token, jti, expiresAt });
    }

    static restore({ idSession, idUser, token, jti, expiresAt }) {
        if (!idSession || !idUser || !token || !jti || !expiresAt) throw new InvalidDomainParams({ originalError: "Dados insuficientes para reconstrução da entidade" });
        return new SessionEntity({ idSession, idUser, token, jti, expiresAt });
    }
}
