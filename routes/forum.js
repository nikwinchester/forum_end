const router = require('koa-router')();
const model = require('../model');

let User = model.User;
let Forum = model.Forum;
let Comment = model.Comment;
router.prefix('/forum');



//创建帖子
router.post('/createForum', async(ctx) => {
    let obj = {
        title: ctx.request.body.title || '无标题',
        content: ctx.request.body.content,
        username: ctx.username,
        category: ctx.request.body.category || '无'
    };
    try {
        ctx.body = await Forum.create(obj);
    } catch (e) {
        console.log(e);
        ctx.status = 444;
        ctx.body = { err: "发帖失败" }
    }
});



//获取帖子
router.post('/getForumByUser', async(ctx) => {
    ctx.body = await Forum.findAll({ attributes: { exclude: ['deleted_at'] }, where: { username: ctx.request.body.username } });
});



//更新帖子
router.post('/updateForum', async(ctx) => {
    //验证帖子用户名
    let user_info = await Forum.findOne({ where: { f_id: ctx.request.body.f_id } });
    if (user_info.username === ctx.username) {
        let obj = {
            title: ctx.request.body.title || '无标题',
            content: ctx.request.body.content,
            category: ctx.request.body.category
        };
        try {
            let rst = await Forum.update(obj, { where: { f_id: ctx.request.body.f_id } });
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
        ctx.body = { err: '用户不一致' }
    }

});


router.post('/visitCount', (ctx) => {
    //find and add
});


//删除帖子
router.post('/deleteForum', async(ctx) => {
    let forum_info = await Forum.findOne({ where: { f_id: ctx.request.body.f_id } });
    if (forum_info.username === ctx.username) {
        let rst = await Forum.destroy({ where: { f_id: ctx.request.body.f_id } });
        if (rst > 0) {
            await Comment.destroy({ where: { f_id: ctx.request.body.f_id } });
            ctx.body = { message: rst }
        } else {
            ctx.status = 444;
            ctx.body = { err: rst }
        }
    }

});

module.exports = router;