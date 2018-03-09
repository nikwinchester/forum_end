const router = require('koa-router')();
const myMiddleware = require('../middleware');
const model = require('../model');

let Forum = model.Forum;
let User = model.User;
let Comment = model.Comment;
router.prefix('/comment');


//新建评论
router.post('/createComment', async(ctx) => {
    "use strict";
    let obj = {
        comment: ctx.request.body.content,
        username: ctx.username,
        f_id: ctx.request.body.f_id
    };
    try {
        ctx.body = await Comment.create(obj);
    } catch (e) {
        console.log(e);
        ctx.status = 444;
        ctx.body = { err: "评论失败" }
    }

});

//更新评论
router.post('/updateComment', async(ctx) => {
    "use strict";
    let user_info = await Comment.findOne({ where: { c_id: ctx.request.body.c_id } });
    if (user_info.username === ctx.username) {
        let obj = {
            comment: ctx.request.body.comment || ''
        };
        try {
            let rst = await Comment.update(obj, { where: { c_id: ctx.request.body.c_id } });
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
            ctx.body = { err: '修改失败' }
        }
    } else {
        ctx.status = 444;
        ctx.body = { err: '验证失败' }
    }
});


//获得评论
router.post('/getCommentById', async(ctx) => {
    "use strict";
    //TODO:modify
    let rst = await Comment.findOne({ attributes: { exclude: ['deleted_at'] }, where: { c_id: ctx.request.body.c_id } });
    if (rst) {
        let user_info = await User.findOne({ attributes: { exclude: ['password', 'created_at', 'updated_at', 'deleted_at'] }, where: { username: rst.username } });
        let tmp_rst = {
            comment: rst,
            user_info: user_info
        };
        ctx.body = JSON.parse(JSON.stringify(tmp_rst));
    } else {
        ctx.status = 444;
        ctx.body = { err: "未查询到帖子" }
    }
});

router.post('/getCommentByUser', async(ctx) => {
    "use strict";
    ctx.body = await Comment.findAll({ include: { model: Forum, attributes: ['title'] }, attributes: { exclude: ['deleted_at'] }, where: { username: ctx.request.body.username } });
});


//删除帖子
router.post('/deleteComment', async(ctx) => {
    "use strict";
    //检查是否删除自己的评论
    let user_info = await Comment.findOne({ where: { c_id: ctx.request.body.c_id } });
    //console.log(user_info,ctx.username);
    if (user_info !== null && user_info.username === ctx.username) {
        let rst = await Comment.destroy({ where: { c_id: ctx.request.body.c_id } });
        if (rst > 0) {
            ctx.body = { message: rst }
        } else {
            ctx.status = 444;
            ctx.body = { err: rst }
        }
    } else {
        ctx.status = 444;
        ctx.body = { err: '检验出错' }
    }
});


module.exports = router;