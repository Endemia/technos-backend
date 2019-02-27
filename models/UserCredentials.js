class UserCredentials {

    constructor(login, password, id, active) {
        this.login = login;
        this.password = password;
        this.id = id;
        this.active = active;
    }

}

module.exports = UserCredentials;