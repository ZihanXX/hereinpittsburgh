var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
    },
    date_update: Date
});

module.exports = mongoose.model("Comment", commentSchema);