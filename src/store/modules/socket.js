import socket from '@/util/websocket'
import { Notification } from "element-ui";
import { speechSynthesisUtterance } from "@/util"

const state = {
  ws: null,
  ws_msg: null //返回信息
}

const mutations = {
  SET_WS(state, ws) {
    state.ws = ws
  },
  CLOSE_WS(state) {
    state.ws.close()
  },
  SET_WS_MSG(state, ws_msg) {
    state.ws_msg = ws_msg
  }
}

const actions = {
  // 创建并连接
  createWebSocket({ commit }, roles) {
    const ws = new socket({
      url: process.env.VUE_APP_WEB_SOCKET + '?role=' + roles[0],
      reconnectTimes: 0
    })
    // speechSynthesisUtterance('王さん、来ましたよ', 'ja')
    ws.onmessage(data => {
      // let dataFormat = data + "#" + new Date().getTime() //使每次数据不同
      // commit('SET_WS_MSG', dataFormat)
      const d = JSON.parse(data)
      commit('SET_WS_MSG', d)
      // type: notify提示广播,quiet静默广播
      if (d.type === 'notify') {
        Notification({
          title: "提示",
          message: d.msg,
          type: "success",
          duration: 0
        });
      }
      // 语音合成
      speechSynthesisUtterance(d.msg, 'zh-CN')
    })
    commit('SET_WS', ws)
},
  // 关闭连接
  closeWebSocket({ commit }) {
    commit('CLOSE_WS')
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions,
}