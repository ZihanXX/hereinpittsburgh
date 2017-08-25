var mongoose = require("mongoose");
var Item = require("./models/item");
var Comment = require("./models/comment");

var data = [
         {name: "CHANEL", image: "http://wx1.sinaimg.cn/mw690/6d48f423gy1fh517d2su3j20m80euabu.jpg"},
         {name: "DIOR", image: "http://wx2.sinaimg.cn/mw690/6d48f423gy1fh517ed4vlj20m80eu3zq.jpg"},
         {name: "BOYY", image: "http://wx1.sinaimg.cn/mw690/6d48f423gy1fh517bjbvtj20m80euabm.jpg"},
         {name: "MadeWell", image: "http://wx3.sinaimg.cn/mw690/6d48f423gy1fh517g1by1j20m80eu75o.jpg"},
         {name: "DIOR2", image: "http://wx2.sinaimg.cn/mw690/6d48f423gy1fh517ed4vlj20m80eu3zq.jpg"}
    ]
    


function seedDB(){
    //remove all the items
    Item.remove({}, function(err){
        if(err) {
            console.log(err);
        }
        console.log("removed items!");
        //then add a few items
        data.forEach(function(seed){
            Item.create(seed, function(err, item){
                if(err) {
                    console.log(err);
                } else {
                    console.log("added a item.");
                    //add a few comments
                    Comment.create({
                        text: "This item is great.",
                        author: "Xinxin"
                    }, function(err, comment){
                        if(err) {
                            console.log(err);
                        } else {
                            item.comments.push(comment);
                            item.save();
                            console.log("create new comment");
                        }
                    });
                }
            });
        });
    });
      
}

//send the function seedDB() and store in seedDB
module.exports = seedDB;

