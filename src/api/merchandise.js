import request from '@/util/request'

/**
 * 后台获取商品列表（上,下架）
 * @param {*} page 
 * @param {*} pageSize 
 */
export function getfoodList(page, pageSize) {
    return request({
        url: '/admin/getfoodList',
        method: 'get',
        params: { page, pageSize }
    })
}
/**
 * 删除商品
 * @param {*} id 商品id
 */
export function deleteFood(id) {
    return request({
        url: '/admin/deleteFood',
        method: 'get',
        params: { id }
    })
}
/**
 * 添加商品
 * @param {*} data
 * ------------------------------
 * @param {*} desc 商品描述
 * @param {*} name 商品名称
 * @param {*} price 商品价格
 * @param {*} status 0下架 1上架
 * @param {*} type 商品类型
 * @param {*} img 图片
 * @param {*} size: ['常规']/【{specs:'西米',price:0,packing_fee:0}】
 * @param {*} tem: ['常规'],
 * @param {*} sugar: ['常规']
 */
export function addFood(data) {
    return request({
        url: '/admin/addFood',
        method: 'post',
        data
    })
}
/**
 * 更新商品
 * @param {*} data 
 */
export function updateFood(data) {
    return request({
        url: '/admin/updateFood',
        method: 'post',
        data
    })
}
/**
 * 后台获取小零食列表 (分页或全部) 无参表示查全部
 * @param {*} page 
 * @param {*} pageSize 
 */
export function getSnackList(page, pageSize) {
    return request({
        url: '/admin/getSnackList',
        method: 'get',
        params: { page, pageSize }
    })
}
/**
 * 添加副食
 * @param {*} page 
 * @param {*} pageSize 
 */
export function addSnack(data) {
    return request({
        url: '/admin/addSnack',
        method: 'post',
        data
    })
}
/**
 * 删除副食
 * @param {*} data 
 */
export function deleteSnack(data) {
    return request({
        url: '/admin/deleteSnack',
        method: 'post',
        data
    })
}
/**
 * 更新副食
 * @param {*} data 
 */
export function updateSnack(data) {
    return request({
        url: '/admin/updateSnack',
        method: 'post',
        data
    })
}
/**
 * 获取商品分类
 */
export function getMenu() {
    return request({
        url: '/getMenu',
        method: 'get'
    })
}
/**
 * 添加商品分类
 * @param {*} data 
 * ----------------------
 * @param {*} type 商品类型
 */
export function addMenu(data) {
    return request({
        url: '/admin/addMenu',
        method: 'post',
        data
    })
}
/**
 * 删除商品分类
 * @param {*} data 
 * ------------------
 * @param {*} type 商品类型 
 * 
 */
export function deleteMenu(data) {
    return request({
        url: '/admin/deleteMenu',
        method: 'post',
        data
    })
}
/**
 * 获取广告图片
 */
export function getBanner() {
    return request({
        url: '/getBanner',
        method: 'get'
    })
}
/**
 * 添加广告图片
 * @param {*} data 
 * ----------------------
 * @param {*} img 图片地址
 */
export function addBanner(data) {
    return request({
        url: '/admin/addBanner',
        method: 'post',
        data
    })
}
/**
 * 删除广告图片
 * @param {*} data 
 * ------------------
 * @param {*} id 图片id
 * 
 */
export function deleteBanner(data) {
    return request({
        url: '/admin/deleteBanner',
        method: 'post',
        data
    })
}