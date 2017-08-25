var express  = require("express"),
    router   = express.Router();

var Item        = require("../models/item"),
    Comment     = require("../models/comment"),
    User        = require("../models/user"),
    Category    = require("../models/category");
    
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
    
var middleware = require("../middleware");


//items page
router.get("/items", function(req, res){
    req.session.returnTo = req.path; //RECORD THE PATH
    //console.log(req.session);
    Item.find({}).sort({date_update: -1}).exec(function(err, items) {
        if(err) {
            console.log(err);
        } else {
            res.render("items/index", {items: items});
        }
    });
});

//search
router.get("/items/search", function(req, res) {
    var query = req.query.q;
    req.session.returnTo = req.path + "?q=" + query; //RECORD THE PATH
    //console.log(req.session);
    Item.find({"name":{$regex : ".*" + query +".*", $options: '-i'}}, function(err, items){
        if(err) {
            console.log(err);
        } else {
            res.render("items/index", {items: items});
        }
    });
});

//CATEGORY
//category1 page
router.get("/items/category=1", function(req, res){
    req.session.returnTo = req.path; //RECORD THE PATH
    //console.log(req.session);
    Category.findOne({name: "1"}).populate("items").exec(function(err, cate){
        if(err) {
            console.log(err);
        } else {
            res.render("items/index", {items: cate.items});
        }
    });
});
//category2 page
router.get("/items/category=2", function(req, res){
    req.session.returnTo = req.path; //RECORD THE PATH
    //console.log(req.session);
    Category.findOne({name: "2"}).populate("items").exec(function(err, cate){
        if(err) {
            console.log(err);
        } else {
            res.render("items/index", {items: cate.items});
        }
    });
});
//category3 page
router.get("/items/category=3", function(req, res){
    req.session.returnTo = req.path; //RECORD THE PATH
    //console.log(req.session);
    Category.findOne({name: "3"}).populate("items").exec(function(err, cate){
        if(err) {
            console.log(err);
        } else {
            res.render("items/index", {items: cate.items});
        }
    });
});


//post new items
router.post("/items", upload.array('uploadedImages', 20), function(req, res, next){
    var name = req.body.name;
    var image = req.body.image;
    //cate是db里一个Category，而category只是item里的一个field
    Category.findOne({name: req.body.category}, function(err, cate){
        if(err){console.log(err)}
        else {
            var category = {
                id: cate._id,
                catename: req.body.category
            }
            var author = {
                id: req.user._id,
                username: req.user.username
            }
            var newItem = {name: name, category: category, image: image, author: author, 
                            date_crt: currentTime(), date_update: currentTime(), 
                            address: {name: req.body.address, place_id: req.body.place_id}};
            //creare a new item and save to dbs
            Item.create(newItem, function(err, newItem){
                if(err) {
                    console.log(err);
                } else {
                    cate.items.push(newItem);
                    cate.save();
                    //console.log(cate);
                    req.user.items.push(newItem);
                    req.user.save(); 
                    //console.log(req.user);
                    res.redirect("/items");
                }
            });
        }
    });
});

//show the form that will send the data to /items
router.get("/items/new", middleware.isLoggedIn, function(req, res){
    res.render("items/new");
});

//show item detail on one page
router.get("/items/:id", function(req, res) {
    req.session.returnTo = req.path; //RECORD THE PATH
    //console.log(req.session);
    Item.findById(req.params.id).populate("comments").exec(function(err, foundItem){
        if(err) {
            console.log(err);
        } else {
            //console.log(foundItem);
            User.findById(foundItem.author.id, function(err, user) {
                if(err) {console.log(err);}
                res.render("items/show", {item: foundItem, user: user});
            });
        }
    });
});

//SET FAVORITE TO BE ON
router.get("/items/:id/favorite-on", middleware.isLoggedIn, function(req, res) {
    req.session.returnTo = req.path.substring(0, -12); //RECORD THE PATH
    //console.log(req.session);
    var currentUser = req.user;
    var itemID = req.params.id;
    Item.findById(itemID, function(err, favoriteItem) {
        if(err) {console.log(err);}
        else {
            currentUser.favorites.push(favoriteItem);
            currentUser.save();
            //console.log(currentUser);
            res.redirect('back');
        }
    });
});
//DELETE FAVOTITE
router.get("/items/:id/favorite-off", middleware.isLoggedIn, function(req, res) {
    req.session.returnTo = req.path.substring(0, -13); //RECORD THE PATH
    //console.log(req.session);
    var currentUser = req.user;
    var itemID = req.params.id;
    Item.findById(itemID, function(err, favoriteItem) {
        if(err) {console.log(err);}
        else {
            currentUser.favorites.pop(favoriteItem);
            currentUser.save();
            //console.log(currentUser);
            res.redirect('back');
        }
    });
});

//EDIT ITEM ROUTE
router.get("/items/:id/edit", middleware.checkItemOwnerShip, function(req, res){
    Item.findById(req.params.id, function(err, foundItem){
        if(err){}
        res.render("items/edit", {item: foundItem});
    });
});

//UPDATE ITEM ROUTE
router.put("/items/:id", middleware.checkItemOwnerShip, function(req, res) {
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
router.delete("/items/:id", middleware.checkItemOwnerShip, function(req, res){
   Item.findByIdAndRemove(req.params.id, function(err, item){
        if(err){
            res.redirect("/items");
        } else {
            //console.log(item);
            Category.findOne({name: item.category.catename}, function(err, cate) {
                if(err) {console.log(err);}
                else {
                    //console.log(cate);
                    cate.items.pop(item);
                    cate.save();
                    //console.log(cate);
                }
            });
            User.findById(item.author.id, function(err, user) {
                if(err) {console.log(err);}
                else {
                    //console.log(user);
                    user.items.pop(item);
                    user.favorites.pop(item);
                    user.save();
                    //console.log(user);
                }
            });
            Comment.find({item: item.id}, function(err, comments){
                if(err) {}
                else {
                    comments.forEach( function (comment) {
                        comment.remove();
                    });
                }
            });
            res.redirect("/myprofile/" + req.user._id);
        }
   });
});

//get the date function
var currentTime = function() {
    var utcNow = new Date();
    var now = new Date(Date.UTC(utcNow.getFullYear(), utcNow.getMonth(), utcNow.getDate(), 
                            utcNow.getHours()-4, utcNow.getMinutes(), utcNow.getSeconds()));
    return now;
}

module.exports = router;
