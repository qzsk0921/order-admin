import request from '@/util/request'

/**
 * 后台获取订单列表
 * @param {*} page 
 * @param {*} pageSize 
 */
export function getOrderList(page, pageSize) {
    return request({
        url: '/admin/getOrderList',
        method: 'get',
        params: { page, pageSize }
    })
}

/**
 * 更新订单状态，并向用户发送取餐消息
 * @param {*} status
 * @param {*} orderId
 */
export function updateOrderStatus(data) {
    return request({
        url: '/updateOrderStatus',
        method: 'post',
        data
    })
}
/**
 * 打印订单
 * @param {*} data
 */
export function printfOrder(data) {
    return request({
        url: '/printfOrder',
        method: 'post',
        data
    })
}