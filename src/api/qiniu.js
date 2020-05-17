import request from '@/util/request'
/**
 * 获取七牛token 后端通过Access Key,Secret Key,bucket等生成token
 * 七牛官方sdk https://developer.qiniu.com/sdk#official-sdk
 */
export function getQnToken(data) {
  return request({
    url: '/qiniu/token',
    method: 'post',
    data
  })
}
/**
 * 删除七牛上的图片
 * @param {*} data 
 */
export function deleteFile(data) {
  return request({
    url: '/qiniu/deleteFile',
    method: 'post',
    data
  })
}
