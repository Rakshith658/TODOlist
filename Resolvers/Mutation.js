import User from "../models/User";
import { hashSync, compareSync } from "bcryptjs";
import { sign } from "jsonwebtoken";
import TaskList from "../models/TaskList";
import ToDo from "../models/ToDo";
require("dotenv").config();

const { JWT_SECRET } = process.env;

const getToken = (user) =>
  sign({ id: user._id }, JWT_SECRET, { expiresIn: "30 days" });

const Mutation = {
  singup: async (parent, args, context, info) => {
    const emailtaken = await User.findOne({ email: args.data.email });
    if (emailtaken) {
      throw new Error(
        `the User with this email ${args.data.email} is already exists`
      );
    }
    const hashedpassword = hashSync(args.data.password);
    const newUser = new User({
      name: args.data.name,
      email: args.data.email,
      password: hashedpassword,
      avatar: args.data.avatar,
    });
    const user = await newUser.save();
    return {
      user,
      token: getToken(user),
    };
  },
  singin: async (parent, args, context, info) => {
    const user = await User.findOne({ email: args.data.email });
    const isPasswordCorrect =
      user && compareSync(args.data.password, user.password);
    if (!user || !isPasswordCorrect) {
      throw new Error("email or password is invalid");
    }
    return {
      user,
      token: getToken(user),
    };
  },
  createTaskList: async (parent, args, { user }, info) => {
    if (!user) {
      throw new Error("Authorization invalid");
    }
    const newTaskList = TaskList({
      createdAt: new Date().toISOString(),
      title: args.title,
      progress: 0,
    });
    newTaskList.users.push(user.id);

    const tasklist = await newTaskList.save();
    return tasklist;
  },
  updateTaskList: async (parent, args, { user }, info) => {
    if (!user) {
      throw new Error("Authorization invalid");
    }
    await TaskList.findByIdAndUpdate(args.id.match(/^[0-9a-fA-F]{24}$/), {
      title: args.title,
    });
    return await TaskList.findById(args.id.match(/^[0-9a-fA-F]{24}$/));
  },
  deleteTaskList: async (parent, args, { user }, info) => {
    if (!user) {
      throw new Error("Authorization invalid");
    }
    const res = await TaskList.findByIdAndDelete(
      args.id.match(/^[0-9a-fA-F]{24}$/)
    );
    if (res === null) {
      throw new Error("no data found with this id " + args.id);
    }
    return res;
  },
  inviteUser: async (parent, { tasklistid, userId }, { user }, info) => {
    if (!user) {
      throw new Error("Authorization invalid");
    }

    const tasklist = await TaskList.findById(
      tasklistid.match(/^[0-9a-fA-F]{24}$/)
    );
    const isUserexist = tasklist.users.find((user) => user === userId);
    if (isUserexist) {
      return tasklist;
    }
    await TaskList.findByIdAndUpdate(tasklistid.match(/^[0-9a-fA-F]{24}$/), {
      $push: {
        users: userId,
      },
    });
    return await TaskList.findById(tasklistid.match(/^[0-9a-fA-F]{24}$/));
  },
  createToDo: async (parent, args, { user }, info) => {
    if (!user) {
      throw new Error("Authorization invalid");
    }
    const newTodo = await ToDo({
      content: args.content,
      tasklistid: args.tasklistid,
      iscomplete: false,
    });
    const newtodo = await newTodo.save();
    return newtodo;
  },
  updateToDo: async (parent, { id, data }, { user }, info) => {
    if (!user) {
      throw new Error("Authorization invalid");
    }
    await ToDo.findByIdAndUpdate(id.match(/^[0-9a-fA-F]{24}$/), data);

    return await ToDo.findById(id.match(/^[0-9a-fA-F]{24}$/));
  },
  deleteTodo: async (parent, { id }, { user }, info) => {
    if (!user) {
      throw new Error("Authorization invalid");
    }
    return await ToDo.findByIdAndDelete(id.match(/^[0-9a-fA-F]{24}$/));
  },
};

export default Mutation;
