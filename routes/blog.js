var express = require('express'),
    router = express.Router(),
    Blog = require('../models/blog');

//Restfull Routes

//INDEX
router.get("/", function(req, res){
  Blog.find({}, function(err, allblogs){
    if(err)
      console.log(err);
    else
      res.render("blog/index", {blogs : allblogs});
  });
});

//CREATE
router.post("/", isLoggedIn, function(req, res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  var owner = {
    id: req.user._id,
    username: req.user.username
  }
  req.body.blog['owner'] = owner;
  Blog.create(req.body.blog, function(err, new_blog){
    if(err)
      console.log(err);
    else
      res.redirect("/blogs");
  });
});

//NEW
router.get("/new", isLoggedIn, function(req, res){
  res.render("blog/new");
});

//SHOW
router.get("/:id", isLoggedIn, function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if(err)
      res.redirect("/blogs")
    else
      res.render("blog/show", {blog: foundBlog});
  });
});
//EDIT ROUTE GET
router.get("/:id/edit", checkBlogOwnership, function(req, res){
  Blog.findById(req.params.id, function(err, foundblog){
    if(err)
      res.render("/blogs");
    else
      res.render("blog/edit", {blogs:foundblog});
  })
})
//UPDATE ROUTE
router.put("/:id", checkBlogOwnership, function(req, res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updateblog){
    if(err)
      res.redirect("/blogs");
    else
      res.redirect("/blogs/" + req.params.id);
  })
})
//DELETE ROUTE
router.delete("/:id", checkBlogOwnership, function(req, res){
  Blog.findByIdAndDelete(req.params.id, function(err, deletedblog){
    res.redirect("/blogs");
  })
})

//Middleware
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  else{
    res.redirect('/blogs');
  }
}
function checkBlogOwnership(req, res, next){
  if(req.isAuthenticated()){
    Blog.findById(req.params.id, function(err, foundBlog){
      if(err){
        console.log(err);
        res.redirect('/blogs');
      }
      else{
        if(foundBlog.owner.id.equals(req.user._id)){
          return next();
        }
        else{
          res.redirect('/blogs');
        }
      }
    })
  }
  else{
    res.redirect('/login');
  }
}
module.exports = router;

