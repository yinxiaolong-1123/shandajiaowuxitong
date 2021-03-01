<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        
        <div class="cm-btn-con" style="margin:10px 5px 10px 5px">
            <el-button size="medium" type="primary" style="margin-top:15px;">保存</el-button>
            <el-button size="medium" @click="back" >返回</el-button>
        </div>
        
        <div class="table-infos">
        	<table>
        		<tr>
        			<th>学生信息</th>
                    <div class="left-line" >
            </div>
        			<th>学生反馈信息-有差异</th>
        		</tr>
        		<!-- <tr v-for="item in stuInfos">
        			<td>
        				<label class="name">{{item.fieldInfo}}: &nbsp;&nbsp;</label>
        				<span class="content">{{item.fieldName}}</span>
        			</td>
        			<td></td>
        		</tr> -->
        	</table>
            <template>
                <div>
                    <FormData> </FormData>
                </div>
            </template>
        </div>
      
        
    </section>
</template>

<script>
import util from '@/util';
import FormData from './add_student.vue';// 第一步 先使用import导入你要在该组件中使用的子组件

export default {
    name: "student_verify",
    data() {
        return {
            breadcrumb: [
                {label: "学生管理",path:"verify_manage"},
                {label: "学生信息核对修改"},
            ],
            stuid:this.$route.query.stuid,//学生id
            stuInfos:[],//学生信息
            
        }
    },
    components:{
        FormData
    },
    methods: {
        getVerifyInfo(){//学生信息
        	this.$http.get('_op:/students/'+this.stuid,{
        	}).then(data=>{
            	this.stuInfos=data.data;
            }).catch(()=>{
            })
        },
        back(){//返回上一层
        	this.$router.push({
        		name:'verify_manage'
        	})
        }
        
    },
    mounted(){
        util.resize(this);
        window.onresize=()=>{
            util.resize(this);
        };
    },
    created(){
    	this.getVerifyInfo()
    }
}
</script>

<style scoped lang="less">
.table-infos{
	width: 100%;
	table{
		width: 80%;
		th{
			width: 50%;
		}
		td{
			label,span{
				width: 50%;
			}
			label{
				text-align: right;
			}
			span{
				text-align: left;
			}
		}
	}
}
.cm-btn-con{
    width: 100%;
    height: 40px;
    background-color:#D2DCE6;
}

</style>