var mongoose = require("mongoose");

var imgsSchema = mongoose.Schema({
    count: Number, //actual number of images
    urls: [],
    item_id: String, //belongs to which item
});

module.exports = mongoose.model("Imgs", imgsSchema);