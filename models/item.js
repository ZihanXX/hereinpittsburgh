var mongoose = require("mongoose");

//set up schema
var itemsSchema = new mongoose.Schema({
    name: String,
    image: String,
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
    category: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        },
        catename: String
    }
});

//when we require item.js, we'll be getting the model
module.exports = mongoose.model("Item", itemsSchema);