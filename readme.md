# Issue & Feature Tracker

A collaborative platform for software teams to report bugs, suggest features, and coordinate resolutions.

----

# Live link 

---

# File structure

```bash

├── node_modules/
├── src/
│   ├── auth/
│   ├── config/
│   ├── db/
│   ├── middleware/
│   ├── modules/
│   │   ├── issues/
│   │   └── usersProfile/
│   ├── types/
│   └── utility/
├── app.ts
├── server.ts
├── package.json
├── tsconfig.json
└── .env
```

---
# Database Table 

### usersProfile
- id ----------> SERIAL PRIMARY KEY
- name --------> VARCHAR(30)
- email -------> VARCHAR(30) UNIQUE
- password ----> TEXT
- role --------> VARCHAR(20)
- created_at --> TIMESTAMP
- updated_at --> TIMESTAMP


### issues
- id ------------> SERIAL PRIMARY KEY
- title ---------> TEXT
- description ---> TEXT
- type ----------> TEXT
- status --------> VARCHAR(20)
- reporter_id ---> INT
- created_at ----> TIMESTAMP
- updated_at ----> TIMESTAMP

- reporter_id references the user who created the issue.


---

## API Endpoints

- POST --> `/api/auth/signup` --> Register User
- POST --> `/api/auth/login` --> User Login

- POST --> `/api/issues` --> Create Issue
- GET --> `/api/issues` --> Get All Issues
- GET --> `/api/issues/:id` --> Get Single Issue
- PATCH --> `/api/issues/:id` --> Update Issue
- DELETE --> `/api/issues/:id` --> Delete Issue


---

```

```
---
