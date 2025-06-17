import { IDecodedUser } from "app/modules/auth/auth.interface";

declare global {
    namespace Express {
        interface Request {
            user?: IDecodedUser;
        }
    }
}
