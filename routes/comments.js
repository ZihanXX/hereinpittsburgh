var express  = require("express"),
    router   = express.Router({mergeParams: true}); //为了传:id

var Item        = require("../models/item"),
    Comment     = require("../models/comment"),
    User        = require("../models/user"),
    Category    = require("../models/category");
    
var middleware = require("../middleware");


//if logged in, run "next()", 也就是后面的function
//但下面这一段只是隐藏了这个url，如果有人直接access rul，也可以做出更改
router.get("/new", middleware.isLoggedIn, function(req, res) {
    console.log(req.params.id); //传的:id
    Item.findById(req.params.id, function(err, item){
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {item: item});   
        }
    });
});

//所以要在下面这一段也加上middleware isLoggedIN
router.post("/", middleware.isLoggedIn, function(req, res){
    Item.findById(req.params.id, function(err, item) {
        if(err) {
            console.log(err);
            res.redirect("/items");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err) {console.log(err);}
                else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    item.comments.push(comment);
                    item.save();
                    res.redirect("/items/" + item._id);
                }
            });
            console.log(req.body.comment);
        }
    });
});

module.exports = router;