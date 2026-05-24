import bcrypt from "bcryptjs"
import { pool } from "../../db"
import type { UserProfileInterface } from "./usersProfile.interface"

const createUserIntoDB = async(payload : UserProfileInterface) => {
 
    const {name, email, password, role} = payload
    const hashPassword = await bcrypt.hash(password, 10)
 
    // to get rid of null role -> coalesce
    const result = await pool.query(`
     INSERT INTO usersProfile (name, email, password, role) VALUES($1,$2,$3,$4)
     RETURNING *
     `, [name, email, hashPassword, role])

     delete result.rows[0].password

     return result
}
 

export const userService = {
    createUserIntoDB
}