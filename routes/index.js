const router = require('koa-router')();
const model = require('../model');
// const moment = require('moment');

let User = model.User;
let Forum = model.Forum;
let Comment = model.Comment;
let File = model.File;


//首页获取帖子
router.post('/getIndex', async(ctx) => {
    "use strict";
    let offset = ctx.request.body.offset // || moment().utc().format();
    let limit = ctx.request.body.limit || 10;
    //查询所有帖子，帖子下评论数目作为comment_count字段,username作为user_name字段
    let sql = 'SELECT forum.*,Count(`comment`.c_id) AS comment_count,`user`.user_id,`user`.username AS user_username,`user`.user_img,forum.deleted_at FROM forum LEFT JOIN `comment` ON `comment`.f_id = forum.f_id LEFT JOIN `user` ON forum.username = `user`.username WHERE `comment`.deleted_at IS NULL AND forum.deleted_at IS NULL AND forum.updated_at < \'' + offset + '\' GROUP BY forum.f_id ORDER BY forum.updated_at DESC LIMIT ' + limit;
    try {
        ctx.body = await model.sequelize.query(sql, { type: model.sequelize.QueryTypes.SELECT });
    } catch (e) {
        ctx.status = 444;
        ctx.body = { err: "something err" }
    }

});

//获取公告
router.post('/getAnnouncement', async(ctx) => {
    "use strict";
    ctx.body = await Announcement.findAll({ limit: 5, order: [
            ['updated_at', 'DESC']
        ] })
});


//html匹配
const matchHTML = html => {
    html = html || '';
    return html.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>?/gi, '').trim();
};

//查询搜索帖子
router.post('/searchForForum', async(ctx) => {
    "use strict";
    let exp = ctx.request.body.exp;
    if (!exp || exp === '') {
        return ctx.body = '输入搜索内容'
    }
    try {
        let result = [];
        let temp = await Forum.findAll({
            where: {
                $or: [{
                        content: { $like: '%' + exp + '%' }
                    },
                    {
                        title: { $like: '%' + exp + '%' }
                    }
                ]
            },
            raw: true
        });
        for (let item of temp) {
            let test_str = matchHTML(item.content);
            let test_content = new RegExp(exp).test(test_str);
            let test_title = new RegExp(exp).test(item.title);
            if (test_content || test_title) {
                result.push(item)
            }
        }
        ctx.body = result;
    } catch (e) {
        ctx.status = 444;
        ctx.body = { err: "something err" }
    }
});


//搜索文件
router.post('/searchForFile', async(ctx) => {
    "use strict";
    let exp = ctx.request.body.exp;
    if (!exp || exp === '') {
        return ctx.body = '输入搜索内容'
    }
    try {
        let result = [];
        let temp = await File.findAll({
            where: {
                $or: [{
                        comment: { $like: '%' + exp + '%' }
                    },
                    {
                        title: { $like: '%' + exp + '%' }
                    }, {
                        originalname: { $like: '%' + exp + '%' }
                    }
                ]
            },
            raw: true
        });
        for (let item of temp) {
            let test_str = matchHTML(item.comment);
            let test_content = new RegExp(exp).test(test_str);
            let test_title = new RegExp(exp).test(item.title);
            let test_filename = new RegExp(exp).test(item.originalname);
            if (test_content || test_title || test_filename) {
                result.push(item)
            }
        }
        ctx.body = result;
    } catch (e) {
        ctx.status = 444;
        ctx.body = { err: "something err" }
    }
});

module.exports = router;