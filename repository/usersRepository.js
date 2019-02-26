const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['127.0.0.1:9042'], localDataCenter: 'datacenter1', keyspace: 'technos' });
const bcrypt = require('bcrypt');
const uuidV4 = require('uuid/v4');

const User = require("../models/User");
const UserCredentials = require("../models/UserCredentials");

class UsersRepository {

	getUserById(userId) {
		const query = 'select * from users where id = ?';
		const params = [userId];
		return client.execute(query, params, {prepare: true}).then(result => {
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
		return client.execute(query, params, {prepare: true}).then(result => {
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
		return client.execute(query, params, {prepare: true}).then(result => {
			if (result.rows && result.rows.length > 0) {
				return new UserCredentials(result.rows[0].login, result.rows[0].password, result.rows[0].id);
			} else {
				return null;
			}
		})
	}

	register(login, password, nom, prenom, email) {

		const newUserId = uuidV4();
		console.log('newUserId ', newUserId);

		return bcrypt.hash(password, 10).then(cryptedPassword => {
			const queries = [
				{
					query: 'insert into users_credentials(login, password, id) values (?, ?, ?)',
					params: [login, cryptedPassword, newUserId]
				},
				{
					query: 'insert into users(id, prenom, nom, email) values (?, ?, ?, ?)',
					params: [newUserId, prenom, nom, email]
				}
			]
			return client.batch(queries, {prepare: true}).then(res => newUserId);
		})

		
	}
}

module.exports = UsersRepository;