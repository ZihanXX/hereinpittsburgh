var Item        = require("../models/item");
    
// all the middleare goes here
var middlewareObj = {};

//check if logged in, and react to it
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "请先登录. Please login first."); //not actually shown, just an access
    res.redirect("/login");
};

//check if the user owns the item
middlewareObj.checkItemOwnerShip = function(req, res, next) {
    if(req.isAuthenticated()) {
        Item.findById(req.params.id, function(err, foundItem) { //是否有用户登录
            if(err) {
                req.flash("error", "Post not found.");
                res.redirect("back");
            } else {
                if(foundItem.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "Sorry, you don't have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "请先登录. You need to be logged in.");
        res.redirect("back");
    }
}

module.exports = middlewareObj;