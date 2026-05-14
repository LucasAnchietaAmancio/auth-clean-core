import UserEntity from "../../../domain/entities/UserEntity.js";

export default class UserMapper {

    static toDomain(userRecord) {
        if (!userRecord) return null;

        return UserEntity.restore({
            id: userRecord.id_user,
            name: userRecord.name,
            email: userRecord.email,
            hashedPassword: userRecord.password
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

        return UserEntity.restore({
            id: userRecord.id_user,
            email: userRecord.email,
            name: userRecord.name,
            hashedPassword: userRecord.password
        });
    };
};