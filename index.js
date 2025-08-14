const express = require("express");
const app = express();
const { v4: uuid4 } = require('uuid');

app.use(express.json()) 

let todos = [];
let requestCount = 0;

function todosAuthMiddleware(req, res, next) {
  console.log("Auth middleware triggered", req.method, req.url)
  if (req.query.auth !== "true") {
    return res.status(403).json({error: "not authorized"})
  }
  next();
}

function contentValidation(req, res, next) {
  let missingfields = [];

  if(!req.body.title || req.body.title.trim() === " "){
    missingfields.push("title");
  }

  if(!req.body.description || req.body.description.trim() === " "){
    missingfields.push("description");
  }

  if(missingfields.length > 0 ) {
    return res.status(400).json({
      error: `Missing field${missingfields.length > 1 ? "s" : ""}`
    })
  }

  next()

}

app.use(function (req, res, next) {
  requestCount += 1;
  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} ${req.url} Request count is ${requestCount}`)
  next();
})

app.get('/', (req, res) => {
  res.send("Welcome to the To-Do API")
})

app.get('/todos', todosAuthMiddleware, (req, res) => {
  res.status(200).json({todos})
})

app.get('/todos/:id', (req, res) => {
  const todoId = req.params.id;
  const todo = todos.find((t) => t.id === todoId);

  if(!todo) {
    return res.status(400).json({error : "Todo doest not exists"})
  }

  res.status(200).json(todo);
})

app.post('/todos', todosAuthMiddleware, contentValidation, (req, res) => {
  
    const newTodo = {
      id: uuid4(),
      title: req.body.title,
      description: req.body.description
    }

    todos.push(newTodo);
    res.status(201).json({message:"Todo added successfully!"});
  
})

app.put('/todos/:id', (req, res) => {
  const todoIndex = todos.findIndex((t) => t.id === req.params.id);
  if (todoIndex === -1) {
    return res.status(404).json({error : "todo does not exists"})
  } else {
    todos[todoIndex].title = req.body.title;
    todos[todoIndex].description = req.body.description;
    res.json(todos[todoIndex]);
  }
});

app.delete('/todos/:id', (req, res) => {
  const todoIndex = todos.findIndex((t) => t.id === req.params.id);
  if (todoIndex === -1) {
    res.status(404).send();
  } else {
    todos.splice(todoIndex, 1);
    res.status(200).send();
  }
})

app.listen(3000)