export default class CreateUserRequestDto {
    constructor({ name, email, password }) {
        this.name = name;
        this.email = email;
        this.password = password;
    };
};
