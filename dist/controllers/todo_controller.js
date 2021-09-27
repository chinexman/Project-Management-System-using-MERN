"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getATodo = exports.deleteTodo = exports.getAllTodos = exports.updateTodo = exports.createTodo = void 0;
const todoModel_1 = __importDefault(require("../models/todoModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function verifyUser(request) {
    const jwtToken = request.cookies.token || request.headers.token;
    if (!jwtToken) {
        throw new Error("Unauthorized user");
    }
    try {
        const userAuthorization = jsonwebtoken_1.default.verify(jwtToken.toString(), process.env.SECRET_KEY);
        return userAuthorization.user_id;
    }
    catch (err) {
        throw new Error("Invalid token!");
    }
}
//Function to create todo 
async function createTodo(title, description, request) {
    const userId = verifyUser(request);
    const todo = await new todoModel_1.default({
        title: title,
        description: description,
        userId: userId
    });
    await todo.save();
    return todo;
}
exports.createTodo = createTodo;
//Function to get all todos
async function getAllTodos(request) {
    const userId = verifyUser(request);
    let todos = (await todoModel_1.default.find({ userId: userId }).sort({ createdAt: -1 }));
    return todos;
}
exports.getAllTodos = getAllTodos;
//Function to get todo by id
async function getATodo(id, request) {
    const userId = verifyUser(request);
    let singleTodo = await todoModel_1.default.findOne({ userId, _id: id });
    return singleTodo;
}
exports.getATodo = getATodo;
//Function to edit a todo
async function updateTodo(id, title, description, request) {
    const userId = verifyUser(request);
    const todoId = id;
    let findTodo = await todoModel_1.default.findOne({ userId, _id: id });
    if (!findTodo) {
        throw new Error("Todo does not exist");
    }
    let updatedTodo = await todoModel_1.default.findByIdAndUpdate(todoId, { title: title, description: description }, { new: true });
    return updatedTodo;
}
exports.updateTodo = updateTodo;
//Function to delete a todo
async function deleteTodo(id, request) {
    const userId = verifyUser(request);
    const todoId = id;
    let findTodo = await todoModel_1.default.findOne({ userId, _id: id });
    if (!findTodo) {
        throw new Error("Todo does not exist");
    }
    let deletedTodo = await todoModel_1.default.findByIdAndDelete(todoId);
    return `todo with ${todoId} deleted successfully`;
}
exports.deleteTodo = deleteTodo;
