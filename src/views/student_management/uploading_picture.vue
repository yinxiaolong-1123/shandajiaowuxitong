<template>
    <section class="cm-container">
		<!-- 学上照片导入页面 -->
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
		
		<div class="info-box">
			<h3>照片上传说明</h3>
			<li>选择导入照片类型</li>
			<li>选择照片所在的路径</li>
			<li>上传检查：检查上传照片是否符合规范要求(A ：格式支持：jpg、bmp ； B ：照片命名规范：学号.文件格式 例如：20180710001.jpg ； C ：照片大小建议小于2M) </li>
			<li>上传：通过上传检查后，将照片上传到服务器与学生信息进行匹配</li>
		</div>
		
		<el-form :model="form" label-width="200px">
		  	<el-form-item label="请选择导入照片类型">
			    <el-radio-group v-model="form.type">
			      <el-radio label="0">入学照片</el-radio>
			      <el-radio label="1">毕业照片</el-radio>
			    </el-radio-group>
		  	</el-form-item>
		  	<el-form-item label="请选择照片路径">
		  		<el-upload
				  class="upload-demo"
				  ref="upload"
          action="/operation/data/admin/importImage"
          :headers="headers"
				  :data={type:form.type}
				  :on-preview="handlePreview"
					 :limit="3"
					  multiple

				  :on-remove="handleRemove"
				  :file-list="form.fileList"
				  :on-success="handleAvatarSuccess"
				  :before-upload="beforeAvatarUpload"
				  >
				  <el-button size="small" type="primary" v-if="btnPerObj.upload">点击上传</el-button>
				  <div slot="tip" class="el-upload__tip">只能上传jpg/bmp/zip文件，且不超过2M, 请以学号命名文件名</div>
				</el-upload>
		  	</el-form-item>
		</el-form>
		
    </section>
</template>

<script>
	import util from '@/util'
	import {mapState} from 'vuex'//111

    export default {
        name: "student-management",
        data() {
            return {
                breadcrumb: [
                    {label: "学生管理"},
                    {label: "学生照片导入"}
                ],
                form:{
                	type:"0",
                	fileList: [],
                	studentId: ''
      
				},
				 btnPerObj:{//按钮权限
					upload:false,
				}
            }
		},
	    computed:{
    		...mapState(['btnPermitList']),//333
    		headers (){
	            return {
	                'Access_Token': util.getStorage('token'),
	                'Authorization': util.getStorage('token')
	            }
	        }
        },
        methods: {
						  //获取按钮权限
				getBtnPermit() {
						let self = this;
						let actionId=this.$route.query.actionId;
						this.$http.get('_auth:/privilege/getList/'+actionId+'/2').then(data=>{
								data.data.map(item => {
										if (item.code=="upload_check") {
											self.btnPerObj.upload=true;
										}
								});
						}).catch(()=>{
						})
				},
		    handleRemove(file, fileList) {
		      
		    },
		    handlePreview(file) {
		    
		    },
		    handleAvatarSuccess(res, file) {
		      let str = res.data.fails.toString()
		   
		      let type = "success";
		      let message = "上传成功！";
		      if(str.indexOf('学号不存在')>-1){
		         type = "error";
		         message = res.data.fails;
		         delete(file.name);
		      }
		      this.$message({
		        type:type,
		        message:message
		      })
		    },
		    beforeAvatarUpload(file) {
				
		        const isJPG = file.type === 'image/jpeg' || file.type === 'image/bmp' || file.type == 'application/x-zip-compressed';
		      
	          const isLt2M = file.size / 1024 / 1024 < 2;
	          //判断图片类型
	          if (!isJPG) {
	            this.$message.error('上传头像图片只能是JPG,bmp或者zip压缩文件格式!');
	          }
	          if (!isLt2M) {
	            this.$message.error('上传头像图片大小不能超过 2MB!');
	          }
	          // if (!isName) {
	          //   this.$message.error('上传头像图片必须是学号文件格式!');
	          // }
	          return isJPG && isLt2M;// && isName;
		    }
        },
        mounted(){
            util.resize(this);
            window.onresize=()=>{
                util.resize(this);
			};
			
            util.openBtnPermit(this.btnPerObj);
//          this.getBtnPermit();
        },
        created(){
        }
    }
</script>

<style scoped lang="less">
.info-box{border: 1px solid #DCDFE6;border-radius: 4px;padding: 10px 20px;margin-bottom: 20px;}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>