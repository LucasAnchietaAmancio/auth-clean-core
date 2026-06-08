export default class IUserRepository {
    async save({ user }) {
        throw new Error("Metodo nao implementado");
    };

    async findByIdUser({ idUser }) {
        throw new Error("Metodo nao implementado");
    };

    async findByEmail({ email }) {
        throw new Error("Metodo nao implementado");
    };

    async findAuthByEmail({ email }) {
        throw new Error("Metodo nao implementado");
    };
};
