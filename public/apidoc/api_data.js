define({ "api": [  {    "type": "delete",    "url": "/api/tasks?id=:id",    "title": "",    "name": "DeleteTask",    "group": "Tasks",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "id",            "description": "<p>identifier of task</p>"          }        ]      }    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "InvalidParameters",            "description": "<p>parameters are empty or nor allowed</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "Unauthorized",            "description": "<p>user not logged in or not permitted to access this api</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "routes/tasks.js",    "groupTitle": "Tasks"  },  {    "type": "get",    "url": "/api/tasks?public=:public",    "title": "",    "name": "GetAllTasks",    "group": "Tasks",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "Boolean",            "optional": true,            "field": "public",            "description": "<p>Query parameter for getting only private or public tasks</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object[]",            "optional": false,            "field": "tasks",            "description": "<p>list of all tasks belonging to the user</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "tasks._id",            "description": "<p>identifier of task list</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "tasks.name",            "description": "<p>name of task</p>"          },          {            "group": "Success 200",            "type": "Integer[]",            "optional": false,            "field": "tasks.owner",            "description": "<p>list of user ids which subscribed to this list</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "tasks.color",            "description": "<p>color of the task list chosen by user</p>"          },          {            "group": "Success 200",            "type": "Boolean",            "optional": false,            "field": "tasks.public",            "description": "<p>indicates if task is public(true) or private(false)</p>"          },          {            "group": "Success 200",            "type": "Object[]",            "optional": false,            "field": "tasks.todos",            "description": "<p>list of all todos in this list</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "tasks.todos._id",            "description": "<p>identifier of todo</p>"          },          {            "group": "Success 200",            "type": "Boolean",            "optional": false,            "field": "tasks.todos.done",            "description": "<p>indicates if todo is done or not</p>"          }        ]      }    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "Unauthorized",            "description": "<p>user not logged in or not permitted to access this api</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "routes/tasks.js",    "groupTitle": "Tasks"  },  {    "type": "post",    "url": "/api/tasks?id=:id&name=:name&public=:public",    "title": "",    "name": "InsertTask",    "group": "Tasks",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "id",            "description": "<p>identifier of task</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>name of task list</p>"          },          {            "group": "Parameter",            "type": "Boolean",            "optional": false,            "field": "public",            "description": "<p>indicates if task is public(true) or private(false)</p>"          }        ]      }    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "InvalidParameters",            "description": "<p>parameters are empty or nor allowed</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "Unauthorized",            "description": "<p>user not logged in or not permitted to access this api</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "routes/tasks.js",    "groupTitle": "Tasks"  },  {    "type": "post",    "url": "/api/tasks?name=:name&color=:color&public=:public",    "title": "",    "name": "InsertTask",    "group": "Tasks",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>name of task</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "color",            "description": "<p>color of the task list chosen by user</p>"          },          {            "group": "Parameter",            "type": "Boolean",            "optional": false,            "field": "public",            "description": "<p>indicates if task is public(true) or private(false)</p>"          }        ]      }    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "InvalidParameters",            "description": "<p>parameters are empty or nor allowed</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "Unauthorized",            "description": "<p>user not logged in or not permitted to access this api</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "routes/tasks.js",    "groupTitle": "Tasks"  },  {    "type": "get",    "url": "/api/todos?id=:id",    "title": "",    "name": "GetOneTodo",    "group": "Todos",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "id",            "description": "<p>identifier of todo</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object",            "optional": false,            "field": "todo",            "description": "<p>todo with specified identifier</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "todo._id",            "description": "<p>identifier of todo</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "todo.name",            "description": "<p>name of todo</p>"          },          {            "group": "Success 200",            "type": "Boolean",            "optional": false,            "field": "todo.done",            "description": "<p>indicates if todo is done or not</p>"          }        ]      }    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "Unauthorized",            "description": "<p>user not logged in or not permitted to access this api</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "routes/todo.js",    "groupTitle": "Todos"  },  {    "type": "post",    "url": "/api/todos?id=:id&name=:name",    "title": "",    "name": "InsertTodo",    "group": "Todos",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "id",            "description": "<p>identifier of task list to which todo shall be added</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>name of todo</p>"          }        ]      }    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "InvalidParameters",            "description": "<p>parameter missing or invalid</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "Unauthorized",            "description": "<p>user not logged in or not permitted to access this api</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "routes/todo.js",    "groupTitle": "Todos"  },  {    "type": "put",    "url": "/api/todos?_id=:id&_todoId=:todoId&name=:name&done=:done",    "title": "",    "name": "UpdateTodo",    "group": "Todos",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "id",            "description": "<p>identifier of task list which shall be updated</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "todoId",            "description": "<p>identifier of todo which shall be updated</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>(new) name of todo</p>"          },          {            "group": "Parameter",            "type": "Boolean",            "optional": false,            "field": "done",            "description": "<p>(new) value of done</p>"          }        ]      }    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "InvalidParameters",            "description": "<p>parameter missing or invalid</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "Unauthorized",            "description": "<p>user not logged in or not permitted to access this api</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "routes/todo.js",    "groupTitle": "Todos"  },  {    "type": "delete",    "url": "/api/todos?_id=:id&_todoId=:todoId",    "title": "",    "name": "UpdateTodo",    "group": "Todos",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "id",            "description": "<p>identifier of task list which shall be deleted</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "todoId",            "description": "<p>identifier of todo which shall be deleted</p>"          }        ]      }    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "InvalidParameters",            "description": "<p>parameter missing or invalid</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "Unauthorized",            "description": "<p>user not logged in or not permitted to access this api</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "routes/todo.js",    "groupTitle": "Todos"  },  {    "type": "post",    "url": "/api/token",    "title": "",    "name": "GetToken",    "group": "Token",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "username",            "description": "<p>username of user</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "password",            "description": "<p>(new) password password of user</p>"          }        ]      },      "examples": [        {          "title": "Request-Example:",          "content": "{\n  \"username\": \"max\",\n  \"password\": \"mustermann\"\n}",          "type": "json"        }      ]    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "token",            "description": "<p>token of user</p>"          }        ]      },      "examples": [        {          "title": "Response-Example:",          "content": "{\n    \"token\": \"xyzszzdausdaksd.dsdsd.....\"\n}",          "type": "json"        }      ]    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "BadRequest",            "description": "<p>username or password missing or invalid</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "Unauthorized",            "description": "<p>user not logged in or not permitted to access this api</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "routes/token.js",    "groupTitle": "Token"  },  {    "type": "post",    "url": "/api/users",    "title": "",    "name": "Add_User",    "group": "Users",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "username",            "description": "<p>username of user</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "role",            "description": "<p>role of use</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "firstName",            "description": "<p>given name of the user</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>name of user</p>"          }        ]      },      "examples": [        {          "title": "Request-Example:",          "content": "{\n    \"username\" : \"maxmustermann\",\n    \"name\" : \"Musterfrau\",\n    \"firstName\" : \"Max\",\n    \"role\" : \"USER\"\n}",          "type": "json"        }      ]    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "_id",            "description": "<p>identifier of user object</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "username",            "description": "<p>username of user</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "role",            "description": "<p>role of use</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "firstName",            "description": "<p>given name of the user</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>name of user</p>"          }        ]      },      "examples": [        {          "title": "Response-Example:",          "content": "{\n    \"_id\" : \"7729ab60-a5a3-11e5-a9ce-5b4aa543157d\",\n    \"username\" : \"maxmusterfrau\",\n    \"name\" : \"Musterfrau\",\n    \"firstName\" : \"Max\",\n    \"role\" : \"USER\"\n}",          "type": "json"        }      ]    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "BadRequest",            "description": "<p>user with given identifier not found or invalid arguments</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "Unauthorized",            "description": "<p>user not logged in or not permitted to access this api</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "routes/users.js",    "groupTitle": "Users"  },  {    "type": "delete",    "url": "/api/users/:id",    "title": "",    "name": "DeleteUser",    "group": "Users",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "id",            "description": "<p>identifier of user object which shall be deleted</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "_id",            "description": "<p>identifier of user object</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "username",            "description": "<p>username of user</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "role",            "description": "<p>role of use</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "firstName",            "description": "<p>given name of the user</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>name of user</p>"          }        ]      },      "examples": [        {          "title": "Response-Example:",          "content": "{\n    \"_id\" : \"7729ab60-a5a3-11e5-a9ce-5b4aa543157d\",\n    \"username\" : \"maxmusterfrau\",\n    \"name\" : \"Musterfrau\",\n    \"firstName\" : \"Max\",\n    \"role\" : \"USER\"\n}",          "type": "json"        }      ]    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "BadRequest",            "description": "<p>user with given identifier not found or invalid arguments</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "Unauthorized",            "description": "<p>user not logged in or not permitted to access this api</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "routes/users.js",    "groupTitle": "Users"  },  {    "type": "get",    "url": "/api/users",    "title": "",    "name": "GetAllUsers",    "group": "Users",    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "Object[]",            "optional": false,            "field": "users",            "description": "<p>list of all users</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "users._id",            "description": "<p>identifier of user object</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "users.username",            "description": "<p>username of user</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "users.role",            "description": "<p>role of use</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "users.firstName",            "description": "<p>given name of the user</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "users.name",            "description": "<p>name of user</p>"          }        ]      }    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "Unauthorized",            "description": "<p>user not logged in or not permitted to access this api</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "routes/users.js",    "groupTitle": "Users"  },  {    "type": "get",    "url": "/api/users/:id",    "title": "",    "name": "GetAllUsers",    "group": "Users",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "id",            "description": "<p>identifier of user</p>"          }        ]      }    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "_id",            "description": "<p>identifier of user object</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "username",            "description": "<p>username of user</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "role",            "description": "<p>role of use</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "firstName",            "description": "<p>given name of the user</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>name of user</p>"          }        ]      },      "examples": [        {          "title": "Response-Example:",          "content": "{\n    \"_id\" : \"7729ab60-a5a3-11e5-a9ce-5b4aa543157d\",\n    \"username\" : \"maxmustermann\",\n    \"name\" : \"Mustermann\",\n    \"firstName\" : \"Max\",\n    \"role\" : \"USER\"\n}",          "type": "json"        }      ]    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "BadRequest",            "description": "<p>user with given identifier not found</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "Unauthorized",            "description": "<p>user not logged in or not permitted to access this api</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "routes/users.js",    "groupTitle": "Users"  },  {    "type": "put",    "url": "/api/users/:id",    "title": "",    "name": "UpdateUser",    "group": "Users",    "parameter": {      "fields": {        "Parameter": [          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "id",            "description": "<p>identifier of user object</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "username",            "description": "<p>username of user</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "role",            "description": "<p>role of use</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "firstName",            "description": "<p>given name of the user</p>"          },          {            "group": "Parameter",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>name of user</p>"          }        ]      },      "examples": [        {          "title": "Request-Example:",          "content": "{\n    \"username\" : \"maxmustermann\",\n    \"name\" : \"Musterfrau\",\n    \"firstName\" : \"Max\",\n    \"role\" : \"USER\"\n}",          "type": "json"        }      ]    },    "success": {      "fields": {        "Success 200": [          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "_id",            "description": "<p>identifier of user object</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "username",            "description": "<p>username of user</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "role",            "description": "<p>role of use</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "firstName",            "description": "<p>given name of the user</p>"          },          {            "group": "Success 200",            "type": "String",            "optional": false,            "field": "name",            "description": "<p>name of user</p>"          }        ]      },      "examples": [        {          "title": "Response-Example:",          "content": "{\n    \"_id\" : \"7729ab60-a5a3-11e5-a9ce-5b4aa543157d\",\n    \"username\" : \"maxmusterfrau\",\n    \"name\" : \"Musterfrau\",\n    \"firstName\" : \"Max\",\n    \"role\" : \"USER\"\n}",          "type": "json"        }      ]    },    "error": {      "fields": {        "Error 4xx": [          {            "group": "Error 4xx",            "optional": false,            "field": "BadRequest",            "description": "<p>user with given identifier not found or invalid arguments</p>"          },          {            "group": "Error 4xx",            "optional": false,            "field": "Unauthorized",            "description": "<p>user not logged in or not permitted to access this api</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "routes/users.js",    "groupTitle": "Users"  }] });
