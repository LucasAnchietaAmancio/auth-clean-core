import UserEntity from "../../../domain/entities/UserEntity.js";

export default class UserMapper {

    static toDomain(userRecord) {
        if (!userRecord) return null;

        return new UserEntity({
            id: userRecord.id,
            name: userRecord.name,
            email: userRecord.email,
            password: userRecord.password,
            alreadyHashed: true
        });
    }

    static toPublicView(userRecord) {
        if (!userRecord) return null;

        return {
            id: userRecord.id,
            email: userRecord.email,
            name: userRecord.name,
        };
    }

    static toAuthView(userRecord) {
        if (!userRecord) return null;

        return {
            id: userRecord.id,
            email: userRecord.email,
            name: userRecord.name,
            password: userRecord.password
        };
    };
};