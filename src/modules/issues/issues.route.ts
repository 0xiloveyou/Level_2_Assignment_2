import { Router, type NextFunction } from "express";
import { issuesControler } from "./issues.controller";
import { UserProfile_Role } from "../../types";
import auth from "../../middleware/auth";
import { authIssue } from "../../middleware/auth.Issues";

const router = Router() 

router.post('/', issuesControler.createIssues)
router.get('/', issuesControler.getAllIssuesBySort)
router.get('/:id', issuesControler.getSingleIssue)
router.patch('/:id',
       authIssue(UserProfile_Role.maintainer),
       issuesControler.updateIssue)

// router.get('/', auth(User_Role.admin, User_Role.agent), userControler.getAllUsers)
// router.get('/:id', userControler.getSingleUser)
// router.put('/:id', userControler.updateUser)
// router.delete('/:id', userControler.deleteUser)

export const issuesRoute = router
