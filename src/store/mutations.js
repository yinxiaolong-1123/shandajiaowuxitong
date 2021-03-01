export default {
    initMenu(state, data) { //左侧菜单
        state.menuList = data;
    },
    loadingState(state, data) {
        state.loading = data;
    },
    initBtnPermitList(state, data) { //按钮权限
        state.btnPermitList = data;
     
    },
    listRefresh(state,show){  // 监听 state 下面的 refrsh 属性
        state.refresh = show
      },
    setupMe(state, data) {
        state.me = data;
    },
    initCurrentTermYear(state,data){
        state.currentTermYear = data;
    },
}