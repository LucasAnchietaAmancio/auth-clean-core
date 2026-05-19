
export default class IUserRepository {
    async save({ user }) {
        throw new Error("Método não implementado");
    };

    async findByEmail({ email }) {
        throw new Error("Método não implementado");
    };

    async findAuthByEmail({ email }) {
        throw new Error("Método não implementado");
    };
};