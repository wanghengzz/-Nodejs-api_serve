// 导入express
const express = require('express')
// 创建服务器的实例对象
const app = express()
const joi = require('joi')
// 配置cors跨域
const cors = require('cors')
app.use(cors())

// 解析表单数据的中间件      注意：这个中间件只能解析 x-www-form-urlencoded 格式的表单数据
app.use(express.urlencoded({ extended: false }))

// 托管静态资源文件 
app.use('/uploads', express.static('./uploads'))

// 一定要在路由之前封装res.cc函数
app.use((req, res, next) => {
  // status=1表示默认失败的情况
  // err的值 可能是一个错误对象，也可能是一个错误的描述字符串
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})

// 一定要在路由之前配置解析token的中间件
const expressJWT = require('express-jwt')
const config = require('./config')
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api/] }))

// 导入并使用用户模块路由
const userRouter = require('./router/user.js')
app.use('/api', userRouter)
// 导入并使用用户信息的路由模块
const userInfoRouter = require('./router/userinfo.js')
app.use('/my', userInfoRouter)
// 导入并使用文章分类的路由模块
const artCateRouter = require('./router/artcate.js')
app.use('/my/article',artCateRouter)
// 导入并使用文章路由模块 
const articleRouter = require('./router/article') 
// 为文章的路由挂载统一的访问前缀 /my/article 
app.use('/my/article', articleRouter)


// 错误中间件
app.use(function (err, req, res, next) {
  // 数据验证失败
  if (err instanceof joi.ValidationError) return res.cc(err)
  // 身份认真失败后的错误
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
  // 未知错误
  res.cc(err)
})

// 启动服务器
app.listen(3007, () => {
  console.log('http://127.0.0.1:3007')
})
