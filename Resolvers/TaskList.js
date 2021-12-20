import ToDo from "../models/ToDo";
import User from "../models/User";

const TaskList = {
  progress: async (parent, args, { user }, info) => {
    const totaltask = await ToDo.find({ tasklistid: parent.id });
    const completedtask = totaltask.filter((todo) => todo.iscomplete);

    if (totaltask.length === 0) {
      return 0;
    }

    return (100 * completedtask.length) / totaltask.length;
  },
  users: async ({ users }, args, context, info) => {
    return await users.map((user) =>
      User.findById(user.match(/^[0-9a-fA-F]{24}$/))
    );
  },
  todos: async (parent, args, { user }, info) => {
    return await ToDo.find({ tasklistid: parent.id });
  },
};

export default TaskList;
