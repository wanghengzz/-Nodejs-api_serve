// 文章分类的路由模块
const express = require('express')
const router = express.Router()
// 导入文章分类的路由处理函数模块
const artCate_hanler = require('../router_handler/artcate.js')

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象
const { add_cate_schema,delete_cate_schema ,get_cate_schema,update_cate_schema} = require('../schema/artcate.js')
// 获取文章分类数据的路由
router.get('/cates', artCate_hanler.getArtCates)

// 新增文章分类的路由
router.post('/addcates',expressJoi(add_cate_schema), artCate_hanler.addArticalCates)

// 根据文章id删除分类的路由
router.get('/deletecate/:id',expressJoi(delete_cate_schema),artCate_hanler.deleteCateById)
module.exports = router

// 根据id获取文章分类的路由
router.get('/cates/:id',expressJoi(get_cate_schema),artCate_hanler.getArtById)

// 更新文章分类
router.post('/updatecate',expressJoi(update_cate_schema),artCate_hanler.updateCateById)