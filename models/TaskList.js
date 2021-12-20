const mongoose = require("mongoose");

const TaskList = new mongoose.Schema({
  createdAt: {
    type: "string",
    required: true,
    min: 3,
    max: 30,
  },
  title: {
    type: "string",
    required: true,
    min: 3,
    max: 30,
  },
  progress: {
    type: "Number",
    required: true,
  },
  users: {
    type: [],
    required: true,
  },
});

module.exports = mongoose.model("TaskList", TaskList);
