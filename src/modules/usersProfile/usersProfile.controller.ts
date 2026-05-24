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


export const userControler = {
    createUser
}