var config =

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

module.exports = config;