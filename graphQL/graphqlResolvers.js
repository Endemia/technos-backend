const TechnosProcess = require('../process/technosProcess');
const NotesProcess = require('../process/notesProcess');
const UsersProcess = require('../process/usersProcess');
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const resolvers = {
  	Query: { 
  		findTechnos: (obj, args, { user }) => {
            if (!user || !user.user) {
                throw new Error('You are not authenticated!')
            }
	  		return new TechnosProcess().getTechnoByName(args.name, args.depth, args.exactMatch);
  		},
  		countTechnos: (obj, args, { user }) => {
            if (!user || !user.user) {
                throw new Error('You are not authenticated!')
            }
	  		return new TechnosProcess().countTechnos();	
	  	},
	  	findNotes: (obj, args, { user }) => {
            if (!user || !user.user) {
                throw new Error('You are not authenticated!')
            }
	  		return new NotesProcess().getNotes(args.userId);
	  	},
	  	allNotes: (obj, args, { user }) => {
            if (!user || !user.user) {
                throw new Error('You are not authenticated!')
            }
	  		return new NotesProcess().getAllNotes();
	  	}
  	},
  	Mutation: {
        login: (obj, args) => {
            return new UsersProcess().getCredentialsByLogin(args.login).then(user => {
                if (!user) {
                    throw new Error('Invalid credentials')
                }

                return bcrypt.compare(args.password, user.password).then(valid => {
                    if (!valid) {
                        throw new Error('Invalid credentials')
                    } else {
                        return jsonwebtoken.sign(
                            { id: user.id, login: user.login },
                            "SECRET",
                            { expiresIn: '1d' }
                        )
                    }
                })
            })
        },
  		addTechno: (obj, args, { user }) => {
            if (!user || !user.user) {
                throw new Error('You are not authenticated!')
            }
  			return new TechnosProcess().createTechno(args.name);
  		},
  		updateNote: (obj, args, { user }) => {
            if (!user || !user.user) {
                throw new Error('You are not authenticated!')
            }
  			return new NotesProcess().updateNote(args.userId, args.techno, args.note);
  		},
  	}
};

module.exports = resolvers;