export default class LoginResponseDTO {
    constructor({ accessToken, refreshToken, user }) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.user = {
            id: user.id,
            name: user.name,
        };
    }
}
