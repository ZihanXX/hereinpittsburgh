var mongoose = require("mongoose");

var imgsSchema = mongoose.Schema({
    count: Number,
    urls: [],
    item_id: String,
    multi_img: Boolean
});

module.exports = mongoose.model("Imgs", imgsSchema);