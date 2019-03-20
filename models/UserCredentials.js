class UserCredentials {

    constructor(login, password, id, active, register_key, admin) {
        this.login = login;
        this.password = password;
        this.id = id;
        this.active = active;
        this.register_key = register_key;
        this.admin = admin;
    }

}

module.exports = UserCredentials;