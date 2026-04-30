
export default class IHashProvider {
    async hash({ value }) {
        throw new Error("Método não implementado");
    }

    async compare({ value, hash }) {
        throw new Error("Método não implementado");
    }
}