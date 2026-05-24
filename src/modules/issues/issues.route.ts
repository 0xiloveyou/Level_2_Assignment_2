import { Router, type NextFunction } from "express";
import { issuesControler } from "./issues.controller";
import { UserProfile_Role } from "../../types";
import auth from "../../middleware/auth";
import { authIssue } from "../../middleware/auth.Issues";

const router = Router() 

router.post('/', auth(UserProfile_Role.maintainer, UserProfile_Role.contributor), issuesControler.createIssues)
router.get('/', issuesControler.getAllIssuesBySort)
router.get('/:id', issuesControler.getSingleIssue)
router.patch('/:id',
       authIssue(UserProfile_Role.maintainer),
       issuesControler.updateIssue) /// contributor related logic handled inside the middlewere fucntion 
router.delete('/:id',auth(UserProfile_Role.maintainer), issuesControler.deleteIssue)


export const issuesRoute = router
