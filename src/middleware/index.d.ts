import type { JwtPayload } from "jsonwebtoken";

declare global{
    namespace Express {
        interface Request {
            // currentUser: UserModel
            userData? : JwtPayload /// attached userData custom property inside the req
        }
    }
}