import util from '../util/axios';

const $http = util.Axios;

export default {
    initMenuAction({ commit }, list) {
        commit('initMenu', list);
    },

    listRefresh({ commit }, show) {
        commit('listRefresh', show)
    },

    // 当前学期所在的年
    initCurrentTermYear({ commit }){
        $http.get('_op:/terms/学期').then(data=>{
            if (data.code == 0) {
                let nowTerm = data.data.find(item=>item.stage==2||item.name.indexOf('当前学期')>-1);
                commit('initCurrentTermYear', nowTerm.year.toString());
            }
        });
    },
}