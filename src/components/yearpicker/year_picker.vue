<!-- 年份选择器封装 -->
<template>
    <el-date-picker
        v-model="dataPickerValue"
        type="year"
        value-format="yyyy" 
        :placeholder="placeholder"
        @change="handelChange"
        :default-value="currentTermYear"
        :clearable="clearable"
        :disabled="disabled"
        :picker-options="pickerOptions">
    </el-date-picker>
</template>

<script>
    import { mapState } from 'vuex';
    export default {
        props: {
            placeholder:{
                default:'',
                type: String,
            },
            value:{
                
            },
            clearable:{
                default:true,
                type:Boolean,
            },
            disabled:{
                default:false,
                type:Boolean,
            },
            readonly:{
                default:false,
                type:Boolean,
            },
            editable:{
                default:true,
                type:Boolean,
            },
        },
        data () {
            return {
                dataPickerValue:'',
            }
        },
        watch:{
            value(newVal){
                this.dataPickerValue = newVal;
            },
        },
        methods:{
            handelChange(newVal){
                this.$emit('input',newVal);
                this.$emit('change',newVal);
            }
            
        },
        created(){
            this.dataPickerValue = this.value;
        },
        beforeDestroy(){
			
		},
        computed: {
            ...mapState(['currentTermYear']),
            pickerOptions(){
                let pickerOptions = {shortcuts:[]};
                for(let i = 0; i < 6; i++){
                    let year = +this.currentTermYear-i+1;
                    let date1 = new Date();
                    date1.setFullYear(year);
                    pickerOptions.shortcuts.push({
                        text:year,
                        onClick(picker) {
                            picker.$emit('pick', date1);
                        }
                    });
                }
                return pickerOptions;
            },
        },
        filters:{
            
        },
    }
</script>

<style scoped>
    
</style>