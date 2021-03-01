<template>
  <section class="cm-container">
    <div class="cm-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          v-for="(item,index) in breadcrumb"
          :key="index"
          :to="{ path:item.path }"
        >{{item.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="cm-fold">
      <el-form :inline="true" size="mini">
        <div class="fold">
          <div ref="formDetail" class="detail">
            <el-form-item>
              <el-button type="primary" @click="save()">保存</el-button>
              <el-button type="primary" @click="returnback()">返回</el-button>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <div class="cm-title">
      <div class="leftbox">
        <p class="leftboxtit">学生信息</p>
        <div>
          <el-form
            :inline="true"
            size="mini"
            label-width="96px"
            :model="submitModel"
            :label-position="labelPosition"
          >
            <div class="fold2" v-if="display_on">
            
              <div ref="formDetail" class="studentinfo">
               
                    <el-form-item label="学号">
                      <el-input
                        v-model="submitModel.stuNum"
                        onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                        onbeforepaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                        class
                      ></el-input>
                   </el-form-item>
                <el-form-item label="考生号">
                  <el-input v-model="submitModel.testNum"></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                  <el-input v-model="submitModel.name"></el-input>
                </el-form-item>

     <!--           <el-form-item label="拼音">
                  <el-input v-model="submitModel.spellName"></el-input>
                </el-form-item>  -->

                <el-form-item label="曾用名">
                  <el-input v-model="submitModel.formerName"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                  <el-select v-model="submitModel.sex" placeholder="请选择" clearable filterable>
                    <el-option
                      v-for="item in sexList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                  <el-form-item label="国籍">
                  <el-select v-model="submitModel.countryId" placeholder="请选择" clearable filterable>
                    <el-option
                      v-for="item in countryList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>

              
                <el-form-item label="民族">
                  <el-select v-model="submitModel.nationId" placeholder="请选择" clearable filterable>
                    <el-option
                      v-for="item in nationList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>


                   <el-form-item label="出生日期">
                  <el-date-picker
                    v-model="submitModel.birthday"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择"
                  ></el-date-picker>
                </el-form-item>


                <el-form-item label="出生地">
                  <el-cascader
                    @change="addressSelectChange(submitModel.birthProvinceCityIds,'birthProvinceCityId')"
                    :options="cityList"
                    v-model="submitModel.birthProvinceCityIds"
                    expand-trigger="hover"
                    change-on-select
                    filterable
                    clearable
                  ></el-cascader>
                </el-form-item>

             

                <el-form-item label="籍贯">
                  <el-cascader
                    @change="addressSelectChange(submitModel.nativeProvinceCityIds,'nativeProvinceCityId')"
                    :options="cityList"
                    v-model="submitModel.nativeProvinceCityIds"
                    expand-trigger="hover"
                    change-on-select
                    filterable
                    clearable
                  ></el-cascader>
                </el-form-item>
                
                <el-form-item label="生源地">
                  <el-cascader
                    @change="addressSelectChange(submitModel.sourceProvinceCityIds,'sourceProvinceCityId')"
                    :options="cityList"
                    v-model="submitModel.sourceProvinceCityIds"
                    :disabled="selectDisabled"
                    expand-trigger="hover"
                    change-on-select
                    filterable
                    clearable
                  ></el-cascader>
                </el-form-item>

                <el-form-item label="入学方式">
                  <el-select
                    v-model="submitModel.entrance"
                    :disabled="selectDisabled"
                    placeholder="请选择"
                    clearable
                    filterable
                  >
                     <el-option v-for="(entrance, index) of entranceList" :label="entrance.name" :value="entrance.id" :key="index"></el-option>
                  </el-select>
                </el-form-item> 

                <el-form-item label="政治面貌">
                  <el-select
                    v-model="submitModel.politicsStatusId"
                    placeholder="请选择"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in politicalList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="健康状况">
                  <el-select
                    v-model="submitModel.healthStatusId"
                    placeholder="请选择"
                    clearable
                    filterable
                  >
                    <el-option label="良好" value="1"></el-option>
                    <el-option label="残疾" value="2"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="证件类型">
                  <el-select
                    v-model="submitModel.cardTypeId"
                    placeholder="请选择"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in idCategoryList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <!-- <el-form-item label="证件号码">
                  <el-input
                    v-model="submitModel.cardNum"
                    maxlength="18"
                    @change="verifyFn('cardNum',infostudents['cardNum'])"
                    placeholder="证件号限制18位"
                  ></el-input>
                </el-form-item> -->

                <el-form-item label="户口性质">
                  <el-select
                    v-model="submitModel.registerTypeId"
                    :disabled="selectDisabled"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in registerList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="户口所在地">
                  <el-cascader
                    @change="addressSelectChange(submitModel.registerProvinceCityIds,'registerProvinceCityId')"
                    :options="cityList"
                    v-model="submitModel.registerProvinceCityIds"
                    :disabled="selectDisabled"
                    expand-trigger="hover"
                    change-on-select
                    filterable
                    clearable
                  ></el-cascader>
                </el-form-item>
                <el-form-item label="应届生">
                  <el-select
                    v-model="submitModel.stuModelId"
                    placeholder="请选择"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in stuModelList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="email">
                  <el-input v-model="submitModel.email"></el-input>
                </el-form-item>

                <el-form-item label="手机号">
                  <el-input v-model="submitModel.mobile" maxlength="11"></el-input>
                </el-form-item>

                <el-form-item label="微信号">
                  <el-input v-model="submitModel.wechat"></el-input>
                </el-form-item>

                
                <el-form-item label="qq">
                  <el-input v-model="submitModel.qq"></el-input>
                </el-form-item>
                <el-form-item label="父/母联系人1">
                  <el-input v-model="submitModel.contactPerson"></el-input>
                </el-form-item>
                <el-form-item label="联系电话1">
                  <el-input v-model="submitModel.contactTel" maxlength="11"></el-input>
                </el-form-item>
                <el-form-item label="邮政编码1">
                  <el-input v-model="submitModel.postalCode"></el-input>
                </el-form-item>
                <el-form-item label="家庭住址1">
                  <el-input v-model="submitModel.address"></el-input>
                </el-form-item>

                <el-form-item label="父/母联系人2">
                  <el-input v-model="submitModel.twoContactPerson"></el-input>
                </el-form-item>
                <!-- <el-form-item label="毕业照片">
                  <el-input v-model="submitModel.graduationUrl"></el-input>
                </el-form-item>
                <el-form-item label="入学照片">
                  <el-input v-model="submitModel.headUrl"></el-input>
                </el-form-item> -->
                

                

                <el-form-item label="联系电话2">
                  <el-input v-model="submitModel.twoContactTel" maxlength="11"></el-input>
                </el-form-item>

                <el-form-item label="邮政编码2">
                  <el-input v-model="submitModel.twoPostalCode" @blur="filterPostalcode"></el-input>
                </el-form-item>

	            <el-form-item label="家庭住址2">
                  <el-input v-model="submitModel.twoAddress"></el-input>
                </el-form-item>
                <el-form-item label="学制">
                  <el-select v-model="submitModel.eduNumId" placeholder="请选择" clearable filterable>
                    <el-option
                      v-for="item in schoolingList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>             
                <el-form-item label="入学日期">
                  <el-date-picker
                    v-model="submitModel.enrollmentDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择"
                  ></el-date-picker>
                </el-form-item>		
     <!--           <el-form-item label="修业年限">
                  <el-select
                    v-model="submitModel.studyNumId"
                    placeholder="请选择"
                    @change="yearListFind(studyNumId,infostudents['studyNumId'])"
                    clearable
                  >
                    <el-option
                      v-for="item in yearList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>	  -->			
                <el-form-item label="预计毕业日期">
                  <el-date-picker
                    v-model="submitModel.expectDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择"
                  ></el-date-picker>
                </el-form-item>
     <!--           <el-form-item label="毕业证书编号">
                  <el-input v-model="submitModel.graduationNum"></el-input>
                </el-form-item>
                <el-form-item label="获得学位日期">
                  <el-date-picker
                    v-model="submitModel.diplomaDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="学位证书编号">
                  <el-input v-model="submitModel.diplomaNum"></el-input>
                </el-form-item>
                 <el-form-item label="决议编号">
                  <el-input v-model="submitModel.decisionNum"></el-input>
                </el-form-item>  -->


    <!--            <el-form-item label="备注">
                  <el-input v-model="submitModel.remark"></el-input>
                </el-form-item>  -->

    <!--            <el-form-item label="所在级">
                
                  <intelligent-year-picker
                    v-model="submitModel.enrollmentYear"
                    type="year"
                    value-format="yyyy"
                    placeholder="请选择"
                    @change="getAdministratives(infostudents['enrollmentYear'])"
                  ></intelligent-year-picker>
                </el-form-item>

                <el-form-item label="所在专业">
                  <el-select
                    v-model="submitModel.majorId"
                    placeholder="请选择"
                    clearable
                    filterable
                    @change="getAdministratives(infostudents['majorId'])"
                  >
                    <el-option
                      v-for="item in majorList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>  -->
		

     <!--           <el-form-item label="所在行政班">
                  <el-select
                    :disabled="!submitModel.majorId||!submitModel.enrollmentYear"
                    v-model="submitModel.administrativeClassId"
                    :placeholder=" !submitModel.majorId||!submitModel.enrollmentYear ?'请先选择年级和专业':'请选择'"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in administrativeList"
                      :key="item.id"
                      :label=" item.grade +'-'+ item.name "
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item> -->
                <el-form-item label="学生特征">
                  <el-select
                    v-model="submitModel.stuFeatureId"
                    placeholder="请选择"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in stufeatureList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>				
                <el-form-item label="学习形式">
                  <el-select
                    v-model="submitModel.studyModelId"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in learFormList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="层次">
                  <el-select
                    v-model="submitModel.stageId"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in educationalList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <!-- <el-form-item label="办学形式">
                  <el-select
                    v-model="submitModel.eduModalityId"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in schoolRunType"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item> -->
                <el-form-item label="办学类型">
                  <el-select
                    v-model="submitModel.eduTypeId"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in schoolRunType"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                
                

     <!--           <el-form-item label="学籍状态">
                  <el-select v-model="submitModel.status" placeholder="请选择" clearable filterable>
                    <el-option label="在籍" value="1"></el-option>
                    <el-option label="非在籍" value="2"></el-option>
                    <el-option value="4" label="休学"></el-option>
                    <el-option value="12" label="保留学籍"></el-option>
                  </el-select>
                </el-form-item>
                 <el-form-item label="毕业日期">
                  <el-date-picker
                    v-model="submitModel.graduationDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择"
                  ></el-date-picker>
                </el-form-item>  -->

                <!-- <el-form-item label="毕业/结业">
                  <el-input v-model="submitModel.graduationStatus"></el-input>
                </el-form-item> -->
                
                
                
               

                <!-- <el-form-item label="本硕连读标识">
                  <el-input v-model="submitModel.flag"></el-input>
                </el-form-item> -->
                <el-form-item label="上一层次">
                  <el-select
                    v-model="submitModel.provStageId"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in educationalList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="招生季节">
                  <el-select
                    v-model="submitModel.seasonId"
                    placeholder="请选择"
                    clearable
                  >
                    <el-option
                      v-for="item in seasonList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="毕业学校">
                  <el-input v-model="submitModel.graduationSchool"></el-input>
                </el-form-item>
                <el-form-item label="毕业类型">
                  <el-input v-model="submitModel.graduationType"></el-input>
                </el-form-item>
                <el-form-item label="高考成绩">
                  <el-input v-model="submitModel.score"></el-input>
                </el-form-item>				
                <!-- <el-form-item label>
                  <el-checkbox
                    v-for="(item,index) in eduCheckList"
                    :key="index"
                    v-model="item.checked"
                    @change="studentStatusCheck(item)"
                  >{{item.prop}}</el-checkbox>
                </el-form-item> -->
              </div>
            </div>
          </el-form>
        </div>
      </div>
      <div class="rightbox">
        <p class="rightboxtit">学生反馈信息-有差异</p>
        <div>
          <el-form :inline="true" size="mini" label-width="96px" :label-position="labelPosition">
            <div class="fold2">
              <div
                ref="formDetail"
                class="studentinfo"
                v-for="(lis,index) in sutinfolist"
                :key="index"
              >
                <!-- {setopacity:!lis.value!=''&&!lis.value!=null} -->
                <el-form-item :label="lis.fieldInfo">
                  <el-input class="te" v-model="lis.value" disabled v-if="lis.fieldName !== 'sex' && lis.fieldName !== 'countryId' && lis.fieldName !== 'nationId' && lis.fieldName !== 'birthProvinceCityId' && lis.fieldName !== 'nativeProvinceCityId' && lis.fieldName !== 'sourceProvinceCityId' && lis.fieldName !== 'entrance' && lis.fieldName !== 'politicsStatusId' && lis.fieldName !== 'healthStatusId' && lis.fieldName !== 'cardTypeId' && lis.fieldName !== 'registerTypeId' && lis.fieldName !== 'registerProvinceCityId' && lis.fieldName !== 'stuModelId' && lis.fieldName !== 'stuFeatureId' && lis.fieldName !== 'majorId' && lis.fieldName !== 'eduNumId' && lis.fieldName !== 'studyNumId' && lis.fieldName !== 'administrativeClassId' && lis.fieldName !== 'studyModelId' && lis.fieldName !== 'stageId' && lis.fieldName !== 'eduModalityId' && lis.fieldName !== 'eduTypeId' && lis.fieldName !== 'status' && lis.fieldName !== 'provStageId' && lis.fieldName !== 'seasonId'"></el-input>
                  <el-select v-if="lis.fieldName == 'sex'" v-model="lis.value" disabled clearable filterable>
                    <el-option
                      v-for="item in sexList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <el-select v-if="lis.fieldName == 'countryId'" v-model="lis.value" disabled clearable filterable>
                    <el-option
                      v-for="item in countryList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <el-select v-if="lis.fieldName == 'nationId'" v-model="lis.value" disabled clearable filterable>
                    <el-option
                      v-for="item in nationList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <el-cascader
                    v-if="lis.fieldName == 'birthProvinceCityId'"
                    disabled
                    :options="cityList"
                    v-model="lis.value"
                    expand-trigger="hover"
                    change-on-select
                    filterable
                    clearable
                  ></el-cascader>
                  <el-cascader
                    v-if="lis.fieldName == 'nativeProvinceCityId'"
                    disabled
                    :options="cityList"
                    v-model="lis.value"
                    expand-trigger="hover"
                    change-on-select
                    filterable
                    clearable
                  ></el-cascader>
                  <el-cascader
                    v-if="lis.fieldName == 'sourceProvinceCityId'"
                    disabled
                    :options="cityList"
                    v-model="lis.value"
                    expand-trigger="hover"
                    change-on-select
                    filterable
                    clearable
                  ></el-cascader>
                  <el-select v-if="lis.fieldName == 'entrance'" v-model="lis.value" disabled clearable filterable>
                    <el-option v-for="(entrance, index) of entranceList" :label="entrance.name" :value="entrance.id" :key="index"></el-option>
                  </el-select>
                  <el-select v-if="lis.fieldName == 'politicsStatusId'" v-model="lis.value" disabled clearable filterable>
                    <el-option
                      v-for="item in politicalList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <el-select v-if="lis.fieldName == 'healthStatusId'" v-model="lis.value" disabled clearable filterable>
                    <el-option label="良好" value="1"></el-option>
                    <el-option label="残疾" value="2"></el-option>
                  </el-select>
                  <el-select v-if="lis.fieldName == 'cardTypeId'" v-model="lis.value" disabled clearable filterable>
                    <el-option
                      v-for="item in idCategoryList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <el-select v-if="lis.fieldName == 'registerTypeId'" v-model="lis.value" disabled clearable filterable>
                    <el-option
                      v-for="item in registerList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <el-cascader
                    v-if="lis.fieldName == 'registerProvinceCityId'"
                    disabled
                    :options="cityList"
                    v-model="lis.value"
                    expand-trigger="hover"
                    change-on-select
                    filterable
                    clearable
                  ></el-cascader>
                  <el-select v-if="lis.fieldName == 'stuModelId'" v-model="lis.value" disabled clearable filterable>
                    <el-option
                      v-for="item in stuModelList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <el-select v-if="lis.fieldName == 'stuFeatureId'" v-model="lis.value" disabled clearable filterable>
                    <el-option
                      v-for="item in stufeatureList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <el-select v-if="lis.fieldName == 'majorId'" v-model="lis.value" disabled clearable filterable>
                    <el-option
                      v-for="item in administrativeList"
                      :key="item.id"
                      :label=" item.grade +'-'+ item.name "
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <el-select v-if="lis.fieldName == 'eduNumId'" v-model="lis.value" disabled clearable filterable>
                    <el-option
                      v-for="item in schoolingList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <el-select v-if="lis.fieldName == 'studyNumId'" v-model="lis.value" disabled clearable filterable>
                    <el-option
                      v-for="item in yearList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <el-select v-if="lis.fieldName == 'administrativeClassId'" v-model="lis.value" disabled clearable filterable>
                    <el-option
                      v-for="item in administrativeList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <el-select v-if="lis.fieldName == 'studyModelId'" v-model="lis.value" disabled clearable filterable>
                    <el-option
                      v-for="item in learFormList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <el-select v-if="lis.fieldName == 'stageId'" v-model="lis.value" disabled clearable filterable>
                    <el-option
                      v-for="item in educationalList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <el-select v-if="lis.fieldName == 'eduModalityId'" v-model="lis.value" disabled clearable filterable>
                    <el-option
                      v-for="item in schoolRunType"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <el-select v-if="lis.fieldName == 'eduTypeId'" v-model="lis.value" disabled clearable filterable>
                    <el-option
                      v-for="item in schoolRunType"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <el-select v-if="lis.fieldName == 'status'" v-model="lis.value" disabled  clearable filterable>
                    <el-option label="在籍" value="1"></el-option>
                    <el-option label="非在籍" value="2"></el-option>
                    <el-option value="4" label="休学"></el-option>
                    <el-option value="12" label="保留学籍"></el-option>
                  </el-select>
                  <el-select v-if="lis.fieldName == 'provStageId'" v-model="lis.value" disabled  clearable filterable>
                    <el-option
                      v-for="item in educationalList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <el-select v-if="lis.fieldName == 'seasonId'" v-model="lis.value" disabled clearable filterable>
                    <el-option
                      v-for="item in seasonList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
      </div>
    </div>

    <div class="block_page"></div>
  </section>
</template>

<script>
import util from "@/util";
const parametersList = [
  "sex-code",
  "political-status",
  "ID-category",
  "learning-form",
  "schooling-length",
  "educational-level",
  "school-running",
  "student-feature",
  "nation-code",
  "student-modal",
  "register-type",
  "admissions-season",
  "study-year",
  "education-modality"
];
export default {
  name: "student_info_modify",
  data() {
    return {
      display_on: false,
      infostudents: {
        fieldInfo: "eduModalityId",
        fieldName: "",
        fieldType: 0,
        id: "",
        modify: true,
        orderNum: true,
        originalValue: [],
        rid: "",
        value: "",
        visible: true
      }, //学生反馈的字段
      infostudent: {}, //学生反馈的字段
      actionId: "",
      queryparam: "", //需要带回去的参数
      //    checkList:['本硕连读'],
      labelPosition: "right",
      /*基本信息*/
      stuNum: "", //学号
      testNum: "", //考号
      name: "", //姓名
      spellName: "", //拼音
      formerName: "", //曾用名
      sex: "", //性别
      countryId: "", //国籍
      nationId: "", //民族
      birthday: "", //出生日期
      birthProvinceCityId: [], //出生地*
      nativeProvinceCityId: [], //籍贯*
      sourceProvinceCityId: [], //生源地*
      politicsStatusId: "", //政治面貌
      healthStatusId: "", //健康状况
      cardNum: "", //证件号
      registerTypeId: "", //户口性质
      stuModelId: "", //往应届
      email: "", //电子邮件
      wechat: "", //微信
      qq: "", //QQ
      remark: "", //备注
      headUrl: "", //照片
      entrance: "", //入学方式
      cardTypeId: "", //证件类型
      registerProvinceCityId: [], //户口所在地*
      mobile: "", //手机号码
      stuFeatureId: "", //考生特征
      /*家庭信息*/
      contactPerson: "", //父/母联系人
      contactTel: "", //联系电话
      postalCode: "", //邮政编码
      address: "", //家庭地址

      twoContactPerson: "", //父/母联系人
      twoContactTel: "", //联系电话
      twoPostalCode: "", //邮政编码
      twoAddress: "", //家庭地址
      /*学籍信息*/
      enrollmentDate: "", //入学日期
      enrollmentYear: "", //所在级
      eduNumId: "", //学制
      studyNumId: "", //修业年限
      studyModelId: "", //学习形式
      stageId: "", //层次
      eduTypeId: "", //办学类型
      expectDate: "", //预计毕业日期
      status: "", //学籍状态
      graduationStatus: "", //毕业/结业
      graduationDate: "", //毕业日期
      graduationNum: "", //毕业证书
      diplomaDate: "", //获学位日期
      diplomaNum: "", //学位证书

      headUrl: "", //照片
      majorId: "", //所在专业
      administrativeClassId: "", //所在行政班
      eduCheckList: [
        { checked: false, value: 1, prop: "本硕连读" },
        { checked: false, value: 2, prop: "院外转入" },
        { checked: false, value: 3, prop: "保留学籍" },
        { checked: false, value: 4, prop: "院内转出" },
        { checked: false, value: 5, prop: "休学标识" },
        { checked: false, value: 6, prop: "退学标识" },
        { checked: false, value: 7, prop: "降级标识" },
        { checked: false, value: 8, prop: "复学标识" }
      ],
      eduModalityId: [], //标识
      decisionNum: "", //决议编号
      /*上一级信息*/
      provStageId: "", //上一层次
      seasonId: "", //招生季节
      graduationSchool: "", //毕业学校
      graduationType: "", //毕业类型
      score: "", //高考成绩
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
      sutinfolist: [],
      entranceList: [],
      ifshow: {
        //学生反馈的字段
        /*基本信息*/
        stuNum: false, //学号
        testNum: false, //考号
        name: false, //姓名
        spellName: false, //拼音
        formerName: false, //曾用名
        sex: false, //性别
        countryId: false, //国籍
        nationId: false, //民族
        birthday: false, //出生日期
        birthProvinceCityId: false, //出生地*
        nativeProvinceCityId: false, //籍贯*
        sourceProvinceCityId: false, //生源地*
        politicsStatusId: false, //政治面貌
        healthStatusId: false, //健康状况
        cardNum: false, //证件号
        registerTypeId: false, //户口性质
        stuModelId: false, //往应届
        email: false, //电子邮件
        wechat: false, //微信
        qq: false, //QQ
        remark: false, //备注
        headUrl: false, //照片
        entrance: false, //入学方式
        cardTypeId: false, //证件类型
        registerProvinceCityId: false, //户口所在地*
        mobile: false, //手机号码
        stuFeatureId: false, //考生特征

        /*家庭信息*/
        contactPerson: false, //父/母联系人
        contactTel: false, //联系电话
        postalCode: false, //邮政编码
        address: false, //家庭地址

        twoContactPerson: false, //父/母联系人
        twoContactTel: false, //联系电话
        twoPostalCode: false, //邮政编码
        twoAddress: false, //家庭地址

        /*学籍信息*/
        enrollmentDate: false, //入学日期
        enrollmentYear: false, //所在级
        eduNumId: false, //学制
        studyNumId: false, //修业年限
        studyModelId: false, //学习形式
        stageId: false, //层次
        eduTypeId: false, //办学类型
        expectDate: false, //预计毕业日期
        status: false, //学籍状态
        graduationStatus: false, //毕业/结业
        graduationDate: false, //毕业日期
        graduationNum: false, //毕业证书
        diplomaDate: false, //获学位日期
        diplomaNum: false, //学位证书

        headUrl: false, //照片
        majorId: false, //所在专业
        administrativeClassId: false, //所在行政班
        eduModalityId: false, //标识
        decisionNum: false, //决议编号
        /*上一级信息*/
        provStageId: false, //上一层次
        seasonId: false, //招生季节
        graduationSchool: false, //毕业学校
        graduationType: false, //毕业类型
        score: false, //高考成绩
        /*其它data*/
        sexList: false, //性别
        countryList: false, //国家
        nationList: false, //民族
        politicalList: false, //政治面貌
        idCategoryList: false, //证件类型
        learFormList: false, //学习形式
        schoolingList: false, //学制
        educationalList: false, //学历层次
        schoolRunType: false, //办学类型
        stufeatureList: false, //学生特征
        stuModelList: false, //往应届
        registerList: false, //户口性质
        seasonList: false, //招生季节
        yearList: false, //修业年限
        modalityList: false, //复选框选项
        cityList: false, //城市树
        majorList: false, //专业
        administrativeList: false, //行政班
        selectDisabled: false //与国籍关联的选项
      },
      saveList: [], //修改保存的数组
      breadcrumb: [
        //面包屑
        { label: "学生管理" },
        { label: "学生信息核对修改" }
      ],
      dialogTable: false,
      btnPerObj: {
        //按钮权限
        query: false
      },
      stuInfo: null, //当前学生信息
      submitModel: {
        //基本信息
        stuNum: "",
        testNum: "",
        sex: "",
        name: "",
        stuModelId: "",
        stuFeatureId: "",
        remark: "",
        graduationUrl: "",
        headUrl: "",
        studyModelId: "",
        stageId: "",
        eduModalityId: "",
        eduTypeId: "",
        graduationDate: "",
        graduationStatus: "",
        graduationNum: "",
        diplomaDate: "",
        diplomaNum: "",
        decisionNum: "",
        provStageId: "",
        seasonId: "",
        graduationSchool: "",
        graduationType: "",
        score: "",
        spellName: "",
        formerName: "",
        birthProvinceCityIds: [],
        birthProvinceCityId: 0,
        birthday: "",
        nationId: null,
        countryId: null,
        nativeProvinceCityIds: [],
        nativeProvinceCityId: 0,
        politicsStatusId: null,
        cardTypeId: null,
        cardNum: "",
        registerTypeId: null,
        registerProvinceCityIds: [],
        registerProvinceCityId: 0,
        email: "",
        mobile: "",
        wechat: "",
        qq: "",
        sourceProvinceCityIds: [],
        sourceProvinceCityId: 0,
        healthStatusId: 0,

        //家庭信息
        contactPerson: "",
        contactTel: "",
        postalCode: "",
        address: "",
        twoContactPerson: "",
        twoContactTel: "",
        twoPostalCode: "",
        twoAddress: "",
        //学籍信息
        enrollmentDate: "",
        enrollmentYear: "",
        majorId: null,
        eduNumId: null,
        studyNumId: null,
        administrativeClassId: null,
        status: null,
        expectDate: "",
        entrance: "",
        eduModalityId: []
      },
      dataModel: []
    };
  },
  watch: {
    stuInfo: {
      handler(newVal, oldVal) {
        console.info("handler stuInfo");
        if (newVal && newVal.id) {
          this.initParameters(newVal);
        } else {
          this.cancel();
        }
      },
      immediate: false
    },
    countryId(newval) {
      let code = "";
      let self = this;
      self.countryList.map(function(item) {
        if (item.id == newval) {
          code = item.code;
        }
      });

      if (code && code == "001") {
        self.selectDisabled = false;
      } else {
        self.submitModel.selectDisabled = true;
        self.submitModel.birthProvinceCityId = []; //出生地*
        self.submitModel.nativeProvinceCityId = []; //籍贯*
        self.submitModel.sourceProvinceCityId = []; //生源地*
        self.submitModel.entrance = ""; //入学方式
        self.submitModel.politicsStatusId = ""; //政治面貌
        self.submitModel.registerTypeId = ""; //户口性质
        self.submitModel.stuModelId = ""; //往应届
        self.submitModel.registerProvinceCityId = []; //户口所在地*
      }
    }
  },
  mounted() {
    let self = this;
    parametersList.map(function(item) {
      self.getDictsList(item);
    });

    self.getMajorCategory();
    self.getCityTree();
    self.getCountry();

    //  util.resize(this);
    // window.onresize=()=>{
    //     util.resize(this);
    // };
  },
  created() {
    this.getSchoolWay()
    this.stuInfo = this.$route.query.row;
    this.queryparam = this.$route.query.param;
    this.actionId = this.$route.query.actionId;
    let stuNum = this.stuInfo.stuNum;
  console.log(this.stuInfo,'信息');
    //获取学生反馈信息-有差异
    this.getstudentsfeedback(stuNum);
    // /students/{stuNum}

    this.display_on = true;

    this.getAdministrative();
  },
  methods: {
    getstudentsfeedback(stuNum) {
      let self = this;
      let vuex = JSON.parse(localStorage.getItem('vuex'));
      let poatData = {
          id:0,
          type:"student_verify_detail",
          extend: JSON.stringify({student_no: stuNum}),
          userId:vuex.me.attributes.login_info.id
      }
      this.$http.post("_op:/gaojiReport/pQueryCom/", poatData).then(data => {
        let list = JSON.parse(data.data)
        list.forEach(item => {
            if(item.fieldInfo == '健康状况') {
              item.value = item.value.toString()
            }
            if(item.modify == true) {
              item.value = ''
            }
            if(item.value instanceof Array) {
              item.value.forEach(t => {
                item.value = item.value.join('-').split('-')
              })
              console.log('dddd', item.value)
            }
            
          })
          self.sutinfolist = list
          // for (let i = 0; i < dataList.length; i++) {
          //   let a = dataList[i].fieldName;
          //   self.infostudents[a] = dataList[i];
          //   self.dataModel[a] = dataList[i];
          //   // 学号赋值
          //   console.log('55555', dataList[i])
          //   if (dataList[i].fieldName == "stuNum") {
          //     this.infostudent.stuNum = dataList[i].value;
          //     this.ifshow.stuNum = !dataList[i].modify;
          //     //// console.log(this.ifshow.stuNum,'是么')
          //   } else if (dataList[i].fieldName == "name") {
          //     // 姓名赋值
          //     alert('000')
          //     this.infostudent.name = dataList[i].value;
          //     this.ifshow.name = dataList[i].modify;
          //   } else if (dataList[i].fieldName == "spellName") {
          //     // 拼音赋值
          //     this.infostudent.spellName = dataList[i].value;
          //     this.ifshow.spellName = dataList[i].modify;
          //   } else if (dataList[i].fieldName == "formerName") {
          //     // 曾用名赋值
          //     this.infostudent.formerName = dataList[i].value;
          //     this.ifshow.formerName = dataList[i].modify;
          //   } else if (dataList.fieldName == "sex") {
          //     // 性别
          //     // this.infostudent.sex = dataList[i].value.toString();
          //     // this.ifshow.sex = dataList[i].modify;
          //   } else if (dataList[i].fieldName == "countryId") {
          //     //国籍

          //     this.infostudent.countryId = dataList[i].value;
          //     this.ifshow.countryId = !dataList[i].modify;
          //   } else if (dataList[i].fieldName == "nationId") {
          //     //民族
          //     this.infostudent.nationId = dataList[i].value;
          //     this.ifshow.nationId = !dataList[i].modify;
          //   } else if (dataList[i].fieldName == "birthday") {
          //     //出生日期
          //     this.infostudent.birthday = dataList[i].value;
          //     this.ifshow.birthday = dataList[i].modify;
          //   } else if (dataList[i].fieldName == "birthProvinceCityId") {
          //     //出生地*
          //     this.infostudent.birthProvinceCityId = dataList[i].value;
          //     // dataList[i].originalValue.reverse().map(item=>{
          //     // this.infostudent.birthProvinceCityId.push(item.toString())

          //     // })
          //     this.ifshow.birthProvinceCityId = dataList[i].modify;
          //   } else if (dataList[i].fieldName == "nativeProvinceCityId") {
          //     this.infostudent.nativeProvinceCityId = dataList[i].value;
          //     // dataList[i].originalValue.reverse().map(item=>{//籍贯*
          //     // this.infostudent.nativeProvinceCityId.push(item.toString())
          //     // })
          //     this.ifshow.nativeProvinceCityId = dataList[i].modify;
          //   } else if (dataList[i].fieldName == "politicsStatusId") {
          //     //政治面貌
          //     this.infostudent.politicsStatusId = dataList[i].value;
          //     this.ifshow.politicsStatusId = dataList[i].modify;
          //   } else if (dataList[i].fieldName == "cardTypeId") {
          //     //证件类型
          //     this.infostudent.cardTypeId = dataList[i].value;
          //     this.ifshow.cardTypeId = dataList[i].modify;
          //   } else if (dataList[i].fieldName == "cardNum") {
          //     //证件号
          //     this.infostudent.cardNum = dataList[i].value;
          //     this.ifshow.cardNum = !dataList[i].modify;
          //   } else if (dataList[i].fieldName == "email") {
          //     //电子邮件
          //     this.infostudent.email = dataList[i].value;
          //     this.ifshow.email = dataList[i].modify;
          //   } else if (dataList[i].fieldName == "mobile") {
          //     //手机号
          //     this.infostudent.mobile = dataList[i].value;
          //     this.ifshow.mobile = dataList[i].modify;
          //   } else if (dataList[i].fieldName == "wechat") {
          //     //微信
          //     this.infostudent.wechat = dataList[i].value;
          //     this.ifshow.wechat = dataList[i].modify;
          //   } else if (dataList[i].fieldName == "sourceProvinceCityId") {
          //     //出生地*
          //     this.infostudent.sourceProvinceCityId = dataList[i].value;
          //     // dataList[i].originalValue.reverse().map(item=>{
          //     // this.infostudent.sourceProvinceCityId.push(item.toString())
          //     // })
          //     this.ifshow.sourceProvinceCityId = dataList[i].modify;
          //   } else if (dataList[i].fieldName == "healthStatusId") {
          //     //健康状况
          //     this.infostudent.healthStatusId = dataList[i].value;
          //     this.ifshow.healthStatusId = dataList[i].modify;
          //   } else if (dataList[i].fieldName == "contactPerson") {
          //     //父/母联系人
          //     this.infostudent.contactPerson = dataList[i].value;
          //     this.ifshow.contactPerson = dataList[i].modify;
          //   } else if (dataList[i].fieldName == "twoContactPerson") {
          //     //父/母联系人
          //     this.infostudent.twoContactPerson = dataList[i].value;
          //     this.ifshow.twoContactPerson = dataList[i].modify;
          //   } else if (dataList[i].fieldName == "contactTel") {
          //     //联系电话
          //     this.infostudent.contactTel = dataList[i].value;
          //     this.ifshow.contactTel = dataList[i].modify;
          //   } else if (dataList[i].fieldName == "twoContactTel") {
          //     //联系电话
          //     this.infostudent.twoContactTel = dataList[i].value;
          //     this.ifshow.twoContactTel = dataList[i].modify;
          //   } else if (dataList[i].fieldName == "contactTel") {
          //     //固定电话
          //     this.infostudent.contactTel = dataList[i].value;
          //     this.ifshow.contactTel = dataList[i].modify;
          //   } else if (dataList[i].fieldName == "registerTypeId") {
          //     //户口性质
          //     this.infostudent.registerTypeId = dataList[i].value;
          //     this.ifshow.registerTypeId = dataList[i].modify;
          //   } else if (dataList[i].fieldName == "registerProvinceCityId") {
          //     //户口所在地*
          //     // console.log(dataList[i],'户口所在地')
          //     if (dataList[i].value != null) {
          //       //todo
          //       this.infostudent.registerProvinceCityId = dataList[i].value;
          //       // dataList[i].value.reverse().map(item=>{
          //       // this.infostudent.registerProvinceCityId.push(item.toString())
          //       // })
          //     } else {
          //       this.infostudent.registerProvinceCityId = dataList[i].value;
          //     }

          //     this.ifshow.registerProvinceCityId = dataList[i].modify;
          //   } else if(dataList[i].fieldName == "stuModelId") {
          //     // 应届生
          //     this.infostudent.stuModelId = dataList[i].value;
          //     this.ifshow.stuModelId = data.data[i].modify;
          //   } else if(dataList[i].fieldName == "stuFeatureId") {
          //     // 学生特征
          //     this.infostudent.stuFeatureId = dataList[i].value;
          //     this.ifshow.stuFeatureId = dataList[i].modify;
          //   } else if(dataList[i].fieldName =="remark") {
          //     // 备注
          //     this.infostudent.remark = dataList[i].value;
          //     this.ifshow.remark = dataList[i].modify;
          //   } else if(dataList[i].fieldName =="graduationUrl") {
          //     // 毕业照片
          //     this.infostudent.graduationUrl = dataList[i].value;
          //     this.ifshow.graduationUrl = dataList[i].modify;
          //   } else if(dataList[i].fieldName == "headUrl") {
          //     // 入学照片
          //     this.infostudent.headUrl = dataList[i].value;
          //     this.ifshow.headUrl = dataList[i].modify;
          //   } else if (dataList[i].fieldName == "postalCode") {
          //     //邮政编码
          //     this.infostudent.postalCode = dataList[i].value;
          //     this.ifshow.postalCode = dataList[i].modify;
          //   } else if (dataList[i].fieldName == "twoPostalCode") {
          //     //邮政编码
          //     this.infostudent.twoPostalCode = dataList[i].value;
          //     this.ifshow.twoPostalCode = dataList[i].modify;
          //   } else if (dataList[i].fieldName == "address") {
          //     //家庭住址
          //     this.infostudent.address = dataList[i].value;
          //     this.ifshow.address = dataList[i].modify;
          //   } else if (dataList[i].fieldName == "twoAddress") {
          //     //家庭住址
          //     this.infostudent.twoAddress = dataList[i].value;
          //     this.ifshow.twoAddress = dataList[i].modify;
          //   } else if (dataList[i].fieldName == "enrollmentDate") {
          //     //入学日期
          //     this.infostudent.enrollmentDate = dataList[i].value;
          //     this.ifshow.enrollmentDate = dataList[i].modify;
          //   } else if (dataList[i].fieldName == "enrollmentYear") {
          //     //所在级
          //     this.infostudent.enrollmentYear = dataList[i].value;

          //     this.ifshow.enrollmentYear = dataList[i].modify;
          //   } else if (dataList[i].fieldName == "majorId") {
          //     //所在专业
          //     this.infostudent.majorId = dataList[i].value;

          //     this.ifshow.majorId = !dataList[i].modify;
          //   } else if (dataList[i].fieldName == "studyNumId") {
          //     //修业年限
          //     this.infostudent.studyNumId = dataList[i].value;
          //     this.ifshow.studyNumId = dataList[i].modify;
          //   } else if (dataList[i].fieldName == "eduNumId") {
          //     //学制
          //     this.infostudent.eduNumId = dataList[i].value;
          //     this.ifshow.spelleduNumIdName = dataList[i].modify;
          //   } else if (dataList[i].fieldName == "administrativeClassId") {
          //     //所在行政班
          //     this.infostudent.administrativeClassId = dataList[i].value;
          //     this.ifshow.administrativeClassId = !dataList[i].modify;
          //   } else if(dataList[i].fieldName == "studyModelId") {
          //     // 学习形式
          //     this.infostudent.studyModelId = dataList[i].value;
          //     this.ifshow.studyModelId = dataList[i].modify;
          //   } else if(stageId) {
          //     // 层次
          //     this.infostudent.stageId = dataList[i].value;
          //     this.ifshow.stageId = dataList[i].modify;
          //   } else if (dataList[i].fieldName == "eduModalityId") {
          //     // 办学形式
          //     this.infostudent.eduModalityId = dataList[i].value;
          //     this.ifshow.eduModalityId = dataList[i].modify;
          //   } else if(dataList[i].fieldName == "eduTypeId") {
          //    // 办学类型
          //     this.infostudent.eduTypeId = dataList[i].value;
          //     this.ifshow.eduTypeId = dataList[i].modify;
          //   } else if (dataList[i].fieldName == "status") {
          //     //学籍状态
          //     this.infostudent.status = dataList[i].value;
          //     this.ifshow.status = dataList[i].modify;
          //   } else if (dataList[i].fieldName == "graduationDate") {
          //     //预计毕业日期
          //     this.infostudent.graduationDate = dataList[i].value;
          //     this.ifshow.graduationDate = dataList[i].modify;
          //   } else if(dataList[i].fieldName == "graduationStatus") {
          //     // 毕业/结业
          //     this.infostudent.graduationStatus = dataList[i].value;
          //     this.ifshow.graduationStatus = dataList[i].modify;
          //   } else if(dataList[i].fieldName == "graduationNum") {
          //     //毕业证编号
          //     this.infostudent.graduationNum = dataList[i].value;
          //     this.ifshow.graduationNum = dataList[i].modify;
          //   } else if(dataList[i].fieldName == "diplomaDate") {
          //     // 获得学位日期
          //     this.infostudent.diplomaDate = dataList[i].value;
          //     this.ifshow.diplomaDate = dataList[i].modify;
          //   } else if(dataList[i].fieldName == "diplomaNum") {
          //     //获得学位书编号
          //     this.infostudent.diplomaNum = dataList[i].value;
          //     this.ifshow.diplomaNum = dataList[i].modify;
          //   }else if(dataList[i].fieldName == "flag") {
          //      // 本硕连读标识
          //     this.infostudent.flag = dataList[i].value;
          //     this.ifshow.flag = dataList[i].modify;
          //   } else if(dataList[i].fieldName == "decisionNum") {
          //     // 决议编号
          //     this.infostudent.decisionNum = dataList[i].value;
          //     this.ifshow.decisionNum = dataList[i].modify;
          //   } else if(dataList[i].fieldName == "provStageId") {
          //      // 上一层次
          //     this.infostudent.provStageId = dataList[i].value;
          //     this.ifshow.provStageId = dataList[i].modify;
          //   } else if(dataList[i].fieldName == "seasonId") {
          //     // 招生季节
          //     this.infostudent.seasonId = dataList[i].value;
          //     this.ifshow.seasonId = dataList[i].modify;
          //   } else if(dataList[i].fieldName == "graduationSchool") {
          //     // 毕业学校
          //     this.infostudent.graduationSchool = dataList[i].value;
          //     this.ifshow.graduationSchool = dataList[i].modify;
          //   } else if(dataList[i].fieldName == "graduationType") {
          //     // 毕业类型
          //     this.infostudent.graduationType = dataList[i].value;
          //     this.ifshow.graduationType = dataList[i].modify;
          //   } else if(dataList[i].fieldName == "score") {
          //     // 高考成绩
          //     this.infostudent.score = dataList[i].value;
          //     this.ifshow.score = dataList[i].modify;
          //   } else if (dataList[i].fieldName == "entrance") {
          //     //入学方式
          //     this.infostudent.entrance = dataList[i].value;
          //     this.ifshow.entrance = dataList[i].modify;
          //   } else if (dataList[i].fieldName == "eduModalityId") {
          //     // 毕业日期
          //     if (dataList[i].originalValue) {
          //       let self = this;
          //       let eduModalityId = dataList[i].originalValue;

          //       eduModalityId.map(function(item1) {
                  
          //         self.eduCheckList.map(function(item2) {
          //           if (item1 == item2.value) {
          //             item2.checked = true;
          //           }
          //         });
          //       });
          //     }

          //     this.infostudent.eduModalityId = dataList[i].value;
          //     if (dataList[i].value != null) {
          //       //      dataList[i].value.map(function(item1){
          //       //      self.eduCheckList.map(function(item2){
          //       //         if (item1==item2.value) {
          //       //             item2.checked= true;
          //       //         }
          //       //     })
          //       //  })
          //     } else {
          //       this.infostudent.eduModalityId = dataList[i].value;
          //     }

          //     this.ifshow.eduModalityId = !dataList[i].modify;
          //   }else if (dataList[i].fieldName == "testNum") {
          //     this.infostudent.testNum = dataList[i].value;
          //     this.ifshow.testNum = !dataList[i].modify;
          //   }
          // }
        console.log(JSON.parse(data.data),'反馈ddddd')
      }).catch(err => {
          // console.log(err)
        });
    },
    studentStatusCheck(val) {
      //新增方法退学方法
      if (val.checked == true && val.prop == "退学标识" && val.value == "5") {
        this.status = "非在籍";
      } else if (
        val.checked == false &&
        val.prop == "退学标识" &&
        val.value == "5"
      ) {
        this.status = "在籍";
      }
    },
    spellNamechange(val) {
      // let self = this
      // if( self.saveList.indexOf(val)==-1){
      //     self.saveList.push(val)
      // }
      // // console.log(self.saveList,'保存在数组')
    },
    addressSelectChange(value, key) {
      let self = this;
      if (value && value.length > 1) {
        let index = value.length - 1;
        self.submitModel[key] = parseInt(value[index]);
      } else {
        self.submitModel[key] = value[0];
      }
    },
    save() {
      let self = this;
      //校验邮箱
      if (self.submitModel.email && self.submitModel.email.length > 0) {
        let regEmail = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/
        // let regEmail = /^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/;
        if (!regEmail.test(self.submitModel.email)) {
          self.$message.error("请正确填写邮箱！");
          return false;
        }
      }
      //校验手机号
      // if (self.submitModel.mobile && self.submitModel.mobile.length > 0) {
      //   // let regEmail = /^1[3456789]\d{9}$/
      //   let regPhone = /^1[3|4|5|7|8][0-9]{9}$/;
      //   if (!regPhone.test(self.submitModel.mobile)) {
      //     self.$message.error("请正确填写手机号码！");
      //     return false;
      //   }
      // }

      // if (
      //   self.submitModel.contactTel &&
      //   self.submitModel.contactTel.length > 0
      // ) {
      //   let regTel = /^1[3|4|5|7|8][0-9]{9}$/;
      //   // let regEmail = /^1[3|4|5|7|8][0-9]{9}$/;
      //   if (!regTel.test(self.submitModel.contactTel)) {
      //     self.$message.error("请正确填写联系人手机号码！");
      //     return false;
      //   }
      // }

      // if (
      //   self.submitModel.twoContactTel &&
      //   self.submitModel.twoContactTel.length > 0
      // ) {
      //   let regEmail = /^1[3|4|5|7|8][0-9]{9}$/;
      //   if (!regEmail.test(self.submitModel.twoContactTel)) {
      //     self.$message.error("请正确填写联系人手机号码！");
      //     return false;
      //   }
      // }

      //获取选中的eduCheckList
      self.submitModel.eduModalityId = [];
      self.eduCheckList.map(function(item) {
        if (item.checked) {
          self.submitModel.eduModalityId.push(item.value);
        }
      });
      //构造后台需要的数据结果,只提交已经修改了的数据
      let subData = [];
      for (let key in self.submitModel) { 
        let currentValue = null;
        let tempkey = key;
        let temp = self.submitModel[tempkey];
        if (tempkey.indexOf("Id") != -1) {
          if (temp instanceof Array) {
            currentValue = parseInt(temp[temp.length - 1]);
            tempkey = tempkey.substring(0, tempkey.length - 1);
          } else {
            currentValue = parseInt(temp);
          }
        } else {
          currentValue = temp;
        }
        let oldValue = self.stuInfo[tempkey];
        if (currentValue && currentValue != oldValue) {
          let record = self.dataModel[tempkey];
          if (record) {
            //有反馈信息
            let model = {
              fieldInfo: record.fieldInfo,
              fieldName: record.fieldName,
              id: record.id,
              rid: record.rid,
              value: currentValue,
              originalValue: record.originalValue
            };
            subData.push(model);
          } else {
            //不存在反馈信息
            let model = {
              fieldName: tempkey,
              value: currentValue,
              originalValue: oldValue
            };
            subData.push(model);
          }
        }
      }
      let postData = {
            id:0,
            type:10003,
            extend:JSON.stringify({operaterType: 2,
            stuNum: self.stuInfo.stuNum,
            studentVerifyDetailFieldList: subData,
            modify: 1
            }),
            user_id:JSON.parse(localStorage.getItem('vuex')).me.attributes.login_info.id
          }
      // console.info("params", params);
      self.$http.post("_op:/approve/pTransCom", postData).then(data => {
        if (data.code == 0) {
          self.$message.success("修改成功！");
          this.getstudentsfeedback()
        } else {
          self.$message.error("修改失败!");
        }
      });

      //  if( self.saveList.indexOf(self.infostudents['eduModalityId'])==-1){

      //         self.infostudents['eduModalityId'].originalValue = this.eduModalityId
      //         self.saveList.push(self.infostudents['eduModalityId'])
      //     }
      //      // console.log(self.saveList,'保存在数组')
      //     this.submission()
    },
    getSchoolWay() {
      this.$http.post('_op:/dicts/getDictsList',{
        type: "entrance"
      }).then(data => {
            this.entranceList = data.data;
            this.entranceList.forEach(item => {
            item.id = item.id.toString()
        })
      })
    },
    submission() {
      let self = this;
      let studentVerifyDetailFieldList = [];
      for (let i = 0; i < self.saveList.length; i++) {
        let fieldInfo = self.saveList[i].fieldInfo;
        let fieldName = self.saveList[i].fieldName;
        let id = self.saveList[i].id;
        let rid = self.saveList[i].rid;
        let originalValue = self.saveList[i].originalValue;
        let value = self.saveList[i].value;
        let List = {
          fieldInfo: fieldInfo,
          fieldName: fieldName,
          id: id,
          rid: rid,
          value: value,
          originalValue: originalValue
        };
        studentVerifyDetailFieldList.push(List);
      }
      let query = {
        operaterType: 2,
        stuNum: self.stuInfo.stuNum,
        studentVerifyDetailFieldList: studentVerifyDetailFieldList
      };

      self.$http.post("_op:/students/feedBack", query).then(data => {
        if (data.code == 0) {
          self.$message.success("修改成功！");
        } else {
          self.$message.error("修改失败!");
        }
      });
    },

    saves() {
      if (this.verifyParameters() == false) {
        return false;
      }

      this.enrollmentYear = this.enrollmentYear.substr(0, 4);

      //毕业日期不能小于入学日期
      let enrollData, graduateData;
      enrollData = this.enrollmentDate.split("-");
      graduateData = this.graduationDate.split("-");
      if (this.graduationDate && graduateData[0] <= enrollData[0]) {
        this.$message.warning("毕业日期填写有误！");
        return;
      }

      let birth, nativeProvinceCity, sourceProvinceCity, registerProvinceCity;
      //出生地
      birth = this.birthProvinceCityId[this.birthProvinceCityId.length - 1];
      //籍贯
      nativeProvinceCity = this.nativeProvinceCityId[
        this.nativeProvinceCityId.length - 1
      ];
      //生源地
      sourceProvinceCity = this.sourceProvinceCityId[
        this.sourceProvinceCityId.length - 1
      ];
      //户口所在地
      registerProvinceCity = this.registerProvinceCityId[
        this.registerProvinceCityId.length - 1
      ];
      let parameters = {
        /*基本信息*/
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
        twoContactPerson: this.twoContactPerson, //父/母联系人
        contactTel: this.contactTel, //联系电话
        postalCode: this.postalCode, //邮政编码
        address: this.address, //家庭地址

        twoContactPerson: this.twoContactPerson, //父/母联系人
        twoContactTel: this.twoContactTel, //联系电话
        twoPostalCode: this.twoPostalCode, //邮政编码
        twoAddress: this.twoAddress, //家庭地址

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
        score: parseInt(this.score) //高考成绩
      };

      if (this.stuInfo.id) {
        parameters.id = this.stuInfo.id;
        this.$http
          .put("_op:/students", parameters)
          .then(data => {
            let type = "success";
            let message = `${
              this.stuInfo.dialogStatus == "新增" ? "新增" : "编辑"
            }成功！`;
            if (data.code == 0) {
              // this.cancel();
              this.$message({
                type: type,
                message: message
              });
              // this.$emit("getTableData")
              // this.$emit('closeDialog')
            } else {
              type = "error";
              message = data.msg;
            }

            this.$message({
              type: type,
              message: message
            });
          })
          .catch(() => {});
      } else {
        this.$http
          .post("_op:/students", parameters)
          .then(data => {
            let type = "success";
            let message = `${
              this.stuInfo.dialogStatus == "新增" ? "新增" : "编辑"
            }成功！`;
            if (data.code == 0) {
              this.cancel();
              // this.$emit("getTableData")
              // this.$emit('closeDialog')
            } else {
              type = "error";
              message = data.msg;
            }
            this.$message({
              type: type,
              message: message
            });
          })
          .catch(() => {});
      }
    },
    cancel() {
      /*基本信息*/
      this.stuNum = ""; //学号
      this.testNum = ""; //考号
      this.name = ""; //姓名
      this.spellName = ""; //拼音
      this.formerName = ""; //曾用名
      this.sex = ""; //性别
      this.countryId = ""; //国籍
      this.nationId = ""; //民族
      this.birthday = ""; //出生日期
      this.birthProvinceCityId = []; //出生地*
      this.nativeProvinceCityId = []; //籍贯*
      this.sourceProvinceCityId = []; //生源地*
      this.politicsStatusId = ""; //政治面貌
      this.healthStatusId = ""; //健康状况
      this.cardNum = ""; //证件号
      this.registerTypeId = ""; //户口性质
      this.stuModelId = ""; //往应届
      this.email = ""; //电子邮件
      this.wechat = ""; //微信
      this.qq = ""; //QQ
      this.remark = ""; //备注

      this.headUrl = ""; //照片
      this.entrance = ""; //入学方式
      this.cardTypeId = ""; //证件类型
      this.registerProvinceCityId = []; //户口所在地*
      this.mobile = ""; //手机号码
      this.stuFeatureId = ""; //考生特征

      /*家庭信息*/
      this.contactPerson = ""; //父/母联系人
      this.contactTel = ""; //联系电话
      this.postalCode = ""; //邮政编码
      this.address = ""; //家庭地址

      this.twoContactPerson = ""; //父/母联系人
      this.twoContactTel = ""; //联系电话
      this.twoPostalCode = ""; //邮政编码
      this.twoAddress = ""; //家庭地址

      /*学籍信息*/
      this.enrollmentDate = ""; //入学日期
      this.enrollmentYear = ""; //所在级
      this.eduNumId = ""; //学制
      this.studyNumId = ""; //修业年限
      this.studyModelId = ""; //学习形式
      this.stageId = ""; //层次
      this.eduTypeId = ""; //办学类型
      this.expectDate = ""; //预计毕业日期
      this.status = ""; //学籍状态
      this.graduationStatus = ""; //毕业/结业
      this.graduationDate = ""; //毕业日期
      this.graduationNum = ""; //毕业证书
      this.diplomaDate = ""; //获学位日期
      this.diplomaNum = ""; //学位证书

      this.majorId = ""; //所在专业
      this.administrativeClassId = ""; //所在行政班
      this.checked_bsld = false; //本硕连读
      this.checked_zcyy = false; //转出医院
      this.checked_zryy = false; //转入医院
      this.checked_xxbs = false; //休学标识
      this.checked_txbs = false; //退学标识
      this.checked_jjbs = false; //降级标识
      this.decisionNum = ""; //决议编号

      /*上一级信息*/
      this.provStageId = ""; //层次
      this.seasonId = ""; //招生季节
      this.graduationSchool = ""; //毕业学校
      this.graduationType = ""; //毕业类型
      this.score = ""; //高考成绩
    },
    verifyParameters() {
      var self = this;
      if (this.stuNum == "") {
        this.$message({ message: "请填写学号", type: "warning" });
        return false;
      } else if (this.testNum == "") {
        this.$message({ message: "请填写考号", type: "warning" });
        return false;
      } else if (this.name == "") {
        this.$message({ message: "请填写姓名", type: "warning" });
        return false;
      } else if (this.sex == "") {
        this.$message({ message: "请选择性别", type: "warning" });
        return false;
      } else if (this.birthday == "" || this.birthday == null) {
        this.$message({ message: "请选择出生日期", type: "warning" });
        return false;
      } else if (this.cardTypeId == "") {
        this.$message({ message: "请选择证件类型", type: "warning" });
        return false;
      } else if (this.cardNum == "") {
        this.$message({ message: "请填写证件号码", type: "warning" });
        return false;
      } else if (this.enrollmentDate == "") {
        this.$message({ message: "请选择入学日期", type: "warning" });
        return false;
      } else if (this.enrollmentYear == "") {
        this.$message({ message: "请选择所在级", type: "warning" });
        return false;
      } else if (this.majorId == "") {
        this.$message({ message: "请选择专业", type: "warning" });
        return false;
      }

      if (this.administrativeClassId == "") {
        this.$message({ message: "请选择行政班", type: "warning" });
        return false;
      } else {
        this.administrativeList.map(function(item) {
          if (self.administrativeClassId == item.id) {
            //// console.log('aaa');
            self.className = item.name;
          }
        });
      }
      this.eduModalityId = [];
      self.eduCheckList.map(function(item) {
        if (item.checked) {
          self.eduModalityId.push(item.value);
        }
      });
    },
    yearListFind(val, val2) {
      this.schoolingList.map(item => {
        if (this.eduNumId === item.id) {
          let num = item.name.substring(0, item.name.substring.length - 1);
          this.yearList.map(list => {
            let strY = list.name.substring(0, list.name.substring.length - 1);
            if (val == list.id && strY < num) {
              this.$message.error("修业年限不能小于学制！");
              this.infostudents["studyNumId"].originalValue = "";
            }
          });
        }
      });

      //     // console.log(this.saveList,'保存在数组')
    },
    initParameters(row) {
      let self = this;
      for (let key in self.submitModel) {
        if (key === "healthStatusId") {
          self.submitModel[key] = row[key].toString();
        } else if (key == 'birthProvinceCityIds') {
          self.submitModel.birthProvinceCityIds = []
          row[key].forEach(item => {
            self.submitModel.birthProvinceCityIds.unshift(item.toString())
          })
        }else if (key == 'nativeProvinceCityIds') {
          self.submitModel.nativeProvinceCityIds = []
          row[key].forEach(item => {
            self.submitModel.nativeProvinceCityIds.unshift(item.toString())
          })
        }else if (key == 'sourceProvinceCityIds') {
          self.submitModel.sourceProvinceCityIds = []
          row[key].forEach(item => {
            self.submitModel.sourceProvinceCityIds.unshift(item.toString())
          })
        }else if (key == 'registerProvinceCityIds') {
          self.submitModel.registerProvinceCityIds = []
          row[key].forEach(item => {
            self.submitModel.registerProvinceCityIds.unshift(item.toString())
          })
        }else {
          if (row[key] instanceof Array) {
            let record = row[key]
            record.forEach(item => {
              // self.submitModel[key].push(item.toString());
            });
          } else if (row[key] && key.indexOf("Id") != -1) {
            console.info("Id", row[key]);
            self.submitModel[key] = parseInt(row[key]);
          } else if (row[key]) {
            if(key == 'sex') {
              self.submitModel[key] = row[key];
            }else{
              self.submitModel[key] = row[key] + "";
            }
            
          } else {
            self.submitModel[key] = "";
          }
        }
      }

      row.eduModalityId.map(function(item1) {
        self.eduCheckList.map(function(item2, index) {
          //   if (item1 == item2.value) {
          //     item2.checked = true;
          //   }
          // debugger
          if (row.eduModalityId[index] == 1) {
            item2.checked = true;
          }
        });
      });

      self.getAdministrative();

      // self.submitModel.countryId = row.countryId ==0 ? '' : row.countryId;//国籍
      // self.submitModel.nationId = row.nationId ==0 ? '' : row.nationId;//民族

      // self.submitModel.politicsStatusId = row.politicsStatusId ? parseInt(row.politicsStatusId) :'';//政治面貌
      // self.submitModel.healthStatusId = row.healthStatusId ? row.healthStatusId.toString() :'';//健康状况
      // self.submitModel.registerTypeId = row.registerTypeId == 0 ? '' : parseInt(row.registerTypeId);//户口性质
      // self.submitModel.stuModelId = row.stuModelId == 0 ? '' : parseInt(row.stuModelId);//往应届
      // self.submitModel.cardTypeId = row.cardTypeId == 0 ? '' : parseInt(row.cardTypeId);
      // self.submitModel.majorId = row.majorId == 0 ? '' :  parseInt(row.majorId);
      // self.submitModel.eduNumId = row.eduNumId == 0 ? '' :  parseInt(row.eduNumId);

      console.info(self.submitModel, "tag");
      // /*基本信息*/
      // this.stuNum=row.stuNum;//学号
      // this.testNum=row.testNum;//考号
      // this.name=row.name;//姓名
      // this.spellName=row.spellName;//拼音
      // this.formerName=row.formerName;//曾用名
      // this.sex=row.sex;//性别
      // this.countryId= row.countryId==0 ? '' : row.countryId;//国籍
      // this.nationId= row.nationId==0 ? '' : row.nationId;//民族
      // this.birthday=row.birthday || '';//出生日期

      // //// console.log(this.birthday)
      // //出生地*
      // row.birthProvinceCityIds.reverse().map(item=>{
      // 	this.birthProvinceCityId.push(item.toString())
      // })

      // //籍贯*
      // row.nativeProvinceCityIds.reverse().map(item=>{
      // 	this.nativeProvinceCityId.push(item.toString())
      // })

      // //生源地*
      // row.sourceProvinceCityIds.reverse().map(item=>{
      // 	this.sourceProvinceCityId.push(item.toString())
      // })
      // this.politicsStatusId=row.politicsStatusId ? parseInt(row.politicsStatusId) :'';//政治面貌
      // this.healthStatusId=row.healthStatusId ? row.healthStatusId.toString() :'';//健康状况
      // this.cardNum=row.cardNum;//证件号
      // this.registerTypeId= row.registerTypeId==0 ? '' : parseInt(row.registerTypeId);//户口性质
      // this.stuModelId= row.stuModelId==0 ? '' : parseInt(row.stuModelId);//往应届
      // this.email=row.email;//电子邮件
      // this.wechat=row.wechat;//微信
      // this.qq=row.qq;//QQ
      // this.remark=row.remark;//备注

      // this.headUrl=row.headUrl;//照片
      // this.entrance=row.entrance;//入学方式
      // this.cardTypeId=parseInt(row.cardTypeId);//证件类型

      // //生源地*
      // row.registerProvinceCityIds.reverse().map(item=>{
      // 	this.registerProvinceCityId.push(item.toString())
      // })
      // this.mobile=row.mobile;//手机号码
      // this.stuFeatureId= row.stuFeatureId==0 ? '' :parseInt(row.stuFeatureId);//考生特征

      // /*家庭信息*/
      // this.contactPerson=row.contactPerson;//父/母联系人
      // this.contactTel=row.contactTel;//联系电话
      // this.postalCode=row.postalCode;//邮政编码
      // this.address=row.address;//家庭地址

      // this.twoContactPerson=row.twoContactPerson;//父/母联系人
      // this.twoContactTel=row.twoContactTel;//联系电话
      // this.twoPostalCode=row.twoPostalCode;//邮政编码
      // this.twoAddress=row.twoAddress;//家庭地址

      // /*学籍信息*/
      // this.enrollmentDate=row.enrollmentDate || '';//入学日期
      // this.enrollmentYear=row.enrollmentYear+'-01-01';//所在级
      // this.eduNumId= row.eduNumId==0 ? '' : row.eduNumId;//学制
      // this.studyNumId= row.studyNumId==0 ? '' : row.studyNumId;//修业年限
      // this.studyModelId= row.studyModelId==0 ? '' : parseInt(row.studyModelId);//学习形式
      // this.stageId= row.stageId==0 ? '' : row.stageId;//层次
      // this.eduTypeId= row.eduTypeId==0 ? '' : row.eduTypeId;//办学类型
      // this.expectDate=row.expectDate || '';//预计毕业日期

      // this.graduationStatus=row.graduationStatus;//毕业/结业

      // this.graduationDate=row.graduationDate || '';//毕业日期
      // this.graduationNum=row.graduationNum;//毕业证书

      // this.diplomaDate=row.diplomaDate || '';//获学位日期
      // this.diplomaNum=row.diplomaNum;//学位证书
      // this.majorId=row.majorId;//所在专业

      // this.administrativeClassId = row.administrativeClassId ; //所在行政班
      // //console.log(typeof row.administrativeClassId === 'number')
      // //this.administrativeClassId = '';
      // this.decisionNum=row.decisionNum;//决议编号
      // row.eduModalityId.map(function(item1){
      // 	self.eduCheckList.map(function(item2){
      // 		if (item1==item2.value) {
      // 			item2.checked= true;
      // 		}
      // 	})
      // })
      // /*上一级信息*/
      // this.provStageId= row.provStageId==0 ? '' : row.provStageId;//层次
      // this.seasonId= row.seasonId==0 ? '' : parseInt(row.seasonId);//招生季节
      // this.graduationSchool=row.graduationSchool;//毕业学校
      // this.graduationType=row.graduationType;//毕业类型
      // this.score= row.score==0? '' : row.score;//高考成绩
      //// console.log(row,'学籍状态')
      //this.status=row.status.toString()==0 ? '1' :'2';//学籍状态
    },

    getAdministratives(val) {
      //行政班
      let self = this;
      let year = self.submitModel.enrollmentYear.substr(0, 4);

      if (self.submitModel.majorId != "" && year != "") {
        this.$http
          .get(
            "_op:/administrative/class/list/" +
              year +
              "/" +
              self.submitModel.majorId
          )
          .then(data => {
            self.administrativeList = data.data;
            self.submitModel.administrativeClassId = data.data[0].id;
            self.infostudents["administrativeClassId"].originalValue =
              data.data[0].id;
          })
          .catch(() => {});
      }
      // if(val.fieldName=='enrollmentYear'){
      //     val.originalValue=this.enrollmentYear
      //     // this.enrollmentYear=val
      //     if( this.saveList.indexOf(val)==-1){
      //         this.saveList.push(val)
      //     }
      //     if( this.saveList.indexOf(this.infostudents['administrativeClassId'])==-1){
      //         this.saveList.push(this.infostudents['administrativeClassId'])
      //     }
      // }
      // if(val.fieldName=='majorId'){
      //     val.originalValue=this.majorId
      //     if( this.saveList.indexOf(val)==-1){
      //         this.saveList.push(val)
      //     }
      // }

      // // console.log(this.saveList,'保存在数组')
    },
    returnback() {
      this.$confirm("请确认当前修改操作是否已经保存, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // this.$router.go(-1);
          // window.history.back(-1);
          this.$router.push({
            path:'/report_management/student_info_management',
            query:{
                param:this.queryparam,
                actionId:this.actionId
            },
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消返回"
          });
        });

      //
    },
    filterPostalcode(val) {
      //邮政编码正则校验
      let reg = /^[1-9][0-9]{5}$/;
      if (!reg.test(this.postalCode)) {
        this.postalCode = "";
        this.$message.error("请正确填写邮政编码！");
      }
    },
    filterMobile(val) {
      //手机号码正则校验 mobile：学生手机号码，p-mobile:父母联系人手机
      let reg = /^1[3|4|5|7|8][0-9]{9}$/;
      if (val === 1 && !reg.test(this.mobile)) {
        this.mobile = "";
        this.$message.error("请正确填写手机号码！");
      } else if (val === 2 && !reg.test(this.contactTel)) {
        this.contactTel = "";
        this.$message.error("请正确填写联系人手机号码！");
      }
    },
    filterEmail() {
      //邮箱正则校验
      let reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (!reg.test(this.email)) {
        this.email = "";
        this.$message.error("请正确填写邮箱！");
      }
    },
    enrollmentDateChange(val) {
      this.enrollmentYear = val;
    },
    verifyFn(type, val) {
      if (type == "cardNum" && this.cardNum.length > 18) {
        this.cardNum = this.cardNum.substring(0, 18);
        this.$message({ message: "证件号长度不能多于18位", type: "warning" });
      }
    },
    getCountry() {
      //国家查询
      this.$http
        .get("_op:/dicts/combox/country-code")
        .then(data => {
          this.countryList = data.data;
          for (let i = 0; i < this.countryList.length; i++) {
            if (this.countryList[i].code == "001") {
              this.countryId = this.countryList[i].id;
            }
          }
          if (this.stuInfo.id) {
            this.initParameters(this.stuInfo);
          }
        })
        .catch(() => {});
    },
    getDictsList(type) {
      //字典查询
      this.$http
        .post("_op:/dicts/getDictsList", {
          type: type
        })
        .then(data => {
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
        })
        .catch(() => {});
    },
    nameChange(val) {
      if (val) {
        this.$http
          .get("_op:pingying/" + val)
          .then(data => {
            this.spellName = data.data;
          })
          .catch(() => {});
      }
    },
    getCityTree() {
      //地点树
      let self = this;
      this.$http
        .get("_op:/province/city/tree/1")
        .then(data => {
          self.cityList = this.mapTree(data.data.children);
        })
        .catch(() => {});
    },
    mapTree(children) {
      let self = this;
      let objlist = [];
      if (children.length > 0) {
        children.map(function(item) {
          if (item.children && item.children.length > 0) {
            objlist.push({
              value: item.id.toString(),
              //								value:item.cnName,
              label: item.cnName,
              children: self.mapTree(item.children)
            });
          } else {
            objlist.push({
              value: item.id.toString(),
              //								value:item.cnName,
              label: item.cnName
            });
          }
        });
      }
      return objlist;
    },
    getMajorCategory() {
      //专业
      this.$http
        .get("_op:/major/combox")
        .then(data => {
          this.majorList = data.data;
        })
        .catch(() => {});
    },
    getAdministrative() {
      //行政班
      let self = this;
      // self.submitModel
      let enrollmentYear = self.submitModel.enrollmentYear; // self.infostudents[''].originalValue
      let majorId = self.submitModel.majorId; //self.infostudents['majorId'].originalValue

      if (majorId != "" && enrollmentYear != "") {
        this.$http
          .get(
            "_op:/administrative/class/list/" + enrollmentYear + "/" + majorId
          )
          .then(data => {
            self.administrativeList = data.data;
          })
          .catch(() => {});
      }
    }
  }
};
</script>

<style scoped lang="less">
.cm-title {
  margin: 0 20px;
  display: flex;
  border: solid 3px #303133;
  .leftbox {
    margin-left: 100px;
    width: 40%;
    border-right: solid 1px #ddd;
    .fold2 {
      border-radius: 10px;
      // border: solid 1px #ddd;
      margin: 10px 8px;
      .el-form-item--mini.el-form-item,
      .el-form-item--small.el-form-item {
        margin-bottom: 5px;
      }
      .fonttit {
        margin-top: -9px;
      }
    }
  }
  .rightbox {
    width: 40%;
  }
  .leftboxtit {
    text-align: center;
    font-weight: bold;
  }
  .rightboxtit {
    text-align: center;
    font-weight: bold;
  }
  .fold2 {
    border-radius: 10px;
    // border: solid 1px #ddd;
    margin: 10px 20px;
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      margin-bottom: 5px;
    }
    .fonttit {
      margin-top: -9px;
    }
  }
  .studentinfo {
    // width: 326px;
    margin: 0 auto;
  }
}
.input-reg {
  width: 64%;
  padding: 0 3%;
  height: 26px;
  line-height: 40px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.cm-container /deep/.el-input--mini .el-input__inner {
  height: 28px;
  line-height: 28px;
  width: 290px;
}
.setopacity{
  opacity: 0;
}
.rightbox /deep/.el-input--mini .el-input__inner{
  color: red;
}
</style>