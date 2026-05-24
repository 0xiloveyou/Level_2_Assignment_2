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
     return sendResponse(res, {
       statusCode : 401,
       sucess : false,
       message : "unauthorized access",
      }) 
   }

   const decoded = jwt.verify(accessToken as string, config.secret as string) as JwtPayload
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
  
  const inputData = {
    "reporter_id" :  user.id,
    ...req.body
  }
  
  const result = await issuesService.createIssuesIntoDB(inputData)
 
   sendResponse(res, {
   statusCode : 201,
   sucess : true,
   message : "Issue created successfully",
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

  const sortValue = req.query.sort as string;
  const typeValue = req.query.type as string;
  const statusValue = req.query.status as string;

  const result = await issuesService.getAllIssuesFromDB(
    sortValue,
    typeValue,
    statusValue)

    sendResponse(res, {
     statusCode : 200,
     sucess : true,
     message : "Issues retrived sucessfully",
     data : result,
     })

     
   }catch(error : any){

    sendResponse(res, {
     statusCode : 500,
     sucess : false,
     message : error.message,
     data : error,
     })
         
   }
}


const getSingleIssue = async(req : Request , res : Response) => {

  const {id} = req.params

  try {

    const result = await issuesService.getSingelIssueFromDB(id as string)
    /// as ts can't recoginze the type we used as keyword

    sendResponse(res, {
      statusCode : 200,
      sucess : true,
      message : "Issue retrived successfully",
      data : result,
     })
      

  }catch(error : any ){

     sendResponse(res, {
       statusCode : 500,
       sucess : false,
       message : error.message,
       data : error,
     })
  }

}


const updateIssue = async(req : Request , res : Response) => {

  const {id} = req.params

  try {
    
    const result = await issuesService.updateIssueFromDB(req.body, id as string)

    if(result.rows.length === 0){

        return sendResponse(res, {
             statusCode : 404,
             sucess : false,
             message : "issue not found on the database",
            })
      }

      sendResponse(res, {
             statusCode : 200,
             sucess : true,
             message : "Issue updated sucessfully",
             data : result.rows[0]
            })
    
  } catch(error : any ){
     sendResponse(res, {
      statusCode : 500,
      sucess : false,
      message : error.message,
      data : error,
     })
  }

}

const deleteIssue = async(req : Request , res : Response) => {

   const {id} = req.params
   
   try {
       const result = await issuesService.deleteIssueFromDB(id as string)

       if(result.rows.length === 0){
        return sendResponse(res, {
             statusCode : 404,
             sucess : false,
             message : "issue not found on the database",
            })
        }

     return res.status(200).json({ 
        sucess : true,
        message : "Issue deleted sucessfully"
      })


   } catch (error : any) {
    sendResponse(res, {
      statusCode : 500,
      sucess : false,
      message : error.message,
      data : error,
     })
   }
}

export const issuesControler = {
    createIssues,
    getAllIssuesBySort,
    getSingleIssue,
    updateIssue,
    deleteIssue
}