
export default class IHashProvider {
    async hash({ password, salt }) {
        throw new Error("Método não implementado");
    }

    async compare({ password, hash }) {
        throw new Error("Método não implementado");
    }
}