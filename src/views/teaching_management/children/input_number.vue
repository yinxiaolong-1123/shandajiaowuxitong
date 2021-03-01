<!-- 数字输入框封装 -->
<template>
    <el-input
        v-model="input"
        :placeholder="placeholder"
        :size="size"
        :disabled="disabled">
    </el-input>
</template>

<script>
    export default {
        props: {
            placeholder:{
                default:'',
                type: String,
            },
            size:{
                default:'',
                type: String,
            },
            disabled:{
                default:false,
                type: Boolean,
            },
            value:{
                default:'',
            },
            debounce:{
                default:1500,
                type: Number,
            },
            min:{
                type: Number,
            },
            max:{
                type: Number,
            },
        },
        data () {
            return {
                input:'',
                timer:'',
            }
        },
        watch:{
            value(val){
                this.handelValue(this.value);
            },
            input(val){
                this.handelChange();
            }
        },
        methods:{
            handelChange(){
                clearTimeout(this.timer);
                this.timer = setTimeout(()=>{
                    this.handelValue(this.input);
                },this.debounce);
            },

            // 对用户输入数据的处理
            handelValue(inputValue){
                let emitVal = '';
                // 先判断是否为空，为空给默认0
                if(!inputValue && inputValue!=0){
                    emitVal = 0;
                }else if(typeof(inputValue)!='number' && typeof(inputValue)!='string'){
                    emitVal = 0;
                }else{
                    // 把非数字字符过滤掉
                    emitVal = inputValue.toString();
                    emitVal = emitVal.replace(/[^\-?\d.]/g,'');

                    // 判断是否可以转换成数字，不能转换的赋值为0，能转换的转换
                    emitVal = parseFloat(emitVal);
                    if(isNaN(emitVal)){
                        emitVal = 0;
                    }else{
                        emitVal = Math.floor(emitVal * 100) / 100;
                    }
                }
                if(this.min!=undefined){
                    emitVal = emitVal<this.min?this.min:emitVal;
                }
                if(this.max!=undefined){
                    emitVal = emitVal>this.max?this.max:emitVal;
                }
                this.$emit('input', emitVal);
                this.input = emitVal;
            },
            
        },
        created(){
            this.handelValue(this.value);
        },
        beforeDestroy(){
			
		},
        computed: {

        },
        filters:{
            
        },
    }
</script>

<style scoped>
    
</style>
