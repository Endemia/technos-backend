class UserNotes {

    constructor(userId, notes) {
        this.userId = userId;
        this.notes = notes || [];
    }

    setNotes(notes) {
    	this.notes = notes;
    }

    setUser(user) {
    	this.user = user;
    }
}

module.exports = UserNotes;