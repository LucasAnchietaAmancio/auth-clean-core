export default class ISessionRepository {
    async save({ sessionEntity }) {
        throw new Error("Método não implementado");
    }

    async update({ sessionEntity }) {
        throw new Error("Método não implementado");
    }

    async findByJti({ jti }) {
        throw new Error("Método não implementado");
    }

    async deleteByJti({ jti }) {
        throw new Error("Método não implementado");
    }

    async deleteAllByUserId({ userId }) {
        throw new Error("Método não implementado");
    }
}
