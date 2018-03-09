const fs = require('fs');
const db = require('./db');

let files = fs.readdirSync(__dirname + '/models');

let js_files = files.filter((f) => {
    if (f !== 'Test.js') {
        return f.endsWith('.js');
    }
}, files);

//console.log(js_files)
module.exports = {};
//db.sync({force:true});

for (let f of js_files) {
    console.log('import model from file ' + f);
    let name = f.substring(0, f.length - 3);
    //module.exports[name] = require(__dirname+'/models/'+f);
    module.exports[name] = db.sequelize.import(__dirname + '/models/' + f);
}

module.exports.sync = () => {
    return db.sync();
};

//为表增加外键，表之间联系
module.exports.User.hasMany(module.exports.Forum, { foreignKey: 'username', sourceKey: 'username' });
module.exports.User.hasMany(module.exports.Comment, { foreignKey: 'username', sourceKey: 'username' });
module.exports.User.hasMany(module.exports.File, { foreignKey: 'username', sourceKey: 'username' });
module.exports.Forum.hasMany(module.exports.Comment, { foreignKey: 'f_id', sourceKey: 'f_id' });

module.exports.Comment.belongsTo(module.exports.Forum, { foreignKey: 'f_id', sourceKey: 'f_id' });
module.exports.File.belongsTo(module.exports.User, { foreignKey: 'username', sourceKey: 'username' });
module.exports.Forum.belongsTo(module.exports.User, { foreignKey: 'username', sourceKey: 'username', onDelete: 'cascade', hooks: true });

module.exports.sequelize = db.sequelize;

console.log(module.exports);