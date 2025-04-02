import gql from "graphql-tag";

const typeDefs = gql`
type User {
	id: ID
	name: String!
	email: String!
	createdAt: String
}


type Query {
	hello: String
	allUser: [User!]
}

type Mutation {
	signup(name: String!, email: String!, password: String!): User!
	login(email: String!, password: String!): Boolean!
	logout: Boolean!
}
`

export default typeDefs;
