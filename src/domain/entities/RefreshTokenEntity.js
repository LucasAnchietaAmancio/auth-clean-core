export default class RefreshTokenEntity {
    constructor({ id, userId, token, jti, expiresAt }) {
        this.id = id || null;
        this.userId = userId;
        this.token = token;
        this.jti = jti;
        this.expiresAt = expiresAt;
    }

    isExpired() {
        const nowInSeconds = Math.floor(Date.now() / 1000);
        return nowInSeconds > this.expiresAt;
    }
}
