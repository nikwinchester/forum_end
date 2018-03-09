//环境变量初始化,默认development环境
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
var cors = require('koa-cors');

const index = require('./routes/index')
const users = require('./routes/users')

// error handler
onerror(app)

app.use(cors()); //解决跨域问题

// middlewares
app.use(bodyparser({
    enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))



// logger
app.use(async(ctx, next) => { //上下文context封装了request和response在里面
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods()) //allowedMethods当前接口运行的method
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

module.exports = app