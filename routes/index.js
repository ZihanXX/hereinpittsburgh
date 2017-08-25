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
    req.session.returnTo = req.path; //RECORD THE PATH
    //console.log(req.session);
    res.render("landing");
});

//REGISTER SIGNUP
router.get("/register", function(req, res) {
    res.render("register");
});
//SIGN UP
router.post("/register", function(req, res) {
    var exitMassage = "";
    User.findOne({personal_name: req.body.personal_name}, function(err, existingUser){
        if (!err && existingUser){ exitMassage = "please choose another name";}
    });
    var newUser = new User({username: req.body.username, 
                            personal_name: req.body.personal_name, wechat: req.body.wechat}); 
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            var errMassage = err.message;
            var re = /username/gi;
            errMassage = errMassage.replace(re, 'email');
            return res.render("register", {"error": errMassage});
        } else if(exitMassage == "please choose another name") {
            user.remove();
            return res.render("register", {"error": exitMassage});
        } else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to HIP, " + user.personal_name);
                if(!req.session.returnTo) {
                    res.redirect("/items");
                } else {
                    res.redirect("" + req.session.returnTo);
                    delete req.session.returnTo;
                }
            });
        }
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
    req.session.returnTo = req.path; //RECORD THE PATH
    //console.log(req.session);
    User.findById(req.params.id).populate("items").exec(function(err, user){
        if(err) {
            console.log(err);
        } else {
            res.render("user/profile", {user: user, items: user.items});
        }
    });
});

//LOGIN
router.get("/login", function(req, res) {
    res.render("login");
    // var message = req.flash("error");
    // res.render("login", {message: message});
});
router.post('/login', 
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true}),
    function(req, res) {
        if(!req.session.returnTo) {
            res.redirect("/items");
        } else {
            res.redirect("" + req.session.returnTo);
            delete req.session.returnTo;
        }
});
  
//LOGOUT
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "loged you out");
    if(!req.session.returnTo) {
        res.redirect("/items");
    } else {
        res.redirect("" + req.session.returnTo);
        delete req.session.returnTo;
    }
});


module.exports = router;