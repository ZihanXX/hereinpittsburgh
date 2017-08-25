var mongoose = require("mongoose");
var Item        = require("./models/item"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    Category    = require("./models/category"),
    Imgs        = require("./models/imgs")
    
var catdata = [
    {name: "Sale", items: []},
    {name: "Housing", items: []},
    {name: "Events", items: []}
    ]

//====CLEAR ALL THE DATA EXCEPT FOR CATES====//

function seedDB(){
    //remove all the items
    Item.remove({}, function(){});
    Comment.remove({}, function(){});
    User.remove({}, function(){});
    Imgs.remove({}, function(){});
    Category.remove({}, function() {
        catdata.forEach(function(seed){
            Category.create(seed, function(){});
        });
    });
}

//send the function seedDB() and store in seedDB
module.exports = seedDB;

