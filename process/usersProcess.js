const UsersRepository = require('../repository/usersRepository');

class UsersProcess {

	constructor() {
		this.usersRepository = new UsersRepository();
	}

	getCredentialsByLogin(login) {
		return this.usersRepository.getCredentialsByLogin(login);
	}

}

module.exports = UsersProcess;