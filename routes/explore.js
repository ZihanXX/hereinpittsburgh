var express         = require("express"),
    bodyParser      = require("body-parser"),
    middleware      = require("../middleware");
var router          = express.Router();

var Item        = require("../models/item"),
    Comment     = require("../models/comment"),
    User        = require("../models/user"),
    Category    = require("../models/category"),
    Imgs        = require("../models/imgs"),
    Location     = require("../models/location");

var passport = require("passport");

router.use(bodyParser.urlencoded({extended: true}));


router.get("/explore", function(req, res){
    res.render("explore/index");
});

router.get("/explore/foods", function(req, res){
    req.session.returnTo = req.path; //RECORD THE PATH
    Location.find({category: "housing"}, function(err, locations){
        if(err) throw err;
        else {
            res.render("explore/cates", {locs: locations});
        }
    });
});

router.get("/explore/new_loc", middleware.isLoggedIn, function(req, res) {
    req.session.returnTo = req.path; //RECORD THE PATH
    res.render("explore/new_loc");
});

router.post("/explore/new_location", middleware.isLoggedIn, function(req, res, next) {
    var title = req.body.title;
    var category = req.body.category;
    var descreption = req.body.descreption;
    var orgUrl = req.body.orgUrl;
    var author = {
        id: req.user._id,
        username: req.user.personal_name
    }
    var newLoc = new Location({
        title: title, 
        category: category, 
        descreption: descreption,
        orgUrl: orgUrl,
        author: author,
        date_crt: currentTime(),
        address: {
            name: req.body.address, 
            place_id: req.body.place_id
        } 
    });
    newLoc.save();
    req.user.locations.push(newLoc);
    req.user.save();
    res.redirect("/explore/foods");
});


//get the date function
var currentTime = function() {
    var utcNow = new Date();
    var now = new Date(Date.UTC(utcNow.getFullYear(), utcNow.getMonth(), utcNow.getDate(), 
                            utcNow.getHours()-4, utcNow.getMinutes(), utcNow.getSeconds()));
    return now;
}

module.exports = router;