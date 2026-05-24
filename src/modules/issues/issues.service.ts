import bcrypt from "bcryptjs"
import { pool } from "../../db"
import type { IssueTable } from "./issue.interface"
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

  if (typeValue) {
    conditions.push(`type = '${typeValue}'`);
  }

  if (statusValue) {
    conditions.push(`status = '${statusValue}'`);
  }

  if (conditions.length) {
    initialData += ` WHERE ` + conditions.join(' AND ');
  }

  if (sortValue === 'newest') {
    initialData += ` ORDER BY created_at DESC`;
  }

  if (sortValue === 'oldest') {
    initialData += ` ORDER BY created_at ASC`;
  }

  const result = await pool.query(initialData);

  const optimizeResult = await Promise.all(
    result.rows.map(async (issue) => {

      const reporterId = issue.reporter_id;
      // console.log(reporterId)

      const reporterData = await pool.query(
        `SELECT id, name, role FROM usersProfile WHERE id = $1`,
        [reporterId]
      )
      

      const reporter =  reporterData.rows[0]
      // console.log(reporter)

      return { ...issue, reporter}
    })
  )

  return optimizeResult
}



const getSingelIssueFromDB = async(id : string) => {
   
  const result = await pool.query(`
      SELECT * FROM issues  WHERE id = $1
      `, [id])
    
     if(result.rows.length === 0) {
      throw new Error("issue not exist")
     }

      const reporterId = result.rows[0].reporter_id
 
      const reporterData = await pool.query(
        `SELECT id, name, role FROM usersProfile WHERE id = $1`,
        [reporterId]
      )
      
      const reporter =  {...reporterData.rows[0]}
      const newResult = { ...result.rows[0], reporter}

      return newResult
}

const updateIssueFromDB = async(payload : IssueTable, id : string, ) => {

    const {title, description, type, status} = payload

    const result = await pool.query(`
    UPDATE issues  SET   
    title = COALESCE($1, title),
    description = COALESCE($2,description), 
    type = COALESCE($3, type), 
    status = COALESCE($4, status)
    WHERE id = $5
    RETURNING *
    `, [title, description, type , status, id])

    return result
}

// const deleteUserFromDB = async(id : string) => {
//     const result = await pool.query(`
//       DELETE FROM users WHERE id = $1
//       `, [id])
//       return result
// }

export const issuesService = {
    createIssuesIntoDB,
    getAllIssuesFromDB,
    getSingelIssueFromDB,
    updateIssueFromDB,
    // deleteUserFromDB
}