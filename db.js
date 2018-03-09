const Sequelize = require('sequelize');
const config = require('./config');
var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
});

//测试数据库的链接
sequelize
    .authenticate()
    .then(() => {
        console.log('Mysql Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

exports = module.exports;
exports.sequelize = sequelize;

//建表
exports.sync = () => {
    //定义关联联系
    if (process.env.NODE_ENV !== 'production') {
        return sequelize.sync({ force: true });
    } else {
        throw new Error('Cannot sync() when NODE_ENV is set to \'production\'.');
    }
};