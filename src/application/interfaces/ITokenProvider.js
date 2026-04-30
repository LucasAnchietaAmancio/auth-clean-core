
export default class ITokenProvider {
    async generateToken({ payload }) {
        throw new Error("Método não implementado");
    };

    async verifyToken({ token }) {
        throw new Error("Método não implementado");
    };

    async decodeToken({ token }) {
        throw new Error("Método não implementado");
    };
};