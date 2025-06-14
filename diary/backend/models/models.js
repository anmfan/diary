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
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
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
    },
    classroom: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
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
            if (student.changed('group_id')) {
                const previousGroupId = student.previous('group_id');
                const newGroupId = student.group_id;
                if (previousGroupId) {
                    await Groups.decrement('students_count', {
                        where: { id: previousGroupId },
                        transaction: options.transaction
                    });
                }
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
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    studentId: {
        type: DataTypes.INTEGER,
        references: {
            model: Students,
            key: 'id'
        },
        field: 'student_id',
    },
    subjectId: {
        type: DataTypes.INTEGER,
        references: {
            model: Subjects,
            key: 'id'
        },
        field: 'subject_id',
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

const SubjectTeachers = sequelize.define('SubjectTeachers', {
    subjectId: {
        type: DataTypes.INTEGER,
        references: {
            model: Subjects,
            key: 'id'
        }
    },
    teacherId: {
        type: DataTypes.INTEGER,
        references: {
            model: Teachers,
            key: 'id'
        }
    },
}, {
    timestamps: true
});

const GroupSubjectAssignments = sequelize.define('GroupSubjectAssignments', {
    groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Groups,
            key: 'id'
        }
    },
    subjectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Subjects,
            key: 'id'
        }
    },
    teacherId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Teachers,
            key: 'id'
        }
    }
}, {
    timestamps: true
});

const Schedule = sequelize.define('schedule', {
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    lesson_number: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    classroom: {
        type: DataTypes.STRING,
        allowNull: true
    },
    groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Groups,
            key: 'id'
        }
    },
    subjectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Subjects,
            key: 'id'
        }
    },
    teacherId: {
        type: DataTypes.INTEGER,
        allowNull: false,
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

Schedule.belongsTo(Groups, { foreignKey: 'groupId' });
Schedule.belongsTo(Subjects, { foreignKey: 'subjectId' });
Schedule.belongsTo(Teachers, { foreignKey: 'teacherId' });

Groups.hasMany(Schedule, { foreignKey: 'groupId' });
Subjects.hasMany(Schedule, { foreignKey: 'subjectId' });
Teachers.hasMany(Schedule, { foreignKey: 'teacherId' });

Groups.belongsToMany(Subjects, {through: GroupSubjectAssignments, foreignKey: 'groupId',
    otherKey: 'subjectId',
    as: 'assigned_subjects'
});

Subjects.belongsToMany(Groups, {through: GroupSubjectAssignments, foreignKey: 'subjectId',
    otherKey: 'groupId',
    as: 'assigned_groups'
});

GroupSubjectAssignments.belongsTo(Groups, { foreignKey: 'groupId' });
GroupSubjectAssignments.belongsTo(Subjects, { foreignKey: 'subjectId' });
GroupSubjectAssignments.belongsTo(Teachers, { foreignKey: 'teacherId' });

Groups.hasMany(GroupSubjectAssignments, { foreignKey: 'groupId' });
Subjects.hasMany(GroupSubjectAssignments, { foreignKey: 'subjectId' });
Teachers.hasMany(GroupSubjectAssignments, { foreignKey: 'teacherId' });

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

Students.belongsToMany(Subjects, { through: Marks });
Subjects.belongsToMany(Students, { through: Marks });

Marks.belongsTo(Students, { foreignKey: 'studentId' });
Marks.belongsTo(Subjects, { foreignKey: 'subjectId' });

Teachers.belongsToMany(Subjects, { through: SubjectTeachers, foreignKey: 'teacherId' });
Subjects.belongsToMany(Teachers, { through: SubjectTeachers, foreignKey: 'subjectId' });

module.exports = {
    Users,
    Groups,
    Subjects,
    Students,
    Roles,
    Marks,
    Teachers,
    SubjectTeachers,
    GroupSubjectAssignments,
    Schedule
};