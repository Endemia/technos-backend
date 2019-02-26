const UsersRepository = require('../repository/usersRepository');

class UsersProcess {

	constructor() {
		this.usersRepository = new UsersRepository();
	}

	getCredentialsByLogin(login) {
		return this.usersRepository.getCredentialsByLogin(login);
	}

	isLoginAvailable(login) {
		return this.usersRepository.getCredentialsByLogin(login).then(res => {
			return res === null;
		})
	}

	register(login, password, nom, prenom, email) {
        if (!login || login.length < 2) {
            throw new Error("loginUnavailable");
        }
        if (!password || password.length < 2) {
            throw new Error("passwordEmpty");
        }
        if (!nom) {
            throw new Error("nomEmpty");
        }
        if (!prenom) {
            throw new Error("prenomEmpty");
        }
		if (!email) {
            throw new Error("emailEmpty");
        }
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@cgi.com$/;
        if (!re.test(email)) {
        	throw new Error("emailNotCgi");
        }

        return this.isLoginAvailable(login).then(isLoginAvailable => {
            if (isLoginAvailable) {
				return this.usersRepository.register(login, password, nom, prenom, email);
			} else {
                throw new Error("loginNotAvailable");
            }
        });
	}

}

module.exports = UsersProcess;