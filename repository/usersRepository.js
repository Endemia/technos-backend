const cassandra = require('cassandra-driver');
const bcrypt = require('bcrypt');
const uuidV4 = require('uuid/v4');

const config = require('../config.json');
const User = require("../models/User");
const UserCredentials = require("../models/UserCredentials");

class UsersRepository {

	constructor() {
		this.client = new cassandra.Client(
			{
				contactPoints: [config.cassandra.host + ': ' + config.cassandra.port],
				localDataCenter: config.cassandra.datacenter, 
				keyspace: config.cassandra.keyspace 
			}
		);
	}

	getUserById(userId) {
		const query = 'select * from users where id = ?';
		const params = [userId];
		return this.client.execute(query, params, {prepare: true}).then(result => {
			if (result.rows && result.rows.length > 0) {
				return new User(userId, result.rows[0].nom, result.rows[0].prenom);
			} else {
				return null;
			}
		})
	}

	getUserByIds(userIds) {
		const query = 'select * from users where id in ?';
		const params = [userIds];
		return this.client.execute(query, params, {prepare: true}).then(result => {
			if (result.rows) {
				return result.rows.map(row => {
					return new User(row.id, row.nom, row.prenom);
				})
			} else {
				return null;
			}
		})
	}

	getCredentialsByLogin(login) {
		const query = 'select * from users_credentials where login = ?';
		const params = [login];
		return this.client.execute(query, params, {prepare: true}).then(result => {
			if (result.rows && result.rows.length > 0) {
				return new UserCredentials(result.rows[0].login, result.rows[0].password, result.rows[0].id, result.rows[0].active, result.rows[0].register_key, result.rows[0].admin);
			} else {
				return null;
			}
		})
	}

	register(login, password, nom, prenom, email) {

		const newUserId = uuidV4();
		const registerKey = uuidV4();
		console.log('newUserId ', newUserId);

		const cryptedPassword = bcrypt.hashSync(password, 10);
		const queries = [
			{
				query: 'insert into users_credentials(login, password, id, active, register_key) values (?, ?, ?, ?, ?)',
				params: [login, cryptedPassword, newUserId, false, registerKey]
			},
			{
				query: 'insert into users(id, prenom, nom, email) values (?, ?, ?, ?)',
				params: [newUserId, prenom, nom, email]
			}
		]
		return this.client.batch(queries, {prepare: true}).then(res => {
			return {userId: newUserId, registerKey}
		});
	}

	activate(login) {
		const query = 'update users_credentials set active=true where login = ?';
		const params = [login];
		return this.client.execute(query, params, {prepare: true});
	}
}

module.exports = UsersRepository;