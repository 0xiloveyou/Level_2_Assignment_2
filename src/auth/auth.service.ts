import bcrypt from "bcryptjs"
import { pool } from "../db"
import jwt, { type JwtPayload } from "jsonwebtoken"
import config from "../config"

const loginUserIntoDB = async (payload : {email : string, password : string}) => {
  const {email, password} = payload

  /// check if the user exist
  /// compare the password
  /// generate token 

  const userData = await pool.query(`
    SELECT * FROM usersProfile WHERE email = $1
    `, [email])

    if(userData.rows.length === 0){
        throw new Error("invalid credentials")
    }

    const userProfile = userData.rows[0]

    const matchPassword = await bcrypt.compare(password, userProfile.password)

    if(!matchPassword){
       throw new Error("invalid credentials")
    }

    /// gemerate token 
    const jwtPayload = {
        id : userProfile.id,
        name : userProfile.name,
        email : userProfile.email,
        role : userProfile.role, 
    }

    const acessToken = jwt.sign(jwtPayload, config.secret as string ,
         {expiresIn : "1d"}) 
    
    const result = {
        "token": acessToken,
        "user": {
            "id": userProfile.id,
            "name": userProfile.name,
            "email": userProfile.email,
            "role": userProfile.role,
            "created_at": userProfile.created_at,
            "updated_at": userProfile.updated_at
        }
    }

    return result
}


export const authService = {
    loginUserIntoDB,
}