var express         = require("express"),
    bodyParser      = require("body-parser"),
    middleware      = require("../middleware");
var router          = express.Router();

var Item        = require("../models/item"),
    Comment     = require("../models/comment"),
    User        = require("../models/user"),
    Category    = require("../models/category"),
    Imgs        = require("../models/imgs");

//UPLOADING
var multer          = require('multer'),
    im              = require('imagemagick'),
    s3              = require('s3'),
    fs              = require('fs'),
    urlExists       = require('url-exists');
const del           = require('del');
var upload          = multer({ 
                        dest: 'tmpImages/', 
                        limits: { fileSize: 50000000 }, //max: 50mb
                        onError : function(err, next) {
                                      console.log('error', err);
                                      next(err);
                                    }
                        });
    
router.use(bodyParser.urlencoded({extended: true}));

//SET UP UPLOADING
var client = s3.createClient({
  maxAsyncS3: 20,     // this is the default 
  s3RetryCount: 3,    // this is the default 
  s3RetryDelay: 1000, // this is the default 
  multipartUploadThreshold: 20971520, // this is the default (20 MB) 
  multipartUploadSize: 15728640, // this is the default (15 MB) 
  s3Options: {
    accessKeyId: "AKIAIM3J5R5I3GSMUGWQ",
    secretAccessKey: "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"
  }
});

//ITEMS INDEX PAGE
router.get("/items", function(req, res){
    req.session.returnTo = req.path; //RECORD THE PATH
    //console.log(req.session);
    Item.find({}).sort({date_update: -1}).exec(function(err, items) {
        if(err) {
            console.log(err);
        } else {
            res.render("items/index", {items: items, category: ""});
        }
    });
});

//CATEGORY (has to be placed ahead)
//sale page
router.get("/items/category=sale", function(req, res){
    req.session.returnTo = req.path; //RECORD THE PATH
    //console.log(req.session);
    Item.find({category: "Sale"}).sort({date_update: -1}).exec(function(err, items) {
        if(err) throw err;
        else res.render("items/index", {items: items, category: "On Sale"});
    });
});
//housing page
router.get("/items/category=housing", function(req, res){
    req.session.returnTo = req.path; //RECORD THE PATH
    //console.log(req.session);
    Item.find({category: "Housing"}).sort({date_update: -1}).exec(function(err, items) {
        if(err) throw err;
        else res.render("items/index", {items: items, category: "Housing"});
    });
});
//events page
router.get("/items/category=events", function(req, res){
    req.session.returnTo = req.path; //RECORD THE PATH
    //console.log(req.session);
    Item.find({category: "Events"}).sort({date_update: -1}).exec(function(err, items) {
        if(err) throw err;
        else res.render("items/index", {items: items, category: "Events"});
    });
});



//SEARCH
router.get("/items/search", function(req, res) {
    var query = req.query.q;
    req.session.returnTo = req.path + "?q=" + query; //RECORD THE PATH
    //console.log(req.session);
    Item.find({"name":{$regex : ".*" + query +".*", $options: '-i'}}, function(err, items){
        if(err) {
            console.log(err);
        } else {
            res.render("items/search", {items: items, query: query});
        }
    });
});

//NEW ITEM
router.get("/items/new_sale", middleware.isLoggedIn, function(req, res){
    req.session.catename = "Sale"; //RECORD THE catename
    // req.flash("success", "Please upload imges first.");
    res.render("items/new", {imgs: "not exist", uploadDone: false, catename: "Sale"});
});
router.get("/items/new_housing", middleware.isLoggedIn, function(req, res){
    req.session.catename = "Housing"; //RECORD THE catename
    // req.flash("success", "Please upload imges first.");
    res.render("items/new", {imgs: "not exist", uploadDone: false, catename: "Housing"});
});
router.get("/items/new_events", middleware.isLoggedIn, function(req, res){
    req.session.catename = "Events"; //RECORD THE catename
    // req.flash("success", "Please upload imges first.");
    res.render("items/new", {imgs: "not exist", uploadDone: false, catename: "Events"});
});
//NEW UPLOADING
router.get("/items/new/add_imgs/:id", middleware.isLoggedIn, function(req, res){
    req.session.imgsId = req.params.id; //RECORD THE imgsId
    Imgs.findById(req.params.id, function(err, imgs){
        if(err) throw err;
        else {
            if(req.session.catename == "Sale") res.render("items/new", {imgs: imgs, uploadDone: false, catename: "Sale"});
            if(req.session.catename == "Housing") res.render("items/new", {imgs: imgs, uploadDone: false, catename: "Housing"});
            if(req.session.catename == "Events") res.render("items/new", {imgs: imgs, uploadDone: false, catename: "Events"});
        }
    });
});
router.get("/items/new/imgs_added", middleware.isLoggedIn, function(req, res) {
    Imgs.findById(req.session.imgsId, function(err, imgs){
        if(err) throw err;
        else {
            if(req.session.catename == "Sale") res.render("items/new", {imgs: imgs, uploadDone: true, catename: "Sale"});
            if(req.session.catename == "Housing") res.render("items/new", {imgs: imgs, uploadDone: true, catename: "Housing"});
            if(req.session.catename == "Events") res.render("items/new", {imgs: imgs, uploadDone: true, catename: "Events"});
        }
    });
});
//UPLOADING POST
router.post('/items/new/add_imgs', upload.array('uploadedImages', 10), function (req, res, next) {
    // req.flash("success", "please be patient");
    var files = req.files;
    // upload.onError = function(err, next) {
    //                       console.log('error', err);
    //                     //   next(err);
    //                       req.flash("error", err);
    //                       return res.redirect("back");
    //                     }
    var newImgs = {count: 0, urls: []};
    Imgs.create(newImgs, function(err, imgs){
        if(err) {console.log(err)}
        else {
            editImgs(files, imgs, res, req);
        }
    });
});
router.post('/items/new/add_imgs/:id', upload.array('uploadedImages', 10), function (req, res, next) {
    var files = req.files;
    // if (err) {
    //     req.flash("error", err.message);
    //     return res.redirect('/items');
    // }
    Imgs.findById(req.params.id, function(err, imgs){
        if(err) {console.log(err)}
        else {
            editImgs(files, imgs, res, req);
        }
    });
});
var editImgs = function(files, imgs, res, req) {
    "use strict"
    var countStart = imgs.urls.length + 1;
    var countEnd = imgs.urls.length + files.length;
    if(countEnd > 9) {
        req.flash("error", "Sorry, you cannot upload images more than 9 times. Please start again");
        return res.redirect("back");
    }
    var s3Path = [];
    var resizedLocalPath = [];
    //set up the imgs
    for(var i=countStart; i<=countEnd; i++) {
        s3Path[i] = "imgs/" + imgs.id + "/" + imgs.id + "" + i + ".jpg";
        resizedLocalPath[i] = "tmpImages/" + imgs.id + "" + i + ".jpg";
        imgs.urls.push("https://s3.amazonaws.com/hereinpittsburgh/" + s3Path[i]);
    }
    //resize 
    for(var i=0; i<files.length; i++) {
        imgs.count = imgs.count + 1;
        im.resize({
            srcPath: files[i].path,
            dstPath: resizedLocalPath[countStart + i],
            width: 1000,
            height: 1000
            }, function(err, stdout, stderr){
                // if (err) throw err;
                if(err) {
                    req.flash("error", err.message);
                    return res.redirect("/items");
                }
            });
    }
    imgs.save();
    //wait until all the resizing are done
    var resizeInterval = setInterval(function(){
        var allPathExist = true;
        for(var i=countStart; i<=countEnd; i++) {
            if(!fs.existsSync(resizedLocalPath[i])) allPathExist = false;
        }
        if(allPathExist) {
            clearInterval(resizeInterval);
            uploadThem();
        }
    }, 100);
    //do the upload
    var uploaded_files = 0; //the number of files been uploaded
    var uploadThem = function(){
        for(var i=countStart; i<=countEnd; i++) {
            let uploader = client.uploadFile({
                localFile: resizedLocalPath[i],
                s3Params: {
                    Bucket: "hereinpittsburgh",
                    Key: s3Path[i],
                    ACL: 'public-read'
                }});
            uploader.on('end', function() {
                uploaded_files++;
            });
        }
    }
    // wait until all the uploading are done
    var uploadInterval = setInterval(function() {
        if(uploaded_files == countEnd - countStart + 1) {
            res.redirect("/items/new/add_imgs/" + imgs.id);
            clearInterval(uploadInterval);
            for(var i=countStart; i<=countEnd; i++) {
                del(files[i - countStart].path);
                del(resizedLocalPath[i]);
            }
        }
    }, 100);
}
router.get("/items/new/remove_imgs/:imgName", middleware.isLoggedIn, function(req, res){
    var imgsId = req.params.imgName.slice(0, -1);
    var urlIndex = req.params.imgName.slice(-1) - 1;
    Imgs.findById(imgsId, function(err, imgs) {
        if(err) throw err;
        else{
            imgs.urls = imgs.urls.slice(0,urlIndex).concat("").concat(imgs.urls.slice(urlIndex+1, imgs.urls.length));
            imgs.count--;
            imgs.save();
            // console.log(imgs);
            res.redirect("back");
        }
    });
});


//POST NEW ITEM
router.post("/items", middleware.isLoggedIn, function(req, res, next){
    var imgsId = req.session.imgsId;
    var name = req.body.name;
    var wechat = req.body.wechat;
    var category = req.body.category;
    var descreption = req.body.descreption;
    var date_av = req.body.date_av;
    var isEnd = false;
    var price = req.body.price;
    var price_org = req.body.price_org;
    var orgUrl = req.body.orgUrl;
    var delivery = req.body.delivery;
    //cate是db里一个Category，而category只是item里的一个field
    Category.findOne({name: req.body.category}, function(err, cate){
        if(err){console.log(err)}
        else {
            var author = {
                id: req.user._id,
                username: req.user.personal_name
            }
            var newItem = new Item({name: name, category: category, wechat: wechat, author: author, 
                            date_crt: currentTime(), date_update: currentTime(), descreption: descreption,
                            date_av: date_av, isEnd: isEnd, price: price, price_org: price_org, orgUrl: orgUrl,
                            delivery: delivery, address: {name: req.body.address, place_id: req.body.place_id} });
            Imgs.findById(imgsId, function(err, imgs) {
                if(err) throw err;
                else {
                    imgs.item_id = newItem._id;
                    imgs.save();
                    newItem.imgs.imgs_id = imgsId;
                    newItem.imgs.urls = imgs.urls;
                    newItem.save();
                    // console.log(newItem);
                }
            });
            cate.items.push(newItem);
            cate.save();
            req.user.items.push(newItem);
            req.user.save(); 
            console.log(newItem);
            res.redirect("/items");
        }
    });
});

//SHOW ITEM DETAIL
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
    var itemID = req.params.id;
    Item.findById(itemID, function(err, favoriteItem) {
        if(err) {console.log(err);}
        else {
            // console.log(favoriteItem);
            req.user.favorites.push(favoriteItem);
            req.user.save();
            res.redirect('back');
        }
    });
});
//DELETE FAVOTITE
router.get("/items/:id/favorite-off", middleware.isLoggedIn, function(req, res) {
    req.session.returnTo = req.path.substring(0, -13); //RECORD THE PATH
    //console.log(req.session);
    var itemID = req.params.id;
    Item.findById(itemID, function(err, favoriteItem) {
        if(err) {console.log(err);}
        else {
            // console.log(favoriteItem);
            req.user.favorites.pop(favoriteItem);
            req.user.save();
            res.redirect('back');
        }
    });
});

//EDIT ITEM ROUTE
router.get("/items/:id/edit", middleware.checkItemOwnerShip, function(req, res){
    Item.findById(req.params.id, function(err, foundItem){
        if(err) {}
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
            updatedItem.date_update = currentTime();
            updatedItem.save();
            req.flash("success", "the item has been successfully edited");
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
            Category.findOne({name: item.category}, function(err, cate) {
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




//CURRENT DATE
var currentTime = function() {
    var utcNow = new Date();
    var now = new Date(Date.UTC(utcNow.getFullYear(), utcNow.getMonth(), utcNow.getDate(), 
                            utcNow.getHours()-4, utcNow.getMinutes(), utcNow.getSeconds()));
    return now;
}

module.exports = router;
