import type { Request, Response } from "express"
import sendResponse from "../../utility/sendResponse"
import { issuesService } from "./issues.service"
// import { userService } from "./usersProfile.service"
import jwt, { type JwtPayload }  from "jsonwebtoken"
import config from "../../config"
import { pool } from "../../db"


const createIssues  = async (req : Request, res : Response ) => {

try{

  const accessToken = req.headers.authorization 

  if(!accessToken){
     return  res.status(401).json({
      success: false,
      message : "unauthorized access"
      })
   }
   const decoded = jwt.verify(accessToken as string, config.secret as string) as JwtPayload
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
  
  const inputData = {
    "reporter_id" :  user.id,
    ...req.body
  }
  
  const result = await issuesService.createIssuesIntoDB(inputData)
 
  sendResponse(res, {
  statusCode : 201,
  sucess : true,
  message : "User registered successfully",
  data : result.rows[0],
})

}catch(error : any){ /// we don't know the type of error

sendResponse(res, {
  statusCode : 500,
  sucess : false,
  message : error.message,
  data : error,
})
}

}


const getAllIssuesBySort =  async(req : Request , res : Response) => {
   try{
      
      const result = await userService.getAllUsersFromDB()

      res.status(200).json(
      { 
        sucess : true,
        message : "users retrived sucessfully",
        data : result.rows
      }
      )
   }catch(error : any){
         res.status(500).json(
      { 
        sucess : false,
        message : error.message,
        error : error
      }
      )
   }
}


// const getSingleUser = async(req : Request , res : Response) => {

//    const {id} = req.params

//   try {
    
//     const result = await userService.getSingelUserFromDB(id as string)
//     /// as ts can't recoginze the type we used as keyword

//       if(result.rows.length === 0){
//         res.status(404).json(
//       { 
//         sucess : false,
//         message : "User not found",
//         data : {}
//       })
//       }

//       res.status(200).json(
//       { 
//         sucess : true,
//         message : "users retrived sucessfully",
//         data : result.rows[0]
//       }
//       )

//   }catch(error : any ){
//      res.status(500).json(
//       { 
//         sucess : false,
//         message : error.message,
//         error : error
//       }
//       )
//   }

// }


// const updateUser = async(req : Request , res : Response) => {

//   const {id} = req.params

//   try {

//     const result = await userService.updateUserFromDB(req.body, id as string)

//     if(result.rows.length === 0){
//         res.status(404).json(
//       { 
//         sucess : false,
//         message : "User not found",
//         data : {}
//       })
//       }

//     res.status(200).json({ 
//         sucess : true,
//         message : "users updated sucessfully",
//         data : result.rows[0]
//       })
//   } catch(error : any ){
//      res.status(500).json(
//       { 
//         sucess : false,
//         message : error.message,
//         error : error
//       })
//   }

// }

// const deleteUser = async(req : Request , res : Response) => {

//    const {id} = req.params
//    try {
//        const result = await userService.deleteUserFromDB(id as string)

//        if(result.rows.length === 0){
//         res.status(404).json(
//       { 
//         sucess : false,
//         message : "User not found",
//         data : {}
//       })
//       }

//       res.status(200).json({ 
//         sucess : true,
//         message : "users deleted sucessfully",
//         data : {}
//       })

//    } catch (error : any) {
//     res.status(500).json(
//       { 
//         sucess : false,
//         message : error.message,
//         error : error
//       })
//    }
// }

export const issuesControler = {
    createIssues,
    getAllIssuesBySort,
    // getSingleUser,
    // updateUser,
    // deleteUser
}