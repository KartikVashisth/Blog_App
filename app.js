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
app.use(passport.authenticate());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Restfull Routes
app.get("/", function(req, res){
  res.redirect("/blogs");
});

//INDEX
app.get("/blogs", function(req, res){
  Blog.find({}, function(err, allblogs){
    if(err)
      console.log(err);
    else
      res.render("index", {blogs : allblogs});
  });
});

//CREATE
app.post("/blogs", function(req, res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, function(err, new_blog){
    if(err)
      console.log(err);
    else
      res.redirect("/blogs");
  });
});

//NEW
app.get("/blogs/new", function(req, res){
  res.render("new");
});

//SHOW
app.get("/blogs/:id", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err)
      res.redirect("/blogs")
    else
      res.render("show", {blog: foundBlog});
  });
});
//EDIT ROUTE GET
app.get("/blogs/:id/edit", function(req, res){
  Blog.findById(req.params.id, function(err, foundblog){
    if(err)
      res.render("/blogs");
    else
      res.render("edit", {blogs:foundblog});
  })
})
//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updateblog){
    if(err)
      res.redirect("/blogs");
    else
      res.redirect("/blogs/" + req.params.id);
  })
})
//DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
  Blog.findByIdAndDelete(req.params.id, function(err, deletedblog){
    res.redirect("/blogs");
  })
})
app.listen(process.env.PORT, process.env.IP, function(){
  console.log("Server is running");
});

module.exports = app;