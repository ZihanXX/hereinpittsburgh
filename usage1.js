//initial setups
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    localStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    seedDB          = require("./seeds");
    
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
  authSecret: '1f8ea44e6bdc04e4969e6b756ce20dc58ebd3a63'
})
const del = require('del');
const assemblyOptions = {
    params: {template_id: 'a16e3c5064d411e79b5c81f60ef8eafd'}
}

app.get("/uup", function(req, res){
    res.render("uup");
});

app.post('/uploads', upload.array('uploadedImages', 20), function (req, res, next) {
    var files = req.files;
    var imgurls = [];
    if(files.length > 3) {
        //alert("the maximum is 3");
        res.redirect("/uup");
    } else {
        for(var i=0; i<files.length; i++) {
            transloadit.addFile(files[i].originalname, files[i].path);
            del(files[i].path);
        }
        transloadit.createAssembly(assemblyOptions, (err, result) => {
            if (err) {throw new Error(err);}
            console.log('✅ success');
            for(var i=0; i<result.uploads.length; i++) {
                console.log(result.assembly_id);
                imgurls[i] = result.uploads[i].url.slice();
                console.log(imgurls[i]);
            }
        });
        console.log(imgurls[0]);
        // transloadit.deleteAssembly(assemblyId, (err) => {
        //     console.log('✅ deleted')
        // });
    }
});
  
//make sure the server is running
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("HereInPittsburgh server has been started!!!")
});