# Noed SQL Project
---
#### Requirements
- mongodb
- node and npm

#### Configuration
The project can be configured via the **setting.js** in project root.
```
{
    "http": {
        "port": "3000"
    },
    "mongodb": {
        "host": "localhost",
        "port": "27017",
        "database": "noedSQL",

        "collections": {
            "tasks": "tasks",
            "users": "users"
        }
    },
    "security": {
        "tokenKey": "secretKey"
    }
};
```
#### Installation

Install all required packages via npm.
```
$ npm install
```

Make sure an instance of **mongodb** is running.
Then run the project with:
```
$ node bin/www
```

#### API Documentation

When the project is running the api documentation can be accessed via /apidoc.

Example: http://localhost:3000/apidoc

---
##### NoSQL Project Repository of Team "NÖD"
- Nicolas Weiß
- Julian Wendel
- Jianhua Zhu


