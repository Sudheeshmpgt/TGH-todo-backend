const route = require('express').Router()
const {createTodo, updateTodoStatus, getAllTodos, deleteTodo, todoListByStatus, countTodo} = require('../controller/todoController')
const verifyAuth = require('../middleware/authenticate')

route.post('/new', verifyAuth, createTodo);
route.put('/status', verifyAuth, updateTodoStatus);
route.get('/get-all', verifyAuth, getAllTodos);
route.delete('/delete/:id', verifyAuth, deleteTodo);
route.get('/count', verifyAuth, countTodo);
route.get('/list-by-status', verifyAuth, todoListByStatus);

module.exports = route;