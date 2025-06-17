import { JwtPayload } from "jsonwebtoken";
export interface IDecodedUser extends JwtPayload {
    email: string;
}

export interface ITokenResponse {
    success: boolean;
}
