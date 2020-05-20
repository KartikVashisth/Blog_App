var express = require("express"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose = require("mongoose"),
    app = express();

//APP Config
mongoose.connect("mongodb://localhost:27017/blog_app", {useNewUrlParser : true});
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(expressSanitizer());
//Title Image Body Created(Date)
//Mongoose model schema
var blogSchema = new mongoose.Schema({
  title : String,
  image : String,
  body : String,
  created : {type : Date, default : Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

/*Blog.create({
  title : "Test Blog",
  image : "https://images.unsplash.com/photo-1587242563826-a438ce9e3cc8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
  body : "Hello this is blog post"
  }, function(err, blog){
    if(err)
      console.log(err)
    else
      console.log("Successfully added");
});*/

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