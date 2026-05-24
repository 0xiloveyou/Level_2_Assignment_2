// import type { NextFunction, Request, Response } from "express"
// import jwt, { type JwtPayload }  from "jsonwebtoken"
// import config from "../config"
// import { pool } from "../db"
// import type { ROLES } from "../types"


// const maintainerAuthLogic = (...roles : ROLES[]) => {
   
//    return async (req : Request, res : Response, next : NextFunction) => {

//       /// server crash if it can't decode properly 
//       /// to handle that we have to use try catch
      
//    try {
      

//    const token = req.headers.authorization

//    //! !token -->  already handled on previous auth()

//    const decoded = jwt.verify(token as string, config.secret as string) as JwtPayload
//    const userData = await pool.query(`
//       SELECT *  FROM usersProfile WHERE email = $1
//       `, [decoded.email])

//    const user = userData.rows[0]

//    if(userData.rows.length === 0){
//       res.status(404).json({
//       success: false,
//       message : "user not found on the database"
//       })
//    }

//     if(roles.includes(user.role)){
//       return next()
//    }


//    if(roles.length && !roles.includes(user.role)){
//       res.status(403).json({
//       success: false,
//       message : "Forbidden. user role has no acess"
//       })
//    }

//    req.userData = decoded

//    next()
      
//    } catch (error) {
//       next(error)
//    }

// }
// }

// export default maintainerAuthLogic