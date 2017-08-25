var express  = require("express"),
    router   = express.Router();

var Item        = require("../models/item"),
    Comment     = require("../models/comment"),
    User        = require("../models/user"),
    Category    = require("../models/category");

var passport = require("passport");
var middleware = require("../middleware");


//root route
router.get("/", function(req, res){
    res.render("landing");
});

//show register form
router.get("/register", function(req, res) {
    res.render("register");
});
//handle sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username}); 
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            console.log(err); //like the username has been registered
            return res.render("register");
        } 
        passport.authenticate("local")(req, res, function(){
            res.redirect("/items");
        });
    });
});

//MYPROFILE
router.get("/myprofile/:id", middleware.isLoggedIn, function(req, res){
    User.findById(req.user._id).populate("items").exec(function(err, user){
        if(err) {
            console.log(err);
        } else {
            res.render("user/myprofile", {items: user.items});
        }
    });
});

//OTHER'S PROFILE
router.get("/profile/:id", function(req, res){
    User.findById(req.params.id).populate("items").exec(function(err, user){
        if(err) {
            console.log(err);
        } else {
            res.render("user/profile", {user: user, items: user.items});
        }
    });
});

//show login form
router.get("/login", function(req, res) {
    res.render("login");
});
//handle login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/items",
        failureRedirect: "/login"  
    }), function(req, res) {
});

//log out route
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/items");
});


module.exports = router;