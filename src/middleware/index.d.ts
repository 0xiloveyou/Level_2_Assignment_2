import type { JwtPayload } from "jsonwebtoken";

declare global{
    namespace Express {
        interface Request {
            // currentUser: UserModel
            userData? : JwtPayload
        }
    }
}