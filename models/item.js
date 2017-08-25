var mongoose = require("mongoose");

//set up schema
var itemsSchema = new mongoose.Schema({
    name: String,
    type: String,
    wechat: String,
    imgs: {
        imgs_id: String,
        urls: []
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    category: String,
    date_crt: Date,
    date_update: Date,
    address: {
        name: String,
        place_id: String
    },
    descreption: String,
    date_av: String,
    isEnd: Boolean,
    price: String,
    price_org: String,
    orgUrl: String,
    delivery: String
});

//when we require item.js, we'll be getting the model
module.exports = mongoose.model("Item", itemsSchema);