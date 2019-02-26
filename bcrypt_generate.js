const bcrypt = require('bcrypt');
const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['127.0.0.1:9042'], localDataCenter: 'datacenter1', keyspace: 'technos' });


console.log(bcrypt.hashSync('password', 10));

const query = 'select * from users';
	const params = [];
	return client.execute(query, params, {prepare: true}).then(result => {
		if (result.rows) {
			console.log(result.rows);
		} else {
			return null;
		}
	})


/*

insert into users(id, nom, prenom, email) values ('a4ac2fae-32d6-11e9-b210-d663bd873d93', 'Billiotte', 'Laurent', 'laurent.billiotte@gmail.com');
insert into users(id, nom, prenom, email) values ('b10dc582-32d6-11e9-b210-d663bd873d93', 'Doe', 'John', 'a@ici.fr');
insert into users(id, nom, prenom, email) values ('c14736e0-32d6-11e9-b210-d663bd873d93', 'Bosch', 'Harry', 'b@ici.fr' );

insert into users_credentials(login, password, id) values ('laurent', '$2b$10$wFAT2F3G8AW5lxRkUmhUBeioOwGuqdoSb5MofRKFUTUIhxkUwlWgO', 'a4ac2fae-32d6-11e9-b210-d663bd873d93');
insert into users_credentials(login, password, id) values ('john', '$2b$10$wFAT2F3G8AW5lxRkUmhUBeioOwGuqdoSb5MofRKFUTUIhxkUwlWgO', 'b10dc582-32d6-11e9-b210-d663bd873d93');
insert into users_credentials(login, password, id) values ('harry', '$2b$10$wFAT2F3G8AW5lxRkUmhUBeioOwGuqdoSb5MofRKFUTUIhxkUwlWgO', 'c14736e0-32d6-11e9-b210-d663bd873d93');

*/