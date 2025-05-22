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
        defaultValue: 3,
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
    timestamps: false,
    hooks: {
        afterCreate: async (user, options) => {
            try {
                if (user.role_id === 2) {
                    await Teachers.create({user_id: user.id}, {transaction: options.transaction});
                } else if (user.role_id === 3) {
                    await Students.create({user_id: user.id}, {transaction: options.transaction});
                }
            } catch (e) {
                console.error('Ошибка при создании студента:', e);
                throw e;
            }
        }
    }
});

const Teachers = sequelize.define("teachers", {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: Users,
            key: "id"
        },
        onDelete: "CASCADE"
    },
}, {
    timestamps: true
});

const Groups = sequelize.define('groups', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    students_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    course: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    curator_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Teachers,
            key: 'id'
        }
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

const Subjects = sequelize.define('subjects', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

const Students = sequelize.define('students', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: Users,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    group_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Groups,
            key: 'id'
        }
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
        afterDestroy: async(student, options) => {
            if (student.group_id) {
                await Groups.decrement('students_count', {
                    where: { id: student.group_id },
                    transaction: options.transaction
                })
            }
        },
        afterUpdate: async (student, options) => {
            // Проверяем, изменилась ли группа
            if (student.changed('group_id')) {
                // 1. Получаем старую и новую группу
                const previousGroupId = student.previous('group_id');
                const newGroupId = student.group_id;
                // 2. Уменьшаем старую группу
                if (previousGroupId) {
                    await Groups.decrement('students_count', {
                        where: { id: previousGroupId },
                        transaction: options.transaction
                    });
                }
                // 3. Увеличиваем новую группу
                if (newGroupId) {
                    await Groups.increment('students_count', {
                        where: { id: newGroupId },
                        transaction: options.transaction
                    });
                }
            }
        }
    }
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


Users.hasOne(Teachers, { foreignKey: 'user_id' });
Teachers.belongsTo(Users, { foreignKey: 'user_id' });

Users.hasOne(Students, { foreignKey: 'user_id' });
Students.belongsTo(Users, { foreignKey: 'user_id' });

Teachers.hasMany(Groups, { foreignKey: "curator_id", as: "curated_groups" });
Groups.belongsTo(Teachers, { foreignKey: "curator_id", as: "curator" });

Teachers.belongsToMany(Groups, { through: 'GroupTeachers', foreignKey: 'teacherId' });
Groups.belongsToMany(Teachers, { through: 'GroupTeachers', foreignKey: 'groupId' });

Roles.hasMany(Users, { foreignKey: 'role_id' });
Users.belongsTo(Roles, {foreignKey: 'role_id', as: 'role'})

Groups.hasMany(Students, { foreignKey: 'group_id' });
Students.belongsTo(Groups, { foreignKey: 'group_id' });

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