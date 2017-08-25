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
var upload          = multer({ dest: 'tmpImages/' });
    
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

//NEW ITEM & UPLOADING
router.get("/items/new", middleware.isLoggedIn, function(req, res){
    res.render("items/new", {imgs: "not exist", uploadDone: false});
});
router.get("/items/new/add_imgs/:id", function(req, res){
    req.session.imgsId = req.params.id; //RECORD THE imgsId
    Imgs.findById(req.params.id, function(err, imgs){
        
        if(err) {console.log(err);}
        else {
            res.render("items/new", {imgs: imgs, uploadDone: false});
        }
    });
});
router.get("/items/new/imgs_added", function(req, res) {
    Imgs.findById(req.session.imgsId, function(err, imgs){
        if(err) {console.log(err);}
        else {
            res.render("items/new", {imgs: imgs, uploadDone: true});
        }
    });
});
//UPLOADING POST
router.post('/items/new/add_imgs', upload.array('uploadedImages', 10), function (req, res, next) {
    // req.flash("success", "please be patient");
    var files = req.files;
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
    Imgs.findById(req.params.id, function(err, imgs){
        if(err) {console.log(err)}
        else {
            editImgs(files, imgs, res, req);
        }
    });
});
var editImgs = function(files, imgs, res, req) {
    "use strict"
    var countStart = imgs.count + 1;
    var countEnd = imgs.count + files.length;
    var s3Path = [];
    var resizedLocalPath = [];
    //set up the imgs
    for(var i=countStart; i<=countEnd; i++) {
        s3Path[i] = imgs.id + "" + i + ".jpg";
        resizedLocalPath[i] = "tmpImages/" + s3Path[i];
        imgs.urls.push("https://s3.amazonaws.com/hereinpittsburgh/" + s3Path[i]);
    }
    //resize 
    for(var i=0; i<files.length; i++) {
        imgs.count = imgs.count + 1;
        im.resize({
            srcPath: files[i].path,
            dstPath: resizedLocalPath[imgs.count],
            width: 1000,
            height: 1000
            }, function(err, stdout, stderr){if (err) throw err;});;
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
router.get("/items/new/remove_imgs/:urlName", function(req, res){
    var imgsId = req.params.urlName.slice(0, -1);
    var urlIndex = req.params.urlName.slice(-1) - 1;
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


// post new items
router.post("/items", middleware.isLoggedIn, function(req, res, next){
    var imgsId = req.session.imgsId;
    // console.log(imgsId);
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
            var newItem = new Item({name: name, category: category, image: image, author: author, 
                            date_crt: currentTime(), date_update: currentTime(), 
                            address: {name: req.body.address, place_id: req.body.place_id}});
            Imgs.findById(imgsId, function(err, imgs) {
                if(err) throw err;
                else {
                    imgs.item_id = newItem._id;
                    imgs.save();
                    newItem.imgs.imgs_id = imgsId;
                    newItem.imgs.urls = imgs.urls;
                    newItem.save();
                }
            });
            cate.items.push(newItem);
            cate.save();
            req.user.items.push(newItem);
            req.user.save(); 
            del("tmpImages/");
            res.redirect("/items");
        }
    });
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

//get the date function
var currentTime = function() {
    var utcNow = new Date();
    var now = new Date(Date.UTC(utcNow.getFullYear(), utcNow.getMonth(), utcNow.getDate(), 
                            utcNow.getHours()-4, utcNow.getMinutes(), utcNow.getSeconds()));
    return now;
}

module.exports = router;
