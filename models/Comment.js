'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('comment', {
        c_id: {
            type: DataTypes.BIGINT(11),
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        comment: {
            type: DataTypes.TEXT
        },
        username: {
            type: DataTypes.STRING
        },
        f_id: {
            type: DataTypes.BIGINT(11),
            allowNull: false
        }
    }, {
        timestamps: true,
        underscored: true,
        paranoid: true,
        freezeTableName: true,
        tableName: 'comment',
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });
};