import { Router, type NextFunction } from "express";
// import auth from "../../middleware/auth";
import { UserProfile_Role } from "../../types";
import { userControler } from "./usersProfile.controller";
 
const router = Router() 

router.post('/', userControler.createUser)
// router.get('/', auth(User_Role.admin, User_Role.agent), userControler.getAllUsers)
// router.get('/:id', userControler.getSingleUser)
// router.put('/:id', userControler.updateUser)
// router.delete('/:id', userControler.deleteUser)

export const userRoute = router
