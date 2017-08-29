var mongoose = require("mongoose");

var itemsSchema = new mongoose.Schema({
    name: String,
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
    date_av: [], //[0]: start, [1]: end
    isEnd: Boolean,
    price: String,
    orgUrl: String,
    delivery: String
});

//when we require item.js, we'll be getting the model
module.exports = mongoose.model("Item", itemsSchema);