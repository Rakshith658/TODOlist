import User from "../models/User";
import { hashSync, compareSync } from "bcryptjs";
import { sign } from "jsonwebtoken";
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
};

export default Mutation;
