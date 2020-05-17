import axios from 'axios'
import store from '@/store'
import { getToken } from '@/util/auth'
import { MessageBox, Message, Loading } from 'element-ui'
import router from '../router'

let loadingInstance = null
// create an axios instance
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url 只有以 VUE_APP_ 开头的变量会被 webpack.DefinePlugin 静态嵌入到客户端侧的包中

    timeout: 5000 //request timeout
})

// request interceptor
service.interceptors.request.use(
    config => {
        // 加载数据时显示动效(由于网络请求响应的速度不一样，有多个请求时可能上一个没响应又生成一个，要避免重复生成loading实例)
        if (!loadingInstance && config.url.indexOf('logout') === -1 && router.currentRoute.meta.loading) {
            // dom字符串
            let dom = router.currentRoute.meta.loading
            loadingInstance = Loading.service({
                target: dom
            })
        }

        // do something before request is sent
        if (store.getters.token) {
            // let each request carry token
            // ['X-Token'] is a custom headers key
            // please modify it according to the actual situation
            config.headers['X-Token'] = getToken()
        }
        return config
    },
    error => {
        // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
    */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
        loadingInstance ? loadingInstance.close() : null

        const res = response.data

        // if the custom code is not 0, it is judged as an error.
        if (res.code !== 0) {
            Message({
                message: res.message || 'Error',
                type: 'error',
            })

            // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
            if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
                // to re-login
                // MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
                //     confirmButtonText: 'Re-Login',
                //     cancelButtonText: 'Cancel',
                MessageBox.confirm('您已注销，您可以取消停留在此页，或重新登录', '确认注销', {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    store.dispatch('user/resetToken').then(() => {
                        location.reload()
                    })
                }).catch(e => {
                    console.log(e)
                })
                // store.dispatch('user/resetToken').then(() => {
                //     // location.reload()
                // })
            }
            return Promise.reject(new Error(res.message || 'Error'))
        } else {
            console.log(res)
            return res
        }
    },
    error => {
        console.log('err' + error) // for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service