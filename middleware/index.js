var Item        = require("../models/item"),
    Comment     = require("../models/comment"),
    User        = require("../models/user"),
    Category    = require("../models/category");
    
// all the middleare goes here
var middlewareObj = {};

//check if logged in, and react to it
//问题是，每一次loggin之后都会回到items页,怎么才能改成回到当前页呢
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//check if the user owns the item
middlewareObj.checkItemOwnerShip = function(req, res, next) {
    if(req.isAuthenticated()) {
        Item.findById(req.params.id, function(err, foundItem) { //是否有用户登录
            if(err) {
                res.redirect("back");
            } else {
                if(foundItem.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = middlewareObj;