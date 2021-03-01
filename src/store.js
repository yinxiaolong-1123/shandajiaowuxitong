import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    refresh:'flase'
  },
  mutations: {
    listRefresh(state,show){  // 监听 state 下面的 refrsh 属性
      state.refresh = show
    }
  },
  actions: {
    listRefresh({ commit }, show) {
        commit('listRefresh', show)
    },
  }
})
