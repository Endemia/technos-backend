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
        centerOnTechno: (obj, args, { user }) => {
            if (!user || !user.user) {
                throw new Error('You are not authenticated!')
            }
            return new TechnosProcess().centerOnTechno(args.name, args.depth);
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
            const usersProcess = new UsersProcess();
            return usersProcess.getCredentialsByLogin(args.login).then(user => {
                if (!user || !user.active) {
                    throw new Error('Invalid credentials')
                }

                const valid = bcrypt.compareSync(args.password, user.password);
                if (!valid) {
                    throw new Error('Invalid credentials')
                } else {
                    return usersProcess.getUserById(user.id).then(userInfos => {
                        return jsonwebtoken.sign(
                            { id: user.id, login: user.login, isAdmin: user.admin, nom: userInfos.nom, prenom: userInfos.prenom },
                            "SECRET",
                            { expiresIn: '1d' }
                        )
                    })
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
        addLink: (obj, args, { user }) => {
            if (!user || !user.user) {
                throw new Error('You are not authenticated!')
            }
            if (!user.user.isAdmin) {
                throw new Error('You are not authorized!')
            }
            return new TechnosProcess().createLink(args.from, args.to, user.user.id);
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