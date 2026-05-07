export default class IRefreshTokenRepository {
    create({ refreshTokenEntity }) {
        throw new Error("Método não implementado");
    }

    findByToken({ token }) {
        throw new Error("Método não implementado");
    }

    deleteByUserId({ userId }) {
        throw new Error("Método não implementado");
    }

    deleteByToken({ token }) {
        throw new Error("Método não implementado");
    }
}
