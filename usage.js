//initial setups
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    localStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    seedDB          = require("./seeds");
    
var ImgGroup = require("./models/imgGroup");
    
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })


app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost/hip", { useMongoClient: true });
mongoose.Promise = global.Promise;
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
//seedDB();



const TransloaditClient = require('transloadit')
const transloadit       = new TransloaditClient({
  authKey   : 'd613fb6060cf11e786ef1b0d5ead66f0',
  authSecret: '1f8ea44e6bdc04e4969e6b756ce20dc58ebd3a63',
  notify_url: "https://hereinpittsburgh-zihanxx.c9users.io/up"
})
const del = require('del');
const assemblyOptions = {
    wait: false,
    params: {
        template_id: 'a16e3c5064d411e79b5c81f60ef8eafd',
        notify_url: "https://hereinpittsburgh-zihanxx.c9users.io/up"
    },
    notify_url: "https://hereinpittsburgh-zihanxx.c9users.io/up"
}

app.get("/up", function(req, res){
    res.send("done");
    //res.render("up");
});

app.get("/up/add", function(req, res){
    res.render("addImages1");
});
app.get("/up/add/:id", function(req, res){
    ImgGroup.findById(req.params.id, function(err, thisImgGroup){
        if(err) {console.log(err);}
        else {
            res.render("addImages", {thisImgGroup: thisImgGroup});
        }
    });
});

app.post('/upload_images1', upload.array('uploadedImages', 20), function (req, res, next) {
    var files = req.files;
    var newGroup = {assemblyIds: [], urls: []};
    ImgGroup.create(newGroup, function(err, thisImgGroup){
        if(err) {console.log(err)}
        else {
            for(var i=0; i<files.length; i++) {
                transloadit.addFile(files[i].originalname, files[i].path);
                del(files[i].path);
            }
            transloadit.createAssembly(assemblyOptions, (err, result) => {
                if (err) {throw new Error(err);}
                console.log('✅ success');
                thisImgGroup.assemblyIds.push(result.assembly_id);
                // const interval = setInterval(function(interval){
                // if(result.ok == "ASSEMBLY_COMPLETED"){
                //     clearInterval(interval);
                //     for(var i=0; i<result.uploads.length; i++) {
                //         thisImgGroup.urls.push(result.uploads[i].url);
                //     }
                //     thisImgGroup.save();
                //     console.log(thisImgGroup);
                //     res.redirect("/up/add/" + thisImgGroup.id);
                //     }
                // }, 100);
                for(var i=0; i<result.uploads.length; i++) {
                    thisImgGroup.urls.push(result.uploads[i].url);
                    console.log(result);
                }
                thisImgGroup.save();
                console.log(thisImgGroup);
                //console.log(transloadit);
                //res.redirect("/up/add/" + thisImgGroup.id);
            });
        }
    });
});
app.post('/upload_images/:id', upload.array('uploadedImages', 20), function (req, res, next) {
    console.log(req.params.id);
    var files = req.files;
    ImgGroup.findById(req.params.id, function(err, thisImgGroup){
        if(err) {console.log(err);}
        for(var i=0; i<files.length; i++) {
            transloadit.addFile(files[i].originalname, files[i].path);
            del(files[i].path);
        }
        transloadit.createAssembly(assemblyOptions, (err, result) => {
            if (err) {throw new Error(err);}
            console.log('✅ success');
            thisImgGroup.assemblyIds.push(result.assembly_id);
            window.setInterval(function(){
                if(result.ok == "ASSEMBLY_COMPLETED"){
                    for(var i=0; i<result.uploads.length; i++) {
                        thisImgGroup.urls.push(result.uploads[i].url);
                    }
                    thisImgGroup.save();
                    console.log(thisImgGroup);
                    res.redirect("/up/add/" + thisImgGroup.id);
                }
            }, 100);
        });
    });
});


  
//make sure the server is running
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("HereInPittsburgh server has been started!!!")
});