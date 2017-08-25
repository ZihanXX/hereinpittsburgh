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
router.post("/", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var newItem = {name: name, image: image};
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
router.get("/new", function(req, res){
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


module.exports = router;