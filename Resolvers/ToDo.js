import TaskList from "../models/TaskList";
const ToDo = {
  tasklist: async ({ tasklistid }, args, { user }, info) => {
    return await TaskList.findById(tasklistid.match(/^[0-9a-fA-F]{24}$/));
  },
};

export default ToDo;
