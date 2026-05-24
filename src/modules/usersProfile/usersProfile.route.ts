import { Router, type NextFunction } from "express";
// import auth from "../../middleware/auth";
import { UserProfile_Role } from "../../types";
import { userControler } from "./usersProfile.controller";
 
const router = Router() 

router.post('/', userControler.createUser)

export const userRoute = router
