var mongoose = require("mongoose");
var passprotLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    personal_name: String,
    username: String, //email actually
    password: String,
    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item"
        }
    ],
    favorites: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item"
        }
    ],
    wechat: String
});

UserSchema.plugin(passprotLocalMongoose);

module.exports = mongoose.model("User", UserSchema);