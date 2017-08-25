var mongoose = require("mongoose");
var passprotLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    items: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Item"
      }
    ]
});

UserSchema.plugin(passprotLocalMongoose);

module.exports = mongoose.model("User", UserSchema);