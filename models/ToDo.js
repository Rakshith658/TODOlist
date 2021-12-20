const mongoose = require("mongoose");

const TODO = new mongoose.Schema({
  content: {
    type: "String",
    required: true,
    min: 3,
    max: 30,
  },
  tasklistid: {
    type: "String",
    required: true,
  },
  iscomplete: {
    type: "Boolean",
    required: true,
  },
});

module.exports = mongoose.model("TODO", TODO);
