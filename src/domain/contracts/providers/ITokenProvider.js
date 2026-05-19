
export default class ITokenProvider {
    async generateAccessToken({ payload, expires }) {
        throw new Error("Método não implementado");
    };

    async generateRefreshToken({ payload, expires }) {
        throw new Error("Método não implementado");
    };

    async verifyAccessToken({ accessToken }) {
        throw new Error("Método não implementado");
    };

    async verifyRefreshToken({ refreshToken }) {
        throw new Error("Método não implementado");
    };

    async decodeToken({ token }) {
        throw new Error("Método não implementado");
    };
};