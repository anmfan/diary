module.exports = class UserDto {
    id;
    email;
    username;
    firstName;
    lastName;
    role;
    avatar;
    group = null;

    constructor(model) {
        this.id = model.id;
        this.email = model.email;
        this.username = model.username;
        this.firstName = model.first_name;
        this.lastName = model.last_name;
        this.avatar = model.avatar;
        this.role = model.role ? model.role.name : "Неопознанная роль";
    }
}
