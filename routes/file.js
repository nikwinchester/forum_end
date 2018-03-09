// const moment = require('moment');
const fs = require('fs');
const router = require('koa-router')();
const model = require('../model');
// const multer = require('koa-multer');   //文件上传中间件

let File = model.File;
let User = model.User;
router.prefix('/file');



//设置在哪里存放附件
const diskStore = path => {
    const storage = multer.diskStorage({
        //*设置上传文件路径.
        destination: path,
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        }
    });
    return multer({ storage: storage }); // upload
};
const upload = diskStore('./public/temp');


//ctx.request koa的request对象
const uploadFile = async(ctx) => { //ctx.req node的request对象  其实都一样
    console.log(ctx.req.file);
    console.log(ctx.req.body); //multer在request中新加了file属性
    //ctx.username='aa';
    let originalname = ctx.req.file.originalname;
    let formatname = moment().format('YYYYMMDDHHmmss');
    let file_info = {
        comment: ctx.req.body.comment,
        username: ctx.username,
        title: ctx.req.body.title,
        originalname: originalname,
        formatname: formatname
    };
    //TODO:检查该用户是否已上传同名文件
    let exist = await File.findOne({ where: { username: file_info.username, originalname: file_info.originalname } });
    if (exist) {
        console.log(exist);
        ctx.status = 444;
        return ctx.body = { err: '已经上传过同名文件' }
    } else {
        try {
            await File.create(file_info);
        } catch (e) {
            console.log(e);
            //TODO:删除插入失败的文件
            ctx.status = 444;
            ctx.body = { err: "插入数据库失败" }
        }
        let new_path = './public/uploads/' + formatname;
        let tmp_path = './public/temp/' + originalname;
        fs.rename(tmp_path, new_path, function(err) { //改变名字and移动
            if (err) {
                console.log(err);
                ctx.status = 444;
                return ctx.body = { err: '文件移动失败' }
            }
        });
        ctx.body = { messsage: 'OK' }
    }


};


//上传文件
router.post('/upload', upload.single('file'), uploadFile);

//获得文件列表
router.post('/getFileList', async(ctx) => {
    "use strict";
    //TODO:add user_img
    ctx.body = await File.findAll({ include: { model: User, attributes: ['user_img'] }, attributes: { exclude: ['formatname', 'updated_at', 'deleted_at'] } });
});


//获取文件详细信息
router.post('/getFileById', async(ctx) => {
    "use strict";
    console.log(ctx.request.body._id);
    ctx.body = await File.findOne({ include: { model: User, attributes: ['user_img'] }, where: { _id: ctx.request.body._id }, attributes: { exclude: ['formatname', 'updated_at', 'deleted_at'] } })
});

//获取用户上传过的文件
router.post('/getFileByUser', async(ctx) => {
    "use strict";
    ctx.body = await File.findAll({ where: { username: ctx.request.body.username }, attributes: { exclude: ['formatname', 'updated_at', 'deleted_at'] } })
});

//获取火热下载
router.post('/getHotFiles', async(ctx) => {
    "use strict";
    ctx.body = await File.findAll({
        limit: 10,
        order: [
            ['download_times', 'DESC']
        ]
    })
});

//更新文件
router.post('/updateFile', async(ctx) => {
    "use strict";
    //验证是否是用户自己文件
    let file_info = await File.findOne({ where: { _id: ctx.request.body._id } });
    if (file_info && file_info.username === ctx.username) {
        let obj = {
            title: ctx.request.body.title,
            comment: ctx.request.body.comment
        };
        try {
            let rst = await File.update(obj, { where: { _id: ctx.request.body._id } });
            //console.info(rst[0]);
            if (rst[0] > 0) {
                ctx.body = { message: 'OK' };
            } else {
                ctx.status = 444;
                ctx.body = { err: '修改失败' }
            }
        } catch (e) {
            console.log(e);
            ctx.status = 444;
            ctx.body = { err: "发生错误" }
        }
    } else {
        ctx.status = 444;
        ctx.body = { err: '只能修改自己上传的文件' }
    }
});


//删除文件
router.post('/deleteFile', async(ctx) => {
    "use strict";
    let file_info = await File.findOne({ where: { _id: ctx.request.body._id } });
    // console.log(file_info);
    if (file_info && file_info.username === ctx.username) {
        let file_path = './public/uploads/' + file_info.formatname;
        let rst = await File.destroy({ where: { _id: ctx.request.body._id } });
        if (rst > 0) {
            fs.unlinkSync(file_path); //同步删除文件
            ctx.body = { message: 'OK' }
        } else {
            ctx.status = 444;
            ctx.body = { err: rst }
        }
    } else {
        ctx.status = 444;
        ctx.body = { err: '只能删除自己上传的文件' }
    }


});


//下载文件
router.get('/download', async(ctx) => {
    try {
        let file_info = await File.findOne({ where: { _id: ctx.query._id } }); //query是？后面的参数
        let file_path = './public/uploads/' + file_info.formatname;
        ctx.set({ 'Content-disposition': 'attachment;filename=' + encodeURIComponent(file_info.originalname), 'charset': 'utf-8' });
        ctx.body = fs.createReadStream(file_path); //读取文件路径
        await File.increment('download_times', { silent: true, where: { _id: ctx.query._id } });
    } catch (e) {
        console.log(e);
        ctx.status = 444;
        ctx.body = { err: "发生错误" }
    }

});

module.exports = router;