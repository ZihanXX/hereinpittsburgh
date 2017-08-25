var mongoose = require("mongoose");

var categorySchema = mongoose.Schema({
    name: String,
    items: [
       {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item"
        }
    ]
});

module.exports = mongoose.model("Category", categorySchema);