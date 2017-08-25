var mongoose = require("mongoose");

var imgsSchema = mongoose.Schema({
    count: Number,
    urls: []
});

module.exports = mongoose.model("Imgs", imgsSchema);