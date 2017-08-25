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


// //======date======//
// var currentTime = function() {
//     var utcNow = new Date();
//     var now = new Date(Date.UTC(utcNow.getFullYear(), utcNow.getMonth(), utcNow.getDate(), 
//                             utcNow.getHours()-4, utcNow.getMinutes(), utcNow.getSeconds()));
//     return now;
// }
// var currentTimeNum = function() {
//     var utcNow = new Date();
//     var now = new Date(Date.UTC(utcNow.getFullYear(), utcNow.getMonth(), utcNow.getDate(), 
//                             utcNow.getHours()-4, utcNow.getMinutes(), utcNow.getSeconds()));
//     var year    = now.getFullYear(),
//         month   = now.getMonth() + 1,
//         date    = now.getDate(),
//         hours   = now.getHours(),
//         minutes = now.getMinutes(),
//         seconds = now.getSeconds();
//     var timeStamp = year*10000000000 + month*100000000 + date*1000000 + hours*10000 + minutes*100 + seconds;
//     return timeStamp;
// }
// //console.log(Date());
// console.log(currentTime());
// console.log(currentTimeNum());

// var nowUTC = new Date();
// var now = currentTime();
// console.log(now > nowUTC);//false
// console.log(now < nowUTC);//true: now早,nowUTC晚

//===map===//
app.get("/map", function(req, res){
    res.render("map");
});
app.get("/mapsearch", function(req, res){
    res.render("mapsearch");
});


//make sure the server is running
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("HereInPittsburgh server has been started!!!")
});
