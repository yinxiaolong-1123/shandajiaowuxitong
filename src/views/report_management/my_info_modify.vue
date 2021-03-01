<template>
    <section class="cm-container">
        <div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold">
            <el-form :inline="true" size="mini">
                <div class="fold">
                    <div ref="formDetail" class="detail">
                        
						<el-form-item >
                            <el-button type="primary" @click="save()"  v-if="btnPerObj.change">确定</el-button>
						</el-form-item> 
                    </div>
                </div>
            </el-form>
        </div>
        <div style="margin:0 20px; border: solid 1px #ddd;" v-if="display_on">
          
        <el-form :inline="true" size="mini" label-width="96px" :label-position="labelPosition" style="margin-left:100px;">
            <el-row>
                <el-col :span="12">
                    <div>
                        <p style="font-weight: bold; margin:0 20px;">如下信息如有错误请反馈给学籍科修改</p>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div>
                        <p style="font-weight: bold;">反馈处</p>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <div>
                        <el-form-item label="学号" v-if="infostudent['stuNum']&&infostudent['stuNum'].visible">   
                            <el-input v-model="infostudent['stuNum'].originalValue"  @change="spellNamechange(infostudent['stuNum'])"   :disabled="true"
                            onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                            onbeforepaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                            class="">
                            </el-input>
                        </el-form-item>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div>
                        <el-form-item label="" v-if="infostudent['stuNum']&&infostudent['stuNum'].visible&&infostudent['stuNum'].modify">
                            <el-input v-model="infostudent['stuNum'].value" :disabled="false"   @change="feabackinfo(infostudent['stuNum'])"
                            class="">
                            </el-input>
                        </el-form-item>
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <div>
                        <el-form-item label="考生号" v-if="infostudent['testNum']&&infostudent['testNum'].visible">   
                            <el-input v-model="infostudent['testNum'].originalValue"  @change="spellNamechange(infostudent['testNum'])"   :disabled="true"
                            onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                            onbeforepaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}"
                            class="">
                            </el-input>
                        </el-form-item>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div>
                        <el-form-item label="" v-if="infostudent['testNum']&&infostudent['testNum'].visible&&infostudent['testNum'].modify">
                            <el-input v-model="infostudent['testNum'].value" :disabled="false"   @change="feabackinfo(infostudent['testNum'])"
                            class="">
                            </el-input>
                        </el-form-item>
                    </div>
                </el-col>
            </el-row>
            <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="姓名" v-if="infostudent['name']&&infostudent['name'].visible&&!infostudent['name'].modify">
                        <el-input  @change="nameChange" v-model="infostudent['name'].originalValue"  :disabled="!infostudent['name'].modify"></el-input>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['name']&&infostudent['name'].visible&&infostudent['name'].modify==false">
                        <el-input v-model="infostudent['name'].value" :disabled="infostudent['name'].modify"   @change="feabackinfo(infostudent['name'])"
                        class="">
                        </el-input>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="曾用名" v-if="infostudent['formerName']&&infostudent['formerName'].visible&&!infostudent['formerName'].modify">
                        <el-input @change="spellNamechange(infostudent['formerName'])"  v-model="infostudent['formerName'].originalValue"  :disabled="!infostudent['formerName'].modify"></el-input>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['formerName']&&infostudent['formerName'].visible&&infostudent['formerName'].modify==false">
                        <el-input v-model="infostudent['formerName'].value"  :disabled="infostudent['formerName'].modify"  @change="feabackinfo(infostudent['formerName'])"
                        class="">
                        </el-input>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="姓别" v-if="infostudent['sex']&&infostudent['sex'].visible&&!infostudent['sex'].modify">
                        <el-select  v-model="infostudent['sex'].originalValue"  placeholder="请选择" clearable filterable  :disabled="!infostudent['sex'].modify" @change="birthProvinceCityIdchange(infostudent['sex'])">
                            <el-option 
                                v-for="item in sexList" 
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id"> 
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['sex']&&infostudent['sex'].visible&&infostudent['sex'].modify==false">
                        <el-select  v-model="infostudent['sex'].value"  placeholder="请选择" clearable filterable  :disabled="infostudent['sex'].modify" @change="feabackinfo(infostudent['sex'])">
                            <el-option 
                                v-for="item in sexList" 
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id"> 
                            </el-option>
                        </el-select>
                        
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="国籍" v-if="infostudent['countryId']&&infostudent['countryId'].visible&&!infostudent['countryId'].modify">
                        <el-select  @change="birthProvinceCityIdchange(infostudent['countryId'])" v-model="countryIdval" placeholder="请选择" clearable filterable  :disabled="!infostudent['countryId'].modify">
                            <el-option 
                                v-for="item in countryList" 
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id"> 
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['countryId']&&infostudent['countryId'].visible&&infostudent['countryId'].modify==false">
                        <el-select  @change="feabackinfo(infostudent['countryId'])" v-model="infostudent['countryId'].value" placeholder="请选择" clearable filterable  :disabled="infostudent['countryId'].modify">
                            <el-option 
                                v-for="item in countryList" 
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id"> 
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="民族" v-if="infostudent['nationId']&&infostudent['nationId'].visible&&!infostudent['nationId'].modify">
                        <el-select  v-model="nationIdval"  placeholder="请选择" clearable filterable  :disabled="!infostudent['nationId'].modify" @change="birthProvinceCityIdchange(infostudent['nationId'])">
                            <el-option 
                                v-for="item in nationList" 
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id"> 
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item v-if="infostudent['nationId']&&infostudent['nationId'].visible&&infostudent['nationId'].modify==false">
                        <el-select  v-model="infostudent['nationId'].value"  placeholder="请选择" clearable filterable  :disabled="infostudent['nationId'].modify" @change="feabackinfo(infostudent['nationId'])">
                            <el-option 
                                v-for="item in nationList" 
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id"> 
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="出生日期" v-if="infostudent['birthday']&&infostudent['birthday'].visible&&!infostudent['birthday'].modify">
                        <el-date-picker
                            @change="birthProvinceCityIdchange(infostudent['birthday'])"
                            :disabled="!infostudent['birthday'].modify"
                            v-model="birthdayval" 
                            type="date" 
                            value-format="yyyy-MM-dd"
                            placeholder="请选择">
                        </el-date-picker>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['birthday']&&infostudent['birthday'].visible&&infostudent['birthday'].modify==false">
                        <el-date-picker
                            @change="feabackinfo(infostudent['birthday'])"
                            :disabled="infostudent['birthday'].modify"
                            v-model="infostudent['birthday'].value" 
                            type="date" 
                            value-format="yyyy-MM-dd"
                            placeholder="请选择">
                        </el-date-picker>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="出生地" v-if="infostudent['birthProvinceCityId']&&infostudent['birthProvinceCityId'].visible&&!infostudent['birthProvinceCityId'].modify">
                        <el-cascader
                            @change="birthProvinceCityIdchange(infostudent['birthProvinceCityId'])"  
                            :options="cityList"
                            v-model="birthProvinceCityIdval"
                            :disabled="!infostudent['birthProvinceCityId'].modify"
                            expand-trigger="hover"
                            change-on-select
                            filterable
                            clearable>
                        </el-cascader>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['birthProvinceCityId']&&infostudent['birthProvinceCityId'].visible&&infostudent['birthProvinceCityId'].modify==false">
                        <el-cascader
                            @change="feabackinfo(infostudent['birthProvinceCityId'])"  
                            :options="cityList"
                            v-model="infostudent['birthProvinceCityId'].value"
                            :disabled="infostudent['birthProvinceCityId'].modify"
                            expand-trigger="hover"
                            change-on-select
                            filterable
                            clearable>
                        </el-cascader>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="籍贯" v-if="infostudent['nativeProvinceCityId']&&infostudent['nativeProvinceCityId'].visible&&!infostudent['nativeProvinceCityId'].modify">
                        <el-cascader
                            @change="birthProvinceCityIdchange(infostudent['nativeProvinceCityId'])" 
                            :options="cityList"
                            v-model="nativeProvinceCityIdval"
                                :disabled="!infostudent['nativeProvinceCityId'].modify"
                            expand-trigger="hover"
                            change-on-select
                            filterable
                            clearable>
                        </el-cascader>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['nativeProvinceCityId']&&infostudent['nativeProvinceCityId'].visible&&infostudent['nativeProvinceCityId'].modify==false">
                        <el-cascader
                            @change="feabackinfo(infostudent['nativeProvinceCityId'])" 
                            :options="cityList"
                            v-model="infostudent['nativeProvinceCityId'].value"
                            :disabled="infostudent['nativeProvinceCityId'].modify"
                            expand-trigger="hover"
                            change-on-select
                            filterable
                            clearable>
                        </el-cascader>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="生源地" v-if="infostudent['sourceProvinceCityId']&&infostudent['sourceProvinceCityId'].visible&&!infostudent['sourceProvinceCityId'].modify">
                        <el-cascader
                            @change="birthProvinceCityIdchange(infostudent['sourceProvinceCityId'])" 
                            :options="cityList"
                            v-model="sourceProvinceCityIdval"
                            :disabled="!infostudent['sourceProvinceCityId'].modify"
                            expand-trigger="hover"
                            change-on-select
                            filterable
                            clearable>
                        </el-cascader>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['sourceProvinceCityId']&&infostudent['sourceProvinceCityId'].visible&&infostudent['sourceProvinceCityId'].modify==false">
                        <el-cascader
                            @change="feabackinfo(infostudent['sourceProvinceCityId'])" 
                            :options="cityList"
                            v-model="infostudent['sourceProvinceCityId'].value"
                            :disabled="infostudent['sourceProvinceCityId'].modify"
                            expand-trigger="hover"
                            change-on-select
                            filterable
                            clearable>
                        </el-cascader>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="政治面貌" v-if="infostudent['politicsStatusId']&&infostudent['politicsStatusId'].visible&&!infostudent['politicsStatusId'].modify">
                        <el-select  @change="birthProvinceCityIdchange(infostudent['politicsStatusId'])"  v-model="politicsStatusIdval"  :disabled="!infostudent['politicsStatusId'].modify" placeholder="请选择" clearable filterable>
                            <el-option 
                                v-for="item in politicalList" 
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id"> 
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['politicsStatusId']&&infostudent['politicsStatusId'].visible&&infostudent['politicsStatusId'].modify==false">
                        <el-select  @change="feabackinfo(infostudent['politicsStatusId'])"  v-model="infostudent['politicsStatusId'].value"  :disabled="infostudent['politicsStatusId'].modify" placeholder="请选择" clearable filterable>
                            <el-option 
                                v-for="item in politicalList" 
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id"> 
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="健康状况" v-if="infostudent['healthStatusId']&&infostudent['healthStatusId'].visible&&!infostudent['healthStatusId'].modify">
                        <el-select  v-model="infostudent['healthStatusId'].originalValue"  placeholder="请选择" clearable filterable  :disabled="!infostudent['healthStatusId'].modify" @change="birthProvinceCityIdchange(infostudent['healthStatusId'])">
                            <el-option 
                                v-for="item in healthList" 
                                :key="item.value" 
                                :label="item.name" 
                                :value="item.value"> 
                            </el-option>
                        </el-select>
                        
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['healthStatusId']&&infostudent['healthStatusId'].visible&&infostudent['healthStatusId'].modify==false">
                        <el-select  v-model="infostudent['healthStatusId'].value"  placeholder="请选择" clearable filterable  :disabled="infostudent['healthStatusId'].modify" @change="feabackinfo(infostudent['healthStatusId'])">
                            <el-option 
                                v-for="item in healthList" 
                                :key="item.value" 
                                :label="item.name" 
                                :value="item.value"> 
                            </el-option>
                        </el-select>
                       
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="证件类型"  v-if="infostudent['cardTypeId']&&infostudent['cardTypeId'].visible&&!infostudent['cardTypeId'].modify">
                        <el-select   @change="birthProvinceCityIdchange(infostudents['cardTypeId'])" v-model="cardTypeIdval" :disabled="!infostudent['cardTypeId'].modify"  placeholder="请选择" clearable filterable>
                            <el-option 
                                v-for="item in idCategoryList" 
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id"> 
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['cardTypeId']&&infostudent['cardTypeId'].visible&&infostudent['cardTypeId'].modify==false">
                        <el-select   @change="feabackinfo(infostudent['cardTypeId'])" v-model="infostudent['cardTypeId'].value" :disabled="infostudent['cardTypeId'].modify"  placeholder="请选择" clearable filterable>
                            <el-option 
                                v-for="item in idCategoryList" 
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id"> 
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="户口性质" v-if="infostudent['registerTypeId']&&infostudent['registerTypeId'].visible&&!infostudent['registerTypeId'].modify">
                        <el-select  @change="birthProvinceCityIdchange(infostudent['registerTypeId'])" v-model="registerTypeIdval" placeholder="请选择" clearable filterable  :disabled="!infostudent['registerTypeId'].modify">
                            <el-option 
                                v-for="item in registerList" 
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id"> 
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['registerTypeId']&&infostudent['registerTypeId'].visible&&infostudent['registerTypeId'].modify==false">
                        <el-select  @change="feabackinfo(infostudent['registerTypeId'])" v-model="infostudent['registerTypeId'].value" placeholder="请选择" clearable filterable  :disabled="infostudent['registerTypeId'].modify">
                            <el-option 
                                v-for="item in registerList" 
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id"> 
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="户口所在地" v-if="infostudent['registerProvinceCityId']&&infostudent['registerProvinceCityId'].visible&&!infostudent['registerProvinceCityId'].modify">
                        <el-cascader
                            @change="birthProvinceCityIdchange(infostudent['registerProvinceCityId'])" 
                            :options="cityList"
                            v-model="registerProvinceCityIdval"
                            :disabled="!infostudent['registerProvinceCityId'].modify"
                            expand-trigger="hover"
                            change-on-select
                            filterable
                            clearable>
                        </el-cascader>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['registerProvinceCityId']&&infostudent['registerProvinceCityId'].visible&&infostudent['registerProvinceCityId'].modify==false">
                        <el-cascader
                            @change="feabackinfo(infostudent['registerProvinceCityId'])" 
                            :options="cityList"
                            v-model="infostudent['registerProvinceCityId'].value"
                            :disabled="infostudent['registerProvinceCityId'].modify"
                            expand-trigger="hover"
                            change-on-select
                            filterable
                            clearable>
                        </el-cascader>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="应届生" v-if="infostudent['stuModelId']&&infostudent['stuModelId'].visible&&!infostudent['stuModelId'].modify">
                        <el-select  v-model="infostudent['stuModelId'].originalValue"  placeholder="请选择" clearable filterable  :disabled="!infostudent['stuModelId'].modify" @change="birthProvinceCityIdchange(infostudent['stuModelId'])">
                            <el-option 
                                v-for="item in stuModelList" 
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id"> 
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['stuModelId']&&infostudent['stuModelId'].visible&&infostudent['stuModelId'].modify==false">
                        <el-select  v-model="infostudent['stuModelId'].value"  placeholder="请选择" clearable filterable  :disabled="infostudent['stuModelId'].modify" @change="feabackinfo(infostudent['stuModelId'])">
                            <el-option 
                                v-for="item in stuModelList" 
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id"> 
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
         <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="Email" v-if="infostudent['email']&&infostudent['email'].visible&&!infostudent['email'].modify">
                        <el-input  @change="spellNamechange(infostudent['email'])"  v-model="infostudent['email'].originalValue" @blur="filterMobile(1,infostudent['email'].originalValue)"  :disabled="!infostudent['email'].modify"></el-input>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['email']&&infostudent['email'].visible&&infostudent['email'].modify==false">
                        <el-input v-model="infostudent['email'].value"  :disabled="infostudent['email'].modify"  @change="feabackinfo(infostudent['email'])"
                        class="">
                        </el-input>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
         <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="手机号" v-if="infostudent['mobile']&&infostudent['mobile'].visible&&!infostudent['mobile'].modify">
                        <el-input  @change="spellNamechange(infostudent['mobile'])"  v-model="infostudent['mobile'].originalValue" @blur="filterMobile(1,infostudent['mobile'].originalValue)"  :disabled="!infostudent['mobile'].modify"></el-input>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['mobile']&&infostudent['mobile'].visible&&infostudent['mobile'].modify==false">
                        <el-input v-model="infostudent['mobile'].value"  :disabled="infostudent['mobile'].modify"  @change="feabackinfo(infostudent['mobile'])"
                        class="">
                        </el-input>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="微信" v-if="infostudent['wechat']&&infostudent['wechat'].visible&&!infostudent['wechat'].modify">
                        <el-input  @change="spellNamechange(infostudent['wechat'])"  v-model="infostudent['wechat'].originalValue"  :disabled="!infostudent['wechat'].modify"></el-input>
                    </el-form-item> 
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['wechat']&&infostudent['wechat'].visible&&infostudent['wechat'].modify==false">
                        <el-input v-model="infostudent['wechat'].value" :disabled="infostudent['wechat'].modify"  @change="feabackinfo(infostudent['wechat'])"
                        class="">
                        </el-input>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="qq" v-if="infostudent['qq']&&infostudent['qq'].visible&&!infostudent['qq'].modify">
                        <el-input   @change="spellNamechange(infostudent['qq'])"   v-model="infostudent['qq'].originalValue"  :disabled="!infostudent['qq'].modify"></el-input>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['qq']&&infostudent['qq'].visible&&infostudent['qq'].modify==false">
                        <el-input v-model="infostudent['qq'].value" :disabled="infostudent['qq'].modify"  @change="feabackinfo(infostudent['qq'])"
                        class="">
                        </el-input>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="学生特征" v-if="infostudent['stuFeatureId']&&infostudent['stuFeatureId'].visible&&!infostudent['stuFeatureId'].modify">
                        <el-select  v-model="infostudent['stuFeatureId'].originalValue"  placeholder="请选择" clearable filterable  :disabled="!infostudent['stuFeatureId'].modify" @change="birthProvinceCityIdchange(infostudent['stuFeatureId'])">
                            <el-option 
                                v-for="item in stufeatureList" 
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id"> 
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['stuFeatureId']&&infostudent['stuFeatureId'].visible&&infostudent['stuFeatureId'].modify==false">
                        <el-select  v-model="infostudent['stuFeatureId'].value"  placeholder="请选择" clearable filterable  :disabled="infostudent['stuFeatureId'].modify" @change="feabackinfo(infostudent['stuFeatureId'])">
                            <el-option 
                                v-for="item in stufeatureList"
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id"> 
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="父/母联系人1" v-if="infostudent['contactPerson']&&infostudent['contactPerson'].visible&&!infostudent['contactPerson'].modify">
                        <el-input  @change="spellNamechange(infostudent['contactPerson'])" v-model="infostudent['contactPerson'].originalValue"  :disabled="!infostudent['contactPerson'].modify"></el-input>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['contactPerson']&&infostudent['contactPerson'].visible&&infostudent['contactPerson'].modify==false">
                        <el-input v-model="infostudent['contactPerson'].value" :disabled="infostudent['contactPerson'].modify"  @change="feabackinfo(infostudent['contactPerson'])"
                        class="">
                        </el-input>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="联系电话1" v-if="infostudent['contactTel']&&infostudent['contactTel'].visible&&!infostudent['contactTel'].modify">
                        <el-input   @change="spellNamechange(infostudent['contactTel'])"   v-model="infostudent['contactTel'].originalValue" @blur="filterMobile(2,infostudent['contactTel'].originalValue)"  :disabled="!infostudent['contactTel'].modify"></el-input>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['contactTel']&&infostudent['contactTel'].visible&&infostudent['contactTel'].modify==false">
                        <el-input v-model="infostudent['contactTel'].value" :disabled="infostudent['contactTel'].modify"  @change="feabackinfo(infostudent['contactTel'])"
                        class="">
                        </el-input>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="邮政编码1" v-if="infostudent['postalCode']&&infostudent['postalCode'].visible&&!infostudent['postalCode'].modify">
                        <el-input   @change="spellNamechange(infostudent['postalCode'])"    v-model="infostudent['postalCode'].originalValue" @blur="filterPostalcode"  :disabled="!infostudent['postalCode'].modify"></el-input>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['postalCode']&&infostudent['postalCode'].visible&&infostudent['postalCode'].modify==false">
                        <el-input v-model="infostudent['postalCode'].value" :disabled="infostudent['postalCode'].modify"  @change="feabackinfo(infostudent['postalCode'])"
                        class="">
                        </el-input>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="家庭住址1" v-if="infostudent['address']&&infostudent['address'].visible&&!infostudent['address'].modify">
                        <el-input  @change="spellNamechange(infostudent['address'])"  v-model="infostudent['address'].originalValue"  :disabled="!infostudent['address'].modify"></el-input>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['address']&&infostudent['address'].visible&&infostudent['address'].modify==false">
                        <el-input v-model="infostudent['address'].value" :disabled="infostudent['address'].modify"  @change="feabackinfo(infostudent['address'])"
                        class="">
                        </el-input>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                     <el-form-item label="父/母联系人2" v-if="infostudent['twoContactPerson']&&infostudent['twoContactPerson'].visible&&!infostudent['twoContactPerson'].modify">
                        <el-input  @change="spellNamechange(infostudent['twoContactPerson'])" v-model="infostudent['twoContactPerson'].originalValue"  :disabled="!infostudent['twoContactPerson'].modify"></el-input>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['twoContactPerson']&&infostudent['twoContactPerson'].visible&&infostudent['twoContactPerson'].modify==false">
                        <el-input v-model="infostudent['twoContactPerson'].value" :disabled="infostudent['twoContactPerson'].modify"  @change="feabackinfo(infostudent['twoContactPerson'])"
                        class="">
                        </el-input>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="联系电话2" v-if="infostudent['twoContactTel']&&infostudent['twoContactTel'].visible&&!infostudent['twoContactTel'].modify">
                        <el-input   @change="spellNamechange(infostudent['twoContactTel'])"   v-model="infostudent['twoContactTel'].originalValue" @blur="filterMobile(2,infostudent['twoContactTel'].originalValue)"  :disabled="!infostudent['twoContactTel'].modify"></el-input>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['twoContactTel']&&infostudent['twoContactTel'].visible&&infostudent['twoContactTel'].modify==false">
                        <el-input v-model="infostudent['twoContactTel'].value" :disabled="infostudent['twoContactTel'].modify"  @change="feabackinfo(infostudent['twoContactTel'])"
                        class="">
                        </el-input>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="邮政编码2" v-if="infostudent['twoPostalCode']&&infostudent['twoPostalCode'].visible&&!infostudent['twoPostalCode'].modify">
                        <el-input   @change="spellNamechange(infostudent['twoPostalCode'])"    v-model="infostudent['twoPostalCode'].originalValue" @blur="filterPostalcode"  :disabled="!infostudent['twoPostalCode'].modify"></el-input>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['twoPostalCode']&&infostudent['twoPostalCode'].visible&&infostudent['twoPostalCode'].modify==false">
                        <el-input v-model="infostudent['twoPostalCode'].value" :disabled="infostudent['twoPostalCode'].modify"  @change="feabackinfo(infostudent['twoPostalCode'])"
                        class="">
                        </el-input>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="家庭住址2" v-if="infostudent['twoAddress']&&infostudent['twoAddress'].visible&&!infostudent['twoAddress'].modify">
                        <el-input  @change="spellNamechange(infostudent['twoAddress'])"  v-model="infostudent['twoAddress'].originalValue"  :disabled="!infostudent['twoAddress'].modify"></el-input>
                    </el-form-item>         
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['twoAddress']&&infostudent['twoAddress'].visible&&infostudent['twoAddress'].modify==false">
                        <el-input v-model="infostudent['twoAddress'].value" :disabled="infostudent['twoAddress'].modify"  @change="feabackinfo(infostudent['twoAddress'])"
                        class="">
                        </el-input>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
					<el-form-item label="入学日期" v-if="infostudent['enrollmentDate']&&infostudent['enrollmentDate'].visible&&!infostudent['enrollmentDate'].modify">
                        <el-date-picker 
						
							@change="birthProvinceCityIdchange(infostudent['enrollmentDate'])"
							:disabled="!infostudent['enrollmentDate'].modify"
                            v-model="infostudent['enrollmentDate'].originalValue" 							
							type="date" 
							value-format="yyyy-MM-dd"
							placeholder="请选择">							
							
                        </el-date-picker>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['enrollmentDate']&&infostudent['enrollmentDate'].visible&&infostudent['enrollmentDate'].modify==false">
                        <el-date-picker 
                            :disabled="infostudent['enrollmentDate'].modify"
                            v-model="infostudent['enrollmentDate'].value"  
                            type="date"  
							value-format="yyyy-MM-dd"
                            placeholder="请选择" 
                            @change="feabackinfo(infostudent['enrollmentDate'])" >
                            </el-date-picker>
                    </el-form-item>					
					
					
                </div>
            </el-col>
        </el-row> 
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="学制" v-if="infostudent['eduNumId']&&infostudent['eduNumId'].visible&&!infostudent['eduNumId'].modify">
                        <el-select v-model="infostudent['eduNumId'].originalValue==0?'':infostudent['eduNumId'].originalValue" placeholder="请选择" clearable filterable @change="birthProvinceCityIdchange(infostudent['eduNumId'])"  :disabled="!infostudent['eduNumId'].modify">
                                <el-option 
                                    v-for="item in schoolingList" 
                                    :key="item.id" 
                                    :label="item.name" 
                                    :value="item.id"> 
                                </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['eduNumId']&&infostudent['eduNumId'].visible&&infostudent['eduNumId'].modify==false">
                        <el-select v-model="infostudent['eduNumId'].value" placeholder="请选择" clearable filterable @change="feabackinfo(infostudent['eduNumId'])"  :disabled="infostudent['eduNumId'].modify">
                                <el-option 
                                    v-for="item in schoolingList" 
                                    :key="item.id" 
                                    :label="item.name" 
                                    :value="item.id"> 
                                </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="修业年限" v-if="infostudent['studyNumId']&&infostudent['studyNumId'].visible&&!infostudent['studyNumId'].modify">
                        <el-select v-model="infostudent['studyNumId'].originalValue"  placeholder="请选择" clearable filterable @change="birthProvinceCityIdchange(infostudent['studyNumId'])"  :disabled="!infostudent['studyNumId'].modify">
                                <el-option 
                                    v-for="item in yearList" 
                                    :key="item.id" 
                                    :label="item.name" 
                                    :value="item.id"> 
                                </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                     <el-form-item label="" v-if="infostudent['studyNumId']&&infostudent['studyNumId'].visible&&infostudent['studyNumId'].modify==false">
                        <el-select v-model="infostudent['studyNumId'].value"  placeholder="请选择" clearable filterable @change="feabackinfo(infostudent['studyNumId'])"  :disabled="infostudent['studyNumId'].modify">
                                <el-option 
                                    v-for="item in yearList" 
                                    :key="item.id" 
                                    :label="item.name" 
                                    :value="item.id"> 
                                </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="学习形式" v-if="infostudent['studyModelId']&&infostudent['studyModelId'].visible&&!infostudent['studyModelId'].modify">
                        <el-select  v-model="infostudent['studyModelId'].originalValue"  placeholder="请选择" clearable filterable  :disabled="!infostudent['studyModelId'].modify" @change="birthProvinceCityIdchange(infostudent['studyModelId'])">
                            <el-option 
                                v-for="item in learFormList" 
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id"> 
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['studyModelId']&&infostudent['studyModelId'].visible&&infostudent['studyModelId'].modify==false">
                        <el-select  v-model="infostudent['studyModelId'].value"  placeholder="请选择" clearable filterable  :disabled="infostudent['studyModelId'].modify" @change="feabackinfo(infostudent['studyModelId'])">
                            <el-option 
                                v-for="item in learFormList"
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id"> 
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="层次" v-if="infostudent['stageId']&&infostudent['stageId'].visible&&!infostudent['stageId'].modify">
                        <el-select  v-model="infostudent['stageId'].originalValue"  placeholder="请选择" clearable filterable  :disabled="!infostudent['stageId'].modify" @change="birthProvinceCityIdchange(infostudent['stageId'])">
                            <el-option 
                                v-for="item in educationalList" 
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id"> 
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['stageId']&&infostudent['stageId'].visible&&infostudent['stageId'].modify==false">
                        <el-select  v-model="infostudent['stageId'].value"  placeholder="请选择" clearable filterable  :disabled="infostudent['stageId'].modify" @change="feabackinfo(infostudent['stageId'])">
                            <el-option 
                                v-for="item in educationalList"
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id"> 
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="办学类型" v-if="infostudent['eduTypeId']&&infostudent['eduTypeId'].visible&&!infostudent['eduTypeId'].modify">
                        <el-select  v-model="infostudent['eduTypeId'].originalValue"  placeholder="请选择" clearable filterable  :disabled="!infostudent['eduTypeId'].modify" @change="birthProvinceCityIdchange(infostudent['eduTypeId'])">
                            <el-option 
                                v-for="item in schoolRunType" 
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id"> 
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['eduTypeId']&&infostudent['eduTypeId'].visible&&infostudent['eduTypeId'].modify==false">
                        <el-select  v-model="infostudent['eduTypeId'].value"  placeholder="请选择" clearable filterable  :disabled="infostudent['eduTypeId'].modify" @change="feabackinfo(infostudent['eduTypeId'])">
                            <el-option 
                                v-for="item in schoolRunType"
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id"> 
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="预计毕业日期" v-if="infostudent['expectDate']&&infostudent['expectDate'].visible&&!infostudent['expectDate'].modify">
                        <el-date-picker 
                            :disabled="!infostudent['expectDate'].modify"
                            v-model="infostudent['expectDate'].originalValue"  
                            type="date"  
							value-format="yyyy-MM-dd"
                            placeholder="请选择" 
                            @change="birthProvinceCityIdchange(infostudent['expectDate'])" >
                            </el-date-picker>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['expectDate']&&infostudent['expectDate'].visible&&infostudent['expectDate'].modify==false">
                        <el-date-picker 
                            :disabled="infostudent['expectDate'].modify"
                            v-model="infostudent['expectDate'].value"  
                            type="date"  
							value-format="yyyy-MM-dd"
                            placeholder="请选择" 
                            @change="feabackinfo(infostudent['expectDate'])" >
                            </el-date-picker>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="上一层次" v-if="infostudent['provStageId']&&infostudent['provStageId'].visible&&!infostudent['provStageId'].modify">
                        <el-select  v-model="infostudent['provStageId'].originalValue"  placeholder="请选择" clearable filterable  :disabled="!infostudent['provStageId'].modify" @change="birthProvinceCityIdchange(infostudent['provStageId'])">
                            <el-option 
                                v-for="item in educationalList" 
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id"> 
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['provStageId']&&infostudent['provStageId'].visible&&infostudent['provStageId'].modify==false">
                        <el-select  v-model="infostudent['provStageId'].value"  placeholder="请选择" clearable filterable  :disabled="infostudent['studyModelId'].modify" @change="feabackinfo(infostudent['provStageId'])">
                            <el-option 
                                v-for="item in educationalList"
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id"> 
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="招生季节" v-if="infostudent['seasonId']&&infostudent['seasonId'].visible&&!infostudent['seasonId'].modify">
                        <el-select  v-model="infostudent['seasonId'].originalValue"  placeholder="请选择" clearable filterable  :disabled="!infostudent['seasonId'].modify" @change="birthProvinceCityIdchange(infostudent['seasonId'])">
                            <el-option 
                                v-for="item in seasonList" 
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id"> 
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['seasonId']&&infostudent['seasonId'].visible&&infostudent['seasonId'].modify==false">
                        <el-select  v-model="infostudent['seasonId'].value"  placeholder="请选择" clearable filterable  :disabled="infostudent['seasonId'].modify" @change="feabackinfo(infostudent['seasonId'])">
                            <el-option 
                                v-for="item in seasonList"
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id"> 
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="毕业学校" v-if="infostudent['graduationSchool']&&infostudent['graduationSchool'].visible&&!infostudent['graduationSchool'].modify">
                        <el-select  v-model="infostudent['graduationSchool'].originalValue"  placeholder="请选择" clearable filterable  :disabled="!infostudent['graduationSchool'].modify" @change="spellNamechange(infostudent['graduationSchool'])">
                            <el-option 
                                v-for="item in seasonList" 
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id"> 
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['graduationSchool']&&infostudent['graduationSchool'].visible&&infostudent['graduationSchool'].modify==false">
                        <el-input @change="feabackinfo(infostudent['graduationSchool'])" :disabled="infostudent['graduationSchool'].modify" v-model="infostudent['graduationSchool'].value"></el-input>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="毕业类型" v-if="infostudent['graduationType']&&infostudent['graduationType'].visible&&!infostudent['graduationType'].modify">
                        <el-input @change="spellNamechange(infostudent['graduationType'])"  :disabled="!infostudent['graduationType'].modify" v-model="infostudent['graduationType'].originalValue"></el-input>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item v-if="infostudent['graduationType']&&infostudent['graduationType'].visible&&infostudent['graduationType'].modify == false">
                        <el-input @change="feabackinfo(infostudent['graduationType'])" :disabled="infostudent['graduationType'].modify" v-model="infostudent['graduationType'].value"></el-input>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="高考成绩" v-if="infostudent['score']&&infostudent['score'].visible&&!infostudent['score'].modify">
                        <el-select  v-model="infostudent['score'].originalValue"  placeholder="请选择" clearable filterable  :disabled="!infostudent['score'].modify" @change="spellNamechange(infostudent['score'])">
                            <el-option 
                                v-for="item in seasonList" 
                                :key="item.id" 
                                :label="item.name" 
                                :value="item.id"> 
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['score']&&infostudent['score'].visible&&infostudent['score'].modify==false">
                        <el-input v-model="infostudent['score'].value"  :disabled="infostudent['score'].modify"  @change="feabackinfo(infostudent['score'])"
                        class="">
                        </el-input>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        
        
        
        
        
        
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="拼音" v-if="infostudent['spellName']&&infostudent['spellName'].visible&&!infostudent['spellName'].modify">
                        <el-input @change="spellNamechange(infostudent['spellName'])" :disabled="!infostudent['spellName'].modify" v-model="infostudent['spellName'].originalValue"></el-input>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['spellName']&&infostudent['spellName'].visible&&infostudent['spellName'].modify==false">
                        <el-input v-model="infostudent['spellName'].value"  :disabled="infostudent['spellName'].modify"   @change="feabackinfo(infostudent['spellName'])"
                        class="">
                        </el-input>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="身份证号" v-if="infostudent['cardNum']&&infostudent['cardNum'].visible&&!infostudent['cardNum'].modify">
                        <el-input @change="spellNamechange(infostudent['cardNum'])" v-model="infostudent['cardNum'].originalValue" @blur="filterEmail"  :disabled="!infostudent['cardNum'].modify"></el-input>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['cardNum']&&infostudent['cardNum'].visible&&infostudent['cardNum'].modify==false">
                        <el-input v-model="infostudent['cardNum'].value" :disabled="infostudent['cardNum'].modify"  @change="feabackinfo(infostudent['cardNum'])"
                        class="">
                        </el-input>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        
        <!-- <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="电子邮件" v-if="infostudent['email']&&infostudent['email'].visible&&!infostudent['email'].modify">
                        <el-input  @change="spellNamechange(infostudent['email'])" v-model="infostudent['email'].originalValue" @blur="filterEmail"  :disabled="!infostudent['email'].modify"></el-input>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['email']&&infostudent['email'].visible&&infostudent['email'].modify==false">
                        <el-input v-model="infostudent['email'].value" :disabled="infostudent['email'].modify"  @change="feabackinfo(infostudent['email'])"
                        class="">
                        </el-input>
                    </el-form-item>
                </div>
            </el-col>
        </el-row> -->
        <!-- <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="生源地" v-if="infostudent['sourceProvinceCityId']&&infostudent['sourceProvinceCityId'].visible&&!infostudent['sourceProvinceCityId'].modify">
                        <el-cascader
                            @change="birthProvinceCityIdchange(infostudent['sourceProvinceCityId'])" 
                            :options="cityList"
                            v-model="sourceProvinceCityIdval"
                            :disabled="!infostudent['sourceProvinceCityId'].modify"
                            expand-trigger="hover"
                            change-on-select
                            filterable
                            clearable>
                        </el-cascader>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['sourceProvinceCityId']&&infostudent['sourceProvinceCityId'].visible&&infostudent['sourceProvinceCityId'].modify==false">
                        <el-cascader
                            @change="feabackinfo(infostudent['sourceProvinceCityId'])" 
                            :options="cityList"
                            v-model="infostudent['sourceProvinceCityId'].value"
                            :disabled="infostudent['sourceProvinceCityId'].modify"
                            expand-trigger="hover"
                            change-on-select
                            filterable
                            clearable>
                        </el-cascader>
                    </el-form-item>
                </div>
            </el-col>
        </el-row> -->
        <!-------------------- 家庭信息 ----------------------------->
        
        
        
         <!-- ---------------------------------学籍信息------------------------- -->
        
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="所在级" v-if="infostudent['enrollmentYear']&&infostudent['enrollmentYear'].visible&&!infostudent['enrollmentYear'].modify">
                        <intelligent-year-picker
                            :disabled="!infostudent['enrollmentYear'].modify"
                            v-model="enrollmentYearval" 
                            type="year" 
                            value-format="yyyy" 
                            placeholder="请选择" 
                            @change="getAdministratives(infostudent['enrollmentYear'])">
                            </intelligent-year-picker>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['enrollmentYear']&&infostudent['enrollmentYear'].visible&&infostudent['enrollmentYear'].modify==false">
                        <el-input v-model="infostudent['enrollmentYear'].value" :disabled="infostudent['enrollmentYear'].modify"  @change="feabackinfo(infostudent['enrollmentYear'])"
                        class="">
                        </el-input>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="所在专业" v-if="infostudent['majorId']&&infostudent['majorId'].visible&&!infostudent['majorId'].modify">
                        <el-select v-model="infostudent['majorId'].originalValue" placeholder="请选择" clearable filterable @change="getAdministratives(infostudent['majorId'])"  :disabled="!infostudent['majorId'].modify">
                                <el-option 
                                    v-for="item in majorList" 
                                    :key="item.id" 
                                    :label="item.name" 
                                    :value="item.id"
                                    > 
                                </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['majorId']&&infostudent['majorId'].visible&&infostudent['majorId'].modify==false">
                        <el-select v-model="infostudent['majorId'].value" placeholder="请选择" clearable filterable @change="feabackinfo(infostudent['majorId'])"  :disabled="infostudent['majorId'].modify">
                                <el-option 
                                    v-for="item in majorList" 
                                    :key="item.id" 
                                    :label="item.name" 
                                    :value="item.id"
                                    > 
                                </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="所在行政班" v-if="infostudent['administrativeClassId']&&infostudent['administrativeClassId'].visible&&!infostudent['administrativeClassId'].modify">
                        <el-select @change="birthProvinceCityIdchange(infostudent['administrativeClassId'])"  :disabled="!infostudent['administrativeClassId'].modify" v-model="administrativeClassIdval" 
                            :placeholder=" !majorIdval||!enrollmentYearval ?'请先选择年级和专业':'请选择'" clearable filterable>
                            <el-option 
                                v-for="item in administrativeList" 
                                :key="item.id" 
                                :label="item.name " 
                                :value="item.id"> 
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['administrativeClassId']&&infostudent['administrativeClassId'].visible&&infostudent['administrativeClassId'].modify==false">
                        <el-select @change="feabackinfo(infostudent['administrativeClassId'])"  :disabled="infostudent['administrativeClassId'].modify" v-model="infostudent['administrativeClassId'].value" 
                            :placeholder=" !majorIdval||!enrollmentYearval ?'请先选择年级和专业':'请选择'" clearable filterable>
                            <el-option 
                                v-for="item in administrativeList" 
                                :key="item.id" 
                                :label="item.name " 
                                :value="item.id"> 
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="学籍状态" v-if="infostudent['status']&&infostudent['status'].visible&&!infostudent['status'].modify">
                        <el-select v-model="infostudent['status'].originalValue" placeholder="请选择" clearable filterable @change="birthProvinceCityIdchange(infostudent['status'])"  :disabled="!infostudent['status'].modify">
                                <el-option 
                                v-for="item in statusList" 
                                :key="item.id" 
                                :label="item.name " 
                                :value="item.id"> 
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['status']&&infostudent['status'].visible&&infostudent['status'].modify==false">
                        <el-select v-model="infostudent['status'].value" placeholder="请选择" clearable filterable @change="feabackinfo(infostudent['status'])"  :disabled="infostudent['status'].modify">
                                <el-option 
                                v-for="item in statusList" 
                                :key="item.id" 
                                :label="item.name " 
                                :value="item.id"> 
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        
        <el-row>
            <el-col :span="12">
                <div>
                    <el-form-item label="入学方式" v-if="infostudent['entrance']&&infostudent['entrance'].visible&&!infostudent['entrance'].modify">
                        <el-select v-model="infostudent['entrance'].originalValue" placeholder="请选择" clearable filterable @change="birthProvinceCityIdchange(infostudent['entrance'])"  :disabled="!infostudent['entrance'].modify">
                            <el-option v-for="(entrance, index) of entranceList" :label="entrance.name" :value="entrance.id" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form-item label="" v-if="infostudent['entrance']&&infostudent['entrance'].visible&&infostudent['entrance'].modify==false">
                        <el-select v-model="infostudent['entrance'].value" placeholder="请选择" clearable filterable @change="feabackinfo(infostudent['entrance'])"  :disabled="infostudent['entrance'].modify">
                                <el-option v-for="(entrance, index) of entranceList" :label="entrance.name" :value="entrance.id" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
        </el-row>
        </el-form>
           
        </div>
        <!-- /22222 -->
            <div style="margin:0 20px; border: solid 1px #ddd;" class="" v-if="display_on">
                 <div class="leftbox">
               <p class="leftboxtit"></p>
               <div>
                   <el-form size="mini" label-width="96px" :label-position="labelPosition" style="margin-left:100px;">

                         <div class="fold2">
                            <p class="fonttit">如下信息如有错误，请直接修改</p>
                            <div ref="formDetail" class="studentinfo">
                             
                                    <el-form-item label="姓名" v-if="infostudent['name']&&infostudent['name'].visible&&infostudent['name'].modify">
                                        <el-input  @change="nameChange" v-model="infostudent['name'].originalValue"  :disabled="!infostudent['name'].modify"></el-input>
                                    </el-form-item>
                                     <el-form-item label="曾用名" v-if="infostudent['formerName']&&infostudent['formerName'].visible&&infostudent['formerName'].modify">
                                        <el-input @change="spellNamechange(infostudent['formerName'])"  v-model="infostudent['formerName'].originalValue"  :disabled="!infostudent['formerName'].modify"></el-input>
                                    </el-form-item>
                                    <el-form-item label="姓别" v-if="infostudent['sex']&&infostudent['sex'].visible&&infostudent['sex'].modify">
                                        <el-select  v-model="infostudent['sex'].originalValue"  placeholder="请选择" clearable filterable  :disabled="!infostudent['sex'].modify" @change="birthProvinceCityIdchange(infostudent['sex'])">
                                            <el-option 
                                                v-for="item in sexList" 
                                                :key="item.id" 
                                                :label="item.name" 
                                                :value="item.id"> 
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="国籍" v-if="infostudent['countryId']&&infostudent['countryId'].visible&&infostudent['countryId'].modify">
                                        <el-select  @change="birthProvinceCityIdchange(infostudent['countryId'])" v-model="countryIdval" placeholder="请选择" clearable filterable  :disabled="!infostudent['countryId'].modify">
                                            <el-option 
                                                v-for="item in countryList" 
                                                :key="item.id" 
                                                :label="item.name" 
                                                :value="item.id"> 
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                     <el-form-item label="民族" v-if="infostudent['nationId']&&infostudent['nationId'].visible&&infostudent['nationId'].modify">
                                        <el-select  v-model="nationIdval"  placeholder="请选择" clearable filterable  :disabled="!infostudent['nationId'].modify" @change="birthProvinceCityIdchange(infostudent['nationId'])">
                                            <el-option 
                                                v-for="item in nationList" 
                                                :key="item.id" 
                                                :label="item.name" 
                                                :value="item.id"> 
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="拼音" v-if="infostudent['spellName']&&infostudent['spellName'].visible&&infostudent['spellName'].modify">
                                        <el-input @change="spellNamechange(infostudent['spellName'])" :disabled="!infostudent['spellName'].modify" v-model="infostudent['spellName'].originalValue"></el-input>
                                    </el-form-item>
                             
                                    <el-form-item label="出生日期" v-if="infostudent['birthday']&&infostudent['birthday'].visible&&infostudent['birthday'].modify">
                                        <el-date-picker
                                            @change="birthProvinceCityIdchange(infostudent['birthday'])"
                                            :disabled="!infostudent['birthday'].modify"
                                            v-model="birthdayval" 
                                            type="date" 
                                            value-format="yyyy-MM-dd"
                                            placeholder="请选择">
                                        </el-date-picker>
                                    </el-form-item>
                                
                                    <el-form-item label="出生地" v-if="infostudent['birthProvinceCityId']&&infostudent['birthProvinceCityId'].visible&&infostudent['birthProvinceCityId'].modify">
                                        <el-cascader
                                             @change="birthProvinceCityIdchange(infostudent['birthProvinceCityId'])"  
                                            :options="cityList"
                                            v-model="birthProvinceCityIdval"
                                             :disabled="!infostudent['birthProvinceCityId'].modify"
                                            expand-trigger="hover"
                                            change-on-select
                                            filterable
                                            clearable>
                                        </el-cascader>
                                    </el-form-item>
                                   
                        
                            
                                     <el-form-item label="籍贯" v-if="infostudent['nativeProvinceCityId']&&infostudent['nativeProvinceCityId'].visible&&infostudent['nativeProvinceCityId'].modify">
                                        <el-cascader
                                             @change="birthProvinceCityIdchange(infostudent['nativeProvinceCityId'])" 
                                            :options="cityList"
                                            v-model="nativeProvinceCityIdval"
                                             :disabled="!infostudent['nativeProvinceCityId'].modify"
                                            expand-trigger="hover"
                                            change-on-select
                                            filterable
                                            clearable>
                                        </el-cascader>
                                    </el-form-item> 
                                     <el-form-item label="生源地" v-if="infostudent['sourceProvinceCityId']&&infostudent['sourceProvinceCityId'].visible&&infostudent['sourceProvinceCityId'].modify">
                                        <el-cascader
                                             @change="birthProvinceCityIdchange(infostudent['sourceProvinceCityId'])" 
                                            :options="cityList"
                                            v-model="sourceProvinceCityIdval"
                                             :disabled="!infostudent['sourceProvinceCityId'].modify"
                                            expand-trigger="hover"
                                            change-on-select
                                            filterable
                                            clearable>
                                        </el-cascader>
                                    </el-form-item> 
                                    <el-form-item label="政治面貌" v-if="infostudent['politicsStatusId']&&infostudent['politicsStatusId'].visible&&infostudent['politicsStatusId'].modify">
                                        <el-select  @change="birthProvinceCityIdchange(infostudent['politicsStatusId'])"  v-model="politicsStatusIdval"  :disabled="!infostudent['politicsStatusId'].modify" placeholder="请选择" clearable filterable>
                                            <el-option   
                                                v-for="item in politicalList" 
                                                :key="item.id" 
                                                :label="item.name" 
                                                :value="item.id"> 
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="健康状况" v-if="infostudent['healthStatusId']&&infostudent['healthStatusId'].visible&&infostudent['healthStatusId'].modify">
                                        <el-select  v-model="infostudent['healthStatusId'].originalValue"  placeholder="请选择" clearable filterable  :disabled="!infostudent['healthStatusId'].modify" @change="birthProvinceCityIdchange(infostudent['healthStatusId'])">
                                            <el-option 
                                                v-for="item in healthList" 
                                                :key="item.value" 
                                                :label="item.name" 
                                                :value="item.value"> 
                                            </el-option>
                                        </el-select>
                                        
                                    </el-form-item>
                                      <el-form-item label="证件类型"  v-if="infostudent['cardTypeId']&&infostudent['cardTypeId'].visible&&infostudent['cardTypeId'].modify">
                                        <el-select   @change="birthProvinceCityIdchange(infostudents['cardTypeId'])" v-model="cardTypeIdval" :disabled="!infostudent['cardTypeId'].modify"  placeholder="请选择" clearable filterable>
                                            <el-option 
                                                v-for="item in idCategoryList" 
                                                :key="item.id" 
                                                :label="item.name" 
                                                :value="item.id"> 
                                            </el-option>
                                        </el-select>
                                    </el-form-item>

                                    <el-form-item label="身份证号" v-if="infostudent['cardNum']&&infostudent['cardNum'].visible&&infostudent['cardNum'].modify">
                                        <el-input @change="spellNamechange(infostudent['cardNum'])" v-model="infostudent['cardNum'].originalValue" @blur="filterEmail"  :disabled="!infostudent['cardNum'].modify"></el-input>
                                    </el-form-item>

                                     <el-form-item label="户口性质" v-if="infostudent['registerTypeId']&&infostudent['registerTypeId'].visible&&infostudent['registerTypeId'].modify">
                                        <el-select  @change="birthProvinceCityIdchange(infostudent['registerTypeId'])" v-model="registerTypeIdval" placeholder="请选择" clearable filterable  :disabled="!infostudent['registerTypeId'].modify">
                                            <el-option 
                                                v-for="item in registerList" 
                                                :key="item.id" 
                                                :label="item.name" 
                                                :value="item.id"> 
                                            </el-option>
                                        </el-select>
                                    </el-form-item>

                                     <el-form-item label="户口所在地" v-if="infostudent['registerProvinceCityId']&&infostudent['registerProvinceCityId'].visible&&infostudent['registerProvinceCityId'].modify">
                                        <el-cascader
                                             @change="birthProvinceCityIdchange(infostudent['registerProvinceCityId'])"
                                            :options="cityList"
                                            v-model="registerProvinceCityIdval"
                                             :disabled="!infostudent['registerProvinceCityId'].modify"
                                            expand-trigger="hover"
                                            change-on-select
                                            filterable
                                            clearable>
                                        </el-cascader>
                                    </el-form-item> 
										
                                    <el-form-item label="应届生" v-if="infostudent['stuModelId']&&infostudent['stuModelId'].visible&&infostudent['stuModelId'].modify">
                                        <el-select  @change="birthProvinceCityIdchange(infostudent['stuModelId'])"  v-model="stuModelIdval"  :disabled="!infostudent['stuModelId'].modify" placeholder="请选择" clearable filterable>										
										
                                            <el-option 
                                                v-for="item in stuModelList" 
                                                :key="item.id" 
                                                :label="item.name" 
                                                :value="item.id"> 
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="电子邮件" v-if="infostudent['email']&&infostudent['email'].visible&&infostudent['email'].modify">
                                        <el-input  @change="spellNamechange(infostudent['email'])" v-model="infostudent['email'].originalValue" @blur="filterEmail"  :disabled="!infostudent['email'].modify"></el-input>
                                    </el-form-item>
                        
                                    <el-form-item label="手机号" v-if="infostudent['mobile']&&infostudent['mobile'].visible&&infostudent['mobile'].modify">
                                       <el-input  @change="spellNamechange(infostudent['mobile'])"  v-model="infostudent['mobile'].originalValue" @blur="filterMobile(1,infostudent['mobile'])"  :disabled="!infostudent['mobile'].modify"></el-input>
                                    </el-form-item>
                       
                                    <el-form-item label="微信" v-if="infostudent['wechat']&&infostudent['wechat'].visible&&infostudent['wechat'].modify">
                                       <el-input  @change="spellNamechange(infostudent['wechat'])"  v-model="infostudent['wechat'].originalValue"  :disabled="!infostudent['wechat'].modify"></el-input>
                                    </el-form-item> 

                                    <el-form-item label="qq" v-if="infostudent['qq']&&infostudent['qq'].visible&&infostudent['qq'].modify">
                                       <el-input   @change="spellNamechange(infostudent['qq'])"   v-model="infostudent['qq'].originalValue"  :disabled="!infostudent['qq'].modify"></el-input>
                                    </el-form-item>

                                    <el-form-item label="学生特征" v-if="infostudent['stuFeatureId']&&infostudent['stuFeatureId'].visible&&infostudent['stuFeatureId'].modify">
                                        <el-select  v-model="infostudent['stuFeatureId'].originalValue"  placeholder="请选择" clearable filterable  :disabled="!infostudent['stuFeatureId'].modify" @change="birthProvinceCityIdchange(infostudent['stuFeatureId'])">
                                            <el-option 
                                                v-for="item in stufeatureList" 
                                                :key="item.id" 
                                                :label="item.name" 
                                                :value="item.id"> 
                                            </el-option>
                                        </el-select>
                                    </el-form-item>

                                    <!-------------------- 家庭信息 ----------------------------->
                                       <el-form-item label="父/母联系人1" v-if="infostudent['contactPerson']&&infostudent['contactPerson'].visible&&infostudent['contactPerson'].modify">
                                        <el-input  @change="spellNamechange(infostudent['contactPerson'])" v-model="infostudent['contactPerson'].originalValue"  :disabled="!infostudent['contactPerson'].modify"></el-input>
                                    </el-form-item>
                                    <el-form-item label="联系电话1" v-if="infostudent['contactTel']&&infostudent['contactTel'].visible&&infostudent['contactTel'].modify">
                                        <el-input   @change="spellNamechange(infostudent['contactTel'])"   v-model="infostudent['contactTel'].originalValue" @blur="filterMobile(2,infostudent['contactTel'].originalValue)"  :disabled="!infostudent['contactTel'].modify"></el-input>
                                    </el-form-item>
                                    <el-form-item label="邮政编码1" v-if="infostudent['postalCode']&&infostudent['postalCode'].visible&&infostudent['postalCode'].modify">
                                        <el-input   @change="spellNamechange(infostudent['postalCode'])"    v-model="infostudent['postalCode'].originalValue" @blur="filterPostalcode"  :disabled="!infostudent['postalCode'].modify"></el-input>
                                    </el-form-item>
                                    <el-form-item label="家庭住址1" v-if="infostudent['address']&&infostudent['address'].visible&&infostudent['address'].modify">
                                        <el-input  @change="spellNamechange(infostudent['address'])"  v-model="infostudent['address'].originalValue"  :disabled="!infostudent['address'].modify"></el-input>
                                    </el-form-item>
                                    <el-form-item label="父/母联系人2" v-if="infostudent['twoContactPerson']&&infostudent['twoContactPerson'].visible&&infostudent['twoContactPerson'].modify">
                                        <el-input  @change="spellNamechange(infostudent['twoContactPerson'])" v-model="infostudent['twoContactPerson'].originalValue"  :disabled="!infostudent['twoContactPerson'].modify"></el-input>
                                    </el-form-item>
                                    <el-form-item label="联系电话2" v-if="infostudent['twoContactTel']&&infostudent['twoContactTel'].visible&&infostudent['twoContactTel'].modify">
                                        <el-input   @change="spellNamechange(infostudent['twoContactTel'])"   v-model="infostudent['twoContactTel'].originalValue" @blur="filterMobile(2,infostudent['twoContactTel'].originalValue)"  :disabled="!infostudent['twoContactTel'].modify"></el-input>
                                    </el-form-item>
                                    <el-form-item label="邮政编码2" v-if="infostudent['twoPostalCode']&&infostudent['twoPostalCode'].visible&&infostudent['twoPostalCode'].modify">
                                      <el-input   @change="spellNamechange(infostudent['twoPostalCode'])"    v-model="infostudent['twoPostalCode'].originalValue" @blur="filterPostalcode"  :disabled="!infostudent['twoPostalCode'].modify"></el-input>
                                    </el-form-item>

									<el-form-item label="入学日期" v-if="infostudent['enrollmentDate']&&infostudent['enrollmentDate'].visible&&infostudent['enrollmentDate'].modify">
                                       <el-date-picker 
                                            :disabled="!infostudent['enrollmentDate'].modify"
                                           v-model="infostudent['enrollmentDate'].originalValue"  
                                           type="date"  
										   value-format="yyyy-MM-dd"
                                           placeholder="请选择" 
                                           @change="birthProvinceCityIdchange(infostudent['enrollmentDate'])" >
                                           </el-date-picker>										   
                                    </el-form-item>
                                    <el-form-item label="学制" v-if="infostudent['eduNumId']&&infostudent['eduNumId'].visible&&infostudent['eduNumId'].modify">
                                        <el-select v-model="infostudent['eduNumId'].originalValue" placeholder="请选择" clearable filterable @change="birthProvinceCityIdchange(infostudent['eduNumId'])"  :disabled="!infostudent['eduNumId'].modify">
                                                <el-option 
                                                    v-for="item in schoolingList" 
                                                    :key="item.id" 
                                                    :label="item.name" 
                                                    :value="item.id"> 
                                                </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="修业年限" v-if="infostudent['studyNumId']&&infostudent['studyNumId'].visible&&infostudent['studyNumId'].modify">
                                        <el-select v-model="infostudent['studyNumId'].originalValue"  placeholder="请选择" clearable filterable @change="birthProvinceCityIdchange(infostudent['studyNumId'])"  :disabled="!infostudent['studyNumId'].modify">
                                                <el-option 
                                                    v-for="item in yearList" 
                                                    :key="item.id" 
                                                    :label="item.name" 
                                                    :value="item.id"> 
                                                </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="学习形式" v-if="infostudent['studyModelId']&&infostudent['studyModelId'].visible&&infostudent['studyModelId'].modify">
                                        <el-select  v-model="infostudent['studyModelId'].originalValue"  placeholder="请选择" clearable filterable  :disabled="!infostudent['studyModelId'].modify" @change="birthProvinceCityIdchange(infostudent['studyModelId'])">
                                            <el-option 
                                                v-for="item in learFormList" 
                                                :key="item.id" 
                                                :label="item.name" 
                                                :value="item.id"> 
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="家庭住址2" v-if="infostudent['twoAddress']&&infostudent['twoAddress'].visible&&infostudent['twoAddress'].modify">
                                       <el-input  @change="spellNamechange(infostudent['twoAddress'])"  v-model="infostudent['twoAddress'].originalValue"  :disabled="!infostudent['twoAddress'].modify"></el-input>
                                    </el-form-item>
                                    <el-form-item label="层次" v-if="infostudent['stageId']&&infostudent['stageId'].visible&&infostudent['stageId'].modify">
                                        <el-select  v-model="infostudent['stageId'].originalValue"  placeholder="请选择" clearable filterable  :disabled="!infostudent['stageId'].modify" @change="birthProvinceCityIdchange(infostudent['stageId'])">
                                            <el-option 
                                                v-for="item in educationalList" 
                                                :key="item.id" 
                                                :label="item.name" 
                                                :value="item.id"> 
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                     <el-form-item label="办学类型" v-if="infostudent['eduTypeId']&&infostudent['eduTypeId'].visible&&infostudent['eduTypeId'].modify">
                                        <el-select  v-model="infostudent['eduTypeId'].originalValue"  placeholder="请选择" clearable filterable  :disabled="!infostudent['eduTypeId'].modify" @change="birthProvinceCityIdchange(infostudent['eduTypeId'])">
                                            <el-option 
                                                v-for="item in schoolRunType" 
                                                :key="item.id" 
                                                :label="item.name" 
                                                :value="item.id"> 
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="预计毕业日期" v-if="infostudent['expectDate']&&infostudent['expectDate'].visible&&infostudent['expectDate'].modify">
                                       <el-date-picker 
                                            :disabled="!infostudent['expectDate'].modify"
                                           v-model="infostudent['expectDate'].originalValue"  
                                           type="date"  
										   value-format="yyyy-MM-dd"
                                           placeholder="请选择" 
                                           @change="birthProvinceCityIdchange(infostudent['expectDate'])" >
                                           </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="上一层次" v-if="infostudent['provStageId']&&infostudent['provStageId'].visible&&infostudent['provStageId'].modify">
                                        <el-select  v-model="infostudent['provStageId'].originalValue"  placeholder="请选择" clearable filterable  :disabled="!infostudent['provStageId'].modify" @change="birthProvinceCityIdchange(infostudent['provStageId'])">
                                            <el-option 
                                                v-for="item in educationalList" 
                                                :key="item.id" 
                                                :label="item.name" 
                                                :value="item.id"> 
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="招生季节" v-if="infostudent['seasonId']&&infostudent['seasonId'].visible&&infostudent['seasonId'].modify">
                                        <el-select  v-model="infostudent['seasonId'].originalValue"  placeholder="请选择" clearable filterable  :disabled="!infostudent['seasonId'].modify" @change="birthProvinceCityIdchange(infostudent['seasonId'])">
                                            <el-option 
                                                v-for="item in seasonList" 
                                                :key="item.id" 
                                                :label="item.name" 
                                                :value="item.id"> 
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="毕业学校" v-if="infostudent['graduationSchool']&&infostudent['graduationSchool'].visible&&infostudent['graduationSchool'].modify">
                                        <el-select  v-model="infostudent['graduationSchool'].originalValue"  placeholder="请选择" clearable filterable  :disabled="!infostudent['graduationSchool'].modify" @change="spellNamechange(infostudent['graduationSchool'])">
                                            <el-option 
                                                v-for="item in seasonList" 
                                                :key="item.id" 
                                                :label="item.name" 
                                                :value="item.id"> 
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="毕业类型" v-if="infostudent['graduationType']&&infostudent['graduationType'].visible&&infostudent['graduationType'].modify">
                                        <el-input v-model="infostudent['graduationType'].originalValue" placeholder="请选择" clearable filterable  :disabled="!infostudent['graduationType'].modify" @change="spellNamechange(infostudent['graduationType'])"></el-input>
                                    </el-form-item>
                                    <el-form-item label="高考成绩" v-if="infostudent['score']&&infostudent['score'].visible&&infostudent['score'].modify">
                                        <el-select  v-model="infostudent['score'].originalValue"  placeholder="请选择" clearable filterable  :disabled="!infostudent['score'].modify" @change="spellNamechange(infostudent['score'])">
                                            <el-option 
                                                v-for="item in seasonList" 
                                                :key="item.id" 
                                                :label="item.name" 
                                                :value="item.id"> 
                                            </el-option>
                                        </el-select>
                                    </el-form-item>

                                    
                                    <!-- <el-form-item label="联系电话" v-if="infostudent['contactTel']&&infostudent['contactTel'].visible&&infostudent['contactTel'].modify">
                                        <el-input   @change="spellNamechange(infostudent['contactTel'])"   v-model="infostudent['contactTel'].originalValue" @blur="filterMobile(2,infostudent['contactTel'].originalValue)"  :disabled="!infostudent['contactTel'].modify"></el-input>
                                    </el-form-item> -->

                                    <!-- <el-form-item label="邮政编码" v-if="infostudent['postalCode']&&infostudent['postalCode'].visible&&infostudent['postalCode'].modify">
                                      <el-input   @change="spellNamechange(infostudent['postalCode'])"    v-model="infostudent['postalCode'].originalValue" @blur="filterPostalcode"  :disabled="!infostudent['postalCode'].modify"></el-input>
                                    </el-form-item>
                             
                                    <el-form-item label="家庭住址" v-if="infostudent['address']&&infostudent['address'].visible&&infostudent['address'].modify">
                                       <el-input  @change="spellNamechange(infostudent['address'])"  v-model="infostudent['address'].originalValue"  :disabled="!infostudent['address'].modify"></el-input>
                                    </el-form-item> -->

                                    
                       
                                    

                                    
                             
                                    

                                    <!-- ---------------------------------学籍信息------------------------- -->

                                     

                                     <el-form-item label="所在级" v-if="infostudent['enrollmentYear']&&infostudent['enrollmentYear'].visible&&infostudent['enrollmentYear'].modify">
                                       	<intelligent-year-picker
                                            :disabled="!infostudent['enrollmentYear'].modify"
                                           v-model="enrollmentYearval" 
                                           type="year" 
                                           value-format="yyyy" 
                                           placeholder="请选择" 
                                           @change="getAdministratives(infostudent['enrollmentYear'])">
                                           </intelligent-year-picker>
                                    </el-form-item>

                                    <el-form-item label="所在专业" v-if="infostudent['majorId']&&infostudent['majorId'].visible&&infostudent['majorId'].modify">
                                        <el-select v-model="infostudent['majorId'].originalValue" placeholder="请选择" clearable filterable @change="getAdministratives(infostudent['majorId'])"  :disabled="!infostudent['majorId'].modify">
                                                <el-option 
                                                    v-for="item in majorList" 
                                                    :key="item.id" 
                                                    :label="item.name" 
                                                    :value="item.id"
                                                    > 
                                                </el-option>
                                        </el-select>
                                    </el-form-item>
                                    

                                    
                                    

                                    <el-form-item label="所在行政班" v-if="infostudent['administrativeClassId']&&infostudent['administrativeClassId'].visible&&infostudent['administrativeClassId'].modify">
                                        <el-select @change="birthProvinceCityIdchange(infostudent['administrativeClassId'])"  :disabled="!infostudent['administrativeClassId'].modify" v-model="administrativeClassIdval" 
                                            :placeholder=" !majorIdval||!enrollmentYearval ?'请先选择年级和专业':'请选择'" clearable filterable>
                                            <el-option 
                                                v-for="item in administrativeList" 
                                                :key="item.id" 
                                                :label="item.name " 
                                                :value="item.id"> 
                                            </el-option>
                                        </el-select>
                                    </el-form-item>

                                     <el-form-item label="学籍状态" v-if="infostudent['status']&&infostudent['status'].visible&&infostudent['status'].modify">
                                        <el-select v-model="infostudent['status'].originalValue" placeholder="请选择" clearable filterable @change="birthProvinceCityIdchange(infostudent['status'])"  :disabled="!infostudent['status'].modify">
                                                <el-option 
                                                v-for="item in statusList" 
                                                :key="item.id" 
                                                :label="item.name " 
                                                :value="item.id"> 
                                            </el-option>
                                        </el-select>
                                    </el-form-item>

                                    

                                    <el-form-item label="入学方式" v-if="infostudent['entrance']&&infostudent['entrance'].visible&&infostudent['entrance'].modify">
                                        <el-select v-model="infostudent['entrance'].originalValue" placeholder="请选择" clearable filterable @change="birthProvinceCityIdchange(infostudent['entrance'])"  :disabled="!infostudent['entrance'].modify">
                                                <el-option 
                                                v-for="(entrance, index) of entranceList" 
                                                :label="entrance.name" :value="entrance.id" 
                                                :key="index">
                                                </el-option>
                                        </el-select>
                                    </el-form-item>
                                    
                                    
                                    
                                   
                                    
                                    
                                    
                                    
                                    
                            </div>
                        </div>
                    </el-form>
               </div>
            </div>
           

        </div>
        <div class="block_page">
    
        </div>
    </section>
</template>

<script>
    import util from '@/util'
    
    const parametersList=["sex-code","political-status","ID-category","learning-form","schooling-length","educational-level","school-running","student-feature","nation-code","student-modal","register-type","admissions-season","study-year","education-modality"];
    export default {
        name: "my_info_modify",
        data() {
            return {
                sutinfolist:[],
                sutdentNum:'',
                saveList:[],
                statusList:[
                    {id:1,name:'在籍'},
                    {id:2,name:'非在籍'},
                ],
                nationLists:[],
               
                sexval:'',
                birthProvinceCityIdval:'',
                birthdayval:'',
                nationIdval:'',
                countryIdval:'',
                nativeProvinceCityIdval:'',//籍贯
                sourceProvinceCityIdval:'',//生源地
                registerProvinceCityIdval:'',//户口所在地
                politicsStatusIdval:'',
                cardTypeIdval:'',
                enrollmentYearval:'',
                enrollmentDateval:'',//入学日期
                majorIdval:'',
                administrativeClassIdval:'',
				stuModelIdval:'',
                display_on: false,
                labelPosition: 'right',
               /*基本信息*/
            	stuNum:'',//学号
            	testNum:'',//考号
            	name:'',//姓名
            	spellName:'',//拼音
            	formerName:'',//曾用名
            	sex:'',//性别
            	countryId:'',//国籍
            	nationId:'',//民族
            	birthday:'',//出生日期
            	birthProvinceCityId:[],//出生地*
            	nativeProvinceCityId:[],//籍贯*
            	sourceProvinceCityId:[],//生源地*
                politicsStatusId:'',//政治面貌
               
            	healthStatusId:'',//健康状况
            	cardNum:'',//证件号
            	registerTypeId:'',//户口性质
            	stuModelId:'',//往应届
            	email:'',//电子邮件
            	wechat:'',//微信
            	qq:'',//QQ
            	remark:'',//备注
				headUrl:'',//照片
            	entrance:'',//入学方式
            	cardTypeId:'',//证件类型
            	registerProvinceCityId:[],//户口所在地*
            	mobile:'',//手机号码
            	stuFeatureId:'',//考生特征
            	/*家庭信息*/
            	contactPerson:'',//父/twoAddress
            	contactTel:'',//联系电话
            	postalCode:'',//邮政编码
                address:'',//家庭地址
                
                twoContactPerson:'',//父/母联系人
            	twoContactTel:'',//联系电话
            	twoPostalCode:'',//邮政编码
            	twoAddress:'',//家庭地址
            	/*学籍信息*/
            	enrollmentDate:'',//入学日期
                enrollmentYearval:'',//所在级
                registerTypeIdval:'',//户口性质
            	eduNumId:'',//学制
            	studyNumId:'',//修业年限
            	studyModelId:'',//学习形式
            	stageId:'',//层次
            	eduTypeId:'',//办学类型
            	expectDate:'',//预计毕业日期
            	status:'',//学籍状态
            	graduationStatus:'',//毕业/结业
            	graduationDate:'',//毕业日期
            	graduationNum:'',//毕业证书
            	diplomaDate:'',//获学位日期
            	diplomaNum:'',//学位证书
            	
            	headUrl:'',//照片
            	majorId:'',//所在专业
                administrativeClassId:'',//所在行政班
                healthList: [
                    {name: '良好', value: 1},
                    {name: '残疾', value: 2}
                ],
            	eduCheckList:[{checked:false,value:1,prop:'本硕连读'},
            				  {checked:false,value:2,prop:'转出医院'},
            				  {checked:false,value:3,prop:'转入医院'},
            				  {checked:false,value:4,prop:'休学标识'},
            				  {checked:false,value:5,prop:'退学标识'},
                              {checked:false,value:6,prop:'降级标识'},
                              {checked:false,value:7,prop:'辅修学位'},
                              {checked:false,value:8,prop:'第二学位'}],
            	eduModalityId:[],//标识
            	decisionNum:'',//决议编号
            	/*上一级信息*/
            	provStageId:'',//上一层次
            	seasonId:'',//招生季节
            	graduationSchool:'',//毕业学校
            	graduationType:'',//毕业类型
            	score:'',//高考成绩
                /*其它data*/
                entranceList: [], // 入学方式
            	sexList:[],//性别
            	countryList:[],//国家
            	nationList:[],//民族
            	politicalList:[],//政治面貌
            	idCategoryList:[],//证件类型
            	learFormList:[],//学习形式
            	schoolingList:[],//学制
            	educationalList:[],//学历层次
            	schoolRunType:[],//办学类型
            	stufeatureList:[],//学生特征
            	stuModelList:[],//往应届
            	registerList:[],//户口性质
            	seasonList:[],//招生季节
            	yearList:[],//修业年限
            	modalityList:[],//复选框选项
            	cityList:[],//城市树
            	majorList:[],//专业
            	administrativeList:[],//行政班
                selectDisabled:false,//与国籍关联的选项
                infostudent:{},//学生反馈的字段
                breadcrumb: [//面包屑
                    {label: "学生管理"},
                    {label: "我的信息核对"},
                ],
                dialogTable:false,
				 btnPerObj:{//按钮权限
                  
                  change:true,
                  nochange:true,
                }
            }
        },
        watch:{
        	stuInfo: function(newval){
        		if (newval&&newval.id) {
                     
        			this.initParameters(newval)
        		}else{
	        		this.cancel()
	        	}
        	},
        	countryId: function(newval){
    			let code='';
    			this.countryList.map(function(item){
    				if (item.id==newval) {
    					code=item.code;
    				}
    			})
    			
        		if(code && code=='001'){
        			this.selectDisabled=false;
        		}else{
        			this.selectDisabled=true;
	            	this.birthProvinceCityId=[];//出生地*
	            	this.nativeProvinceCityId=[];//籍贯*
	            	this.sourceProvinceCityId=[];//生源地*
        			this.entrance='';//入学方式
                    this.politicsStatusId='';//政治面貌
                    this.cardTypeId = ''
	            	this.registerTypeId='';//户口性质
	            	this.stuModelId='';//往应届
	            	this.registerProvinceCityId=[];//户口所在地*
        		}
        	}
        },
        mounted(){
            let slef = this
            slef.getCityTree() //获取城市树
            slef.getMajorCategory(); //获取专业列表
            slef.getCountry() //获取国家列表
            this.getSchoolWay() // 入学方式
        },
        created(){
            this.getStudentVerifyInfo()
            // this.getBtnPermit()
        },
    
        methods: {
            getStudentVerifyInfo(){
                let loginId = localStorage.getItem("loginId")
                this.getstudentsfeedback(loginId)
                
            },
           
            getstudentsfeedback(loginId){
                var self=this;
                let vuex = JSON.parse(localStorage.getItem('vuex'));
                let poatData = {
                    id:0,
                    type:"student_verify_detail",
                    extend: JSON.stringify({student_no: vuex.me.user.username}),
                    userId:vuex.me.attributes.login_info.id
                }
                this.$http.post('_op:/gaojiReport/pQueryCom', poatData).then(data=>{
                    let list = JSON.parse(data.data)
                    self.sutinfolist = list
                    console.log('2222', JSON.parse(data.data))
                    for(let i=0;i<self.sutinfolist.length;i++){ 
                            let a =  self.sutinfolist[i].fieldName
                            self.infostudent[a] = self.sutinfolist[i]
                            if(self.sutinfolist[i].fieldName=='eduModalityId'){
                                if(self.sutinfolist.originalValue!=null){
                                        self.sutinfolist[i].originalValue.map(function(item1){
                                        self.eduCheckList.map(function(item2){
                                            if (item1==item2.value){
                                                item2.checked= true;
                                            }
                                        })
                                    })
                                }
                          
                            
                            }else if(self.sutinfolist[i].fieldName=='stuNum'){ // 姓名
                                if(self.sutinfolist[i].originalValue==0){
                                    self.sutdentNum =''
                                }else{
                                    self.sutdentNum = self.sutinfolist[i].originalValue
                                }
                                
                                //赋值进行绑定
                            }else if(self.sutinfolist[i].fieldName=='sex'){ //性别
                                if(self.sutinfolist[i].originalValue==0){
                                    self.sexval = ''
                                }else{
                                     self.sexval = self.sutinfolist[i].originalValue
                                }
                               
                                //赋值进行绑定
                            }else if(self.sutinfolist[i].fieldName=='birthProvinceCityId'){ //出生地
                                if(self.sutinfolist[i].value!="" || null) {
                                    self.infostudent['birthProvinceCityId'].value = self.sutinfolist[i].value.join('-').split('-')
                                }else{
                                    self.infostudent['birthProvinceCityId'].value = ""
                                }
                                if(self.sutinfolist[i].originalValue!="" ||null){
                                    self.birthProvinceCityIdval = self.sutinfolist[i].originalValue.join('-').split('-')
                                }
                               
                            }else if(self.sutinfolist[i].fieldName=='birthday'){ //出生日期
                                self.birthdayval = self.sutinfolist[i].originalValue
                            }else if(self.sutinfolist[i].fieldName=='nationId'){ //民族
                                if(self.sutinfolist[i].originalValue==0){
                                     self.nationIdval = ''
                                }else{
                                     self.nationIdval = self.sutinfolist[i].originalValue
                                }
                               
                            }else if(self.sutinfolist[i].fieldName=='countryId'){ //国籍
                                if(self.sutinfolist[i].originalValue==0){
                                    self.countryIdval = ''
                                }else{
                                    self.countryIdval = self.sutinfolist[i].originalValue
                                }
                                
                            }else if(self.sutinfolist[i].fieldName=='nativeProvinceCityId'){ //籍贯
                                if(self.sutinfolist[i].value!="" || null) {
                                    self.infostudent['nativeProvinceCityId'].value = self.sutinfolist[i].value.join('-').split('-')
                                }else{
                                    self.infostudent['nativeProvinceCityId'].value = ""
                                }
                                if(self.sutinfolist[i].originalValue!="" ||null){
                                    self.nativeProvinceCityIdval = self.sutinfolist[i].originalValue.join('-').split('-')
                                }
                               
                            }
                            else if(self.sutinfolist[i].fieldName=='sourceProvinceCityId'){ // 生源地
                                if(self.sutinfolist[i].value!="" || null) {
                                    self.infostudent['sourceProvinceCityId'].value = self.sutinfolist[i].value.join('-').split('-')
                                }else{
                                    self.infostudent['sourceProvinceCityId'].value = ""
                                }
                                if(self.sutinfolist[i].originalValue!="" ||null){
                                    self.sourceProvinceCityIdval = self.sutinfolist[i].originalValue.join('-').split('-')
                                }
                           }
                           else if(self.sutinfolist[i].fieldName=='registerProvinceCityId'){ //户口所在地
                                if(self.sutinfolist[i].value!="" || null) {
                                    self.infostudent['registerProvinceCityId'].value = self.sutinfolist[i].value.join('-').split('-')
                                }else{
                                    self.infostudent['registerProvinceCityId'].value = ""
                                }
                                if(self.sutinfolist[i].originalValue!="" ||null){
                                    self.registerProvinceCityIdval = self.sutinfolist[i].originalValue.join('-').split('-')
                                }
                               
                           } else if(self.sutinfolist[i].fieldName=='registerTypeId'){ //户口性质
                               self.infostudent['registerTypeId'].value = self.sutinfolist[i].value.toString()
                                if(self.sutinfolist[i].originalValue==0){
                                    self.registerTypeIdval = ''
                                }else{
                                    self.registerTypeIdval = self.sutinfolist[i].originalValue.toString()
                                }
                                
                            }else if(self.sutinfolist[i].fieldName=='politicsStatusId'){ //政治面貌
                                if(self.sutinfolist[i].originalValue==0){
                                    self.politicsStatusIdval = ''
                                }else{
                                    self.politicsStatusIdval = self.sutinfolist[i].originalValue
                                }
                                
                            }else if(self.sutinfolist[i].fieldName=='stuModelId'){ //应届生
                                if(self.sutinfolist[i].originalValue==0){
                                    self.stuModelIdval = ''
                                }else{
                                    self.stuModelIdval = self.sutinfolist[i].originalValue.toString()
                                }
                                
                            }else if(self.sutinfolist[i].fieldName=='enrollmentDate'){ //入学日期
                                if(self.sutinfolist[i].originalValue!=null){
                                    self.enrollmentDateval = self.sutinfolist[i].originalValue.toString()
                                }
                                
                            }else if(self.sutinfolist[i].fieldName=='enrollmentYear'){ //所在级
                                if(self.sutinfolist[i].originalValue!=null){
                                    self.enrollmentYearval = self.sutinfolist[i].originalValue.toString()
                                }
                                
                            }else if(self.sutinfolist[i].fieldName=='majorId'){ //所在专业
                                
                                if(self.sutinfolist[i].originalValue==0){
                                     self.majorIdval = ''
                                }else{
                                    self.majorIdval = self.sutinfolist[i].originalValue
                                }   
                            }else if(self.sutinfolist[i].fieldName=='administrativeClassId'){ //所在行政班
                                if(self.sutinfolist[i].originalValue==0){
                                    self.administrativeClassIdval = ''
                                }else{
                                    self.administrativeClassIdval = self.sutinfolist[i].originalValue
                                }
                                
                            }else if(self.sutinfolist[i].fieldName=='cardTypeId') { // 证件类型
                                self.infostudent['cardTypeId'].value = self.sutinfolist[i].value.toString()
                                if(self.sutinfolist[i].originalValue==0){
                                    self.cardTypeIdval = ''
                                }else{
                                    self.cardTypeIdval = self.sutinfolist[i].originalValue.toString()
                                }
                            }
                    }
                    self.display_on=true;
                    parametersList.map(function(item){
                        self.getDictsList(item)   
                        
                    });
                    self.getAdministrative()
                }).catch(err=>{
                    console.log(err)
                })
            },
             save(){//点击保存按钮 先把eduModalityId 数据加入到定义的数组里面再调请求方法
                let self=this
                //调用保存接口
                self.submission()

            },
            submission(){
                    
                let self=this;
                let studentVerifyDetailFieldList = [];
                for(let i=0;i<self.saveList.length;i++){
                    let fieldInfo = self.saveList[i].fieldInfo
                    let fieldName =  self.saveList[i].fieldName;
                    let id =  self.saveList[i].id;
                    let rid =  self.saveList[i].rid;
                    let originalValue = self.saveList[i].is == 'a' ? self.saveList[i].value : self.saveList[i].originalValue
                    let value = self.saveList[i].is == 'a' ? self.saveList[i].originalValue : self.saveList[i].value
                    let modify = self.saveList[i].modify == true ? 1 : 0
                    let List = {
                            fieldInfo: fieldInfo,
                            fieldName: fieldName,
                            id: id,
                            rid: rid,
                            value: value,
                            originalValue: originalValue,
                            modify: modify
                        }
                    studentVerifyDetailFieldList.push(List)
                }
                console.log('ttt', self.infostudent)
                let query = {
                    id:0,
                    type:10003,
                    extend:JSON.stringify({operaterType: 1,
                    stuNum: JSON.parse(localStorage.getItem('vuex')).me.user.username,
                    studentVerifyDetailFieldList:studentVerifyDetailFieldList
                   }),
                    user_id:JSON.parse(localStorage.getItem('vuex')).me.attributes.login_info.id
                }
                
                 self.$http.post('_op:/approve/pTransCom',query).then(data=>{
                     if(data.code==0){
                         self.$message.success("修改成功！");
                     }else{
                          self.$message.error(data.msg);
                     }
                })
            
         
            },
            studentStatusCheck(val) {  //新增方法退学方法
                if(val.checked==true && val.prop=='退学标识' && val.value=='5') {
                    this.status='非在籍';
                }else if(val.checked==false && val.prop=='退学标识' && val.value=='5'){
                    this.status='在籍';
                }
        	},
            // getstuInfo(stuNum){
            //     let vuex = JSON.parse(localStorage.getItem('vuex'));
            //     let postData = {
            //         id:0,
            //         type:"student_verify_detail",
            //         extend: JSON.stringify({student_no:stuNum}),
            //         userId:vuex.me.attributes.login_info.id
            //     }
            //     this.$http.post('_op:/gaojiReport/pQueryCom' ,stuNum).then(data=>{
            //         console.log(data)
            //     }).catch(err=>{
            //         console.log(err)
            //     })
            // },
            
            cancel(){
            	/*基本信息*/
            	this.stuNum='';//学号
            	this.testNum='';//考号
            	this.name='';//姓名
            	this.spellName='';//拼音
            	this.formerName='';//曾用名
            	this.sex='';//性别
            	this.countryId='';//国籍
            	this.nationId='';//民族
            	this.birthday='';//出生日期
            	this.birthProvinceCityId=[];//出生地*
            	this.nativeProvinceCityId=[];//籍贯*
            	this.sourceProvinceCityId=[];//生源地*
                this.politicsStatusId='';//政治面貌
              
            	this.healthStatusId='';//健康状况
            	this.cardNum='';//证件号
            	this.registerTypeId='';//户口性质
            	this.stuModelId='';//往应届
            	this.email='';//电子邮件
            	this.wechat='';//微信
            	this.qq='';//QQ
            	this.remark='';//备注
            	
            	
				this.headUrl='';//照片
            	this.entrance='';//入学方式
            	this.cardTypeId='';//证件类型
            	this.registerProvinceCityId=[];//户口所在地*
            	this.mobile='';//手机号码
            	this.stuFeatureId='';//考生特征
            	
            	
            	/*家庭信息*/
            	this.contactPerson='';//父/母联系人
            	this.contactTel='';//联系电话
            	this.postalCode='';//邮政编码
                this.address='';//家庭地址
                
                this.twoContactPerson='';//父/母联系人
            	this.twoContactTel='';//联系电话
            	this.twoPostalCode='';//邮政编码
            	this.twoAddress='';//家庭地址
            	
            	
            	/*学籍信息*/
            	this.enrollmentDate='';//入学日期
            	this.enrollmentYearval='';//所在级
            	this.eduNumId='';//学制
            	this.studyNumId='';//修业年限
            	this.studyModelId='';//学习形式
            	this.stageId='';//层次
            	this.eduTypeId='';//办学类型
            	this.expectDate='';//预计毕业日期
            	this.status='';//学籍状态
            	this.graduationStatus='';//毕业/结业
            	this.graduationDate='';//毕业日期
            	this.graduationNum='';//毕业证书
            	this.diplomaDate='';//获学位日期
            	this.diplomaNum='';//学位证书
            	
            	this.majorId='';//所在专业
            	this.administrativeClassId='';//所在行政班
            	this.checked_bsld=false;//本硕连读
            	this.checked_zcyy=false;//转出医院
            	this.checked_zryy=false;//转入医院
            	this.checked_xxbs=false;//休学标识
            	this.checked_txbs=false;//退学标识
            	this.checked_jjbs=false;//降级标识
            	this.decisionNum='';//决议编号
            	
            	
            	/*上一级信息*/
            	this.provStageId='';//层次
            	this.seasonId='';//招生季节
            	this.graduationSchool='';//毕业学校
            	this.graduationType='';//毕业类型
            	this.score='';//高考成绩
		    },
            verifyParameters(){
		    	var self=this;
		    	if (this.stuNum=='') {
		    		this.$message({ message: '请填写学号', type: 'warning' });
		    		return false;
		    	} else if (this.testNum=='') {
		    		this.$message({ message: '请填写考号', type: 'warning' });
		    		return false;
		    	} else if(this.name=='') {
		    		this.$message({ message: '请填写姓名', type: 'warning' });
		    		return false;
		    	} else if(this.sex=='') {
		    		this.$message({ message: '请选择性别', type: 'warning' });
		    		return false;
		    	}else if(this.birthday=='' || this.birthday==null) {
		    		this.$message({ message: '请选择出生日期', type: 'warning' });
		    		return false;
		    	} else if(this.cardTypeId=='') {
		    		this.$message({ message: '请选择证件类型', type: 'warning' });
		    		return false;
		    	} else if(this.cardNum=='') {
		    		this.$message({ message: '请填写证件号码', type: 'warning' });
		    		return false;
		    	} else if(this.enrollmentDate=='') {
		    		this.$message({ message: '请选择入学日期', type: 'warning' });
		    		return false;
		    	} else if(this.enrollmentYearval=='') {
		    		this.$message({ message: '请选择所在级', type: 'warning' });
		    		return false;
		    	} else if(this.majorId=='') {
		    		this.$message({ message: '请选择专业', type: 'warning' });
		    		return false;
		    	}
		    	
		    	if (this.administrativeClassId=='') {
		    		this.$message({ message: '请选择行政班', type: 'warning' });
		    		return false;
		    	}else{
		    		this.administrativeList.map(function(item){
		    			if (self.administrativeClassId==item.id) {
		    			
		    				self.className=item.name
		    			}
		    		})
		    	}
		    	this.eduModalityId=[];
		    	self.eduCheckList.map(function(item){
		    		if (item.checked) {
		    			self.eduModalityId.push(item.value);
		    		}
		    	})
		    	
            },
           
            yearListFind(val) {
              this.schoolingList.map((item) => {
                if(this.eduNumId === item.id) {
                  let num = item.name.substring(0,item.name.substring.length-1);
                  this.yearList.map((list) => {
                    let strY = list.name.substring(0,list.name.substring.length-1);
                    if(val == list.id && strY < num) {
                      this.$message.error('修业年限不能小于学制！')
                    }
                  })
                  
                }
                
              })
              
            },
            feabackinfo(val){
                let self = this
                let u  = val.fieldName
                 if( self.saveList.indexOf(self.infostudent[u])==-1){
                    self.saveList.push(self.infostudent[u])
                }
            },
            initParameters(row){
		    	var self=this;
				/*基本信息*/
            	this.stuNum=row.stuNum;//学号
            	this.testNum=row.testNum;//考号
            	this.name=row.name;//姓名
            	this.spellName=row.spellName;//拼音
            	this.formerName=row.formerName;//曾用名
            	this.sex=row.sex;//性别
            	this.countryId= row.countryId==0 ? '' : row.countryId;//国籍
            	this.nationId= row.nationId==0 ? '' : row.nationId;//民族
				this.birthday=row.birthday || '';//出生日期
				
            
            	//出生地*
            	row.birthProvinceCityIds.reverse().map(item=>{
            		this.birthProvinceCityId.push(item.toString())
            	})
            	
            	//籍贯*
            	row.nativeProvinceCityIds.reverse().map(item=>{
            		this.nativeProvinceCityId.push(item.toString())
            	})

            	//生源地*
            	row.sourceProvinceCityIds.reverse().map(item=>{
            		this.sourceProvinceCityId.push(item.toString())
            	})
                this.politicsStatusId=row.politicsStatusId ? parseInt(row.politicsStatusId) :'';//政治面貌
                this.cardTypeId = row.cardTypeId ?  parseInt(row.cardTypeId) :'';
            	this.healthStatusId=row.healthStatusId ? row.healthStatusId.toString() :'';//健康状况
            	this.cardNum=row.cardNum;//证件号
            	this.registerTypeId= row.registerTypeId==0 ? '' : parseInt(row.registerTypeId);//户口性质
            	this.stuModelId= row.stuModelId==0 ? '' : parseInt(row.stuModelId);//往应届
            	this.email=row.email;//电子邮件
            	this.wechat=row.wechat;//微信
            	this.qq=row.qq;//QQ
				this.remark=row.remark;//备注
				
            	this.headUrl=row.headUrl;//照片
            	this.entrance=row.entrance;//入学方式
            	this.cardTypeId=parseInt(row.cardTypeId);//证件类型
            	
            	//生源地*
            	row.registerProvinceCityIds.reverse().map(item=>{
            		this.registerProvinceCityId.push(item.toString())
            	})
            	this.mobile=row.mobile;//手机号码
            	this.stuFeatureId= row.stuFeatureId==0 ? '' :parseInt(row.stuFeatureId);//考生特征
            
            	
            	/*家庭信息*/
            	this.contactPerson=row.contactPerson;//父/母联系人
            	this.contactTel=row.contactTel;//联系电话
            	this.postalCode=row.postalCode;//邮政编码
                this.address=row.address;//家庭地址
                
                this.twoContactPerson=row.twoContactPerson;//父/母联系人
            	this.twoContactTel=row.twoContactTel;//联系电话
            	this.twoPostalCode=row.twoPostalCode;//邮政编码
            	this.twoAddress=row.twoAddress;//家庭地址
            	
            	
            	/*学籍信息*/
            	this.enrollmentDate=row.enrollmentDate || '';//入学日期
            	this.enrollmentYearval=row.enrollmentYearval+'-01-01';//所在级
            	this.eduNumId= row.eduNumId==0 ? '' : row.eduNumId;//学制
            	this.studyNumId= row.studyNumId==0 ? '' : row.studyNumId;//修业年限
            	this.studyModelId= row.studyModelId==0 ? '' : parseInt(row.studyModelId);//学习形式
            	this.stageId= row.stageId==0 ? '' : row.stageId;//层次
            	this.eduTypeId= row.eduTypeId==0 ? '' : row.eduTypeId;//办学类型
                this.expectDate=row.expectDate || '';//预计毕业日期
              
                    
                this.graduationStatus=row.graduationStatus;//毕业/结业
              
            	this.graduationDate=row.graduationDate || '';//毕业日期
                this.graduationNum=row.graduationNum;//毕业证书
                
            	this.diplomaDate=row.diplomaDate || '';//获学位日期
            	this.diplomaNum=row.diplomaNum;//学位证书
                this.majorId=row.majorId;//所在专业
                
            	
            	this.administrativeClassId = row.administrativeClassId ; //所在行政班 
            	
            	this.decisionNum=row.decisionNum;//决议编号
            	row.eduModalityId.map(function(item1){
            		self.eduCheckList.map(function(item2){
            			if (item1==item2.value) {
            				item2.checked= true;
            			}
            		})
            	})
            	/*上一级信息*/
            	this.provStageId= row.provStageId==0 ? '' : row.provStageId;//层次
            	this.seasonId= row.seasonId==0 ? '' : parseInt(row.seasonId);//招生季节
            	this.graduationSchool=row.graduationSchool;//毕业学校
            	this.graduationType=row.graduationType;//毕业类型
            	this.score= row.score==0? '' : row.score;//高考成绩
            
                //this.status=row.status.toString()==0 ? '1' :'2';//学籍状态
        		// this.getAdministrative();
            },
            returnback(){
                window.history.back(-1); 
            },
            filterPostalcode(val){//邮政编码正则校验
        		let reg=/^[1-9][0-9]{5}$/;
    			if (!reg.test(this.postalCode)) {
    				this.postalCode='';
    				this.$message.error('请正确填写邮政编码！');
    			}
        	},
            filterMobile(val,val2){//手机号码正则校验 mobile：学生手机号码，p-mobile:父母联系人手机
        		let reg=/^1[3|4|5|7|8][0-9]{9}$/;
    			if (val===1 && !reg.test(val2)) {
                    
    				this.mobile='';
    				this.$message.error('请正确填写手机号码！');
    			}else if (val===2 && !reg.test(val2)) {
    				this.contactTel='';
    				this.$message.error('请正确填写联系人手机号码！');
    			}
        	},
            filterEmail(){//邮箱正则校验
        		let reg=/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    			if (!reg.test(this.email)) {
    				this.email='';
    				this.$message.error('请正确填写邮箱！');
    			}
            },
            
            verifyFn(type){
        		if(type=='cardNum'&&this.cardNum.length>18){
        			this.cardNum=this.cardNum.substring(0,18);
        			this.$message({message: '证件号长度不能多于18位',type: 'warning'});
        		}
            },
            getCountry(){//国家查询
            	this.$http.get('_op:/dicts/combox/country-code').then(data=>{
	            	this.countryList=data.data;
	            	for(let i=0;i<this.countryList.length;i++){
	            		if(this.countryList[i].code=='001'){
	            			this.countryId=this.countryList[i].id;
	            		}
	            	}
		        	if(this.stuInfo.id){
		        		this.initParameters(this.stuInfo);
		        	}
		        	
                }).catch(()=>{
                })
            },
            getDictsList(type){//字典查询
            
                this.$http.post('_op:/dicts/getDictsList',{
                	type:type
                }).then(data=>{
                    
                	if(type==="sex-code"){
                		this.sexList=data.data;
                	}else if(type==="country-code"){
                		this.countryList=data.data;
                	}else if(type==="political-status"){
                		this.politicalList=data.data;
                	}else if(type==="ID-category"){
                        this.idCategoryList=data.data;
                        this.idCategoryList.forEach(item => {
                            item.id = item.id.toString()
                        })
                	}else if(type==="learning-form"){
                		this.learFormList=data.data;
                	}else if(type==="schooling-length"){
                		this.schoolingList=data.data;
                	}else if(type==="educational-level"){
                		this.educationalList=data.data;
                	}else if(type==="school-running"){
                		this.schoolRunType=data.data;
                	}else if(type==="student-feature"){
                		this.stufeatureList=data.data;
                	}else if(type==="nation-code"){
                		this.nationList=data.data;
                	}else if(type=="student-modal"){
                		this.stuModelList=data.data;
                	}else if(type=="register-type"){
                        this.registerList=data.data;
                        this.registerList.forEach(item => {
                            item.id = item.id.toString()
                        })
                	}else if(type=="admissions-season"){
                		this.seasonList=data.data;
                	}else if(type=="study-year"){
                		this.yearList=data.data;
                	}else if(type==="education-modality"){
                        this.modalityList=data.data;
                	}
                }).catch(()=>{
                })
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
            nameChange(val){
        		if (val) {
        			this.$http.get('_op:pingying/'+val).then(data=>{
		            	this.spellName=data.data
	                }).catch(()=>{
	                })
                }
                let self = this
                if( self.saveList.indexOf(self.infostudent['name'])==-1){
                    self.saveList.push(self.infostudent['name'])
                }
           
            },
           
            spellNamechange(val){
                let self = this
                // let obj = {
                //     fieldInfo: val.fieldInfo,
                //     fieldName: val.fieldName,
                //     fieldType: val.fieldType,
                //     id: val.id,
                //     modify: val.modify,
                //     orderNum:val.orderNum,
                //     originalValue: val.value,
                //     rid: val.rid,
                //     value: val.originalValue,
                //     visible: val.visible,
                // }
                if(self.saveList.indexOf(val) == -1) {
                    val['is'] = 'a'
                    self.saveList.push(val)
                }
                console.log('666', self.saveList)
            },   
            birthProvinceCityIdchange(data){
                let self = this
                if(self.saveList.indexOf(data) == -1) {
                    data['is'] = 'a'
                    self.saveList.push(data)
                }
                console.log('qqq', self.saveList)
                // if(val.fieldName == 'sex'){
                //     self.infostudent['sex'].value=self.sexval
                //     if( self.saveList.indexOf(self.infostudent['sex'])==-1){
                //         self.saveList.push(obj)
                //     }
                // }else  if(val.fieldName=='birthProvinceCityId'){
                //     self.infostudent['birthProvinceCityId'].value=self.birthProvinceCityIdval
                //     if( self.saveList.indexOf(self.infostudent['birthProvinceCityId'])==-1){
                //         self.saveList.push(obj)
                //     }
                // }else if(val.fieldName=='birthday'){
                //      self.infostudent['birthday'].value=self.birthdayval
                //      if( self.saveList.indexOf(self.infostudent['birthday'])==-1){
                //         self.saveList.push(obj)
                //     }
                   
                // }else if(val.fieldName=='nationId'){
                //     self.infostudent['nationId'].value=self.nationIdval
                //     if( self.saveList.indexOf(self.infostudent['nationId'])==-1){
                //         self.saveList.push(obj)
                //     }
                // }else if(val.fieldName=='countryId'){
                //     self.infostudent['countryId'].value=self.countryIdval
                //     if( self.saveList.indexOf(self.infostudent['countryId'])==-1){
                //         self.saveList.push(obj)
                //     }
                // }else if(val.fieldName=='nativeProvinceCityId'){//籍贯
                //     self.infostudent['nativeProvinceCityId'].value=self.nativeProvinceCityIdval
                //     if( self.saveList.indexOf(self.infostudent['nativeProvinceCityId'])==-1){
                //         self.saveList.push(obj)
                //     }
                // }else if(val.fieldName=='sourceProvinceCityId'){//生源地
                //     self.infostudent['sourceProvinceCityId'].value=self.sourceProvinceCityIdval
                //     if( self.saveList.indexOf(self.infostudent['sourceProvinceCityId'])==-1){
                //         self.saveList.push(obj)
                //     }
                // }
                // else if(val.fieldName=='registerProvinceCityId'){//户口所在地
                //     self.infostudent['registerProvinceCityId'].value=self.registerProvinceCityIdval
                //     if( self.saveList.indexOf(self.infostudent['registerProvinceCityId'])==-1){
                //         self.saveList.push(obj)
                //     }
                // }else if(val.fieldName=='registerTypeId'){//户口性质
                //     self.infostudent['registerTypeId'].value=self.registerTypeId
                //     if( self.saveList.indexOf(self.infostudent['registerTypeId'])==-1){
                //         self.saveList.push(obj)
                //     }
                // } else if(val.fieldName=='cardTypeId'){
                //     self.infostudent['cardTypeId'].value=self.cardTypeIdval
                //     if( self.saveList.indexOf(self.infostudent['cardTypeId'])==-1){
                //         self.saveList.push(obj)
                //     }
                // }
                //  else if(val.fieldName=='enrollmentDate'){
                //     self.infostudent['enrollmentDate'].value=self.enrollmentDateval
                //     if( self.saveList.indexOf(self.infostudent['enrollmentDate'])==-1){
                //         self.saveList.push(obj)
                //     }
                // }
                // else if(val.fieldName=='administrativeClassId'){
                //     self.infostudent['administrativeClassId'].value=self.administrativeClassIdval
                    
                //     if( self.saveList.indexOf(self.infostudent['administrativeClassId'])==-1){
                //         self.saveList.push(obj)
                //     }
                // }
                //  else if(val.fieldName=='expectDate'){ //预计毕业日期
                //     if( self.saveList.indexOf(self.infostudent['expectDate'])==-1){
                //         self.saveList.push(obj)
                //     }
                // }else if(val.fieldName=='eduNumId'){  //学制
                //     if( self.saveList.indexOf(self.infostudent['eduNumId'])==-1){
                //         self.saveList.push(obj)
                //     }
                // }else if(val.fieldName=='studyNumId'){ //修业年限
                //     if( self.saveList.indexOf(self.infostudent['studyNumId'])==-1){
                //         self.saveList.push(obj)
                //     }
                // }
                // else if(val.fieldName=='status'){ //学籍状态
                //     if( self.saveList.indexOf(self.infostudent['status'])==-1){
                //         self.saveList.push(obj)
                //     }
                // }
                // else if(val.fieldName=='entrance'){ //入学方式
                //     if( self.saveList.indexOf(self.infostudent['entrance'])==-1){
                //         self.saveList.push(obj)
                //     }
                // }
                
              
            },

            getCityTree(){//地点树
            
            	let self=this;
            	this.$http.get('_op:/province/city/tree/1').then(data=>{
	            	self.cityList=this.mapTree(data.data.children)
                }).catch(()=>{
                })
            },
            mapTree(children){
            	let self=this;
            	let objlist=[];
            	if (children.length>0) {
            		children.map(function(item){
            			if (item.children&&item.children.length>0) {
	            			objlist.push({
		            			value:item.id.toString(),
		            			label:item.cnName,
		            			children: self.mapTree(item.children)
		            		})
            			}else{
            				objlist.push({
		            			value:item.id.toString(),
		            			label:item.cnName
		            		})
            			}
            		})
            	}
            	return objlist;
            },
            getMajorCategory(){//专业
            	this.$http.get('_op:/major/combox').then(data=>{
            		this.majorList=data.data
                }).catch(()=>{
                })
            },
         
            getAdministrative(){//行政班
                
		    	let year=this.enrollmentYearval;
		    	if (this.infostudent['majorId'].originalValue!='' && this.enrollmentYearval!='') {
                    this.$http.get('_op:/administrative/class/list/'+year+'/'+this.infostudent['majorId'].originalValue).then(data=>{
                        
	            		this.administrativeList=data.data;
                        
                       
                       
	                }).catch(()=>{
                        
	                })
		    	}
            },
            getAdministratives(val){//行政班
		    	let year=this.enrollmentYearval;
		    	if (this.infostudent['majorId'].originalValue!='' && this.enrollmentYearval!='') {
                    this.$http.get('_op:/administrative/class/list/'+year+'/'+this.infostudent['majorId'].originalValue).then(data=>{
                        
                        this.administrativeList=data.data;
                        // this.infostudent['administrativeClassId'].originalValue = this.administrativeList[0].id
                        this.infostudent['administrativeClassId'].value = this.administrativeList[0].id
                        this.administrativeClassIdval= this.administrativeList[0].id
                      
                        if(val.fieldName=='enrollmentYear'){ 
                                // this.infostudent['enrollmentYear'].originalValue = this.enrollmentYearval
                                this.infostudent['enrollmentYear'].value = this.enrollmentYearval
                             if( this.saveList.indexOf(this.infostudent['enrollmentYear'])==-1){
                                 console.log('555', this.infostudent['enrollmentYear'])
                                this.saveList.push(this.infostudent['enrollmentYear'])
                            }
                        }
                        if(val.fieldName=='majorId'){
                                
                             if( this.saveList.indexOf(this.infostudent['majorId'])==-1){
                                this.saveList.push(this.infostudent['majorId'])
                            }
                        }
                        if( this.saveList.indexOf(this.infostudent['administrativeClassId'])==-1){
                            this.saveList.push(this.infostudent['administrativeClassId'])
                        }
                       
	                }).catch(()=>{
                        
	                })
		    	}
            },
        }
    }
        
    
</script>

<style scoped lang="less">
    .cm-title{
        margin:0 20px; 
        border: solid 1px #ddd;
        display: flex;
        .rightbox{
            width:40%;
             .fold2{
            border-radius: 10px;
            // border: solid 1px #ddd;
            margin: 10px 20px;
            .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
                margin-bottom: 5px; 
            }
            .fonttit{
                margin-top: -9px;
            }   
            }
           
        }
        .leftboxtit{
            
            text-align: center;
            font-weight: bold;
        }
        .rightboxtit{
            text-align: center;
            font-weight: bold;
        }
        .fold2{
            border-radius: 10px;
            // border: solid 1px #ddd;
            margin: 10px 20px;
            .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
                margin-bottom: 5px; 
            }
            .fonttit{
                margin-top: -9px;
            }   
        }
        .studentinfo{
            width: 326px;
            margin: 0 auto;
        }
    }
    .input-reg{
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
</style>