import GetProfileRequestDTO from "../../../application/use-cases/user/dtos/GetProfileRequestDTO.js";

export default class GetProfileController {
    constructor({ getProfileUseCase, validatorProvider }) {
        this.getProfileUseCase = getProfileUseCase;
        this.validatorProvider = validatorProvider;
    }

    async handle(req, res, next) {
        try {
            const body = this.validatorProvider
                ? this.validatorProvider.validate({ value: req.body, schemaName: "USER_PROFILE" })
                : req.body;
            const idUser = body.idUser;
            const getProfileRequestDTO = new GetProfileRequestDTO({ idUser });
            const responseDTO = await this.getProfileUseCase.execute({ getProfileRequestDTO });

            return res.status(200).json({
                success: true,
                data: responseDTO
            });

        } catch (error) {
            next(error);
        }
    }
}
