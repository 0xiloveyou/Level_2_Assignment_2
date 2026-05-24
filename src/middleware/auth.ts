import type { NextFunction, Request, Response } from "express"
import jwt, { type JwtPayload }  from "jsonwebtoken"
import config from "../config"
import { pool } from "../db"
import type { ROLES } from "../types"


const auth = (...roles : ROLES[]) => {
   
   return async (req : Request, res : Response, next : NextFunction) => {

      /// server crash if it can't decode properly 
      /// to handle that we have to use try catch
      
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


   if(roles.includes(user.role)){
     req.userData = decoded
     return next

     // return res.status(403).json({
      // success: false,
      // message : "Forbidden. user role has no acess"
      // })
   }
   else{
      const maintainerId = user.id 
      const {id} = req.body /// isuue's id number

      const preResult  = await pool.query(`
       SELECT * FROM issues  WHERE id = $1
       `, [id])
      const {reporter_id, status} = preResult.rows[0]

      if(reporter_id === maintainerId){
         if(status === 'open'){
            req.userData = decoded
            return next()
         }
         else{
             return res.status(403).json({
             success: false,
             message : "Status is not open. So not allowed to update"
          })
         }
      }
      else{
         return res.status(403).json({
         success: false,
         message : "Can't update others issue"
       })
      }

   }

      
   } catch (error) {
      next(error)
   }

}
}

export default auth