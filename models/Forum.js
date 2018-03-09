'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('forum', {
        f_id: {
            type: DataTypes.BIGINT(11),
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        visit: {
            type: DataTypes.BIGINT,
            defaultValue: 0,
            allowNull: false
        },
        category: {
            type: DataTypes.STRING,
            defaultValue: '无',
            allowNull: false
        }
    }, {
        timestamps: true,
        underscored: true,
        paranoid: true,
        freezeTableName: true,
        tableName: 'forum',
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });
};