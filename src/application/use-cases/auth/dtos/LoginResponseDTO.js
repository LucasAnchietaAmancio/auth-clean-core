export default class LoginResponseDTO {
    constructor({ accessToken, refreshToken, user }) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.user = {
            idUser: user.idUser,
            name: user.name,
        };
    }
}
