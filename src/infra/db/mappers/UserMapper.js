import UserEntity from "../../../domain/entities/UserEntity.js";

export default class UserMapper {

    static toDomain(userRecord) {
        if (!userRecord) return null;

        return new UserEntity({
            id: userRecord.id_user,
            name: userRecord.name,
            email: userRecord.email,
            password: userRecord.password,
            alreadyHashed: true
        });
    };

    static toPublicView(userRecord) {
        if (!userRecord) return null;

        return {
            id: userRecord.id_user,
            email: userRecord.email,
            name: userRecord.name,
        };
    };

    static toAuth(userRecord) {
        if (!userRecord) return null;

        return new UserEntity({
            id: userRecord.id_user,
            email: userRecord.email,
            name: userRecord.name,
            password: userRecord.password,
            alreadyHashed: true
        });
    };
};