//initial setups
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Item = require("./models/item");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
// var User = require("./models/user");
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost/hip_v3", { useMongoClient: true });
mongoose.Promise = global.Promise;
app.set("view engine", "ejs");
seedDB();

//landing page
app.get("/", function(req, res){
    res.render("landing");
});

//index page
//items from the dbs
app.get("/index", function(req, res){
    //res.render("index", {items: items}); 
    Item.find({}, function(err, items){
        if(err) {
            console.log(err);
        } else {
            res.render("items/index", {items: items});
        }
    })
});

//post new items
app.post("/index", function(req, res){
    //res.send("You hit the post route!");
    var name = req.body.name;
    var image = req.body.image;
    var newItem = {name: name, image: image};
    //items.push(newItem);
    //creare a new item and save to dbs
    Item.create(newItem, function(err, newItem){
        if(err) {
            console.log(err);
        } else {
            res.redirect("/index");
        }
    });
    //res.redirect("/index");
});

//show the form that will send the data to /index
app.get("/index/new", function(req, res){
    res.render("items/new");
});

//show item detail on one page
app.get("/index/:id", function(req, res) {
    //res.send("This will be the show page one day");
    Item.findById(req.params.id).populate("comments").exec(function(err, foundItem){
        if(err) {
            console.log(err);
        } else {
            console.log(foundItem);
            res.render("items/show", {item: foundItem});
        }
    });
});

//================COMMENTS ROUTES BELOW================

app.get("/index/:id/comments/new", function(req, res) {
    //find item by id
    Item.findById(req.params.id, function(err, item){
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", {item: item});   
        }
    });
});

app.post("/index/:id/comments", function(req, res){
    Item.findById(req.params.id, function(err, item) {
        if(err) {
            console.log(err);
            res.redirect("/index");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err) {console.log(err);}
                else {
                    item.comments.push(comment);
                    item.save();
                    res.redirect("/index/" + item._id);
                }
            });
            console.log(req.body.comment);
            
        }
    });
});

//================COMMENTS ROUTES ABOVE================

//make sure the server is running
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("HereInPittsburgh server has been started!!!")
});
