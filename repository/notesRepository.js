const cassandra = require('cassandra-driver');

const config = require('../config.json');
const User = require("../models/User");
const UserNotes = require("../models/UserNotes");
const TechnoNotes = require("../models/TechnoNotes");
const UserTechnoNote = require("../models/UserTechnoNote");
const TechnoUserNote = require("../models/TechnoUserNote");

class NotesRepository {

	constructor() {
		this.client = new cassandra.Client(
			{
				contactPoints: [config.cassandra.host + ': ' + config.cassandra.port],
				localDataCenter: config.cassandra.datacenter, 
				keyspace: config.cassandra.keyspace 
			}
		);
	}

	updateNote(userId, techno, note) {
		const queries = [
			{
				query: 'insert into users_notes(id, techno, note) values (?, ?, ?)',
				params: [userId, techno, note]
			},
			{
				query: 'insert into technos_notes(techno, id, note) values (?, ?, ?)',
				params: [techno, userId, note]
			}
		]
		return this.client.batch(queries, {prepare: true}).then(res => "OK");
	}

	deleteNote(userId, techno) {
		const queries = [
			{
				query: 'delete from users_notes where id = ? and techno = ?',
				params: [userId, techno]
			},
			{
				query: 'delete from technos_notes where techno = ? and id = ?',
				params: [techno, userId]
			}
		]
		return this.client.batch(queries, {prepare: true}).then(res => "OK");
	}

	getNotes(userId) {
		const query = 'select * from users_notes where id = ?';
		const params = [userId];
		return this.client.execute(query, params, {prepare: true}).then(result => {
			const notes = new UserNotes(userId);
			if (result.rows) {
				notes.setNotes(result.rows.map(n => {
					return new UserTechnoNote(n.techno, n.note);
				}));
			}
			return notes;
		})
	}

	getAllNotes() {
		const query = 'select * from technos_notes';
		return this.client.execute(query, [], {prepare: true}).then(result => {
			if (result.rows) {
				const technosMap = {};
				result.rows.forEach(row => {
					if (!technosMap[row.techno]) {
						technosMap[row.techno] = new TechnoNotes(row.techno);
					}
					technosMap[row.techno].addNote(new TechnoUserNote(new User(row.id), row.note));
				})
				return Object.keys(technosMap).map(k => technosMap[k]).sort((a,b) => {
					if (a.techno < b.techno)
					    return -1;
					if (a.techno > b.techno)
					    return 1;
					return 0;
				})
			} else {
				return [];
			}
		})
	}
}

module.exports = NotesRepository;