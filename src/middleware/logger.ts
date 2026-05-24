import type { NextFunction, Request, Response } from "express"
import fs from "fs"


const logger = (req : Request, res : Response, next : NextFunction) => {
  console.log('\nMethod - URL - Time:',req.method, req.url, Date.now())
  const log = `Method -> ${req.method} - time -> ${Date.now()} URL -> ${req.url}\n`
 

  /// on which file it gonna write
  /// file name logger.txt
  /// if error --> 
  fs.appendFile('logger.txt', log, (err) => {
    console.log(err)
  })

  next()
}

export default logger
