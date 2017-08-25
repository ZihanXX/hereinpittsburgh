var mongoose = require("mongoose");

//set up schema
var itemsSchema = new mongoose.Schema({
    name: String,
    image: String,
    file: String,
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
   ]
});

//when we require item.js, we'll be getting the model
module.exports = mongoose.model("Item", itemsSchema);