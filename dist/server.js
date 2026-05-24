

   import { createRequire } from 'module';

   const require = createRequire(import.meta.url);

  

// src/app.ts
import express from "express";
import cors from "cors";

// src/middleware/globalErrorHandler.ts
var globalErrorHandler = (err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
};

// src/modules/usersProfile/usersProfile.route.ts
import { Router } from "express";

// src/types/index.ts
var UserProfile_Role = {
  contributor: "contributor",
  maintainer: "maintainer"
};

// src/utility/sendResponse.ts
var sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    sucess: data.sucess,
    message: data.message,
    data: data.data,
    error: data.error
  });
};
var sendResponse_default = sendResponse;

// src/modules/usersProfile/usersProfile.service.ts
import bcrypt from "bcryptjs";

// src/db/index.ts
import { Pool } from "pg";

// src/config/index.ts
import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.join(process.cwd(), ".env")
});
var config = {
  connection_string: process.env.CONNECTIONSTRING,
  port: process.env.PORT,
  secret: process.env.JWT_SECRET
};
var config_default = config;

// src/db/index.ts
var pool = new Pool({
  connectionString: config_default.connection_string
});
var initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usersProfile (
        id SERIAL PRIMARY KEY,
        name VARCHAR(30) NOT NULL,
        email VARCHAR(30) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'contributor',

        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS issues(

      id SERIAL PRIMARY KEY,
   
      title TEXT,
      description TEXT,
      type TEXT,
      status VARCHAR(20),
      reporter_id INT,

      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      )
      `);
    console.log("Database connected successfully");
  } catch (error) {
    console.log(error);
  }
};

// src/modules/usersProfile/usersProfile.service.ts
var createUserIntoDB = async (payload) => {
  const { name, email, password, role } = payload;
  const hashPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(`
     INSERT INTO usersProfile (name, email, password, role) VALUES($1,$2,$3,$4)
     RETURNING *
     `, [name, email, hashPassword, role]);
  delete result.rows[0].password;
  return result;
};
var userService = {
  createUserIntoDB
};

// src/modules/usersProfile/usersProfile.controller.ts
var createUser = async (req, res) => {
  try {
    const result = await userService.createUserIntoDB(req.body);
    sendResponse_default(res, {
      statusCode: 201,
      sucess: true,
      message: "User registered successfully",
      data: result.rows[0]
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 500,
      sucess: false,
      message: error.message,
      data: error
    });
  }
};
var userControler = {
  createUser
};

// src/modules/usersProfile/usersProfile.route.ts
var router = Router();
router.post("/", userControler.createUser);
var userRoute = router;

// src/auth/auth.route.ts
import { Router as Router2 } from "express";

// src/auth/auth.service.ts
import bcrypt2 from "bcryptjs";
import jwt from "jsonwebtoken";
var loginUserIntoDB = async (payload) => {
  const { email, password } = payload;
  const userData = await pool.query(`
    SELECT * FROM usersProfile WHERE email = $1
    `, [email]);
  if (userData.rows.length === 0) {
    throw new Error("invalid credentials");
  }
  const userProfile = userData.rows[0];
  const matchPassword = await bcrypt2.compare(password, userProfile.password);
  if (!matchPassword) {
    throw new Error("invalid credentials");
  }
  const jwtPayload = {
    id: userProfile.id,
    name: userProfile.name,
    email: userProfile.email,
    role: userProfile.role
  };
  const acessToken = jwt.sign(
    jwtPayload,
    config_default.secret,
    { expiresIn: "1d" }
  );
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
  };
  return result;
};
var authService = {
  loginUserIntoDB
};

// src/auth/auth.controller.ts
var loginUser = async (req, res) => {
  try {
    const result = await authService.loginUserIntoDB(req.body);
    res.status(200).json({
      sucess: true,
      message: "Login successful",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error
    });
  }
};
var authController = {
  loginUser
};

// src/auth/auth.route.ts
var router2 = Router2();
router2.post("/", authController.loginUser);
var authRoute = router2;

// src/modules/issues/issues.route.ts
import { Router as Router3 } from "express";

// src/modules/issues/issues.service.ts
import "bcryptjs";
var createIssuesIntoDB = async (payload) => {
  const {
    title,
    description,
    type,
    reporter_id
  } = payload;
  const status = "open";
  const result = await pool.query(`
      INSERT INTO issues (title,
      description,
      type,
      status,
      reporter_id) VALUES($1,$2,$3,$4,$5)
      RETURNING *
     `, [title, description, type, status, reporter_id]);
  return result;
};
var getAllIssuesFromDB = async (sortValue = "newest", typeValue, statusValue) => {
  let initialData = `SELECT * FROM issues`;
  const conditions = [];
  if (typeValue) {
    conditions.push(`type = '${typeValue}'`);
  }
  if (statusValue) {
    conditions.push(`status = '${statusValue}'`);
  }
  if (conditions.length) {
    initialData += ` WHERE ` + conditions.join(" AND ");
  }
  if (sortValue === "newest") {
    initialData += ` ORDER BY created_at DESC`;
  }
  if (sortValue === "oldest") {
    initialData += ` ORDER BY created_at ASC`;
  }
  const result = await pool.query(initialData);
  const optimizeResult = await Promise.all(
    result.rows.map(async (issue) => {
      const reporterId = issue.reporter_id;
      const reporterData = await pool.query(
        `SELECT id, name, role FROM usersProfile WHERE id = $1`,
        [reporterId]
      );
      const reporter = reporterData.rows[0];
      return { ...issue, reporter };
    })
  );
  return optimizeResult;
};
var getSingelIssueFromDB = async (id) => {
  const result = await pool.query(`
      SELECT * FROM issues  WHERE id = $1
      `, [id]);
  if (result.rows.length === 0) {
    throw new Error("issue not exist");
  }
  const reporterId = result.rows[0].reporter_id;
  const reporterData = await pool.query(
    `SELECT id, name, role FROM usersProfile WHERE id = $1`,
    [reporterId]
  );
  const reporter = { ...reporterData.rows[0] };
  const newResult = { ...result.rows[0], reporter };
  return newResult;
};
var updateIssueFromDB = async (payload, id) => {
  const { title, description, type, status } = payload;
  const result = await pool.query(`
    UPDATE issues  SET   
    title = COALESCE($1, title),
    description = COALESCE($2,description), 
    type = COALESCE($3, type), 
    status = COALESCE($4, status)
    WHERE id = $5
    RETURNING *
    `, [title, description, type, status, id]);
  return result;
};
var deleteIssueFromDB = async (id) => {
  const result = await pool.query(`
      DELETE FROM issues WHERE id = $1
      RETURNING *
      `, [id]);
  return result;
};
var issuesService = {
  createIssuesIntoDB,
  getAllIssuesFromDB,
  getSingelIssueFromDB,
  updateIssueFromDB,
  deleteIssueFromDB
};

// src/modules/issues/issues.controller.ts
import "jsonwebtoken";
var createIssues = async (req, res) => {
  try {
    const inputData = {
      "reporter_id": req.userData?.id,
      ...req.body
    };
    const result = await issuesService.createIssuesIntoDB(inputData);
    sendResponse_default(res, {
      statusCode: 201,
      sucess: true,
      message: "Issue created successfully",
      data: result.rows[0]
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 500,
      sucess: false,
      message: error.message,
      data: error
    });
  }
};
var getAllIssuesBySort = async (req, res) => {
  try {
    const sortValue = req.query.sort;
    const typeValue = req.query.type;
    const statusValue = req.query.status;
    const result = await issuesService.getAllIssuesFromDB(
      sortValue,
      typeValue,
      statusValue
    );
    sendResponse_default(res, {
      statusCode: 200,
      sucess: true,
      message: "Issues retrived sucessfully",
      data: result
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 500,
      sucess: false,
      message: error.message,
      data: error
    });
  }
};
var getSingleIssue = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await issuesService.getSingelIssueFromDB(id);
    sendResponse_default(res, {
      statusCode: 200,
      sucess: true,
      message: "Issue retrived successfully",
      data: result
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 500,
      sucess: false,
      message: error.message,
      data: error
    });
  }
};
var updateIssue = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await issuesService.updateIssueFromDB(req.body, id);
    if (result.rows.length === 0) {
      return sendResponse_default(res, {
        statusCode: 404,
        sucess: false,
        message: "issue not found on the database"
      });
    }
    sendResponse_default(res, {
      statusCode: 200,
      sucess: true,
      message: "Issue updated sucessfully",
      data: result.rows[0]
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 500,
      sucess: false,
      message: error.message,
      data: error
    });
  }
};
var deleteIssue = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await issuesService.deleteIssueFromDB(id);
    if (result.rows.length === 0) {
      return sendResponse_default(res, {
        statusCode: 404,
        sucess: false,
        message: "issue not found on the database"
      });
    }
    return res.status(200).json({
      sucess: true,
      message: "Issue deleted sucessfully"
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 500,
      sucess: false,
      message: error.message,
      data: error
    });
  }
};
var issuesControler = {
  createIssues,
  getAllIssuesBySort,
  getSingleIssue,
  updateIssue,
  deleteIssue
};

// src/middleware/auth.ts
import jwt3 from "jsonwebtoken";
var auth = (...roles) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return sendResponse_default(res, {
          statusCode: 401,
          sucess: false,
          message: "unauthorized access"
        });
      }
      const decoded = jwt3.verify(token, config_default.secret);
      const userData = await pool.query(`
      SELECT *  FROM usersProfile WHERE email = $1
      `, [decoded.email]);
      const user = userData.rows[0];
      if (userData.rows.length === 0) {
        return sendResponse_default(res, {
          statusCode: 404,
          sucess: false,
          message: "User not found on the database"
        });
      }
      if (roles.length && !roles.includes(user.role)) {
        return sendResponse_default(res, {
          statusCode: 403,
          sucess: false,
          message: "Forbidden. User role has no acess"
        });
      }
      req.userData = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
};
var auth_default = auth;

// src/middleware/auth.Issues.ts
import jwt4 from "jsonwebtoken";
var authIssue = (...roles) => {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return sendResponse_default(res, {
          statusCode: 401,
          sucess: false,
          message: "unauthorized access"
        });
      }
      const decoded = jwt4.verify(token, config_default.secret);
      const userData = await pool.query(`
      SELECT *  FROM usersProfile WHERE email = $1
      `, [decoded.email]);
      const user = userData.rows[0];
      if (userData.rows.length === 0) {
        return sendResponse_default(res, {
          statusCode: 404,
          sucess: false,
          message: "user not found on the database"
        });
      }
      if (roles.includes(user.role)) {
        req.userData = decoded;
        return next();
      } else {
        const contributorId = user.id;
        const { id } = req.params;
        if ("status" in req.body) {
          return sendResponse_default(res, {
            statusCode: 403,
            sucess: false,
            message: "Contributor has no permission to change status"
          });
        }
        const preResult = await pool.query(`
       SELECT * FROM issues  WHERE id = $1
       `, [id]);
        const issueInfo = preResult.rows[0];
        const { reporter_id, status } = issueInfo;
        if (reporter_id === contributorId) {
          if (status === "open") {
            req.userData = decoded;
            return next();
          } else {
            return sendResponse_default(res, {
              statusCode: 403,
              sucess: false,
              message: "Status is not open. So not allowed to update it."
            });
          }
        } else {
          return sendResponse_default(res, {
            statusCode: 403,
            sucess: false,
            message: "Can't update others issue"
          });
        }
      }
    } catch (error) {
      next(error);
    }
  };
};

// src/modules/issues/issues.route.ts
var router3 = Router3();
router3.post("/", auth_default(UserProfile_Role.maintainer, UserProfile_Role.contributor), issuesControler.createIssues);
router3.get("/", issuesControler.getAllIssuesBySort);
router3.get("/:id", issuesControler.getSingleIssue);
router3.patch(
  "/:id",
  authIssue(UserProfile_Role.maintainer),
  issuesControler.updateIssue
);
router3.delete("/:id", auth_default(UserProfile_Role.maintainer), issuesControler.deleteIssue);
var issuesRoute = router3;

// src/middleware/logger.ts
import fs from "fs";
var logger = (req, res, next) => {
  console.log("\nMethod - URL - Time:", req.method, req.url, Date.now());
  const log = `Method -> ${req.method} - time -> ${Date.now()} URL -> ${req.url}
`;
  fs.appendFile("logger.txt", log, (err) => {
  });
  next();
};
var logger_default = logger;

// src/app.ts
var app = express();
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(logger_default);
app.use(cors({ origin: "http://localhost:5000" }));
app.get("/", (req, res) => {
  sendResponse_default(res, {
    statusCode: 200,
    message: "Express",
    data: { "author": "Assignment 2 Level 7" }
  });
});
app.use("/api/auth/signup", userRoute);
app.use("/api/auth/login", authRoute);
app.use("/api/issues", issuesRoute);
app.use(globalErrorHandler);
var app_default = app;

// src/server.ts
var main = () => {
  initDB();
  app_default.listen(config_default.port, () => {
    console.log(`App listening on port ${config_default.port}`);
  });
};
main();
//# sourceMappingURL=server.js.map