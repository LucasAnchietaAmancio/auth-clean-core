export default class CreateUserRequestDTO {
    constructor({ name, email, password }) {
        this.name = name;
        this.email = email;
        this.password = password;
    };
};
