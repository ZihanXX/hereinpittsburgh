//initial setups
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    localStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    seedDB          = require("./seeds");
    
var Imgs = require("./models/imgs");

var multer  = require('multer')
var upload = multer({ dest: 'tmpImages/' })

var im = require('imagemagick');
const del = require('del');
var s3 = require('s3');
var fs = require('fs');
var urlExists = require('url-exists');


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

app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost/hip", { useMongoClient: true });
mongoose.Promise = global.Promise;
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
//seedDB();

// im.identify('dior.jpg', function(err, features){
//   if (err) throw err;
//   console.log(features);
//   // { format: 'JPEG', width: 3904, height: 2622, depth: 8 } 
// });

//RESIZE USING IMAGEMAGICK
// im.resize({
//   srcPath: 'dior.jpg',
//   dstPath: 'dior-small.jpg',
//   width:   256
// }, function(err, stdout, stderr){
//   if (err) throw err;
// });

//UPLOAD IMAGE TO S3
// client.uploadFile({
//   localFile: "dior.jpg",
//   s3Params: {
//     Bucket: "hereinpittsburgh",
//     Key: "some/diorr.jpg",
//     ACL: 'public-read'
//   }
// });

//DELETE IMAGE FROM S3
// client.deleteObjects({
//     Bucket: "hereinpittsburgh",
//     Delete: {
//         Objects: [{Key: "some/dior.jpg"}]
//     }
// });


app.get("/up/add", function(req, res){
    res.render("addImages1");
});
app.get("/up/add/:id", function(req, res){
    Imgs.findById(req.params.id, function(err, imgs){
        if(err) {console.log(err);}
        else {
            //console.log(imgs);
            res.render("addImages", {imgs: imgs});
        }
    });
});

app.get("/remove/:urlName", function(req, res){
    console.log(req.params.urlName);
    var imgsId = req.params.urlName.slice(0, -1);
    var urlIndex = req.params.urlName.slice(-1) - 1;
    console.log(imgsId + " " + urlIndex);
    Imgs.findById(imgsId, function(err, imgs) {
        if(err) throw err;
        else{
            var newUrls = imgs.urls.slice(0,urlIndex).concat("").concat(imgs.urls.slice(urlIndex+1, imgs.urls.length));
            imgs.urls = newUrls;
            imgs.save();
            console.log(imgs);
            res.redirect("back");
        }
    });
});

app.post('/upload_images1', upload.array('uploadedImages', 20), function (req, res, next) {
    var files = req.files;
    var newImgs = {count: 0, urls: []};
    Imgs.create(newImgs, function(err, imgs){
        if(err) {console.log(err)}
        else {
            editImgs(files, imgs, res);
        }
    });
});

app.post('/upload_images/:id', upload.array('uploadedImages', 20), function (req, res, next) {
    var files = req.files;
    Imgs.findById(req.params.id, function(err, imgs){
        if(err) {console.log(err)}
        else {
            editImgs(files, imgs, res);
        }
    });
});

var editImgs = function(files, imgs, res) {
    var countStart = imgs.count + 1;
    var countEnd = imgs.count + files.length;
    var s3Path = [];
    var resizedLocalPath = [];
    //set up the imgs
    for(var i=countStart; i<=countEnd; i++) {
        s3Path[i] =  imgs.id + "" + i + ".jpg";
        resizedLocalPath[i] = "tmpImages/" + s3Path[i];
        imgs.urls.push("https://s3.amazonaws.com/hereinpittsburgh/" + s3Path[i]);
    }
    for(var i=0; i<files.length; i++) {
        imgs.count = imgs.count + 1;
        im.resize({
            srcPath: files[i].path,
            dstPath: resizedLocalPath[imgs.count],
            width:   100
            }, function(err, stdout, stderr){if (err) throw err;});
        //del(files[i].path);
    }
    imgs.save();
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
    var uploadThem = function(){
        for(var i=countStart; i<=countEnd; i++) {
            client.uploadFile({
                localFile: resizedLocalPath[i],
                s3Params: {
                    Bucket: "hereinpittsburgh",
                    Key: s3Path[i],
                    ACL: 'public-read'
                }});
            //del(resizedLocalPath[i]);
            //del("tmpImages/");
        }
    }
    console.log(imgs);
    // var uploadInterval = setInterval(function(){
    //     var allUrlExist = true;
    //     for(var i=countStart; i<=countEnd; i++) {
    //         console.log(i + " " + countStart + " " + countEnd);
    //         urlExists("https://s3.amazonaws.com/hereinpittsburgh/" + s3Path[i], function(err, exists) {
    //             if(err) throw err;
    //             else{
    //                 if(!exists) allUrlExist = false;
    //                 console.log(i + " " + s3Path[i] + " " + allUrlExist);
    //             }
    //         });
    //     }
    //     if(allUrlExist) {
    //         console.log(allUrlExist);
    //         clearInterval(uploadInterval);
    //         res.redirect("/up/add/" + imgs.id);
    //     }
    // }, 100);
    // setTimeout(function(){
        //del("tmpImages/");
        res.redirect("/up/add/" + imgs.id);
    // }, 100);
}

  
//make sure the server is running
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("HereInPittsburgh server has been started!!!")
});