const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: true,
    min: 3,
    max: 30,
  },
  email: {
    type: "string",
    required: true,
    min: 3,
    max: 30,
    unique: true,
  },
  password: {
    type: "string",
    required: true,
    min: 6,
  },
  avatar: {
    type: "string",
  },
});

module.exports = mongoose.model("User", UserSchema);
