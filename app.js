var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose = require("mongoose"),
    Blog = require("./models/blog"),
    User = require("./models/user"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passport_local_mongoose = require("passport-local-mongoose");

var blog_routes = require('./routes/blog'),
    index_routes = require('./routes/index');

//APP Config
mongoose.connect("mongodb://localhost:27017/blog_app", {useNewUrlParser : true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(expressSanitizer());

//Passport Config
app.use(require("express-session")({
  secret: "Rusty is a bad dog",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currUser = req.user;
  next(); 
})

app.use('/blogs', blog_routes);
app.use(index_routes);

app.listen(process.env.PORT, process.env.IP, function(){
  console.log("Server is running");
});

module.exports = app;