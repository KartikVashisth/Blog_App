var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    User = require('../models/user');

router.get("/", function(req, res){
  res.redirect("/blogs");
});
//=====================
//Authentication Routes
//=====================
//SIGNUP
router.get('/register', (req, res) => {
  res.render('index/register');
});
router.post('/register', function(req, res){
  User.register(new User({username: req.body.username}), req.body.password, function(err, newUser){
    if(err){
      console.log(err);
      res.redirect('/register');
    }
    passport.authenticate('local')(req, res, function(){
      res.redirect('/blogs');
    });
  });
});

//LOGIN
router.get('/login', function(req, res){
  res.render('index/login');
})
router.post('/login', passport.authenticate('local', {
  successRedirect: '/blogs',
  failureRedirect: '/login'
}), function(req, res){
});

//LOGOUT
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/blogs');
})

module.exports = router;