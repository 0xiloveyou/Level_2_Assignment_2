import express, { type Application, type Request, type Response } from "express"
import cors from "cors"
import { globalErrorHandler } from "./middleware/globalErrorHandler"
import { userRoute } from "./modules/usersProfile/usersProfile.route"
import { authRoute } from "./auth/auth.route"
import { issuesRoute } from "./modules/issues/issues.route"
import logger from "./middleware/logger"
import sendResponse from "./utility/sendResponse"


const app : Application = express() 

app.use(express.json()) 
app.use(express.text())
app.use(express.urlencoded({extended : true})) 
app.use(logger)
app.use(cors({origin : "http://localhost:5000"}))


app.get('/', (req : Request, res : Response) => {
    
    sendResponse(res, {
    statusCode : 200,
    message : "Express",
    data : {"author" : "Assignment 2 Level 7"},
 })

})

app.use('/api/auth/signup', userRoute)
app.use('/api/auth/login', authRoute)
app.use('/api/issues', issuesRoute)

///  global error handler middlewear
app.use(globalErrorHandler)

export default app
