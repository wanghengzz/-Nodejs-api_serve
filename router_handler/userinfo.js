// 导入db模块
const db = require('../db/index.js')
// 导入byscriptjs模块
const byscript = require('bcryptjs')

// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
  // res.send('ok')
  // 定义查询用户信息的sql语句
  const sql = 'select id,username,nickname,email,user_pic from ev_users where id=?'
  db.query(sql, req.user.id, (err, result) => {
    // 执行sql语句失败
    if (err) return res.cc(err)
    // 成功但是查询的记过为空
    if (result.length != 1) return res.cc('获取用户信息失败！')
    // 用户信息获取成功
    res.send({
      status: 1,
      message: '获取用户信息成功！',
      data: result[0]
    })
  })
}

// 更新用户信息的基本函数
exports.updateUserInfo = (req, res) => {
  // res.send('ok')

  // 定义一个待执行的sql语句
  const sql = 'update ev_users set ? where id=?'

  // 调用db.query()执行sql语句并传递参数
  db.query(sql, [req.body, req.body.id], (err, result) => {
    // 执行sql语句失败了
    if (err) return res.cc(err)
    if (result.affectedRows !== 1) return res.cc('更新用户的基本信息失败！')
    // 更新用户信息成功
    res.cc('更新用户信息成功!', 0)
  })
}

// 更新用户密码的处理函数
exports.updatePassword = (req, res) => {
  // res.send('ok')
  // 根据id查询用户的信息
  const sql = 'select *from ev_users where id=?'
  // 执行sql语句
  db.query(sql, req.user.id, (err, result) => {
    if (err) return res.cc(err)
    if (result.length !== 1) return res.cc('用户不存在！')

    // 判断用户输入的旧密码与数据库中的加密密码是否一致
    const compareResult = byscript.compareSync(req.body.oldPwd, result[0].password)
    if (!compareResult) return res.cc('旧密码错误！')

    // 更新数据库中的密码

    // 定义更新密码的sql语句
    const sql = `update ev_users set password=? where id=?`
    // 对新密码进行加密处理
    const newPwd = byscript.hashSync(req.body.newPwd, 10)
    db.query(sql,[newPwd,req.user.id],(err,result)=>{
      if(err) return res.cc(err)
      // 判断影响的行数
      if(result.affectedRows!==1)  return res.cc('更新密码失败！')
      // 更新成功
      res.cc('更新密码成功',0)
    })
  })
}

// 更新用户头像的处理函数
exports.updataAvatar=(req,res)=>{
  const sql=`update ev_users set user_pic=? where id=?`
  db.query(sql,[req.body.avatar,req.user.id],(err,result)=>{
    if(err) return res.cc(err)
    if(result.affectedRows!==1) return res.cc('更换头像失败！')
    // 更换成功
    res.cc('更换头像成功！',0)
  })
}
