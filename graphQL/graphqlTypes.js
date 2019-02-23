const { gql } = require('apollo-server-koa');

const typeDefs = gql`
  	type Query {
  		findTechnos(name: String, depth: Int, exactMatch: Boolean): [Techno]
  		countTechnos: Int
  		findNotes(userId: String): UserNotes
  		allNotes: [TechnoNotes]
  	}
  	type Mutation {
	    addTechno(name: String): Techno
	    updateNote(userId: String, techno: String, note: Int): String
  	}
  	type Techno { 
	  	name: String, 
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