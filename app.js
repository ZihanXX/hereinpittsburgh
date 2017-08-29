//initial setups
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    localStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    seedDB          = require("./seeds");
    

var Item        = require("./models/item"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    Category    = require("./models/category");

var itemRoutes      = require("./routes/items"),
    commentRoutes   = require("./routes/comments"),
    indexRoutes     = require("./routes/index"),
    exploreRoutes   = require("./routes/explore");


app.use(bodyParser.urlencoded({extended: true}));
// mongoose.connect("mongodb://localhost/hip", { useMongoClient: true });
mongoose.connect("mongodb://" + process.env.MONGO_KEY + ":" + process.env.MONGO_PASS + "@ds027509.mlab.com:27509/hereinpittsburgh", { useMongoClient: true });

mongoose.Promise = global.Promise;
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

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

//让curentUser的状态和flash在每个loacals页面都能被传递
//call this funciton on every single route
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    var error = req.flash("error");
    var success = req.flash("success");
    res.locals.error = error;
    res.locals.success = success;
    next();
});

app.use("/", indexRoutes);
app.use("/", commentRoutes);
app.use("/", itemRoutes);
app.use("/", exploreRoutes);

//make sure the server is running
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("HereInPittsburgh server has been started!!!")
});
