import TaskList from "../models/TaskList";

const Query = {
  mytasklist: async (parent, arges, { user }, info) => {
    return await TaskList.find({ users: user.id });
  },
  getTaskList: async (parent, arges, { user }, info) => {
    if (!user) {
      throw new Error("Authorization invalid");
    }
    return await TaskList.findById(arges.id.match(/^[0-9a-fA-F]{24}$/));
  },
};

export { Query as default };
