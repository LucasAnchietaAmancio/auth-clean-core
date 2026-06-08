
export default class ICacheProvider {
    async set({ key, value, expiresIn }) {
        throw new Error("Método não implementado");
    }

    async get({ key }) {
        throw new Error("Método não implementado");
    }

    async delete({ key }) {
        throw new Error("Método não implementado");
    }
}
