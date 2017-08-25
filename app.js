//initial setups
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb://localhost/hip", { useMongoClient: true });
mongoose.Promise = global.Promise;
app.set("view engine", "ejs");

//set up schema
var itemsSchema = new mongoose.Schema({
    name: String,
    image: String
});
//create a data model called "Item"
var Item = mongoose.model("Item", itemsSchema);

// //create a new item according to Item model
// Item.create(
//     {
//         name: "MadeWell",
//         image: "http://wx3.sinaimg.cn/mw690/6d48f423gy1fh517g1by1j20m80eu75o.jpg"
//     }, function(err, item){
//         if(err) {
//             console.log(err);
//         } else {
//             console.log("NEWLY CREATED ITEM: ");
//             console.log(item);
//         }
//     }
// );

// //data items
// var items = [
//          {name: "CHANEL", image: "http://wx1.sinaimg.cn/mw690/6d48f423gy1fh517d2su3j20m80euabu.jpg"},
//          {name: "DIOR", image: "http://wx2.sinaimg.cn/mw690/6d48f423gy1fh517ed4vlj20m80eu3zq.jpg"},
//          {name: "BOYY", image: "http://wx1.sinaimg.cn/mw690/6d48f423gy1fh517bjbvtj20m80euabm.jpg"},
//          {name: "MadeWell", image: "http://wx3.sinaimg.cn/mw690/6d48f423gy1fh517g1by1j20m80eu75o.jpg"},
//     ]

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
            res.render("index", {items: items});
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
    res.render("new.ejs");
});

//show item detail on one page
app.get("/index/:id", function(req, res) {
    //res.send("This will be the show page one day");
    Item.findById(req.params.id, function(err, foundItem){
        if(err) {
            console.log(err);
        } else {
            res.render("show", {item: foundItem});
        }
    });
});

//make sure the server is running
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("HereInPittsburgh server has been started!!!")
});
