
export default class UserMapper {

    static toPublicView(prismaUser) {
        if (!prismaUser) return null;

        return {
            id: prismaUser.id,
            email: prismaUser.email,
            name: prismaUser.name,
        };
    }

    static toDomainView(prismaUser) {
        if (!prismaUser) return null;

        return {
            id: prismaUser.id,
            email: prismaUser.email,
            name: prismaUser.name,
            password: prismaUser.password
        };
    };
};