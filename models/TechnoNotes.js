class TechnoNotes {

    constructor(techno, notes) {
        this.techno = techno;
        this.notes = notes || [];
    }

    setNotes(notes) {
    	this.notes = notes;
    }

    addNote(note) {
    	this.notes.push(note);
    }
}

module.exports = TechnoNotes;