import crypto from "crypto";
import jwt from "jsonwebtoken";
import JwtTokenProvider from "../../../infra/providers/token/JwtTokenProvider.js";

export const makeTokenProvider = ({ envs }) => {
    return new JwtTokenProvider({ jwt, crypto, envs });
};
