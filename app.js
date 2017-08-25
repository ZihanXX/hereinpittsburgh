//initial setups
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    localStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    seedDB          = require("./seeds");

var Item        = require("./models/item"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    Category    = require("./models/category")

var itemRoutes      = require("./routes/items"),
    commentRoutes   = require("./routes/comments"),
    indexRoutes     = require("./routes/index");


app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost/hip", { useMongoClient: true });
mongoose.Promise = global.Promise;
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
//seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "told you, it's secret",
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

// app.use("/", indexRoutes);
// app.use("/items/:id/comments", commentRoutes);
// app.use("/items", itemRoutes);
app.use("/", indexRoutes);
app.use("/", commentRoutes);
app.use("/", itemRoutes);

//make sure the server is running
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("HereInPittsburgh server has been started!!!")
});
