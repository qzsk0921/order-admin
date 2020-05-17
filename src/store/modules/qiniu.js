import * as qiniu from 'qiniu-js'
import { getQnToken, deleteFile } from "@/api/qiniu"; //七牛token

const state = {
    // qn_url: 'http://q8fjmlnxd.bkt.clouddn.com/', //外链域名
    qn_url: 'http://cdn.qiniu.qzsk.run/', //外链域名
    qn_token: null
}

const mutations = {
    SET_TOKEN(state, token) {
        state.qn_token = token
    }
}

const actions = {
    getQnToken({ commit }) {
        return new Promise((resolve, reject) => {
            getQnToken().then(res => {
                const token = res.uptoken
                commit("SET_TOKEN", token)
                resolve(token)
            }).catch(error => {
                reject(error)
            })
        })
    },
    //文档 https://developer.qiniu.com/kodo/sdk/1283/javascript
    uploadFile({ state, dispatch }, file) {
        return new Promise((resolve, reject) => {

            const token = state.qn_token
            const key = new Date().getTime() + file.name  // 上传后文件资源名以设置的 key 为主，如果 key 为 null 或者 undefined，则文件资源名会以 hash 值作为资源名。

            let config = {
                useCdnDomain: true, //表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
                region: qiniu.region.z0 //z0华东 根据具体提示修改上传地区,当为 null 或 undefined 时，自动分析上传域名区域
            };

            let putExtra = {
                fname: "",  //文件原文件名
                params: {}, //用来放置自定义变量
                mimeType: null  //用来限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
            };
            // 图片上传前压缩
            dispatch("compressImage", file).then(data => {
                let observable = qiniu.upload(data.dist, key, token, putExtra, config);
                observable.subscribe({
                    next: (result) => {
                        // 主要用来展示进度
                        console.log(result)
                    },
                    error: (error) => {
                        // 失败报错信息
                        reject(error)
                        console.log(error)
                    },
                    complete: (result) => {
                        // 接收成功后返回的信息
                        resolve(result)
                        console.log(result)
                    }
                })
            })
            // 不压缩
            // let observable = qiniu.upload(file, key, token, putExtra, config);
            // 上传开始 or var subscription = observable.subscribe(observer) 这样传参形式也可以
            // observable.subscribe({
            //     next: (result) => {
            //         // 主要用来展示进度
            //         console.log(result)
            //     },
            //     error: (error) => {
            //         // 失败报错信息
            //         reject(error)
            //         console.log(error)
            //     },
            //     complete: (result) => {
            //         // 接收成功后返回的信息
            //         resolve(result)
            //         console.log(result)
            //     }
            // })
        })
    },
    // 图片上传前压缩：
    compressImage({ }, file) {
        let options = {
            quality: 0.92,
            noCompressIfLarger: true
            // maxWidth: 1000,
            // maxHeight: 618
        }
        return qiniu.compressImage(file, options)
    },
    deleteFile({ }, imgUrl) {
        const re = /[\w]\/[\w]\S*[.]\w+/
        //获取图片名
        const key = imgUrl.match(re)[0].split("/")[1]
        return new Promise((resolve, reject) => {
            deleteFile({ key }).then(res => {
                resolve(res)
            }).catch(error => {
                reject(error)
            })
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}