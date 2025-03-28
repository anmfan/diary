const sequelize = require("../db");
const {DataTypes} = require("sequelize");

const Roles = sequelize.define('roles', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    timestamps: true
});

const Users = sequelize.define('users', {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    role_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Roles,
            key: 'id'
        }
    },
    refresh_token: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: false
});

const Teachers = sequelize.define("teachers", {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: Users,
            key: "id"
        },
        onDelete: "CASCADE"
    }
});

const Groups = sequelize.define('groups', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    curatorId: {
        type: DataTypes.INTEGER,
        references: {
            model: Teachers,
            key: 'id'
        }
    }
}, {
    timestamps: true
});

const Subjects = sequelize.define('subjects', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});

const Students = sequelize.define('students', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    groupId: {
        type: DataTypes.INTEGER,
        references: {
            model: Groups,
            key: 'id'
        }
    }
}, {
    timestamps: true
});

const Marks = sequelize.define('marks', {
    mark: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    studentId: {
        type: DataTypes.INTEGER,
        references: {
            model: Students,
            key: 'id'
        }
    },
    subjectId: {
        type: DataTypes.INTEGER,
        references: {
            model: Subjects,
            key: 'id'
        }
    }
}, {
    timestamps: true
});


Teachers.hasMany(Groups, { foreignKey: "curatorId" })
Groups.belongsTo(Teachers, { foreignKey: "curatorId" });

Teachers.belongsToMany(Groups, { through: 'GroupTeachers', foreignKey: 'teacherId' });
Groups.belongsToMany(Teachers, { through: 'GroupTeachers', foreignKey: 'groupId' });

Roles.hasMany(Users, { foreignKey: 'role_id' });
Users.belongsTo(Roles, {foreignKey: 'role_id'})

Groups.hasMany(Students, { foreignKey: 'groupId' });
Students.belongsTo(Groups, { foreignKey: 'groupId' });

Groups.belongsToMany(Subjects, { through: 'GroupSubjects' });
Subjects.belongsToMany(Groups, { through: 'GroupSubjects' });

Students.belongsToMany(Subjects, { through: Marks });
Subjects.belongsToMany(Students, { through: Marks });

Marks.belongsTo(Students, { foreignKey: 'studentId' });
Marks.belongsTo(Subjects, { foreignKey: 'subjectId' });

module.exports = {
    Users,
    Groups,
    Subjects,
    Students,
    Roles,
    Marks,
    Teachers
};