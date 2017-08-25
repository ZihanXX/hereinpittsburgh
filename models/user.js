var mongoose = require("mongoose");
var passprotLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(passprotLocalMongoose);

module.exports = mongoose.model("User", UserSchema);