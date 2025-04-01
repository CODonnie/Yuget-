import express, {RequestHandler} from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import gql from "graphql-tag";

//init
dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

//Middleware
const startServer = async () => {
  //GRAPHQL server
  const server = new ApolloServer({
		typeDefs: gql`
		type Query{
			hello: String
		}
		`,
		resolvers: {
			Query: {
				hello: () => "hello, stranger"
			}
		},
	});

  await server.start();

  app.use(cookieParser());
  app.use(
    "/",
		cors<cors.CorsRequest>(),
		express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => ({ req, res }),
    }) as unknown as RequestHandler
  );

  app.listen(port, () => console.log(`server running on localhost:${port}`));
};

startServer();
