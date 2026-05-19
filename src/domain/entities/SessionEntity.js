import InvalidDomainParams from "../errors/InvalidDomainParams.js";

export default class SessionEntity {
    constructor({ id, userId, token, jti, expiresAt }) {
        this.id = id || null;
        this.userId = userId;
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

    isOwnedBy(userId) {
        return this.userId === userId;
    }

    static create({ userId, token, jti, expiresAt }) {
        if (!userId || !token || !jti || !expiresAt) throw new InvalidDomainParams({ originalError: "Dados insuficientes para reconstrução da entidade" });
        return new SessionEntity({ userId, token, jti, expiresAt });
    }

    static restore({ id, userId, token, jti, expiresAt }) {
        if (!id || !userId || !token || !jti || !expiresAt) throw new InvalidDomainParams({ originalError: "Dados insuficientes para reconstrução da entidade" });
        return new SessionEntity({ id, userId, token, jti, expiresAt });
    }
}