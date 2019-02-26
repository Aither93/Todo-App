const User = require("./models/users");
const Todo = require("./models/todolist");

const data = [
    {
        name: "user1",
        password:"1234",
        
    },
    {
        name:"user2",
        password:"5678",
        
    }
];

function seed (){
    Todo.remove({}).then(() => console.log("todos deleted"));
    User.remove({}, (err) => {
        if (err){
            console.log(err);
        } else {
            console.log("All data deleted...")
            data.forEach(function(user){
                User.create(user)
                .then(user => {
                    Todo.create({text: "first to do"})
                    .then(todo => {
                        user.todolist.push(todo);
                        user.save();
                        console.log("user created" |+ user);
                    })
                    .catch(err => console.log(err));
                })
                .catch(err => console.log(err.message));
            })
        }
    }

    )
}
module.exports = seed;