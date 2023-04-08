const TodoModel = require("../model/todoSchema");

const createTodo = async (req, res) => {
  try {
    let task = req.body
    if(!task) throw new Error('Todo details not found');
    const newTodo = new TodoModel({
      text: task.text,
      priority: task.priority,
      status: String(task.status).toLowerCase(),
    });
    const todo = await newTodo.save();
    res.status(201).send({ message: "Todo created successfully", todo: todo });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const updateTodoStatus = async (req, res) => {
  try {
    let todoId = req.body.todoId;
    if(!todoId) throw new Error("Todo ID not found")
    let status = String(req.body.status).toLowerCase();
    if(!status) throw new Error("Todo status not found")
    const updateStatus = await TodoModel.updateOne({_id: todoId},{status: status});
    if(updateStatus.modifiedCount > 0){
        res.status(200).send({message:"Todo status updated successfully"})
    }else{
        res.status(500).send({error:"Todo status updation failed"})
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getAllTodos = async (req, res) => {
    try {
        let todos = await TodoModel.find().sort({priority:1})
        if(todos){
            res.status(200).send({todos:todos})
        }
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

const deleteTodo = async (req, res) => {
    try {
        let todo = await TodoModel.findByIdAndDelete(req.params.id)
        res.status(200).send({todo: todo, message:"Todo deleted successfully"})
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

const countTodo = async (req, res) => {
  try {
    let pending = await TodoModel.find({status:'pending'}).count();
    let completed = await TodoModel.find({status:'completed'}).count();
    let cancelled = await TodoModel.find({status:'cancelled'}).count();
    res.status(200).send({pending:pending, completed:completed, cancelled:cancelled})
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

const todoListByStatus = async (req, res) => {
  try {
    let pending = await TodoModel.find({status:'pending'}).sort({priority:1});
    let completed = await TodoModel.find({status:'completed'}).sort({priority:1});
    let cancelled = await TodoModel.find({status:'cancelled'}).sort({priority:1});
    res.status(200).send({pending:pending, completed:completed, cancelled:cancelled})
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}
module.exports = { createTodo, updateTodoStatus, getAllTodos, deleteTodo, countTodo, todoListByStatus };
