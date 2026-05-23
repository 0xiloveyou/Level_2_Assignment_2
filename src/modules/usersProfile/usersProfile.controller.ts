import type { Request, Response } from "express"
import sendResponse from "../../utility/sendResponse"
import { userService } from "./usersProfile.service"

 
const createUser  = async (req : Request, res : Response) => {

try{

  const result = await userService.createUserIntoDB(req.body)
 
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


// const getAllUsers =  async(req : Request , res : Response) => {
//    try{
      
//       const result = await userService.getAllUsersFromDB()

//       res.status(200).json(
//       { 
//         sucess : true,
//         message : "users retrived sucessfully",
//         data : result.rows
//       }
//       )
//    }catch(error : any){
//          res.status(500).json(
//       { 
//         sucess : false,
//         message : error.message,
//         error : error
//       }
//       )
//    }
// }


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

export const userControler = {
    createUser,
    // getAllUsers,
    // getSingleUser,
    // updateUser,
    // deleteUser
}