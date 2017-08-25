//initial setups
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    localStrategy   = require("passport-local"),
    seedDB          = require("./seeds");

var Item        = require("./models/item"),
    Comment     = require("./models/comment"),
    User        = require("./models/user");

var itemRoutes      = require("./routes/items"),
    commentRoutes   = require("./routes/comments"),
    indexRoutes     = require("./routes/index");

app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost/hip_v3", { useMongoClient: true });
mongoose.Promise = global.Promise;
app.set("view engine", "ejs");
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

//让curentUser的状态在每个loacals页面都能被传递
//call this funciton on every single route
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use("/", indexRoutes);
app.use("/items/:id/comments", commentRoutes);
app.use("/items", itemRoutes);

//make sure the server is running
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("HereInPittsburgh server has been started!!!")
});
