import myYearPicker from './year_picker.vue'
import store from '../../store/index'

store.dispatch('initCurrentTermYear');
const yearPicker = {
    install: function(Vue){
        Vue.component('intelligentYearPicker',myYearPicker)
    }
}

// 导出组件
export default yearPicker