import { Router } from "express";
import { Tasks } from "../data/store.js";
import auth from "../middleware/auth.js"
import mongoose from 'mongoose';
const ObjectId = mongoose.ObjectId;

const taskRoutes =  Router();

taskRoutes.post("/todos", auth, async (req, res) => {
  const { title, description } = req.body;

  try{
    const newTask = await Tasks.create({
      title: title,
      description: description,
      userId: req.userId
    }) 
    res.status(201).json({
      message: "Task created successfully!",
      task: newTask
    })
  } catch(e) {
    res.status(400).json({
      message: "Task cannot be created",
      error: e.message
    })
  }
  
})

taskRoutes.get("/todos", auth, async (req, res) => {
   
  try {
    const tasks = await Tasks.find({ userId: req.userId });
    if(tasks) {
      return res.status(200).json({
        tasks
      })
    } else {
      console.log("No tasks ")
      return null;
    
    }
  }catch(e){
    return res.status(400).json({
      message: "error while finding tasks",
      error: e.message
    })

  }

})

taskRoutes.get("/todos/:id", auth, async (req, res) => {
  try{
    const todoId = req.params.id;
    const todo = await Tasks.findById(todoId);

    if(!todo){
      return res.status(401).json({
        message: "Todo does not exists"
      })
    } else {
      return res.status(200).json(todo);
    }
  } catch(e) {
    return res.status(400).json({
      message: "Error while fetching todo",
      error: e.message
    })
  }
})

taskRoutes.put("/todos/:id", auth, async (req, res) => {
  try{
    const taskId = req.params.id;
    const task = await Tasks.findById(taskId);

    if(!task){
      return res.status(400).json({
        message: "Todo does not exists"
      })
    }

    const newTask = await Tasks.findByIdAndUpdate(req.params.id, req.body,{
      new: true,
    })

    return res.status(200).json(newTask)
  } catch(e) {
    return res.status(400).json({
      message: "Eroor while updating task",
      error: e.message
    })
  }
  
})

taskRoutes.delete("/todos/:id", async (req, res) => {
  try{
    const taskId =  req.params.id;
    const task = await Tasks.findById(taskId);

    if(!task){
      return res.status(400).json({
        message: "Todo doesnt exists"
      })
    }

    const deletedTodo = await Tasks.findByIdAndDelete(taskId, req.body);

    return res.status(200).json({
      message: "Task deleted successfully",
      deletedTodo
    });
  } catch(e) {
    return res.status(400).json({
      message:"Error while deleting task",
      error: e.message
    })
  }
})


export default taskRoutes;

