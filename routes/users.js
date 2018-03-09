const router = require('koa-router')()
const model = require('../model');
let User = model.User;

router.prefix('/users')


//注册
router.post('/signUp', async(ctx) => {
    let obj = {
        username: ctx.request.body.username,
        password: ctx.request.body.password,
        gender: ctx.request.body.gender,
        realname: ctx.request.body.realname,
        user_img: 'http://127.0.0.1:9000/img/default_user.jpg'
    };
    try {
        let rst = await User.create(obj);
        console.log('add user:' + rst);
        ctx.body = { message: 'OK' };
    } catch (e) {
        ctx.response.status = 444;
        ctx.body = { 'err': '注册失败，请更换用户名或联系管理员' };
        console.log('err:' + e);
    }
});


//登录
router.post('/signIn', async(ctx) => {
    let obj = {
        username: ctx.request.body.username,
        password: ctx.request.body.password
    };
    try {
        let rst = await User.findOne({ 'where': obj });
        console.log('find user:' + rst);
        if (!rst) {
            ctx.status = 444;
            ctx.body = { 'err': '登录失败,用户名或密码错误' }
        }
    } catch (e) {
        console.log('err:' + e);
        ctx.status = 444;
        ctx.body = { 'err': '登录失败,查询出错' }
    }
});


//获取用户信息
router.post('/getUserInfo', async(ctx) => {
    let obj = {
        username: ctx.request.body.username
    };
    let rst = await User.findOne({ attributes: { exclude: ['password', 'updated_at', 'deleted_at'] }, where: obj });
    //console.log(rst);
    if (rst) {
        ctx.body = rst;
    } else {
        ctx.status = 444;
        ctx.body = { err: 'no user info' }
    }
});


//更新用户信息
router.post('/updateUserInfo', async(ctx) => {
    let obj = ctx.request.body;
    let e_username = await User.findOne({ where: { user_id: obj.user_id } });
    if (ctx.username === e_username.username) {
        //console.log('here')
        try {
            let rst = await User.update(obj, { where: { user_id: obj.user_id } });
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
            ctx.body = { err: '修改失败,用户名可能被占用' }
        }
    } else {
        ctx.status = 444;
        ctx.body = { err: '修改的用户有误,重新登录再试' }
    }

});
module.exports = router