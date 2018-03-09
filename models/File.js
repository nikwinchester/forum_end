'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('file', {
        _id: {
            type: DataTypes.BIGINT(11),
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        comment: {
            type: DataTypes.TEXT
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING
        },
        download_times: {
            type: DataTypes.BIGINT,
            defaultValue: 0
        },
        originalname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        formatname: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: true,
        underscored: true,
        paranoid: true,
        freezeTableName: true,
        tableName: 'file',
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });
};