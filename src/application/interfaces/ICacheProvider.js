
export default class ICacheProvider {
    async set({ key, value, expiresIn }) {
        throw new Error("Method not implemented");
    }

    async get({ key }) {
        throw new Error("Method not implemented");
    }

    async delete({ key }) {
        throw new Error("Method not implemented");
    }
}
