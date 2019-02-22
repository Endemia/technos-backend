const TechnosProcess = require('../process/technosProcess');
const NotesProcess = require('../process/notesProcess');

const resolvers = {
  	Query: { 
  		findTechnos: (obj, args) => {
	  		return new TechnosProcess().getTechnoByName(args.name, args.depth, args.exactMatch);
  		},
  		countTechnos: () => {
	  		return new TechnosProcess().countTechnos();	
	  	},
	  	findNotes: (obj, args) => {
	  		return new NotesProcess().getNotes(args.userId);
	  	},
	  	allNotes: () => {
	  		return new NotesProcess().getAllNotes();
	  	}
  	},
  	Mutation: {
  		addTechno: (obj, args) => {
  			return new TechnosProcess().createTechno(args.name);
  		},
  		updateNote: (obj, args) => {
  			return new NotesProcess().updateNote(args.userId, args.techno, args.note);
  		},
  	}
};

module.exports = resolvers;