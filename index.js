import { GraphQLServer } from "graphql-yoga";
import connectDB from "./db";
import Mutation from "./Resolvers/Mutation";
import Query from "./Resolvers/Query";
import DbUser from "./models/User";
import { verify } from "jsonwebtoken";
import TaskList from "./Resolvers/TaskList";
import User from "./Resolvers/User";
import ToDo from "./Resolvers/ToDo";
require("dotenv").config();

const { JWT_SECRET } = process.env;

const getUserfronToken = async (token) => {
  if (!token) {
    return null;
  }
  const tokendata = verify(token, JWT_SECRET);
  if (!tokendata.id) {
    return null;
  }
  return await DbUser.findById(tokendata.id.match(/^[0-9a-fA-F]{24}$/));
};
const run_server = async () => {
  await connectDB();
  const server = new GraphQLServer({
    typeDefs: "./schema.graphql",
    resolvers: {
      Query,
      Mutation,
      TaskList,
      User,
      ToDo,
    },
    context: async ({ request }) => {
      const user = await getUserfronToken(request.headers.authorization);
      return {
        user,
      };
    },
  });

  server.start((url) => console.log("server runing at port " + url.port));
};

run_server();
