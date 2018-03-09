"use strict";
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
        user_id: {
            type: DataTypes.BIGINT(11),
            autoIncrement: true,
            unique: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            unique: true,
            comment: '用户名'
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: '密码'
        },
        gender: {
            type: DataTypes.STRING(2),
            comment: '性别'
        },
        realname: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: '真实姓名'
        },
        sign: DataTypes.TEXT,
        user_img: DataTypes.TEXT('long') //TODO 需要比text类型64K更大的类型
    }, {
        timestamps: true, //时间戳自动添加了createdAt和updatedAt两个字段
        underscored: true, //自动添加的字段加上下划线
        paranoid: true, //数据不会真实删除，自动添加一个deletedAt属性
        freezeTableName: true, //如果存在同名表覆盖创建它
        tableName: 'user',
        charset: 'utf8',
        collate: 'utf8_general_ci'
    });
};