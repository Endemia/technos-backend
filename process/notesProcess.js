const NotesRepository = require('../repository/notesRepository');
const UsersRepository = require('../repository/usersRepository');

class NotesProcess {

	constructor() {
		this.notesRepository = new NotesRepository();
		this.usersRepository = new UsersRepository();
	}

	updateNote(userId, techno, note) {
		if (note > 0) {
			return this.notesRepository.updateNote(userId, techno, note);
		} else {
			return this.notesRepository.deleteNote(userId, techno);
		}
	}

	getNotes(userId) {
		return this.notesRepository.getNotes(userId);
	}

	getAllNotes() {
		return this.notesRepository.getAllNotes().then(allNotes => {
			const userIds = new Set();
			allNotes.forEach(techno => {
				techno.notes.forEach(note => {
					userIds.add(note.user.userId);
				})
			})
			return this.usersRepository.getUserByIds(Array.from(userIds)).then(users => {
				
				const usersMap = {};
				users.forEach(user => {
					usersMap[user.userId] = user;
				});

				allNotes.forEach(techno => {
					techno.notes.forEach(note => {
						note.user = usersMap[note.user.userId];
					})
				})

				return allNotes;
			})
		})
	}
}

module.exports = NotesProcess;