const express = require("express");
const mongoose = require("mongoose");
const app = express();
const passport = require("passport");
const bodyParser = require("body-parser");
const localStrategy = require("passport-local");
const expressSession = require("express-session");
const list = require("./models/todolist");
const Todo = list.Todo;
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("./models/users");
const port = process.env.PORT || 3000;
const uristring =
"mongodb+srv://ahmed:12345@cluster0-xvlrq.mongodb.net/todoapp?retryWrites=true";
   



mongoose.connect(uristring)
.then (() => console.log("connected to db"))
.catch(err => console.log(err.message));
app.set("view engine", "ejs");

app.use(expressSession({
    secret: "this is a secret to code and encode sessions",
    resave: false,
    saveUninitialized: false
}));
app.use(express.json());
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

app.get("/", (req, res) => {
    res.render("landing");
})
//login code
//show login form
app.get("/login", (req, res) => {
    res.render("login");
})
//login post request
app.post("/login", passport.authenticate("local",{
	successRedirect:"/list",
	failureRedirect:"/login"
}), function(req, res){});

//registration code 
//show registration form
app.get("/register", (req, res) => {
    res.render("register");
})
//registration action
app.post("/register", (req, res) => {
    User.register(new User({username: req.body.username}), req.body.password)
    .then(user => {
        passport.authenticate("local")(req, res, function(){
            res.redirect("/list");
        })
    })
    .catch(err => {
        console.log(err.message);
        res.redirect("/register")
    });

})
app.get("/logout", (req, res) => {
    req.logOut();
    res.redirect("/");
})

app.get("/list", isLoggedIn, (req, res) => {
    res.render("todolist");
});

app.post("/list", isLoggedIn, (req, res) => {
Todo.create({text:req.body.text})
.then(todo => {
    User.findOne({username: req.user.username})
    .then(user => {
        user.todolist.push(todo);
        user.save();
        res.redirect("/list");
    })
})
.catch(err => console.log(err.message));
})

app.listen(port, ()=>{
    console.log(`listening to port ${port}`)
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else{
        res.redirect("/login");
    }
}
//seeding databse
// User.remove({username:"user1"}).then(() => console.log("usrs removed"));
// Todo.remove({}).then(() => console.log("todos removed"));

// User.register(new User({username: "user1"}), "12345")
// .then(user => console.log(user))
// .catch(err => console.log(err.message));

// User.register(new User({username: "user2"}), "abcde")
// .then(user => console.log(user))
// .catch(err => console.log(err.message));

// Todo.create({text:"todo1 user1"})
// .then(todo => {
//     User.findOne({username:"user1"})
//     .then(user => {
//         user.todolist.push(todo);
//         user.save()
//         .then(() => console.log("todo added"))
//     })
// })
// .catch(err => console.log(err.message));

// Todo.create({text:"todo1 user2"})
// .then(todo => {
//     User.findOne({username:"user2"})
//     .then(user => {
//         user.todolist.push(todo);
//         user.save()
//         .then(() => console.log("todo added"))
//     })
// })
// .catch(err => console.log(err.message));

// User.find({})
// .then (user => console.log(user));
