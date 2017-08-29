var express     = require("express"),
    router      = express.Router();

var Item        = require("../models/item"),
    User        = require("../models/user");

var passport    = require("passport"),
    middleware  = require("../middleware");


//LANDING
router.get("/", function(req, res){
    req.session.returnTo = req.path; //RECORD THE PATH
    Item.find({}).sort({date_update: -1}).exec(function(err, items) {
        if(err) {
            console.log(err);
        } else {
            res.render("landing", {items: items});
        }
    });
});

//REGISTER PAGE
router.get("/register", function(req, res) {
    res.render("register");
});
//REGISTER POST
router.post("/register", function(req, res) {
    //if the username exists, give the error message
    var existMassage = "";
    User.findOne({personal_name: req.body.personal_name}, function(err, existingUser){
        if (!err && existingUser){ existMassage = "此用户名已被占用. Please choose another name.";}
    });
    //new user
    var newUser = new User({username: req.body.username, 
                            personal_name: req.body.personal_name, 
                            wechat: req.body.wechat}); 
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            var errMassage = err.message;
            var re = /username/gi;
            errMassage = errMassage.replace(re, 'email');
            return res.render("register", {"error": errMassage});
        } else if(existMassage == "此用户名已被占用. Please choose another name.") {
            user.remove();
            return res.render("register", {"error": existMassage});
        } else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to 哈匹HereInPittsburgh, " + user.personal_name);
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
    User.findById(req.user._id).populate("items").populate("favorites").exec(function(err, user){
        if(err) {
            console.log(err);
        } else {
            res.render("user/myprofile", {user: user, items: user.items, favorites: user.favorites});
        }
    });
});

//OTHER'S PROFILE
router.get("/profile/:id", function(req, res){
    req.session.returnTo = req.path; //RECORD THE PATH
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
    req.flash("success", "Loged you out");
    if(!req.session.returnTo) {
        res.redirect("/items");
    } else {
        res.redirect("" + req.session.returnTo);
        delete req.session.returnTo;
    }
});

//ABOUT US
router.get("/contact_us", function(req, res) {
    req.session.returnTo = req.path; //RECORD THE PATH
    res.render("partials/contact_us"); 
});


module.exports = router;