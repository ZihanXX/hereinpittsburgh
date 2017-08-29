var mongoose = require("mongoose");

//NOT USED
var locationsSchema = new mongoose.Schema({
    title: String,
    category: String,
    descreption: String,
    address: {
        name: String,
        place_id: String
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
    orgUrl: String,
    date_crt: Date
});

module.exports = mongoose.model("Location", locationsSchema);