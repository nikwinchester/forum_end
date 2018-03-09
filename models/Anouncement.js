"use strict";
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('announcement', {
        a_id: {
            type: DataTypes.BIGINT(11),
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        title: {
            type: DataTypes.TEXT
        },
        content: {
            type: DataTypes.TEXT
        }
    }, {
        timestamps: true,
        underscored: true,
        paranoid: true,
        freezeTableName: true,
        tableName: 'announcement',
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });
};