import type { NextFunction, Request, Response } from "express"
import jwt, { type JwtPayload }  from "jsonwebtoken"
import config from "../config"
import { pool } from "../db"
import type { ROLES } from "../types"


const auth = (...roles : ROLES[]) => {
   
   return async (req : Request, res : Response, next : NextFunction) => {

   try {
      
      /*
      > check if hte token is exists
       > verify the token 
        > find the user into database 
         > if the user active or not
      */

   // console.log(req.headers) 
   const token = req.headers.authorization

   if(!token){
      return res.status(401).json({
      success: false,
      message : "unauthorized access"
      })
   }

   const decoded = jwt.verify(token as string, config.secret as string) as JwtPayload
   /// after decode we need to give type --> jwtPayload
   const userData = await pool.query(`
      SELECT *  FROM usersProfile WHERE email = $1
      `, [decoded.email])

   const user = userData.rows[0]

   if(userData.rows.length === 0){
      return res.status(404).json({
      success: false,
      message : "user not found on the database"
      })
   }

   if(roles.length && !roles.includes(user.role)){
      return res.status(403).json({
      success: false,
      message : "Forbidden. user role has no acess"
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