class User {

    userID;
    personaID;
    hotelID;
    email;
    password;
    username;
    rol;
    activo;
    fechaRegistro;
    constructor({ id = null, username, password = null } = {}) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.personaID = personaID;
        this.hotelID = hotelID;
        this.email = email;
        this.rol = rol;
        this.activo = activo;
        this.fechaRegistro = fechaRegistro;
    }
}

module.exports = User;
