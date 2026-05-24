import type { NextFunction, Request, Response } from "express"
import jwt, { type JwtPayload }  from "jsonwebtoken"
import config from "../config"
import { pool } from "../db"
import type { ROLES } from "../types"
import sendResponse from "../utility/sendResponse"


const auth = (...roles : ROLES[]) => {
   
   return async (req : Request, res : Response, next : NextFunction) => {

   try {
      
      /*
      > check if the token is exists
      > verify the token 
      > find the user into database 
      > validate the role 
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
             message : "User not found on the database",
            })
   }

   if(roles.length && !roles.includes(user.role)){
      return sendResponse(res, {
             statusCode : 403,
             sucess : false,
             message : "Forbidden. User role has no acess",
            }) 
   }

   req.userData = decoded
   next()
      
   } catch (error) {
      next(error)
   }

}
}

export default auth