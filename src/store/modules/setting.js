import variables from '@/style/element-variables.scss'
import defaultSetting from '@/setting'

const { showSetting, tagsView, fixedHeader, sidebarLogo } = defaultSetting

const state = {
  theme: variables.theme,
  showSetting: showSetting,
  tagsView: tagsView,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

