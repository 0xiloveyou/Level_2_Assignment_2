import express, { type Application, type Request, type Response } from "express"
// import { profileRoute } from "./modules/profile/profile.route"
// import { authRoute } from "./auth/auth.route"
// import logger from "./middleware/logger"
// import CookieParser from "cookie-parser"
import cors from "cors"
import { globalErrorHandler } from "./middleware/globalErrorHandler"
import { userRoute } from "./modules/usersProfile/usersProfile.route"
import { authRoute } from "./auth/auth.route"
import { issuesRoute } from "./modules/issues/issues.route"


const app : Application = express() 

app.use(express.json()) 
app.use(express.text())
app.use(express.urlencoded({extended : true})) 
// app.use(CookieParser())
// app.use(logger)
// app.use(cors({origin : "http://localhost:5000"}))

 
app.use('/api/auth/signup', userRoute)
app.use('/api/auth/login', authRoute)
app.use('/api/issues', issuesRoute)


// app.get('/', (req : Request, res : Response) => { 
// res.status(200).json({
//     message : "Express",
//     "author" : "Next Level",
// }) 
// })

/// use global error handler middlewear at last
app.use(globalErrorHandler)

export default app
