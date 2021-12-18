import { GraphQLServer } from "graphql-yoga";
import connectDB from "./db";
import Mutation from "./Resolvers/Mutation";
import Query from "./Resolvers/Query";
import User from "./models/User";
import { verify } from "jsonwebtoken";
require("dotenv").config();

const { JWT_SECRET } = process.env;

const getUserfronToken = async (token) => {
  if (!token) {
    return null;
  }

  const tokendata = verify(token, JWT_SECRET);
  console.log(tokendata);
  if (!tokendata.id) {
    return null;
  }
  return await User.findById(tokendata.id.match(/^[0-9a-fA-F]{24}$/));
};
const run_server = async () => {
  await connectDB();
  const server = new GraphQLServer({
    typeDefs: "./schema.graphql",
    resolvers: {
      Query,
      Mutation,
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
