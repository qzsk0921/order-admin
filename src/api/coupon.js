import request from '@/util/request'
/**
 * 获取所有优惠活动
 * @param {*} page 
 * @param {*} pageSize 
 */
export function getCoupon(page, pageSize) {
    return request({
        url:'/getAllReduction',
        method: 'get',
        params: { page, pageSize }
    })
}
/**
 * 添加优惠活动
 * @param {*} `type`,`typeDes`,`rule`,`cut`,`startDate`,`endDate`,`status`,`img` 
 * @param {*} type 1全场满减 2单品立减
 */
export function addCoupon(data) {
    return request({
        url:'/addReduction',
        method: 'post',
        data
    })
}
