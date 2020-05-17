import request from '@/util/request'
/**
 * 登录
 * @param {*} data 
 */
export function login(data) {
  return request({
    // url: '/admin/user/login',
    url: '/admin/login',
    method: 'post',
    data
  })
}
/**
 *
 * 
 */
export function getInfo() {
  return request({
    url: '/admin/info',
    method: 'get',
    // params: { token }
  })
}
/**
 * header带了token
 */
export function logout() {
  return request({
    url: '/admin/logout',
    method: 'post',
  })
}
