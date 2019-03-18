const TechnosProcess = require('../process/technosProcess');
const NotesProcess = require('../process/notesProcess');
const UsersProcess = require('../process/usersProcess');
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const resolvers = {
  	Query: { 
        isLoginAvailable: (obj, args) => {
            return new UsersProcess().isLoginAvailable(args.login);
        },
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
	  		return new NotesProcess().getNotes(user.user.id);
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
                if (!user || !user.active) {
                    throw new Error('Invalid credentials')
                }

                const valid = bcrypt.compareSync(args.password, user.password);
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
        },
        activate: (obj, args) => {
            return new UsersProcess().activate(args.login, args.registerKey);
        },
        register: (obj, args) => {
            return new UsersProcess().register(args.login, args.password, args.nom, args.prenom, args.email);
        },
  		addTechno: (obj, args, { user }) => {
            if (!user || !user.user) {
                throw new Error('You are not authenticated!')
            }
  			return new TechnosProcess().createTechno(args.name, args.links, args.linkType, user.user.id);
  		},
  		updateNote: (obj, args, { user }) => {
            if (!user || !user.user) {
                throw new Error('You are not authenticated!')
            }
  			return new NotesProcess().updateNote(user.user.id, args.techno, args.note);
  		},
  	}
};

module.exports = resolvers;