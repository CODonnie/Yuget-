import { CreateUser, loginUser, logoutUser, users } from "./services/authServices";
import protect from "./middlewares/authMiddlewares";


export type Input = {
	name?: string;
	email: string;
	password: string;
};

const resolvers = {
	Query: {
		hello: () => "Hello! Donnie",
		allUser: async (_: unknown, __: unknown, context: any) => {
			protect(context);
			return await users();
		},
	},
	Mutation: {
		signup: async (_: unknown, args: Input) => {
			return await CreateUser(args);
		},
		login: async (_: unknown, args: Input, context: any) => {
			return await loginUser(args, context);
		},
		logout: (_: unknown, __: unknown, context: any) => {
			protect(context);
			return logoutUser(context);
		}
	}
}

export default resolvers;
