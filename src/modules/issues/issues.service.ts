import bcrypt from "bcryptjs"
import { pool } from "../../db"
// import type { UserProfileInterface } from "./usersProfile.interface"

const createIssuesIntoDB = async(payload : any) => {
 
    const { title,
      description,
      type,
      reporter_id} = payload
   
      const status = "open" // default set status to open when creating new issue

    const result = await pool.query(`
     INSERT INTO issues (title,
      description,
      type,
      status ,
      reporter_id) VALUES($1,$2,$3,$4,$5)
     RETURNING *
     `, [title,description, type,status,reporter_id])

     return result
}
 

const getAllIssuesFromDB = async (
  sortValue = 'newest',
  typeValue?: string,
  statusValue?: string
) => {

  let initialData = `SELECT * FROM issues`;
  const conditions = [];

  if(typeValue){
    conditions.push(`type = '${typeValue}'`);
  }

  if(statusValue){
    conditions.push(`status = '${statusValue}'`);
  }

  if(conditions.length){
    initialData += ` WHERE ` + conditions.join(' AND ');
  }

  if(sortValue === 'newest'){
    initialData += ` ORDER BY created_at DESC`;
  }
  if(sortValue === 'oldest'){
    initialData += ` ORDER BY created_at ASC`;
  }

  const result = await pool.query(initialData);

  return result;
}



// const getSingelUserFromDB = async(id : string) => {
//     const result = await pool.query(`
      
//       SELECT * FROM users  WHERE id = $1
//       `, [id])
//       return result

// }

// const updateUserFromDB = async(payload : IUser, id : string) => {

//     const {name, password, age, is_active} = payload

//     const result = await pool.query(`
//     UPDATE users  SET   
//     name = COALESCE($1, name),
//     password = COALESCE($2,password), 
//     age = COALESCE($3, age), 
//     is_active = COALESCE($4, is_active)
//     WHERE id = $5
//     RETURNING *
//     `, [name , password, age , is_active, id])

//     return result
// }

// const deleteUserFromDB = async(id : string) => {
//     const result = await pool.query(`
//       DELETE FROM users WHERE id = $1
//       `, [id])
//       return result
// }

export const issuesService = {
    createIssuesIntoDB,
    getAllIssuesFromDB,
    // getSingelUserFromDB,
    // updateUserFromDB,
    // deleteUserFromDB
}