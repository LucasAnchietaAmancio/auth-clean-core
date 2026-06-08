import { z } from "zod";
import ZodValidatorProvider from "../../../infra/providers/schema/ZodValidatorProvider.js";

export const makeValidatorProvider = () => {
    return new ZodValidatorProvider({ zod: z });
};
