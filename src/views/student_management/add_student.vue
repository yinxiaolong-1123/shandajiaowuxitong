<template>
	<div>
		<!-----------------基本信息------------------------>
		<div class="box">
			<p class="title">基本信息</p>
			<div class="content">
				<div class="left">
					<p class="linecell">
						<label><span>*</span>学 号</label>
						<input v-model="stuNum" :disabled='addoredit'
							onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
							onbeforepaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
							class="input-reg">
					</p>
					<p class="linecell">
						<label><span>*</span>考生号</label>
						<input v-model="testNum" :disabled='addoredit'
							onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
							onbeforepaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
							class="input-reg">
					</p>
					<p class="linecell">
						<label><span>*</span>姓名</label>
						<el-input v-model="name" @change="nameChange"></el-input>
					</p>
					<p class="linecell">
						<label>拼音</label>
						<el-input v-model="spellName"></el-input>
					</p>
					<p class="linecell">
						<label>曾用名</label>
						<el-input v-model="formerName"></el-input>
					</p>
					<p class="linecell">
						<label><span>*</span>性别</label>
						<el-select v-model="sex" placeholder="请选择" clearable>
							<el-option v-for="item in sexList" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</p>
					<p class="linecell">
						<label>国籍</label>
						<el-select v-model="countryId" placeholder="请选择" clearable filterable>
							<el-option v-for="item in countryList" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</p>
					<p class="linecell">
						<label>民族</label>
						<el-select v-model="nationId" placeholder="请选择" clearable filterable>
							<el-option v-for="item in nationList" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</p>
					<p class="linecell">
						<label><span>*</span>出生日期</label>
						<el-date-picker v-model="birthday" type="date" value-format="yyyy-MM-dd" placeholder="请选择">
						</el-date-picker>
					</p>
					<p class="linecell">
						<label>出生地</label>
						<el-cascader :options="cityList" v-model="birthProvinceCityId" :disabled="selectDisabled"
							expand-trigger="hover" change-on-select filterable clearable>
						</el-cascader>
					</p>
					<p class="linecell">
						<label>籍贯</label>
						<el-cascader :options="cityList" v-model="nativeProvinceCityId" :disabled="selectDisabled"
							expand-trigger="hover" change-on-select filterable clearable>
						</el-cascader>
					</p>
					<p class="linecell">
						<label>生源地</label>
						<el-cascader :options="cityList" v-model="sourceProvinceCityId" :disabled="selectDisabled"
							expand-trigger="hover" change-on-select filterable clearable>
						</el-cascader>
					</p>
					<p class="linecell">
						<label>政治面貌</label>
						<el-select v-model="politicsStatusId" :disabled="selectDisabled" placeholder="请选择" clearable
							filterable>
							<el-option v-for="item in politicalList" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</p>
					<p class="linecell">
						<label>健康状况</label>
						<el-select v-model="healthStatusId" placeholder="请选择" clearable filterable>
							<el-option label="良好" value="1"> </el-option>
							<el-option label="残疾" value="2"> </el-option>
						</el-select>
					</p>
					<p class="linecell">
						<label><span>*</span>证件号</label>
						<!-- <el-input v-model="cardNum" :disabled='!cardNumEditable' @change="verifyFn('cardNum')"
							placeholder="证件号限制18位"></el-input> -->
							<el-input v-model="cardNum" @change="verifyFn('cardNum')"
							placeholder="证件号限制18位"></el-input>
					</p>
					<p class="linecell">
						<label>户口性质</label>
						<el-select v-model="registerTypeId" :disabled="selectDisabled" placeholder="请选择" clearable>
							<el-option v-for="item in registerList" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</p>
					<p class="linecell">
						<label>应往届</label>
						<el-select v-model="stuModelId" placeholder="请选择" clearable>
							<el-option v-for="item in stuModelList" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</p>
					<p class="linecell">
						<label>电子邮件</label>
						<el-input v-model="email" @blur="filterEmail"></el-input>
					</p>
					<p class="linecell">
						<label>微信</label>
						<el-input v-model="wechat"></el-input>
					</p>
					<p class="linecell">
						<label>QQ</label>
						<input v-model="qq"
							onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
							onbeforepaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
							class="input-reg">
					</p>
				</div>
				<div class="right">
					<div class="imgbox">
						<el-upload class="avatar-uploader" action="operation/data/admin/uploadFile"
							:show-file-list="false" :headers="headers" :on-success="handleAvatarSuccess"
							:before-upload="beforeAvatarUpload">
							<img v-if="headUrl" :src="headUrl" class="avatar">
							<i v-else class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
						<div class="btnbox"> 上传照片(上传头像图片只能是 JPG/bmp 格式!上传头像图片大小不能超过 2MB!) </div>
					</div>
					<p class="linecell">
						<label>入学方式</label>
						<el-select v-model="entrance" :disabled="selectDisabled" placeholder="请选择" clearable filterable>
							<el-option v-for="way in admissionWay" :label="way.name" :value="way.id" :key="way.id"> </el-option>
						</el-select>
					</p>
					<p class="linecell">
						<label><span>*</span>证件类型</label>
						<!-- <el-select v-model="cardTypeId" :disabled='!cardNumEditable' placeholder="请选择" clearable
							filterable>
							<el-option v-for="item in idCategoryList" :key="item.id" :label="item.name"
								:value="item.id">
							</el-option>
						</el-select> -->
						<el-select v-model="cardTypeId" placeholder="请选择" clearable
							filterable>
							<el-option v-for="item in idCategoryList" :key="item.id" :label="item.name"
								:value="item.id">
							</el-option>
						</el-select>
					</p>
					<p class="linecell">
						<label>户口所在地</label>
						<el-cascader :options="cityList" v-model="registerProvinceCityId" :disabled="selectDisabled"
							expand-trigger="hover" change-on-select filterable clearable>
						</el-cascader>
					</p>
					<p class="linecell">
						<label>手机号码</label>
						  <!-- <el-input v-model="mobile" :disabled='showmobile' @blur="filterMobile(1)"></el-input> -->
						  <el-input v-model="mobile" @blur="filterMobile(1)"></el-input>
					</p>
					<p class="linecell">
						<label>学生特征</label>
						<el-select v-model="stuFeatureId" placeholder="请选择" clearable filterable>
							<el-option v-for="item in stufeatureList" :key="item.id" :label="item.name"
								:value="item.id">
							</el-option>
						</el-select>
					</p>
				</div>
			</div>
			<p class="bottom">
				<label>备注</label>
				<el-input v-model="remark"></el-input>
			</p>
		</div>
		<!-----------------家庭信息------------------------>
		<div class="box">
			<p class="title">家庭信息</p>
			<div class="contentline">
				<p class="linecell">
					<!-- <label><span>*</span>父母或监护人1</label> -->
					<label>父母或监护人1</label>
					
					<el-input v-model="contactPerson"></el-input>
				</p>
				<!-- <p class="linecell">
					<label><span>*</span>证件类型</label>
					<el-select v-model="onecardTypeId" placeholder="请选择" clearable filterable>
						<el-option 
							v-for="item in idCategoryList" 
							:key="item.id" 
							:label="item.name" 
							:value="item.id"> 
						</el-option>
					</el-select>
				</p> -->
				<p class="linecell">
					<!-- <label><span>*</span>证件类型</label> -->
					<label>证件类型</label>
					<el-select v-model="oneCardTypeId" placeholder="请选择" clearable filterable>
						<el-option v-for="item in idCategoryList" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</p>
				<p class="linecell">
					<!-- <label><span>*</span>证件号码</label> -->
					<label>证件号码</label>
					<el-input v-model="oneCardNum" @change="verifyFn('cardNum')"></el-input>
				</p>
				<p class="linecell">
					<label>联系电话</label>
					<el-input v-model="contactTel" @blur="filterMobile(2)"></el-input>
				</p>
				<p class="linecell">
					<label>邮政编码</label>
					<el-input v-model="postalCode" @blur="filterPostalcode"></el-input>
				</p>
				<p class="linecell">
					<label>家庭住址</label>
					<el-input v-model="address"></el-input>
				</p>
				<p class="linecell">
					<label>父母或监护人2</label>
					<el-input v-model="twoContactPerson"></el-input>
				</p>
				<!-- <p class="linecell">
					<label><span>*</span>证件类型</label>
					<el-select v-model="twoCardTypeId" placeholder="请选择" clearable filterable>
						<el-option 
							v-for="item in idCategoryList" 
							:key="item.id" 
							:label="item.name" 
							:value="item.id"> 
						</el-option>
					</el-select>
				</p> -->
				<p class="linecell">
					<label>证件类型</label>
					<el-select v-model="twoCardTypeId" placeholder="请选择" clearable filterable>
						<el-option v-for="item in idCategoryList" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</p>
				<p class="linecell">
					<label>证件号码</label>
					<el-input v-model="twoCardNum" @change="verifyFn('cardNum')"></el-input>
				</p>
				<p class="linecell">
					<label>联系电话</label>
					<el-input v-model="twoContactTel" @blur="filterMobile(2)"></el-input>
				</p>
				<p class="linecell">
					<label>邮政编码</label>
					<el-input v-model="twoPostalCode" @blur="filterPostalcode"></el-input>
				</p>
				<p class="linecell">
					<label>家庭住址</label>
					<el-input v-model="twoAddress"></el-input>
				</p>
			</div>
			<!-- <p class="bottom">
				<label>家庭住址</label>
				<el-input v-model="address"></el-input>
			</p> -->
		</div>

		<!-----------------学籍信息------------------------>
		<div class="box">
			<p class="title"><span>*</span>学籍信息</p>
			<div class="content">
				<div class="left">
					<p class="linecell">
						<label><span>*</span>入学日期</label>
						<el-date-picker v-model="enrollmentDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择"
							@change="enrollmentDateChange"> </el-date-picker>
					</p>
					<p class="linecell">
						<label><span>*</span>所在级</label>
						<intelligent-year-picker :disabled="editChecked" v-model="enrollmentYear" type="year" value-format="yyyy" placeholder="请选择"
							@change="getAdministrative"> </intelligent-year-picker>
					</p>
					<p class="linecell">
						<label>学制</label>
						<el-select v-model="eduNumId" placeholder="请选择" clearable filterable>
							<el-option v-for="item in schoolingList" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</p>
					<p class="linecell">
						<label>修业年限</label>
						<el-select v-model="studyNumId" placeholder="请选择" @change="yearListFind" clearable>
							<el-option v-for="item in yearList" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</p>
					<p class="linecell">
						<label>学习形式</label>
						<el-select v-model="studyModelId" placeholder="请选择" clearable filterable>
							<el-option v-for="item in learFormList" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</p>
					<p class="linecell">
						<label>层次</label>
						<el-select v-model="stageId" placeholder="请选择" clearable filterable>
							<el-option v-for="item in educationalList" :key="item.id" :label="item.name"
								:value="item.id">
							</el-option>
						</el-select>
					</p>
					<p class="linecell">
						<label>办学类型</label>
						<el-select v-model="eduTypeId" placeholder="请选择" clearable filterable>
							<el-option v-for="item in schoolRunType" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</p>
					<p class="linecell">
						<label>预计毕业日期</label>
						<el-date-picker v-model="expectDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择">
						</el-date-picker>
					</p>
					<p class="linecell">
						<label>学籍状态</label>
						<el-select :disabled="editChecked" v-model="status" placeholder="请选择" clearable filterable>
							<el-option label="在籍" value="1"> </el-option>
							<el-option label="非在籍" value="2"> </el-option>
							<el-option label="休学" value="4"></el-option>
							<el-option label="保留学籍" value="12"></el-option>
						</el-select>
					</p>
					<p class="linecell">
						<label>毕业/结业</label>
						<el-select v-model="graduationStatus" placeholder="请选择" clearable filterable>
							<el-option label="毕业" value="1"> </el-option>
							<el-option label="结业" value="2"> </el-option>
						</el-select>
					</p>
					<p class="linecell">
						<label>毕业日期</label>
						<el-date-picker v-model="graduationDate" type="date" value-format="yyyy-MM-dd"
							placeholder="请选择"> </el-date-picker>
					</p>
					<p class="linecell">
						<label>毕业证书编号</label>
						<el-input v-model="graduationNum"></el-input>
					</p>
					<p class="linecell">
						<label>获学位日期</label>
						<el-date-picker v-model="diplomaDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择">
						</el-date-picker>
					</p>
					<p class="linecell">
						<label>学位证书编号</label>
						<el-input v-model="diplomaNum"></el-input>
					</p>
				</div>

				<div class="right">
					<p class="linecell">
						<label><span>*</span>所在专业</label>
						<el-select :disabled="editChecked" v-model="majorId" placeholder="请选择" clearable filterable @change="getAdministrative">
							<el-option v-for="item in majorList" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</p>
					<p class="linecell">
						<label><span>*</span>所在行政班</label>
						<el-select :disabled="editChecked" v-model="administrativeClassId"
							:placeholder=" !majorId||!enrollmentYear ?'请选择行政班':'请选择'" clearable filterable>
							<el-option v-for="item in administrativeList" :key="item.id"
								:label=" item.grade +'-'+ item.name " :value="item.id">
							</el-option>
						</el-select>
					</p>
					<p v-if="stuInfo.dialogStatus == '新增'">
						<el-checkbox-group v-model="checkedlist" @change="studentStatusCheck">
							<el-checkbox v-for="(item,index) in eduCheckList" :disabled="index>1" :key="item.value" :label="item.value" v-show="index<2">{{ item.prop }}</el-checkbox>
						</el-checkbox-group>
						
					</p>
					<p v-if="stuInfo.dialogStatus != '新增'">
						<el-checkbox-group v-model="checkedlist" @change="studentStatusCheck">
							<el-checkbox :disabled="item.checked" v-for="(item,index) in eduCheckList" :key="item.value" :label="item.value">{{ item.prop }}</el-checkbox>
						</el-checkbox-group>
					</p>
					<p class="linecell">
						<label>决议编号</label>
						<el-input v-model="decisionNum"></el-input>
					</p>
				</div>
			</div>
		</div>

		<!-----------------上一层次信息------------------------>
		<div class="box">
			<p class="title">上一级信息</p>
			<div class="contentline">
				<p class="linecell">
					<label>上一层次</label>
					<el-select v-model="provStageId" placeholder="请选择" clearable filterable>
						<el-option v-for="item in educationalList" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</p>
				<p class="linecell">
					<label>招生季节</label>
					<el-select v-model="seasonId" placeholder="请选择" clearable>
						<el-option v-for="item in seasonList" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</p>
				<p class="linecell">
					<label>毕业学校</label>
					<el-input v-model="graduationSchool"></el-input>
				</p>
				<p class="linecell">
					<label>毕业类型</label>
					<el-select v-model="graduationType" placeholder="请选择">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>

					<!-- <el-input v-model="graduationType" placeholder="初中/高中/大学"></el-input> -->
				</p>
				<p class="linecell">
					<label>高考成绩</label>
					<input v-model="score"
						onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
						onbeforepaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
						class="input-reg">
				</p>
			</div>
		</div>


		<div class="dialog-bottom">
			<el-button @click="cancelDialog">取消</el-button>
			<el-button type="primary" @click="save">保存</el-button>
		</div>

	</div>
</template>

<script>
	import util from '@/util'
	import moment from 'moment'
	import $ from 'jquery'
import { debug } from 'util';
	const parametersList = ["sex-code", "political-status", "ID-category", "learning-form", "schooling-length",
		"educational-level", "school-running", "student-feature", "nation-code", "student-modal", "register-type",
		"admissions-season", "study-year", "education-modality"
	];
	export default {
		name: "student-management",
		props: {
			stuInfo: Object,
			dialogFormVisible: '',
			editChecked: Boolean
		},
		data() {
			return {
				showChecked:true,//异动学生状态
				showmobile: false,
				cardNumEditable: true,
				addoredit: '',
				options: [{
					value: '初中',
					label: '初中'
				}, {
					value: '高中',
					label: '高中'
				}, {
					value: '大学',
					label: '大学'
				}],
				admissionWay: [],
				value: '',
				/*基本信息*/
				stuNum: '', //学号
				testNum: '', //考号
				name: '', //姓名
				spellName: '', //拼音
				formerName: '', //曾用名
				sex: '', //性别
				countryId: '', //国籍
				nationId: '', //民族
				birthday: '', //出生日期
				birthProvinceCityId: [], //出生地*
				nativeProvinceCityId: [], //籍贯*
				sourceProvinceCityId: [], //生源地*
				politicsStatusId: '', //政治面貌
				healthStatusId: '', //健康状况
				cardNum: '', //证件号
				registerTypeId: '', //户口性质
				stuModelId: '', //往应届
				email: '', //电子邮件
				wechat: '', //微信
				qq: '', //QQ
				remark: '', //备注


				headUrl: '', //照片
				entrance: '', //入学方式
				cardTypeId: '', //证件类型
				registerProvinceCityId: [], //户口所在地*
				mobile: '', //手机号码
				stuFeatureId: '', //考生特征


				/*家庭信息*/
				contactPerson: '', //父/母联系人1
				oneCardTypeId: '', //证件类型1 
				oneCardNum: '', //证件号码1
				contactTel: '', //联系电话1
				postalCode: '', //邮政编码1
				address: '', //家庭地址1

				twoContactPerson: '', //父/母联系人2
				twoCardTypeId: '', //证件类型2 
				twoCardNum: '', //证件号码2
				twoContactTel: '', //联系电话2
				twoPostalCode: '', //邮政编码2
				twoAddress: '', //家庭地址2


				/*学籍信息*/
				enrollmentDate: '', //入学日期
				enrollmentYear: '', //所在级
				eduNumId: '', //学制
				studyNumId: '', //修业年限
				studyModelId: '', //学习形式
				stageId: '', //层次
				eduTypeId: '', //办学类型
				expectDate: '', //预计毕业日期
				status: '', //学籍状态
				graduationStatus: '', //毕业/结业
				graduationDate: '', //毕业日期
				graduationNum: '', //毕业证书
				diplomaDate: '', //获学位日期
				diplomaNum: '', //学位证书

				headUrl: '', //照片
				majorId: '', //所在专业
				administrativeClassId: '', //所在行政班
				eduCheckList: [{
						checked: false,
						value: 0,
						prop: '本硕连读'
					},
						{
						checked: true,
						value: 1,
						prop: ' 院外转入'
					},
					{
						checked: true,
						value: 2,
						prop: '保留学籍'
					},
					{
						checked: true,
						value: 3,
						prop: '院内转出'
					},
					
					{
						checked: true,
						value:4,
						prop: '休学标识'
					},
					{
						checked: true,
						value: 5,
						prop: '退学标识'
					},
					{
						checked: true,
						value: 6,
						prop: '降级标识'
					},
					{
						checked: true,
						value: 7,
						prop: '复学标识'
					}
					
				],
				checkedlist: [],
				eduModalityId: [], //标识
				decisionNum: '', //决议编号


				/*上一级信息*/
				provStageId: '', //上一层次
				seasonId: '', //招生季节
				graduationSchool: '', //毕业学校
				graduationType: '', //毕业类型
				score: '', //高考成绩

				loginName: '',
				/*其它data*/
				sexList: [], //性别
				countryList: [], //国家
				nationList: [], //民族
				politicalList: [], //政治面貌
				idCategoryList: [], //证件类型
				learFormList: [], //学习形式
				schoolingList: [], //学制
				educationalList: [], //学历层次
				schoolRunType: [], //办学类型
				stufeatureList: [], //学生特征
				stuModelList: [], //往应届
				registerList: [], //户口性质
				seasonList: [], //招生季节
				yearList: [], //修业年限
				modalityList: [], //复选框选项

				cityList: [], //城市树
				majorList: [], //专业
				administrativeList: [], //行政班

				selectDisabled: false, //与国籍关联的选项

			}
		},
		watch: {
			
			stuInfo: function (newval) {
				
				// debugger
				// onsole.log(newval,"???")
				if (newval && newval.id) {
					// debugger
					this.initParameters(newval)
					this.addoredit = true;
				} else {
					// debugger
					this.addoredit = false;
					this.cancel();
				}
				if(newval.cardNum){
					this.cardNumEditable = (newval.cardNum.trim() == '');
				}
			},
			dialogFormVisible: function () {
		
				if (this.stuInfo.dialogStatus == "新增") {
					this.addoredit = false;
					this.eduCheckList.map(function (item2,index) {
							item2.checked = false;
					})
				} else {
					this.addoredit = true
				}
				if(this.stuInfo.cardNum){
					this.cardNumEditable = (this.stuInfo.cardNum.trim() == '');
				}
				this.cardNumEditable = ($.trim(this.stuInfo.cardNum )== '');
			},
			countryId: function (newval) {
				let code = '';
				this.countryList.map(function (item) {
					if (item.id == newval) {
						code = item.code;
					}
				})

				if (code && code == '001') {
					this.selectDisabled = false;
				} else {
					this.selectDisabled = false;
					// this.birthProvinceCityId = []; //出生地*
					// this.nativeProvinceCityId = []; //籍贯*
					// this.sourceProvinceCityId = []; //生源地*
					// this.entrance = ''; //入学方式
					// this.politicsStatusId = ''; //政治面貌
					// this.registerTypeId = ''; //户口性质
					// this.stuModelId = ''; //往应届
					// this.registerProvinceCityId = []; //户口所在地*
				}
			}
		},
		computed: {
			headers() {
				return {
					'Authorization': util.getStorage('token'),
					'Access_Token': util.getStorage('token')
				}
			}
		},
		mounted() {
			util.resize(this);
			window.onresize = () => {
				util.resize(this);
			};
		},
		created() {
			this.$authorize.me().then(res => {
				this.loginName = res.user.name
			});
			let self = this;
			parametersList.map(function (item) {
				self.getDictsList(item)
			});

			this.getCityTree();
			this.getMajorCategory();

			this.getCountry()
			if (this.stuInfo.dialogStatus == "新增") {
				this.addoredit = false
			} else {
				this.addoredit = true
			}
			this.cardNumEditable = ($.trim(this.stuInfo.cardNum )== '');
			this.getSchoolWay()

		},
		methods: {
			studentStatusCheck(val) { //新增方法退学方法
				if(this.checkedlist.length){
					let lastest = this.checkedlist[this.checkedlist.length-1];
					if(lastest == 0 || lastest == 1 || lastest == 6 || lastest == 7){
						this.status = '1';
					}else if(lastest == 3 || lastest == 5){
						this.status = '2';
					}else if(lastest == 4){
						this.status = '4';
					}else if(lastest == 2){
						this.status = '12';
					}
				}
			},
			yearListFind(val) {
				this.schoolingList.map((item) => {
					if (this.eduNumId === item.id) {
						let num = item.name.substring(0, item.name.substring.length - 1);
						this.yearList.map((list) => {
							let strY = list.name.substring(0, list.name.substring.length - 1);
							if (val == list.id && strY < num) {
								this.$message.error('修业年限不能小于学制！')
							}
						})

					}

				})



			},
			filterEmail() { //邮箱正则校验
				let reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
				if (!reg.test(this.email)) {
					this.email = '';
					this.$message.error('请正确填写邮箱！');
				}
			},
			filterMobile(val) { //手机号码正则校验 mobile：学生手机号码，p-mobile:父母联系人手机
				let reg = /^1[3|4|5|7|8][0-9]{9}$/;
				if (val === 1 && !reg.test(this.mobile)) {
					this.mobile = '';
					this.$message.error('请正确填写手机号码！');
				} else if (val === 2 && !reg.test(this.contactTel)) {
					this.contactTel = '';
					this.$message.error('请正确填写联系人手机号码！');
				}
			},
			filterPostalcode(val) { //邮政编码正则校验
				let reg = /^[1-9][0-9]{5}$/;
				if (!reg.test(this.postalCode)) {
					this.postalCode = '';
					this.$message.error('请正确填写邮政编码！');
				}
			},
			verifyFn(type) {
				if (type == 'cardNum' && this.cardNum.length > 18) {
					this.cardNum = this.cardNum.substring(0, 18);
					this.$message({
						message: '证件号长度不能多于18位',
						type: 'warning'
					});
				}
			},
			enrollmentDateChange(val) {
				this.enrollmentYear = val
			},
			nameChange(val) {
				if (val) {
					this.$http.get('_op:pingying/' + val).then(data => {
						this.spellName = data.data
					}).catch(() => {})
				}

			},

			getDictsList(type) { //字典查询
				this.$http.post('_op:/dicts/getDictsList', {
					type: type
				}).then(data => {
					if (type === "sex-code") {
						this.sexList = data.data;
					} else if (type === "country-code") {
						this.countryList = data.data;
					} else if (type === "political-status") {
						this.politicalList = data.data;
					} else if (type === "ID-category") {
						this.idCategoryList = data.data;
					} else if (type === "learning-form") {
						this.learFormList = data.data;
					} else if (type === "schooling-length") {
						this.schoolingList = data.data;
					} else if (type === "educational-level") {
						this.educationalList = data.data;
						
					} else if (type === "school-running") {
						this.schoolRunType = data.data;
					} else if (type === "student-feature") {
						this.stufeatureList = data.data;
					} else if (type === "nation-code") {
						this.nationList = data.data;
					} else if (type == "student-modal") {
						this.stuModelList = data.data;
					} else if (type == "register-type") {
						this.registerList = data.data;
					} else if (type == "admissions-season") {
						this.seasonList = data.data;
					} else if (type == "study-year") {
						this.yearList = data.data;
					} else if (type == "education-modality") {
						this.modalityList = data.data;
					}
				
				}).catch(() => {})
			},
			getCountry() { //国家查询
				this.$http.get('_op:/dicts/combox/country-code').then(data => {
					this.countryList = data.data;
					for (let i = 0; i < this.countryList.length; i++) {
						if (this.countryList[i].code == '001') {
							this.countryId = this.countryList[i].id;
						}
					}
					if (this.stuInfo.id) {
						this.initParameters(this.stuInfo);
					}

				}).catch(() => {})
			},
			// 获取入学方式
			getSchoolWay() {
				this.$http.post('_op:/dicts/getDictsList',{
					type: "entrance"
				}).then(res => {
					this.admissionWay = res.data
					this.admissionWay.forEach(item => {
						item.id = item.id.toString()
					});
				})
			},
			getCityTree() { //地点树
				let self = this;
				this.$http.get('_op:/province/city/tree/1').then(data => {
					self.cityList = this.mapTree(data.data.children)
				}).catch(() => {})
			},
			mapTree(children) {
				let self = this;
				let objlist = [];
				if (children.length > 0) {
					children.map(function (item) {
						if (item.children && item.children.length > 0) {
							objlist.push({
								value: item.id.toString(),
								//								value:item.cnName,
								label: item.cnName,
								children: self.mapTree(item.children)
							})
						} else {
							objlist.push({
								value: item.id.toString(),
								//								value:item.cnName,
								label: item.cnName
							})
						}
					})
				}
				return objlist;
			},

			getMajorCategory() { //专业
				this.$http.get('_op:/major/combox').then(data => {
					this.majorList = data.data
				}).catch(() => {})
			},
			getAdministrative() { //行政班
				let year = this.enrollmentYear.substr(0, 4);
				if (this.majorId != '' && this.enrollmentYear != '') {
					this.$http.get('_op:/administrative/class/list/' + year + '/' + this.majorId).then(data => {
						this.administrativeList = data.data;

					}).catch(() => {})
				}
			},
			handleAvatarSuccess(res, file) {
				let host = window.location.host;
				this.headUrl = `${res.data.url}`;
				if (res.code == 0) {
					this.$message.success("上传成功！");
				} else {
					this.$message.error(res.msg);
				}
			},
			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg' || file.type === 'image/bmp';
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isJPG) {
					this.$message.error('上传头像图片只能是 JPG和bmp 格式!');
				}
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isJPG && isLt2M;
			},
			handleRemove(file, fileList) {
				
			},

			cancel() {
				/*基本信息*/
				this.stuNum = ''; //学号
				this.testNum = ''; //考号
				this.name = ''; //姓名
				this.spellName = ''; //拼音
				this.formerName = ''; //曾用名
				this.sex = ''; //性别
				this.countryId = ''; //国籍
				this.nationId = ''; //民族
				this.birthday = ''; //出生日期
				this.birthProvinceCityId = []; //出生地*
				this.nativeProvinceCityId = []; //籍贯*
				this.sourceProvinceCityId = []; //生源地*
				this.politicsStatusId = ''; //政治面貌
				this.healthStatusId = ''; //健康状况
				this.cardNum = ''; //证件号
				this.registerTypeId = ''; //户口性质
				this.stuModelId = ''; //往应届
				this.email = ''; //电子邮件
				this.wechat = ''; //微信
				this.qq = ''; //QQ
				this.remark = ''; //备注


				this.headUrl = ''; //照片
				this.entrance = ''; //入学方式
				this.cardTypeId = ''; //证件类型
				this.registerProvinceCityId = []; //户口所在地*
				this.mobile = ''; //手机号码
				this.stuFeatureId = ''; //考生特征


				/*家庭信息*/
				this.contactPerson = ''; //父/母联系人
				this.contactTel = ''; //联系电话
				this.postalCode = ''; //邮政编码
				this.address = ''; //家庭地址


				/*学籍信息*/
				this.enrollmentDate = ''; //入学日期
				this.enrollmentYear = ''; //所在级
				this.eduNumId = ''; //学制
				this.studyNumId = ''; //修业年限
				this.studyModelId = ''; //学习形式
				this.stageId = ''; //层次
				this.eduTypeId = ''; //办学类型
				this.expectDate = ''; //预计毕业日期
				this.status = ''; //学籍状态
				this.graduationStatus = ''; //毕业/结业
				this.graduationDate = ''; //毕业日期
				this.graduationNum = ''; //毕业证书
				this.diplomaDate = ''; //获学位日期
				this.diplomaNum = ''; //学位证书

				this.majorId = ''; //所在专业
				this.administrativeClassId = ''; //所在行政班
				this.decisionNum = ''; //决议编号


				/*上一级信息*/
				this.provStageId = ''; //层次
				this.seasonId = ''; //招生季节
				this.graduationSchool = ''; //毕业学校
				this.graduationType = ''; //毕业类型
				this.score = ''; //高考成绩
			},
			verifyParameters() {
				var self = this;
				if (this.stuNum == '') {
					this.$message({
						message: '请填写学号',
						type: 'warning'
					});
					return false;
				}
				if (this.testNum == '') {
					this.$message({
						message: '请填写考号',
						type: 'warning'
					});
					return false;
				}
				if (this.name == '') {
					this.$message({
						message: '请填写姓名',
						type: 'warning'
					});
					return false;
				}
				if (this.sex == '') {
					this.$message({
						message: '请选择性别',
						type: 'warning'
					});
					return false;
				}

				if (this.birthday == '' || this.birthday == null) {
					this.$message({
						message: '请选择出生日期',
						type: 'warning'
					});
					return false;
				}

				if (this.cardTypeId == '') {
					this.$message({
						message: '请选择证件类型',
						type: 'warning'
					});
					return false;
				}

				if (this.cardNum == '') {
					this.$message({
						message: '请填写证件号码',
						type: 'warning'
					});
					return false;
				}

				//验证监护人信息
				// if (this.contactPerson == '') {
				// 	this.$message({
				// 		message: '请填写监护人名称',
				// 		type: 'warning'
				// 	});
				// 	return false;
				// }
				// if (this.oneCardTypeId == '') {
				// 	this.$message({
				// 		message: '请选择证件类型',
				// 		type: 'warning'
				// 	});
				// 	return false;
				// }

				// if (this.oneCardNum == '') {
				// 	this.$message({
				// 		message: '请填写证件号码',
				// 		type: 'warning'
				// 	});
				// 	return false;
				// }

				if (this.enrollmentDate == '') {
					this.$message({
						message: '请选择入学日期',
						type: 'warning'
					});
					return false;
				}

				if (this.enrollmentYear == '') {
					this.$message({
						message: '请选择所在级',
						type: 'warning'
					});
					return false;
				}

				if (this.majorId == '') {
					this.$message({
						message: '请选择专业',
						type: 'warning'
					});
					return false;
				}

				if (this.administrativeClassId == '') {
					this.$message({
						message: '请选择行政班',
						type: 'warning'
					});
					return false;
				} else {
					this.administrativeList.map(function (item) {
						if (self.administrativeClassId == item.id) {
							self.className = item.name
						}
					})
				}
				let arr = [0,0,0,0,0,0,0,0];
				this.checkedlist.map(item => {
					let n = Number(item);
					arr[n] = 1;
				})
				this.eduModalityId = arr;
			},
			cancelDialog() {
				// this.addoredit=false;
				// this.cancel();
				this.$emit('closeDialog')
			},
			save() {
				//this.yearListFind(this.studyNumId);
				if (this.verifyParameters() == false) {
					return false
				}

				this.enrollmentYear = this.enrollmentYear.substr(0, 4)

				//毕业日期不能小于入学日期
				let enrollData, graduateData;
				enrollData = this.enrollmentDate.split("-");
				graduateData = this.graduationDate.split("-");
				if (this.graduationDate && (graduateData[0] <= enrollData[0])) {
					this.$message.warning("毕业日期填写有误！")
					return;
				}

				let birth, nativeProvinceCity, sourceProvinceCity, registerProvinceCity;
				//出生地
				birth = this.birthProvinceCityId[this.birthProvinceCityId.length - 1];
				//籍贯
				nativeProvinceCity = this.nativeProvinceCityId[this.nativeProvinceCityId.length - 1];
				//生源地
				sourceProvinceCity = this.sourceProvinceCityId[this.sourceProvinceCityId.length - 1];
				//户口所在地
				registerProvinceCity = this.registerProvinceCityId[this.registerProvinceCityId.length - 1];

				let self = this;
				// self.eduModalityId = this.checkedlist;

				let parameters = {
					/*基本信息*/
					creater: this.loginName,
					stuNum: this.stuNum, //学号
					testNum: this.testNum, //考号
					name: this.name, //姓名
					spellName: this.spellName, //拼音
					formerName: this.formerName, //曾用名
					sex: parseInt(this.sex), //性别
					countryId: parseInt(this.countryId), //国籍
					nationId: parseInt(this.nationId), //民族
					birthday: this.birthday, //出生日期
					birthProvinceCityId: birth, //出生地*
					nativeProvinceCityId: nativeProvinceCity, //籍贯*
					sourceProvinceCityId: sourceProvinceCity, //生源地*
					politicsStatusId: parseInt(this.politicsStatusId), //政治面貌
					healthStatusId: parseInt(this.healthStatusId), //健康状况
					cardNum: this.cardNum, //证件号
					registerTypeId: parseInt(this.registerTypeId), //户口性质
					stuModelId: parseInt(this.stuModelId), //往应届
					email: this.email, //电子邮件
					wechat: this.wechat, //微信
					qq: this.qq, //QQ
					remark: this.remark, //备注

					headUrl: this.headUrl, //照片
					entrance: this.entrance, //入学方式
					cardTypeId: parseInt(this.cardTypeId), //证件类型
					registerProvinceCityId: registerProvinceCity, //户口所在地*
					mobile: this.mobile, //手机号码
					stuFeatureId: parseInt(this.stuFeatureId), //考生特征


					/*家庭信息*/
					contactPerson: this.contactPerson, //父/母联系人
					oneCardTypeId: this.oneCardTypeId, //证件类型1 
					oneCardNum: this.oneCardNum, //证件号码1
					contactTel: this.contactTel, //联系电话
					postalCode: this.postalCode, //邮政编码
					address: this.address, //家庭地址

					twoContactPerson: this.twoContactPerson, //父/母联系人2
					twoCardTypeId: this.twoCardTypeId, //证件类型2 
					twoCardNum: this.twoCardNum, //证件号码2
					twoContactTel: this.twoContactTel, //联系电话2
					twoPostalCode: this.twoPostalCode, //邮政编码2
					twoAddress: this.twoAddress, //家庭地址2


					/*学籍信息*/
					enrollmentDate: this.enrollmentDate, //入学日期
					enrollmentYear: parseInt(this.enrollmentYear), //所在级
					eduNumId: parseInt(this.eduNumId), //学制
					studyNumId: parseInt(this.studyNumId), //修业年限
					studyModelId: parseInt(this.studyModelId), //学习形式
					stageId: parseInt(this.stageId), //层次
					eduTypeId: parseInt(this.eduTypeId), //办学类型
					expectDate: this.expectDate, //预计毕业日期
					status: parseInt(this.status), //学籍状态
					graduationStatus: this.graduationStatus, //毕业/结业
					graduationDate: this.graduationDate, //毕业日期
					graduationNum: this.graduationNum, //毕业证书
					diplomaDate: this.diplomaDate, //获学位日期
					diplomaNum: this.diplomaNum, //学位证书

					majorId: parseInt(this.majorId), //所在专业
					administrativeClassId: parseInt(this.administrativeClassId), //所在行政班
					eduModalityId: this.eduModalityId,
					decisionNum: this.decisionNum, //决议编号

					/*上一级信息*/
					provStageId: parseInt(this.provStageId), //层次
					seasonId: parseInt(this.seasonId), //招生季节
					graduationSchool: this.graduationSchool, //毕业学校
					graduationType: this.graduationType, //毕业类型
					score: parseInt(this.score), //高考成绩
				};
				if (this.stuInfo.id) {
					parameters.id = this.stuInfo.id;
					this.$http.put('_op:/students', parameters).then(data => {
						let type = "success";
						let message = `${this.stuInfo.dialogStatus == '新增' ? '新增' : '编辑'}成功！`;
						if (data.code == 0) {
							this.cancel();
							this.$emit("getTableData")
							this.$emit('closeDialog')
						} else {
							type = "error";
							message = data.msg;
						}
						this.$message({
							type: type,
							message: message
						})
					}).catch(() => {})
				} else {
					this.$http.post('_op:/students', parameters).then(data => {
						let type = "success";
						let message = `${this.stuInfo.dialogStatus == '新增' ? '新增' : '编辑'}成功！`;
						if (data.code == 0) {
							this.cancel();
							this.$emit("getTableData")
							this.$emit('closeDialog')
						} else {
							type = "error";
							message = data.msg;
						}
						this.$message({
							type: type,
							message: message
						})
					}).catch(() => {})
				}
			},
			idToString(list) {
				list.map(item => {
					item.toString();
				})
				return list.reverse();
			},
		
			initParameters(row) {
				var self = this;
				/*基本信息*/
				this.stuNum = row.stuNum; //学号
				this.testNum = row.testNum; //考号
				this.name = row.name; //姓名
				this.spellName = row.spellName; //拼音
				this.formerName = row.formerName; //曾用名
				this.sex = row.sex; //性别
				this.countryId = row.countryId == 0 ? '' : row.countryId; //国籍
				this.nationId = row.nationId == 0 ? '' : row.nationId; //民族
				this.birthday = row.birthday || ''; //出生日期

			
				//出生地*

				row.birthProvinceCityIds.reverse().map(item => {

					this.birthProvinceCityId.push(item.toString())
				})
			
				//籍贯*
				row.nativeProvinceCityIds.reverse().map(item => {
					this.nativeProvinceCityId.push(item.toString())
				})

				//生源地*
				row.sourceProvinceCityIds.reverse().map(item => {
					this.sourceProvinceCityId.push(item.toString())
				})
				this.politicsStatusId = row.politicsStatusId ? parseInt(row.politicsStatusId) : ''; //政治面貌
			
				this.healthStatusId = row.healthStatusId ? row.healthStatusId.toString() : ''; //健康状况
				this.cardNum = row.cardNum; //证件号
				this.registerTypeId = row.registerTypeId == 0 ? '' : parseInt(row.registerTypeId); //户口性质
				this.stuModelId = row.stuModelId == 0 ? '' : parseInt(row.stuModelId); //往应届
				this.email = row.email; //电子邮件
				this.wechat = row.wechat; //微信
				this.qq = row.qq; //QQ
				this.remark = row.remark; //备注

				this.headUrl = row.headUrl; //照片
				this.entrance = row.entrance; //入学方式
				this.cardTypeId = parseInt(row.cardTypeId); //证件类型

				//生源地*
				row.registerProvinceCityIds.reverse().map(item => {
					this.registerProvinceCityId.push(item.toString())
				})
				this.mobile = row.mobile; //手机号码
				if (this.mobile == '' || this.mobile == null) {
					this.showmobile = false
				} else {
					this.showmobile = true
				}

				this.stuFeatureId = row.stuFeatureId == 0 ? '' : parseInt(row.stuFeatureId); //考生特征


				/*家庭信息*/
				this.contactPerson = row.contactPerson; //父/母联系人
				this.oneCardTypeId = row.oneCardTypeId;
				this.twoCardTypeId = row.twoCardTypeId
				this.oneCardNum = row.oneCardNum;
				this.contactTel = row.contactTel; //联系电话
				this.postalCode = row.postalCode; //邮政编码
				this.address = row.address; //家庭地址


				/*学籍信息*/
				this.enrollmentDate = row.enrollmentDate || ''; //入学日期
				this.enrollmentYear = row.enrollmentYear + '-01-01'; //所在级
				this.eduNumId = row.eduNumId == 0 ? '' : row.eduNumId; //学制
				this.studyNumId = row.studyNumId == 0 ? '' : row.studyNumId; //修业年限
				this.studyModelId = row.studyModelId == 0 ? '' : parseInt(row.studyModelId); //学习形式
				this.stageId = row.stageId == 0 ? '' : row.stageId; //层次
				this.eduTypeId = row.eduTypeId == 0 ? '' : row.eduTypeId; //办学类型
				this.expectDate = row.expectDate || ''; //预计毕业日期
				this.status = row.status.toString(); //学籍状态
				this.graduationStatus = row.graduationStatus; //毕业/结业
				this.graduationDate = row.graduationDate || ''; //毕业日期
				this.graduationNum = row.graduationNum; //毕业证书
				this.diplomaDate = row.diplomaDate || ''; //获学位日期
				this.diplomaNum = row.diplomaNum; //学位证书
				this.majorId = row.majorId; //所在专业
				this.administrativeClassId = parseInt(row.administrativeClassId); //所在行政班 
			
				this.decisionNum = row.decisionNum; //决议编号

				this.checkedlist = [];
				if (row.eduModalityId) {
					row.eduModalityId.map((item,i) => {
						if(item == 1){
							this.checkedlist.push(i)
						}
					})
					// this.checkedlist = row.eduModalityId;
				}
				/*上一级信息*/
				this.provStageId = row.provStageId == 0 ? '' : row.provStageId; //层次
				this.seasonId = row.seasonId == 0 ? '' : parseInt(row.seasonId); //招生季节
				this.graduationSchool = row.graduationSchool; //毕业学校
				this.graduationType = row.graduationType; //毕业类型
				this.score = row.score == 0 ? '' : row.score; //高考成绩

				this.getAdministrative();
			}
		}
	}
</script>

<style scoped lang="less">
	.box {
		border: 1px solid #DCDFE6;
		border-radius: 5px;
		width: 95%;
		padding: 20px;
		margin: 0 auto 20px;
	}

	.title {
		font-weight: bold;
		font-size: 18px;
		margin-bottom: 10px;
	}

	.content {
		display: flex;

		.left {
			width: 70%;

			.linecell {
				display: inline-flex;
				width: 50%;
			}
		}

		.right {
			width: 30%;

			.linecell {
				display: inline-flex;
				width: 100%;
			}
		}
	}

	.bottom {
		display: flex;
		align-items: center;

		label {
			display: inline-flex;
			width: 100px;
		}

		.el-input {
			width: 90%;
		}
	}

	.imgbox {
		width: 100%;
		height: 250px;
		text-align: center;

		.btnbox {
			justify-content: center;
			display: flex;
			margin-top: 10px;
		}
	}

	.contentline {
		display: flex;
		width: 100%;
		align-items: center;
		flex-wrap: wrap;
		justify-content: space-between;

		.linecell {
			width: 33%;
		}
	}

	.linecell {
		align-items: center;
		margin-bottom: 10px;
		height: 40px;
		line-height: 40px;

		label {
			width: 31%;
			text-align: right;
			padding-right: 2.3%;

			span {
				color: #F56C6C;
				font-size: 20px;
			}
		}

		.el-select,
		.el-cascader {
			width: 70%;
		}

		.el-input,
		.el-select,
		.el-cascader {
			width: 60%;
		}

		.input-reg {
			width: 53%;
			padding: 0 3%;
			height: 40px;
			line-height: 40px;
			border: 1px solid #dcdfe6;
			border-radius: 4px;
		}
	}

	.linecell .el-input__inner {
		width: 90px;
	}

	.dialog-bottom {
		text-align: right;
	}

	.el-checkbox {
		width: 80%;
		margin-left: 25%;
		height: 33px;
		line-height: 33px;
	}

	.avatar-uploader {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
		width: 170px;
		height: 190px;
		margin: auto;
	}

	.avatar-uploader:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 170px;
		height: 190px;
		line-height: 190px;
		text-align: center;
	}

	.avatar {
		width: 170px;
		height: 190px;
		display: block;
	}
</style>