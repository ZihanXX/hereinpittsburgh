var express  = require("express"),
    router   = express.Router();

var Item = require("../models/item"),
    Comment = require("../models/comment"),
    User = require("../models/user");


//items page
router.get("/", function(req, res){
    Item.find({}, function(err, items){
        if(err) {
            console.log(err);
        } else {
            res.render("items/index", {items: items});
        }
    })
});

//post new items
router.post("/", isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newItem = {name: name, image: image, author: author};
    //creare a new item and save to dbs
    Item.create(newItem, function(err, newItem){
        if(err) {
            console.log(err);
        } else {
            res.redirect("/items");
        }
    });
});

//show the form that will send the data to /items
router.get("/new", isLoggedIn, function(req, res){
    res.render("items/new");
});

//show item detail on one page
router.get("/:id", function(req, res) {
    Item.findById(req.params.id).populate("comments").exec(function(err, foundItem){
        if(err) {
            console.log(err);
        } else {
            console.log(foundItem);
            res.render("items/show", {item: foundItem});
        }
    });
});

//middleware
//copied form index.js
//check if logged in, and react to it
//问题是，每一次loggin之后都会回到items页,怎么才能改成回到当前页呢
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = router;