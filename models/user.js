var mongoose = require("mongoose"),
    passport_local_mongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
  username: String,
  password: String
});
userSchema.plugin(passport_local_mongoose);
module.exports = mongoose.model("User", userSchema);