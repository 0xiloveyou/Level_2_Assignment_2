// import type { NextFunction, Request, Response } from "express"
// import jwt, { type JwtPayload }  from "jsonwebtoken"
// import config from "../config"
// import { pool } from "../db"
// import type { ROLES } from "../types"


// const auth = (...roles : ROLES[]) => {

   
//    return async (req : Request, res : Response, next : NextFunction) => {

//       /// server crash if it can't decode properly 
//       /// to handle that we have to use try catch
      
//    try {
      
//       /*
//       > check if hte token is exists
//        > verify the token 
//         > find the user into database 
//          > if the user active or not

//       */

//    // console.log(req.headers) 
//    const token = req.headers.authorization

//    if(!token){
//       res.status(401).json({
//       success: false,
//       message : "unauthorized access"
//       })
//    }

//    const decoded = jwt.verify(token as string, config.secret as string) as JwtPayload
//    /// after decode we need to give type --> jwtPayload
//    const userData = await pool.query(`
//       SELECT *  FROM users WHERE email = $1
//       `, [decoded.email])

//    const user = userData.rows[0]

//    if(userData.rows.length === 0){
//       res.status(404).json({
//       success: false,
//       message : "user not found on the database"
//       })
//    }
//    if(!user?.is_active){
//       res.status(403).json({
//       success: false,
//       message : "Forbidden. user is deactivated"
//       })
//    }


//    if(roles.length && !roles.includes(user.role)){
//       res.status(403).json({
//       success: false,
//       message : "Forbidden. user role has no acess"
//       })
//    }

//    req.user = decoded  /// req : {user : { } }
//    /*
//    https://dev.to/kwabenberko/extend-express-s-request-object-with-typescript-declaration-merging-1nn5
//    express typescript namespace

//    the user type is not defined so we gotta declear this type manually
//    */

//    next()
      
//    } catch (error) {
//       next(error)
//    }

// }
// }

// export default auth