const { gql } = require('apollo-server-koa');

const typeDefs = gql`
  	type Query {
        isLoginAvailable (login: String): Boolean
  		findTechnos(name: String, depth: Int, exactMatch: Boolean): [Techno]
        centerOnTechno(name: String, depth: Int): [Techno]
  		countTechnos: Int
  		findNotes: UserNotes
  		allNotes: [TechnoNotes]
  	}
  	type Mutation {
        login (login: String!, password: String!): String
        activate (login: String, registerKey: String): String
        register (login: String, password: String, nom: String, prenom: String, email: String): String
	    addTechno(name: String, links: [String], linkType: String): Techno
        addLink(from: String, to: String): Techno
	    updateNote(techno: String, note: Int): String
  	}
  	type Techno { 
	  	name: String, 
        niveau: Int,
  		children: [Techno]
  	}
  	type UserNotes {
  		userId: String,
  		notes: [UserTechnoNote]
  	}
  	type UserTechnoNote {
  		techno: String,
  		note: Int
  	}
  	type TechnoNotes {
  		techno: String,
  		notes: [TechnoUserNote]
  	}
  	type TechnoUserNote {
  		user: User,
  		note: Int
  	}
  	type User {
  		userId: String,
  		nom: String,
  		prenom: String
  	}
`;

module.exports = typeDefs;