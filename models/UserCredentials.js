class UserCredentials {

    constructor(login, password, id, active, register_key) {
        this.login = login;
        this.password = password;
        this.id = id;
        this.active = active;
        this.register_key = register_key;
    }

}

module.exports = UserCredentials;