const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const list = require("./todolist");
const todoSchema = list.todoSchema;

const userSchema = new mongoose.Schema ({
    username: {type: String, required:true},
    password: String,
    todolist: [todoSchema]
});
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);
module.exports = User;

