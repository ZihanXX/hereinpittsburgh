var express  = require("express"),
    router   = express.Router();

var Item = require("../models/item"),
    Comment = require("../models/comment"),
    User = require("../models/user");
    
var middleware = require("../middleware");


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
router.post("/", middleware.isLoggedIn, function(req, res){
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
router.get("/new", middleware.isLoggedIn, function(req, res){
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

//EDIT ITEM ROUTE
router.get("/:id/edit", middleware.checkItemOwnerShip, function(req, res){
    Item.findById(req.params.id, function(err, foundItem){
        if(err){}
        res.render("items/edit", {item: foundItem});
    });
});

//UPDATE ITEM ROUTE
router.put("/:id", middleware.checkItemOwnerShip, function(req, res) {
    //find and update the correct item
    Item.findByIdAndUpdate(req.params.id, req.body.item, function(err, updatedItem){
        if(err) {
            res.redirect("/items");
        } else {
            res.redirect("/items/" + req.params.id);
        }
    });
});

//DESTROY ITEM ROUTE
router.delete("/:id", middleware.checkItemOwnerShip, function(req, res){
   Item.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/items");
      } else {
          res.redirect("/items");
      }
   });
});

module.exports = router;