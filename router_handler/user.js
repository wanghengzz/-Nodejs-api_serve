// 导入数据库操作模块
const db = require('../db/index.js')
// 导入bcryptjs这个包（密码加密）
const bcrypt = require('bcryptjs')
// 导入生成token的包
const jwt=require('jsonwebtoken')
// 导入全局的配置文件 config
const config=require('../config')

// 注册新用户的处理函数
exports.regUser = (req, res) => {
  // res.send('reguser OK')
  // 接收表单数据
  const userInfo = req.body
  // 判断数据是否合法
  // if (!userInfo.username || !userInfo.password) {
  //   return res.send({ status: 1, message: '用户名或密码不能为空！' })
  // }

  // 定义sql语句查询用户名是否被占用
  const sqlStr = 'select *from ev_users where username=?'

  db.query(sqlStr, userInfo.username, (err, result) => {
    // 执行sql语句失败
    if (err) {
      // return res.send({ status: 1, message: err.message })
      return res.cc(err)
    }
    // 判断用户名字是否被占用
    if (result.length > 0) {
      // return res.send({ status: 1, message: '用户名被占用，请更换其他名字！' })
      return res.cc('用户名被占用，请更换其他名字！')
    }

    // 用户名可以使用  调用bcrypt.hashSync（）加密
    userInfo.password = bcrypt.hashSync(userInfo.password, 10)

    // 定义插入新用户的sql语句
    const sql = 'insert into ev_users set ?'
    // 调用db.query这个函数来执行sql语句
    db.query(sql, { username: userInfo.username, password: userInfo.password }, (err, result) => {
      //  判断是否执行成功
      if (err) {
        // return  res.send({status:1,message: err.message})
        return res.cc(err)
      }
      // 判断影响行数是否为1
      if (result.affectedRows !== 1)
        // return res.send({status:1,message:'注册用户失败稍后再试！'})
        res.cc('注册用户失败稍后再试！')
      // 注册用户成功
      // res.send({status:0,message:'注册成功！'})
      res.cc('注册成功！', 0)
    })
  })
}

// 登录的处理函数
exports.login = (req, res) => {
  // 接收表单数据
  const userInfo = req.body
  // 定义sql语句
  const sql = 'select *from ev_users where username=?'
  // 执行sql语句，根据用户名查询
  db.query(sql, userInfo.username, (err, result) => {
    // 执行失败
    if (err) return res.cc(err)
    // 执行sql语句成功，但是获取到的条数不等于1也算失败
    if (result.length != 1) return res.cc('登录失败！')

    // 判断密码是否正确
    // res.send('login OK')
    // 数据库密码是加密的因此需要调用bycript解密对比
    const compareResult = bcrypt.compareSync(userInfo.password, result[0].password)
    if(!compareResult)  return res.cc('登录失败')

    // 在服务器端生成token字符串
    const user={...result[0],password:'',user_pic:''}
     
    // 对用户的信息进行加密生成token字符串
    const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn:config.expiresIn})
    // 调用res.send响应给客户端
    res.send({
      status:0,
      message:'登陆成功！',
      token:'Bearer '+tokenStr
    })
  })
}
