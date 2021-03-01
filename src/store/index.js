import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import createPersistedState from 'vuex-persistedstate'
import getters from './getters'

Vue.use(Vuex);

const state={

};

const store = new Vuex.Store({
    state: {
        refresh:false,
        menuList:[],//pc菜单列表
        loading:false,
        btnPermitList:[],//按钮权限
        me: {},
        currentTermYear:'',
    },
    getters: getters,
    mutations: mutations,
    actions: actions,
    plugins: [createPersistedState()]
})

export default store;
