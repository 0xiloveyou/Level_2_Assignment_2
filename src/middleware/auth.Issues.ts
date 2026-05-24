import type { NextFunction, Request, Response } from "express"
import jwt, { type JwtPayload }  from "jsonwebtoken"
import config from "../config"
import { pool } from "../db"
import type { ROLES } from "../types"
import sendResponse from "../utility/sendResponse"


export const authIssue = (...roles : ROLES[]) => {
   
   return async (req : Request, res : Response, next : NextFunction) => {

   try {
      
      
      /*
      > check if the token is exists
      > verify the token 
      > find the user into database 
      > if the user is allowed besed on role or not
      */

   // console.log(req.headers) 
   const token = req.headers.authorization

   if(!token){
      return sendResponse(res, {
             statusCode : 401,
             sucess : false,
             message : "unauthorized access",
            })

   }

   const decoded = jwt.verify(token as string, config.secret as string) as JwtPayload
   /// after decode we need to give type --> jwtPayload
   const userData = await pool.query(`
      SELECT *  FROM usersProfile WHERE email = $1
      `, [decoded.email])

   const user = userData.rows[0]

   if(userData.rows.length === 0){
      return sendResponse(res, {
             statusCode : 404,
             sucess : false,
             message : "user not found on the database",
            })
    }


   if(roles.includes(user.role)){

     req.userData = decoded
     return next()
   }
   else{
      const contributorId = user.id 
      const {id} = req.params /// isuue's id number
                              /// params --> /:id
                              
     if ("status" in req.body) {
            return sendResponse(res, {
             statusCode : 403,
             sucess : false,
             message : "Contributor has no permission to change status",
            }) 
         }

      const preResult  = await pool.query(`
       SELECT * FROM issues  WHERE id = $1
       `, [id])

      const issueInfo = preResult.rows[0]
      const {reporter_id, status} = issueInfo


      if(reporter_id === contributorId){
         
         if(status === 'open'){
            req.userData = decoded
            return next()
         }
         else{
             return sendResponse(res, {
             statusCode : 403,
             sucess : false,
             message : "Status is not open. So not allowed to update it.",
            })

         }
      }
      else{
         return sendResponse(res, {
             statusCode : 403,
             sucess : false,
             message : "Can't update others issue",
            })
      }
   }

      
   } catch (error) {
      next(error)
   }
}
}

