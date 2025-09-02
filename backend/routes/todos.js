app.get("/", function(req, res) {
  res.json({message: "Backend is working now"})
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
 