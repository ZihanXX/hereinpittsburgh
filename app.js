//initial setups
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");
var Item = require("./models/item");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
var User = require("./models/user");
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost/hip_v3", { useMongoClient: true });
mongoose.Promise = global.Promise;
app.set("view engine", "ejs");
//让curentUser的状态在每个loacals页面都能被传递
//call this funciton on every single route
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});
seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "I'm not that strong",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//landing page
app.get("/", function(req, res){
    res.render("landing");
});

//index page
//items from the dbs
app.get("/index", function(req, res){
    //res.render("index", {items: items}); 
    Item.find({}, function(err, items){
        if(err) {
            console.log(err);
        } else {
            res.render("items/index", {items: items});
        }
    })
});

//post new items
app.post("/index", function(req, res){
    //res.send("You hit the post route!");
    var name = req.body.name;
    var image = req.body.image;
    var newItem = {name: name, image: image};
    //items.push(newItem);
    //creare a new item and save to dbs
    Item.create(newItem, function(err, newItem){
        if(err) {
            console.log(err);
        } else {
            res.redirect("/index");
        }
    });
    //res.redirect("/index");
});

//show the form that will send the data to /index
app.get("/index/new", function(req, res){
    res.render("items/new");
});

//show item detail on one page
app.get("/index/:id", function(req, res) {
    //res.send("This will be the show page one day");
    Item.findById(req.params.id).populate("comments").exec(function(err, foundItem){
        if(err) {
            console.log(err);
        } else {
            console.log(foundItem);
            res.render("items/show", {item: foundItem});
        }
    });
});

//================COMMENTS ROUTES BELOW================

//if logged in, run "next()", 也就是后面的function
//但下面这一段只是隐藏了这个url，如果有人直接access rul，也可以做出更改
app.get("/index/:id/comments/new", isLoggedIn, function(req, res) {
    //find item by id
    Item.findById(req.params.id, function(err, item){
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {item: item});   
        }
    });
});

//所以要在下面这一段也加上middleware isLoggedIN
app.post("/index/:id/comments", isLoggedIn, function(req, res){
    Item.findById(req.params.id, function(err, item) {
        if(err) {
            console.log(err);
            res.redirect("/index");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err) {console.log(err);}
                else {
                    item.comments.push(comment);
                    item.save();
                    res.redirect("/index/" + item._id);
                }
            });
            console.log(req.body.comment);
            
        }
    });
});

//================COMMENTS ROUTES ABOVE================



//================AUTH ROUTES BELOW================

//show register form
app.get("/register", function(req, res) {
    res.render("register");
});
//handle sign up logic
app.post("/register", function(req, res) {
    //res.send("Signing you up"); 
    var newUser = new User({username: req.body.username}); 
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            console.log(err); //like the username has been registered
            return res.render("register");
        } 
        passport.authenticate("local")(req, res, function(){
            res.redirect("/index");
        });
    });
});

//show login form
app.get("/login", function(req, res) {
    res.render("login");
});
//handle login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/index",
        failureRedirect: "/login"  
    }), function(req, res) {
});

//log out route
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/index");
});

//check if logged in, and react to it
//问题是，每一次loggin之后都会回到index页
//怎么才能改成回到当前页呢
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//================AUTH ROUTES ABOVE================

//make sure the server is running
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("HereInPittsburgh server has been started!!!")
});
