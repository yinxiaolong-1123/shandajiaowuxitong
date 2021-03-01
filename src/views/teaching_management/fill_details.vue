<!--填报明细-->
<template>
	<section class="cm-container" v-loading="conflictLoading">
		
		<div class="cm-breadcrumb" style="position:relative">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">{{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="cm-fold">
            <el-form :inline="true" size="mini">
                <div class="fold">
                    <div ref="formDetail" class="detail" > 
                        <!-- <el-form-item class="cm-collapse" v-show="fold.showBtn">
                            <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
                        </el-form-item> -->
                        <el-form-item label="学期">
	                        <el-input v-model="pramsItem.semester_name" :disabled="true"></el-input>
                        </el-form-item>
						
                        <el-form-item label="所在年级">
                            <el-input v-model="pramsItem.grade" :disabled="true"></el-input>
                        </el-form-item>

                        <el-form-item label="排课课程">
                            <el-input v-model="pramsItem.course_name" :disabled="true"></el-input>
                        </el-form-item>
                        
                        <el-form-item label="上课班">
                            <el-input v-model="pramsItem.cls_name" :disabled="true"></el-input>
                        </el-form-item>
                    </div>
                    <el-button type="primary" size="mini"  class="returnBackBoxTop  returnBack_TopStyle" style="margin-right:5px;" @click="returnBack()">返回</el-button>
                </div>
            </el-form>
        </div>
        <div class="" v-if="status!=1" style="padding: 0 20px 0px 20px;">
            <el-button size="small" type="primary" @click="batchEditingSave" :disabled="!hadSelected">
             	<template v-if="!hadSelected">批量保存</template>
                <template v-else>批量保存</template>
            </el-button>
            <el-button size="small" type="primary" @click="conflictCheck">冲突及异常检查</el-button>
            <el-button size="small" type="primary" @click="addExceptionItems">添加例外条目</el-button>

            <!-- <el-upload size="small" style="display: inline-block;margin:0 10px;" class="upload-demo" :action="'/edu/admin/import/schedule/exception/'+subPrams" :headers="headers" :show-file-list="false" :on-success="onExceptionSus">
                <el-button size="small" type="primary">导入例外条目</el-button>
            </el-upload> -->

            <el-upload size="small" style="display: inline-block;margin:0 10px;" class="upload-demo" :action="'/edu/admin/schedule/importSchedule'" :headers="headers" :show-file-list="false" :on-success="onScheduleSus">
                <el-button size="small" type="primary">导入进度表</el-button>
            </el-upload>
            <el-button @click="checkSchedule" size="small" type="primary" :loading="loadCheckSchedule">
                {{ loadCheckSchedule ? '正在加载' : '内容及学时异常' }}
            </el-button>

            <!-- <el-button size="small" type="default">
            <a style="color: #606266;" :href="'/edm/edu/admin/export/schedule/exception/'+subPrams" download="例外条目模板">
                例外条目模板
            </a>
            </el-button> -->
            <!-- 
            <el-button size="small" type="default" @click="donwloadScheduleItemTemplates">
                导出进度表1
                
            </el-button>
            <a v-show="false" ref="exportExcel"></a> -->

    
        </div>
        <template>
            <div class="cm-fold">
            <el-form :inline="true" size="mini" label-width="">
                <div class="fold">
                <div ref="formDetail" class="detail">
                    <el-form-item label="授课老师">
                    <el-select v-model="newData1" clearable   placeholder="请选择授课老师">
                            <el-option
                            v-for="item in array1"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="授课场地">
                    <el-select v-model="newData2" clearable  placeholder="请选择场地">
                            <el-option
                            v-for="item in array2"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="授课形式">
                    <el-select v-model="newData3" clearable   placeholder="请选择授课形式">
                            <el-option
                            v-for="item in array3"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="分组">
                    <el-select v-model="newData4" clearable   placeholder="请选择分组">
                            <el-option
                            v-for="item in array4"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="">
                    <el-button size="small" type="primary" class="" @click="onSearch">
                        查询
                        </el-button>
                    </el-form-item>
                </div>
                <el-button size="small" type="primary" class="returnBackBoxTop  returnBack_TopStyle" @click="donwloadScheduleItemTemplates">
                        导出进度表
                        </el-button>
                    <a v-show="false" ref="exportExcel"></a>
            
                
                </div>
            </el-form>
            </div>
        </template>
        <div class="cm-table">
            <el-table @selection-change="handleSelectionChange"
                ref="multipleTable" :data="tableData"
                border style="width: 100%" header-row-class-name="cm-dark"
                max-height="600" v-loading="tableLoading" element-loading-text="加载中……" element-loading-background="rgba(255, 255, 255, 0.8)">
                <el-table-column type="selection" fixed v-if="status==0"></el-table-column>
                <el-table-column label="授课内容" width="330" fixed>
                    <template slot-scope="scope">
                        <span class="textstyle" v-show="!scope.row.isedit">{{scope.row.teaching_content}}</span>
                        <el-select
                            v-if="status==0"
                            v-show="scope.row.isedit"
                            class="textstyle"
                            v-model="scope.row.teaching_contents"
                            filterable
                            multiple
                            column-key="date"
                            remote
                            :remote-method="getCourseContent"
                            placeholder="请选择授课内容"
                            value-key="id">
                            <el-option v-for="item in se_course_contet" :label="item.content" :value="item" :key="item.id"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="老师" width="150" fixed>
                    <template slot-scope="scope">
                        <span v-show="!scope.row.isedit">{{scope.row.teacher_names}}</span>
                        <el-select
                            v-if="status==0"
                            v-show="scope.row.isedit"
                            v-model="scope.row.teacher_ids"
                            :remote-method="getTeacher"
                            @change="teacherChange(scope.row.teacher_ids,scope.row.id)"
                            remote filterable multiple
                            placeholder="请输入老师名字">
                            <el-option v-for="(item,index) in teachersList" :label="item.name" :value="item.id" :key="index"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="week" label="周次" width="50"> </el-table-column>
                <el-table-column prop="schedule_item_date" label="日期" width="100px">
                    <template slot-scope="scope">{{scope.row.schedule_item_date | filterDate}}</template>
                </el-table-column>
                <el-table-column prop="week_name" label="星期" width="50"> </el-table-column>
                <el-table-column prop="section_nodenames" label="节次" width="70"> </el-table-column>
                <el-table-column prop="section_nodeids.length" label="节数" width="50"></el-table-column>
                <el-table-column prop="area_name" label="授课场地" width="200"> </el-table-column>
                <el-table-column prop="teaching_formname" label="授课形式" width="100"> </el-table-column>
                <el-table-column prop="group_names" label="分组" width="210">
                </el-table-column>
                <el-table-column prop="stu_num" label="学生数"  width="65" > 
                    <template slot-scope="scope">
                            <el-button type="text" @click="showAssociateDialog(scope.row)">{{scope.row.stu_num}}</el-button>
                    </template>
                
                </el-table-column>
                <el-table-column prop="status" label="状态" width="100" >
                    <template slot-scope="scope">
                                {{scope.row.status | statusFilter(scope.row.status)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" v-if="status!=1">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" :disabled="scope.row.isedit" @click="itemEdit(scope.row, false)">编辑</el-button>
                        <el-button type="text" size="small" v-if="showCopyButton(scope.row.teaching_form)" @click="itemEdit(scope.row,true)">复制</el-button>
                        <el-button @click="prostateDel(scope.row)" v-if="scope.row.is_exception!=0" type="text" size="small" style="margin-left:5px;">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-table :data="tableBottom" border style="width: 100%" align="left">

                <el-table-column prop="name" width="300"></el-table-column>

                <el-table-column>
                    <template slot-scope="scope">
                                {{scope.row.nane_title1}}&nbsp;&nbsp;{{scope.row.Proportion}}&nbsp;&nbsp;{{scope.row.nane_title2}}&nbsp;&nbsp;{{scope.row.nane_title2_score}}&nbsp;&nbsp;{{scope.row.nane_title3}}&nbsp;&nbsp;{{scope.row.nane_title3_score}}
                            </template>
                </el-table-column>
            </el-table>

        </div>
        <!-- <el-button type="primary" size="mini" class=" returnBackBoxBottom returnBack_BottomStyle" @click="returnBack()">返1回</el-button> -->


        <!-- 关联学生 -->
        <el-dialog ref="associateDialog" width="1180px" title="关联学生" :visible.sync="associateDialog.visible" :modal-append-to-body="false" :show-close="false">
            <div class="cm-flod">
                <el-form :inline="true">
                    <el-form-item label="年级">
                        <intelligent-year-picker v-model="associateDialog.selectedGrade" type="year" value-format="yyyy" size="small" style="width: 120px;" @change="getMajorsAndClasses"></intelligent-year-picker>
                    </el-form-item>
                    <el-form-item label="专业">
                        <el-select v-model="associateDialog.selectedMajor" size="small" value-key="id" clearable filterable @change="getClassList">
                            <el-option v-for="major in associateDialog.majors" :key="major.id" :label="major.name" :value="major"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="班级">
                        <el-select v-model="associateDialog.selectedClass" size="small" value-key="id" clearable filterable @change="getStudentWithClassId">
                            <el-option v-for="cls in associateDialog.classes" :key="cls.id" :label="cls.name" :value="cls"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="学号从">
                        <el-input clearable v-model="associateDialog.minStudentNum" size="small" maxlength="12" style="width: 120px;"></el-input>
                    </el-form-item>
                    <el-form-item label="至">
                        <el-input clearable v-model="associateDialog.maxStudentNum" size="small" maxlength="12" style="width: 120px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="small" @click="filterStudents">查询学生</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div style="display: flex; flex-direction: row; justify-content: space-between;">
                <div style="display: flex; flex-direction: column;">
                    <span>上课内容</span>
                    <el-table ref="scheduleItemSelectionTable" border style="width: 360px;" :data="associateDialog.candidateContents" @selection-change="scheduleItemSelectedChange" max-height="420">
                        <el-table-column label="全选" type="selection"></el-table-column>
                        <el-table-column label="授课内容" width="240px" prop="teaching_content"></el-table-column>
                        <el-table-column label="授课形式" prop="teaching_formname"></el-table-column>
                        <el-table-column label="上课组" prop="group_names"></el-table-column>
                        <el-table-column label="上课日期" prop="schedule_item_date"></el-table-column>
                        <el-table-column label="课节" prop="section_nodenames"></el-table-column>
                        <el-table-column label="周次" prop="week"></el-table-column>
                        <el-table-column label="星期几" prop="week_name"></el-table-column>
                    </el-table>
                </div>
                <div style="display: flex; flex-direction: column;">
                    <span>可选学生</span>
                    <el-table border style="width: 300px;" :data="associateDialog.shownCandidates" @selection-change="candidatesSelectedChange" max-height="420" v-loading="associateDialog.loadingCandidates" element-loading-text="加载中……" element-loading-background="rgba(255, 255, 255, 0.8)">
                        <el-table-column label="全选" type="selection"></el-table-column>
                        <el-table-column label="学号" prop="studentNo"></el-table-column>
                        <el-table-column label="姓名" prop="name"></el-table-column>
                        <!-- <el-table-column label="行政班" prop="administrativeClassName"></el-table-column> 
                        <el-table-column label="行政班" prop="administrativeClassName"></el-table-column> -->
                    </el-table>
                </div>
                <div style="display: flex; flex-direction: column; align-items:center; justify-content: center; align-content: center;">
                    <div><el-button size="mini" type="primary" style="width: 60px;"   @click="appendCandidatesToSelectedStudent()">添加</el-button></div>
                    <div><el-button size="mini" type="primary" style="width: 60px; margin-top: 13px;" @click="removeSelectedStudents">删除</el-button></div>
                </div>
                <div style="display: flex; flex-direction: column;">
                    <span>已选上课学生</span>
                    <div style="padding: 0px; height: 420px; overflow: auto;">
                        <el-collapse style="width: 380px;" v-if="associateDialog.refreshCollapse" v-model="associateDialog.collapseActived">
                            <el-collapse-item  v-for="(v,k) in associateDialog.selectedStudents" :key="k" :name="k" :title="k">
                                <el-table border  class="boxStyle" :data="associateDialog.selectedStudents[k]" @selection-change="selectedStudentChange($event, k)">
                                    <el-table-column label="全选" type="selection" width="40"></el-table-column>
                                    <el-table-column label="学号" prop="studentNo"   width="110" ></el-table-column>
                                    <el-table-column label="姓名" prop="name"  width="70"></el-table-column>
                                    <el-table-column label="行政班" prop="administrativeClassName"></el-table-column>
                                </el-table>
                            </el-collapse-item>
                        </el-collapse>
                    </div>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeAssociateDialog">取 消</el-button>
                <el-button type="primary" @click="associateStudents">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 关联学生 -->

        <!-- 冲突提醒 -->
        <el-dialog title="冲突检查提醒" :visible.sync="conflictCheckMark" :modal-append-to-body="false" :close-on-click-modal="false" width="75%">
            <el-table :data="gridData" border class="grid-table">

                <el-table-column v-for="(item,index) in gridList" :key="index" :property="item.prop" :label="item.label">

                </el-table-column>
                <el-table-column label="冲突明细" width="200">
                    <template slot-scope="scope">
                                <el-button @click="confi_detail(scope.row)" type="text" size="small">详情</el-button>
                                
                            </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="conflictCheckMark = false">关 闭</el-button>
                    </span>
        </el-dialog>

        <!--
        	冲突详情
        -->
        <el-dialog title="冲突详情" :visible.sync="confi_detail_mark" :modal-append-to-body="false" :close-on-click-modal="false" width="70%">
            <p>{{confi_title}}</p>

            <el-table :data="gridData2" v-if="confi_type!=4">
                <el-table-column :label="confi_title" align="center">
                    <el-table-column prop="schedule_item_date" label="日期">
                        <template slot-scope="scope">
                                    {{scope.row.schedule_item_date | filterDate}}
                                </template>
                    </el-table-column>
                    <!-- 测试 方法-->
                    <el-table-column prop="week" label="星期" style="color:#f00"></el-table-column>
                    <el-table-column prop="section_nodenames" label="课节">
                        <template slot-scope="scope">
                                    <span :class="confi_type == 3 ? 'colorread' :''">{{scope.row.section_nodenames}}</span>
                                </template>
                    </el-table-column>

                    <el-table-column prop="course_name" label="排课课程"></el-table-column>
                    <el-table-column prop="cls_name" label="上课班"></el-table-column>
                    <el-table-column label="场地">
                        <template slot-scope="scope">
                            <span :class="confi_type == 1 ? 'colorread' :''">{{scope.row.area_name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="上课组">
                        <template slot-scope="scope">
                            <span :class="confi_type == 2 ? 'colorread' :''">{{scope.row.group_names}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="老师" prop="teacher_names">
                    </el-table-column>
                </el-table-column>
            </el-table>
            <el-table v-else :data="studentConflicts">
                <el-table-column prop="schedulteItemDate" label="日期">
                    <template slot-scope="scope">
                        {{scope.row.schedulteItemDate | filterDate}}
                    </template>
                </el-table-column>
                <el-table-column prop="weekday" label="星期" style="color:#f00"></el-table-column>
                <el-table-column prop="sectionNodeNames" label="课节">
                    <template slot-scope="scope">
                        <span :class="confi_type == 3 ? 'colorread' :''">{{scope.row.sectionNodeNames}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="studentName" label="姓名(学号）" style="color:#f00"></el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="confi_detail_mark = false">关 闭</el-button>
                    </span>
        </el-dialog>
        <!--例外条目-->
        <el-dialog :title="editDialogTitle" :visible.sync="addExceptionItemsMark" :close-on-click-modal="false" :modal-append-to-body="false">
            <el-form ref="addExceptionForm" :model="addExceptionForm" :rules="rules">
                <el-form-item label="排课课程" class="flex-form">
                    <el-input v-model="pramsItem.course_name" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="上课班" class="flex-form">
                    <el-input v-model="pramsItem.cls_name" :disabled="true"></el-input>
                </el-form-item>

                <el-form-item label="日期" prop="schedule_item_date" class="flex-form">
                    <el-date-picker v-model="addExceptionForm.schedule_item_date" type="date" value-format="timestamp" style="width: 100%;" placeholder="选择日期" :disabled="is_edit">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="课节" prop="sectionnodelist" class="flex-form">
                    <el-select value-key="id" v-model="addExceptionForm.sectionnodelist" placeholder="请选择课节" multiple style="width: 100%;" :disabled="is_edit">
                        <el-option :label="item.name" :value="item" :key="item.id" v-for="item in lessonList"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="授课场地" prop="area_item" class="flex-form">
                    <el-select :disabled="is_edit" v-model="addExceptionForm.area_item" value-key="id"    multiple filterable placeholder="请输入授课场地" style="width: 100%;" clearable  >
                        <el-option v-for="item in areas" :key="item.id" :label="item.name" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="授课形式" prop="teaching_form_item" class="flex-form">
                    <el-select value-key="id" v-model="addExceptionForm.teaching_form_item" @change="teachingformChange" placeholder="请选择授课形式" :disabled="is_edit" style="width: 100%;">
                        <el-option v-for="item in comboxList" :key="item.id" :label="item.name" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分组" prop="groups" class="flex-form">
            
                    <template v-if="is_edit">
                        <el-select :disabled="addExceptionForm.teaching_form_item.categoryId == 0" v-model="addExceptionForm.groups" multiple value-key="id" placeholder="请选择分组" style="width: 100%;">
                            <el-option v-for="item in groupList" :label="item.name" :value="item" :key="item.group_number"></el-option>
                        </el-select>
                    </template>
                    <template v-else>
                        <el-select v-model="addExceptionForm.groups" multiple value-key="id" placeholder="请选择分组" style="width: 100%;">
                            <el-option v-for="item in groupList" :label="item.name" :value="item" :key="item.group_number"></el-option>
                        </el-select>
                    </template>
                </el-form-item>
                <el-form-item label="授课内容" prop="teaching_content_item" class="flex-form">
                    <el-select v-model="addExceptionForm.teaching_content_item" value-key="id" filterable clearable multiple :remote-method='getCourseContent' remote placeholder="请选择授课内容" style="width: 100%;">
                        <el-option :label="item.content" :value="item" v-for="item in se_course_contet" :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="授课老师" prop="teachers" class="flex-form">
                    <el-select 
                        v-model="addExceptionForm.teachers" 
                        value-key = "id" style="width:100%"
                        placeholder="请搜索选择" 
                        multiple 
                        clearable 
                        filterable
                        remote
                        reserve-keyword
                        :remote-method="getTeacher">
                        <el-option 
                            v-for="(item) in teacherList"
                            :key="item.id" 
                            :label="item.name" 
                            :value="item"> 
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label=" " prop="allow_teacher_conflict" class="flex-form">
                    <el-checkbox v-model="allow_teacher_conflict">允许其他组老师同时带本组</el-checkbox>
                </el-form-item>    
            
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addExceptionItemsMark=false">取 消</el-button>
                <el-button type="primary" @click="addExceptionSave('addExceptionForm')">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 内容及学时异常 -->
        <el-dialog title="内容及学时异常" :visible.sync="showCheckSchedule" width="800px" 
            append-to-body top="10vh" :close-on-click-modal="false">
            <p style="font-size: 16px;padding-bottom:10px;">授课形式学时不匹配</p>
            <el-table :data="checkList1" max-height="350" size="mini" border>
                <el-table-column prop="teaching_form_name" label="授课形式"></el-table-column>
                <el-table-column prop="content_row_num" label="内容条数"></el-table-column>
                <el-table-column prop="row_num" label="进度表条数"></el-table-column>
                <el-table-column prop="content_hours" label="内容总学时"></el-table-column>
                <el-table-column prop="schedule_hours" label="课表总学时"></el-table-column>
            </el-table>
            <p style="font-size: 16px;padding: 20px 0 10px;">内容异常</p>
            <el-table :data="checkList2" max-height="350" size="mini" border>
                <el-table-column prop="abnormal_type" label="异常类型" width="180"></el-table-column>
                <el-table-column prop="content" label="内容"></el-table-column>
                <el-table-column prop="teaching_form_name" label="授课形式"  width="80"></el-table-column>
                <el-table-column prop="learning_hour" label="学时" width="50"></el-table-column>
            </el-table>
        </el-dialog>
        <progress-conflict :loading.sync="conflictLoading" ref="progressConflictDialog"></progress-conflict>
        <div :class="{datamsg:true,none:datamsgnone}">
            <div class="datamhsbody">
                <p>冲突明细</p>
                <div class="cm-table">
                    <el-table    
                    ref="datamsgTable"
                    :data="datamsglist"
                    border
                    style="width: 100%"
                    height="300px"
                    header-row-class-name="cm-dark">
                    <el-table-column label="冲突类别" prop="type"  width="100px"> </el-table-column>
                    <el-table-column label="冲突描述" prop="conflict"> </el-table-column>
                    </el-table>
                </div>
                <div style=" text-align: right;padding-top: 10px;">
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" size="mini" @click="colsedatamsg">确 定</el-button>
                    </span>
                </div>
            </div>
        </div>

        <!-- 导入进度表失败详情 -->
        <el-dialog title="冲突及异常明细" :visible.sync="showErrorDialog" width="700px" 
            append-to-body top="10vh" :close-on-click-modal="false">
            <p v-if="errorList && errorList.length" style="padding-bottom:5px;">异常明细</p>
            <el-table v-if="errorList && errorList.length" :data="errorList" max-height="300" size="mini" border style="margin-bottom:10px;">
                <el-table-column prop="key" label="行号" width="60"></el-table-column>
                <el-table-column prop="value" label="描述"></el-table-column>
            </el-table>
            <p v-if="errorList2 && errorList2.length" style="padding-bottom:5px;">冲突明细</p>
            <el-table v-if="errorList2 && errorList2.length" :data="errorList2" max-height="300" size="mini" border>
                <el-table-column prop="type" label="错误类型" width="80"></el-table-column>
                <el-table-column prop="conflict" label="错误描述"></el-table-column>
            </el-table>
        </el-dialog>

    </section>
</template>

<script>
    import Vue from "vue";
    import util from '@/util'
    import moment from 'moment'
    import progressConflict from './progress_conflict'
    export default {
        components:{
            progressConflict,
        },
        data() {
            return {
                activeName:'first',
                conflictnum1:0,
                conflictnum2:0,
                conflictnum3:0,
                conflictnum4:0,

                dialogdelist1:[],
                dialogdelist2:[],
                dialogdelist3:[],
                dialogdelist4:[],


                schedule_id:'',
                datamsgnone:true,
                datamsglist:[
                
                ],//报错的数组



                tableLoading: false,
                editDialogTitle: "添加例外条目",
                array1:[],
                array2:[],
                array3:[],
                array4:[],
                associateDialog: {
                    visible: false,
                    schedule_id: '',
                    refreshCollapse: true, // 用于强制刷新已选学生的标志
                    selectedGrade: "",
                    selectedMajor: {},
                    selectedClass: {},
                    minStudentNum: "",
                    maxStudentNum: "",
                    majors: [],
                    classes: [],
                    candidates: [], // 候选学生
                    shownCandidates: [], // 过滤后需显示的候选人
                    candidateContents: [], // 候选内容
                    selectedContents:[], // 已选内容
                    selectedStudents: {}, // 已选学生
                    selectedCandidates: [], // 已选的候选学生
                    prepareRemoveStudents: {},
                    loadingCandidates: false, // 加载候选人
                    collapseActived: []
                },
                newData1:"",
                newData2:"",
                newData3:"",
                newData4:"",
                newList4:[],
                getFilterTeacher:[],//授课老师
                getFilterField:[],//授课场地
                getFilterForm:[],//授课形式
                getFilterGroup:[],//上课分组过滤
                breadcrumb: [{
                    label: "教学管理",
                    link: ""
                }, {
                    label: "进度表填报",
                    path: "/teaching_management/progress_statement"
                }, {
                    label: "填报明细",
                    path: ""
                }, ],
                fold: {
                    state: false,
                    text: '展开',
                    showBtn: false,
                },

                subPrams: this.$route.query.id, //进度表id
                pramsItem: this.$route.query, //进度表参数
                status: this.$route.query.status,

                hadSelected: false, //批量保存是否已勾选
                newtableData: [], //列表
                newtableData2:[],
                tableData:[],
                tableBottom: [{
                    name: "实际课时统计",
                    nane_title1: " 实际理论/实践:",
                    Proportion: "6/10",
                    nane_title2: "理论",
                    nane_title2_score: 6,
                    "nane_title3": "实践",
                    nane_title3_score: "10"
                }, {
                    name: "指导课时信息",
                    nane_title1: " 指导理论/实践:",
                    Proportion: "6/10",
                    nane_title2: "理论",
                    nane_title2_score: 6,
                    "nane_title3": "实践",
                    nane_title3_score: "10"
                }],
                teacherList:[],//授课老师
                addExceptionForm: {
                    schedule_item_date: "", //日期
                    teaching_form_item: {}, //授课形式对象
                    teaching_content_item: [], //授课内容对象
                    area_item: {}, //授课场地
                    sectionnodelist: [], //授课课节
                    groups: [], //授课分组
                    teachers: [] //授课教师
                },
                rules: {
                    schedule_item_date: [{
                        required: true,
                        message: '请选择日期',
                        trigger: 'blur'
                    }],
                    sectionnodelist: [{
                        required: true,
                        message: '请选择课节',
                        trigger: 'blur'
                    }],
                    area_item: [{
                        required: true,
                        message: '请选择授课场地',
                        trigger: 'blur'
                    }],
                    teaching_form_item: [{
                        required: true,
                        message: '请选择授课形式',
                        trigger: 'blur'
                    }],
                    groups: [{
                        required: true,
                        message: '请选择分组',
                        trigger: 'blur'
                    }],
                    teaching_content_item: [{
                        required: true,
                        message: '请选择授课内容',
                        trigger: 'blur'
                    }],
                    teachers: [{
                        required: true,
                        message: '请选择授课老师',
                        trigger: 'blur'
                    }],
                },
                addExceptionItemsMark: false, //添加例外条目dialog
                is_edit: false, //判断弹框是编辑还是添加

                lessonList: [], //课节数组
                areas: [], //场地数组
                comboxList: [], //授课形式数组
                teachersList: [], //老师下拉列表
                teachersListBak:[],
                se_course_contet: [], //授课内容
                groupList: [], //分组数组


                edit_rowid: "", //编辑时的id

                editList: [], //批量编辑列表

                conflictCheckMark: false, //冲突检查
                confi_detail_mark: false, //冲突详情
                confi_title: "", //冲突详情标题
                confi_type: "",
                create_user: "", //用户id
                create_username: "", //用户名
                gridData: [],
                gridData2: [],
                studentConflicts: [], //学生冲突
                gridList: [{
                        label: '冲突类型',
                        prop: 'type',
                    }, {
                        label: '冲突描述',
                        prop: 'desc',
                    }, {
                        label: '冲突数量',
                        prop: 'items.length',
                    },

                ],
                allow_teacher_conflict: false,
                load_model: {},
                conflictLoading:false,
                showCheckSchedule: false,
                checkList1:[],
                checkList2:[],
                loadCheckSchedule:false,
                errorList: [],
                errorList2: [],
                showErrorDialog:false,
            }
        },
        filters: {
            statusFilter(status) {
                let statusText = "";
                if (status == 0) {
                    statusText = "未提交"
                } else if (status == 1) {
                    statusText = "已提交"
                }
                return statusText;
            },
            filterDate(date) {
                return moment(date).format('YYYY-MM-DD')
            },
        },
        computed: {
            headers() {
                return {
                    'Access_Token': util.getStorage('token'),
                    'Authorization': util.getStorage('token')
                }
            },
        },
        mounted() {
            util.resize(this);
            window.onresize = () => {
                util.resize(this);
            };
        },
        created() {
            // this.getTableList().then(this.getTeacherListAll);
            this.filterlist()
            this.onSearch()
            this.getLessonList(); //课节
            this.getcombox(); //授课形式
            this.getTeacher();
            // this.getTeacherListAll(); //教师列表
            this.getCourseContent(); //授课内容
            this.getareas();
        },
        methods: {
            checkSchedule(){
                this.loadCheckSchedule = true;
                this.checkList1 = [];
                this.checkList2 = [];
                let query = {
                    semester_year: +this.pramsItem.semester_year,
                    semester_year_number: +this.pramsItem.semester_year_number,
                    type: 2,
                    curriculum_visual_id: +this.pramsItem.id,
                    semester_course_id: this.pramsItem.semester_course_id,
                    grade: this.pramsItem.grade,
                }
                this.$http.post('_ed:/scheduleVisualizing/checkScheduleItemContent', query).then(res => {
                    this.loadCheckSchedule = false;
                    if(res.code == 0){
                        let checkList = JSON.parse(res.data);
                        if(checkList.hours_dif && JSON.stringify(checkList.hours_dif) != '[{}]'){
                            this.checkList1 = checkList.hours_dif[0];
                        }
                        if(checkList.content_dif && JSON.stringify(checkList.content_dif) != '[{}]'){
                            this.checkList2 = checkList.content_dif[0];
                        }
                        this.showCheckSchedule = true;
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            colsedatamsg(){
                this.datamsgnone = true
                this.datamsglist = []
            },
            getconflictdelis(){

            },
            onSearch(){
                this.getTableList()
            },
            filterlist(){ //四个列表的
                let self = this
                this.$http.get('_ed:/schedule/getComboxDate/'+this.subPrams).then(res=>{
                    if(res.data!=null){
                        self.array1 = res.data.teacherList
                        self.array2 = res.data.areaList
                        self.array3 = res.data.teacherFormList
                        self.array4 = this.cancelDuplicate(res.data.groupList)
                    }
                })
                
            },
            // 去重复函数
            cancelDuplicate(arr) {
            var uniques = [];
            var stringify = {};
            for (var i = 0; i < arr.length; i++) {
                var keys = Object.keys(arr[i]);
                keys.sort(function(a, b) {
                    return (Number(a) - Number(b));
                });
                var str = '';
                for (var j = 0; j < keys.length; j++) {
                    str += JSON.stringify(keys[j]);
                    str += JSON.stringify(arr[i][keys[j]]);
                }
                console.log(str)
                if (!stringify.hasOwnProperty(str)) {
                    uniques.push(arr[i]);
                    stringify[str] = true;
                }
            }
            return uniques = uniques;
            },
            showAssociateDialog(val) {
                this.getMajorsAndClasses();
              
                this.associateDialog.visible = true;
                this.associateDialog.schedule_id = val.id;
                this.associateDialog.candidateContents = this.tableData.filter(x => (x.teaching_form == val.teaching_form && x.group_names == val.group_names));
                this.$nextTick(() => {
                    this.$refs.scheduleItemSelectionTable.toggleRowSelection(val);
                })
            },
            // 关闭关联学生对话框
            closeAssociateDialog() {
                this.associateDialog.visible = false;
                this.associateDialog.schedule_id = '';
                this.$refs.scheduleItemSelectionTable.clearSelection();
                this.associateDialog.selectedClass = {};
                this.associateDialog.selectedStudents = {};
                this.associateDialog.candidates.splice(0);
                this.associateDialog.shownCandidates.splice(0);
                this.associateDialog.selectedCandidates.splice(0);
                this.associateDialog.refreshCollapse = false;
                this.associateDialog.selectedCandidates.splice(0);
                this.$nextTick(() => {
                    this.associateDialog.refreshCollapse = true;
                })
            },
            // 获取专业列表
            getMajorsAndClasses(grade) {
                if (!grade) grade = this.associateDialog.selectedGrade;
                if (!grade) grade = '';
                var url = encodeURI(`_op:/major/combox/${grade}`);
                this.$http.get(url).then(resp => {
                    this.associateDialog.majors = resp.data;
                    this.getClassList();
                }).catch(err => {

                })
            },

            getClassList() {
                var url = '';
                if (!this.associateDialog.selectedGrade) this.associateDialog.selectedGrade = '';
                if (!this.associateDialog.selectedMajor) this.associateDialog.selectedMajor = {id: ''};

                if (this.associateDialog.selectedGrade) {
                    url = `_op:/students/class/list/${this.associateDialog.selectedGrade}`;
                    if (this.associateDialog.selectedMajor.id) {
                        url = encodeURI(`${url}/${this.associateDialog.selectedMajor.id}`);
                        this.$http.get(url).then(resp => {
                            var temp = [];
                            var otemp = {};
                            resp.data.forEach(x => {
                                if (!otemp[x.id]) {
                                    temp.push(x);
                                    otemp[x.id] = 1;
                                }
                            })
                            this.associateDialog.classes = [].concat(temp);
                         
                        }).catch(err => {

                        })
                    }
                }
            },

             getStudentWithClassId(cls) {
                var self = this;
                this.associateDialog.loadingCandidates = true;
                var url = encodeURI(`_op:/students/student/list/${cls.id}`);
                this.$http.get(url).then(resp => {
                    var temp = resp.data.filter(x => {
                        for(var k in self.associateDialog.selectedStudents) {
                            var t = self.associateDialog.selectedStudents[k].filter(y => y.id == x.id);
                            if (t.length > 0) return false;
                        }
                        return true;
                    });
                  
                    this.associateDialog.candidates = [].concat(temp);
                    this.associateDialog.shownCandidates = [].concat(temp);
                    this.associateDialog.loadingCandidates = false;
                }).catch(err => {
                    this.associateDialog.loadingCandidates = false;
                })
            },

            scheduleItemSelectedChange(val) {
                this.associateDialog.selectedContents = [].concat(val);
                let selectedContentIds = this.associateDialog.selectedContents.map(x => x.id);
                if (selectedContentIds.length <= 0) return;
                this.$http.post(`_ed:/scheduleItemStudent/list/by/ids`, selectedContentIds).then(resp => {
                    if (resp.data.length > 0) {
                        let students = resp.data.map(s => {
                            var n = {};
                            n.id = s.studentId;
                            n.studentNo = s.studentNo;
                            n.name = s.studentName;
                            n.grade = s.grade;
                             n.administrativeClassName = s.administrativeClassName;
                            return n;
                        })
                        var temp = this.associateDialog.selectedStudents;
                      
                        students.forEach(s => {
                            if (!temp) {
                                temp = {};
                            }
                            if (!temp[s.grade]) {
                                temp[s.grade] = new Array();
                            }
                      
                            let exists = temp[s.grade].filter(x => x.id == s.id);
                          
                            if (exists.length <= 0) {
                                temp[s.grade].push(JSON.parse(JSON.stringify(s)));
                            }
                        })
                     
                        this.associateDialog.refreshCollapse = false;
                        this.associateDialog.selectedStudents = temp;
                        this.$nextTick(() => {
                            this.associateDialog.refreshCollapse = true;
                        })
                    }
                }).catch(err => {

                })
            },
            candidatesSelectedChange(val) {

                this.associateDialog.selectedCandidates = val;
            },

                // 将选择的候选学生添加到已选上课学生列表
            appendCandidatesToSelectedStudent() {
                
                if (!this.associateDialog.selectedStudents[this.associateDialog.selectedGrade]) {
                    this.associateDialog.selectedStudents[this.associateDialog.selectedGrade] = new Array();
                }
              
                this.associateDialog.refreshCollapse = false;
                this.associateDialog.selectedStudents[this.associateDialog.selectedGrade] =
                this.associateDialog.selectedStudents[this.associateDialog.selectedGrade].concat(this.associateDialog.selectedCandidates);
              
           
                this.associateDialog.collapseActived = this.associateDialog.selectedStudents
               this.$nextTick(() => {
                    this.associateDialog.refreshCollapse = true;
                })
                this.associateDialog.selectedCandidates.forEach(x => {
                    this.associateDialog.candidates.forEach((v,i) => {
                        if (v.id == x.id) {
                            this.associateDialog.candidates.splice(i, 1);
                        }
                    })

                })
               
               this.associateDialog.collapseActived = [this.associateDialog.selectedGrade]
               //把左边选过的 清掉
            this.associateDialog.selectedCandidates.forEach(x => {
                this.associateDialog.shownCandidates.forEach((v, i) => {
                    if (v.id == x.id) {
                        this.associateDialog.shownCandidates.splice(i, 1);
                        
                    }
                })
            })
                
            },
            // 已选学生移除选择事件
            selectedStudentChange(val, k) {
                if (!this.associateDialog.prepareRemoveStudents[k]) {
                    this.associateDialog.prepareRemoveStudents[k] = new Array();
                }
                this.associateDialog.prepareRemoveStudents[k] = [].concat(val);
               
            },
            // 移除已经选择的学生
            removeSelectedStudents() {
                for (var k in this.associateDialog.prepareRemoveStudents) {
                  
                    this.associateDialog.prepareRemoveStudents[k].forEach(x => {
                        this.associateDialog.selectedStudents[k].forEach((v, i) => {
                            if (v.id == x.id) {
                                this.associateDialog.selectedStudents[k].splice(i, 1);
                            }
                        })
                        this.associateDialog.refreshCollapse = false;
                        if (this.associateDialog.selectedStudents[k].length <= 0) {
                            delete this.associateDialog.selectedStudents[k];
                        }
                        this.$nextTick(() => {
                            this.associateDialog.refreshCollapse = true;
                        })
                    })
                }
            },
              associateStudents() {
                const loading = this.$loading({
                    lock: true,
                    text: "保存中...",
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });

                var data = {
                    scheduleItemId: this.associateDialog.schedule_id,
                    list: []
                };
                this.associateDialog.selectedContents.forEach(c => {
                    for (var k in this.associateDialog.selectedStudents) {
                        this.associateDialog.selectedStudents[k].forEach(s => {
                            var d = {}
                            
                            d.studentId = s.id
                            d.areaId = c.area_id;
                            // d.scheduleItemId = c.id
                            data.list.push(d);
                        })
                    }
                });
                this.$http.post(`_ed:/scheduleItemStudent/addBatch`, data).then(resp => {
                     loading.close();
                    if(resp.code==0){
                       
                        this.getTableList();
                    }else if(resp.code==1){
                        if(resp.data.length>0){
                            this.datamsglist = data.data
                            this.datamsgnone = false
                            
                        }
                    }
                   
                }).catch(err => {
                    loading.close();
                })
                this.closeAssociateDialog();
            },
        
         filterStudents() {
                var temp = this.associateDialog.candidates.filter(c => {
                    var shown = false;

                    if (this.associateDialog.minStudentNum != '' && this.associateDialog.maxStudentNum !='') {
                      
                        shown = ((c.studentNo * 1) >= (this.associateDialog.minStudentNum * 1)) && ((c.studentNo * 1) <= (this.associateDialog.maxStudentNum * 1));
                    } else if (this.associateDialog.minStudentNum != '') {
                       
                        shown = ((c.studentNo * 1) >= (this.associateDialog.minStudentNum * 1))
                    } else if (this.associateDialog.maxStudentNum != '') {
                      
                        shown = ((c.studentNo * 1) <= (this.associateDialog.maxStudentNum * 1));
                    } else {
                        shown = true;
                    }
                    return shown;
                })
                this.associateDialog.shownCandidates = [].concat(temp);
            },

        //    unique(arr) {
        //     return arr.filter(function(item, index, arr) {
        //         //当前元素，在原始数组中的第一个索引==当前索引值，否则返回当前元素
        //         return arr.indexOf(item, 0) === index;
        //     });
        //  },
            showCopyButton(val) {
                // console.info(val,'232');
                var t = this.comboxList.filter(x => x.id == val);
                if (t.length > 0 ) {
                    return (t[0].categoryId != 0)
                }
                return false;
            },
          unique(arr,group_names) {
             if(group_names=='teacher_names'){
                  let hash = {};
                    arr = arr.reduce(function(item, next) {
                    hash[next.teacher_names] ? '' : hash[next.teacher_names] = true && item.push(next);
                    return item
                }, [])
                // console.log(arr,'teaching_formname')
                return arr
              }
                 if(group_names=='area_name'){
                  let hash = {};
                    arr = arr.reduce(function(item, next) {
                    hash[next.area_name] ? '' : hash[next.area_name] = true && item.push(next);
                    return item
                }, [])
                // console.log(arr,'area_name')
                return arr
              }
              if(group_names=='teaching_formname'){
                  let hash = {};
                    arr = arr.reduce(function(item, next) {
                    hash[next.teaching_formname] ? '' : hash[next.teaching_formname] = true && item.push(next);
                    return item
                }, [])
                // console.log(arr,'teaching_formname')
                return arr
              }
              
              if(group_names=='group_names'){
                  let hash = {};
                    arr = arr.reduce(function(item, next) {
                    hash[next.group_names] ? '' : hash[next.group_names] = true && item.push(next);
                    return item
                }, [])
                // console.log(arr,'group_names')
                return arr
              }
                
        },



            //  授课老师过滤
        //   changeFliterTeacher(res){
        //         // console.log('tag---', res)
        //         if (res) {
        //         var r = this.newtableData2.filter(function (x) {
        //             return x.teacher_names == res
        //         }); 
        //         this.tableData=r;
        //         } else {
        //             this.tableData = [].concat(this.newtableData2);
        //         }
        //     }, 
         // 授课场地过滤
        //   changeFliterfield(res){
        //         // console.log('tag---', res)
        //         if (res) {
        //             var r = this.newtableData2.filter(function (x) {
        //                 return x.area_name == res
        //             }); 
        //             this.tableData=r;
        //         } else {
        //             this.tableData = [].concat(this.newtableData2);
        //         }
        //     },   
            //授课形式过滤
            //  changeFliterForm(res){
            //     // console.log('tag---', res)
            //     if (res) {
            //     var r = this.newtableData2.filter(function (x) {
            //         return x.teaching_formname == res
            //     }); 
            //     this.tableData=r;
            //     }else {
            //         this.tableData = [].concat(this.newtableData2);
            //     } 
            // },  
              //分组过滤
            //  changeFliterGroup(res){
               
            //     if (res) {
            //         var r = this.newtableData2.filter(function (x) {
            //             return x.group_names == res
            //         });
             
            //         this.tableData=r;
            //     } else {
            //         this.tableData = [].concat(this.newtableData2);
            //     }
            // },  
            // 返回上一级
            returnBack() {
                // this.$router.push({
                //     path: "/teaching_management/progress_statement",
                //     query: { row: JSON.stringify( this.$route.query) }
                // }
                // );
                this.$router.back(-1);
            },
            collapseShow() {
                this.fold.state = !this.fold.state;
                this.fold.text = this.fold.state ? '收起' : '展开';
            },
            getTableList() {
                let query = {
                    schedule_id: this.subPrams,
                    teacher_id: this.newData1,
                    area_id: this.newData2,
                    teaching_form: this.newData3,
                    group_id: this.newData4
                }
                this.tableLoading = true;
                return this.$http.post("_ed:/schedule/detail/",query ).then(data => {
                    
                    if (data.code == 0) {
                        // data.data.schedule_items.map(function(item) {
                        //     item.isedit = false;
                        //     item.teaching_content_id = item.teaching_content_id == 0 ? '' : item.teaching_content_id
                        // })
                        data.data.schedule_items.forEach(x => {
                            x.isedit = false;
                            x.teaching_content_id = x.teaching_content_id == 0 ? '' : x.teaching_content_id;
                            x.allow_teacher_conflict = x.allow_teacher_conflict == 1 ? true : false;
                            if (x.teaching_content_ids && x.teaching_content_ids.length > 0) {
                                x.teaching_contents = new Array();
                                x.teaching_content_ids.forEach(id => {
                                    x.teaching_contents = x.teaching_contents.concat(this.se_course_contet.filter(c => c.id == id));
                                })
                                // x.teaching_contents = x.teaching_content_ids.map(i => {
                                //     var c = {};
                                //     c.id = i;
                                //     return c;
                                // });
                            } else {
                                x.teaching_contents = new Array();
                            }
                            
                        })
                        this.tableData = data.data.schedule_items;  
                        this.newtableData = data.data.schedule_items;
                        // this.newtableData2 = data.data.schedule_items;
                        


                        //  this.array1 = this.unique(this.newtableData,'teacher_names')
                        //   this.array2 = this.unique(this.newtableData,'area_name')
                        // this.array3 = this.unique(this.newtableData,'teaching_formname')
                        // this.array4 = this.unique(this.newtableData,'group_names')

                      
                        let exception_hours = `${data.data.exception_theory_hours}/${data.data.exception_novitiate_hours}`;
                        let real_hours = `${data.data.real_theory_hours}/${data.data.real_novitiate_hours}`;
                        this.tableBottom[0].Proportion = real_hours;
                        this.tableBottom[0].nane_title2_score = data.data.real_theory_hours;
                        this.tableBottom[0].nane_title3_score = data.data.real_novitiate_hours;
                        this.tableBottom[1].Proportion = exception_hours;
                        this.tableBottom[1].nane_title2_score = data.data.exception_theory_hours;
                        this.tableBottom[1].nane_title3_score = data.data.exception_novitiate_hours;
                    }
                    this.tableLoading = false;
                })
                .catch(err => {
                    this.tableLoading = false;
                })
            },

            batchEditingSave() { //批量保存
                let self = this;
                let itemlist = [];

                for (let i = 0; i < self.tableData.length; i++) {
                    let item = self.tableData[i];
                    if (item.isedit) {
                        if (!item.teaching_content_id) {
                            self.$message.error('第' + item.week + '周课程内容未选择，请选择');
                            return false;
                        } else if (item.teacher_ids.length == 0) {
                            self.$message.error('第' + item.week + '周老师未选择，请选择');
                            return false;
                        }
                      
                        itemlist.push({
                            id: item.id,
                            teacherIds: item.teacher_ids,
                            teaching_content: item.teaching_contents.map(x => x.content).join(','),
                            // teaching_content_ids: item.teaching_content_ids
                            teaching_content_ids: item.teaching_contents.map(x => x.id)
                        })
                        console.info(item.teaching_contents);
                    }
                }

                this.$http.post("_ed:/schedule/detail/edit2batch", {
                    items: itemlist
                }).then(data => {
                    if (data.code == 0) {
                        this.getTableList();
                        this.$message.success("批量保存成功");
                    } else {
                        this.$message.error(data.msg + data.data);
                    }
                });
            },
            handleSelectionChange(list) { //批量选择
                let self = this;
                self.tableData.map(function(item) {
                    item.isedit = false;
                })
                if (list.length == 0) {
                    self.hadSelected = false;
                } else {
                    self.hadSelected = true;

                    list.map(function(item1) {
                        item1.isedit = true;
                    })
                }
            },
            teacherChange(teacherId, id) {
                let self = this;
                let firstId = '';
                for (let i = 0; i < self.tableData.length; i++) {
                    let item = self.tableData[i];
                    if (item.isedit) {
                        firstId = item.id;
                        break;
                    }
                }

                if (id == firstId) {
                    self.tableData.map(item => {
                        if (item.isedit) {
                            item.teacher_ids = teacherId;
                        }
                    })
                }
            },

            getCourseContent(query = '', para1) { //授课内容
                //修改课程内容获取地方 TODO 并且改成多选课程内容
                let self = this;
                return self.$http.get('_ed:/semestercourse/content/' + self.pramsItem.semester_course_id, {
                    semesterCourseId: self.pramsItem.semester_course_id,
                }).then(res => {
                    if (res.code === 0) {
                        self.se_course_contet = res.data;
                       
                        // if(para1){
                        // 	this.$set(para1, "se_course_contet",this.se_course_contet );
                        // }
                    }
                })
            },
            getLessonList() { //获取课节
                this.$http.get("_op:/sectionnodes/querySectionNode").then(data => {
                    if (data.code == 0) {
                        this.lessonList = data.data;
                    } else {
                        this.$message.error(data.msg);
                    }
                })
            },
            getcombox() { //授课形式
                this.$http.get("_op:/teaching/form/combox").then(data => {
                    let self = this
                    if (data.code == 0) {
                        self.comboxList = data.data;
                       
                    } else {
                        this.$message.error(data.msg);
                    }
                })
            },
            queryTeacherList(query){
                let self = this
                var param = `name=${query}&size=60`;
                return this.$http.get(`_op:/teachers/combox3?${param}`).then(data => {
                    if (data.code == 0) {
                        var  arr = self.teachersList.concat(data.data)
                       
                        self.teachersList = arr.reverse()

                        
                        // console.log(self.teachersList,'老师列表1')
                    } else {
                        this.$message.error(data.msg);
                    }
                    return data;
                })
            },
            // 获取所有老师
            // getTeacherListAll(){
            //     this.queryTeacherList(' ').then(data => {
            //         this.teachersListBak = data.data;
            //         this.teachersList = this.filterSelectedTeacher();
            //            console.log(this.teachersList,'老师列表2')
            //         // this.array1= this.teachersList 
                    
            //     })
            // },
               unique(arr) {
                   //数组去重
                        let hash = {};
                            arr = arr.reduce(function(item, next) {
                            hash[next.id] ? '' : hash[next.id] = true && item.push(next);
                            return item
                        }, [])
                    
                        return arr
                },


            // 模糊搜索老师
            	getTeacher(str, callback){
				let self = this
				if (str == null || str.length <= 0) return;
                
        		return this.$http.post("_ed:/exchangecourse/query/teacher",{
        			str:str
        		}).then(data=>{
                    
					var temp = data.data;
					
					if (! this.teachersList)  this.teachersList = [];
					if (self.addExceptionForm.teachers.length > 0) {
						
						self.addExceptionForm.teachers.forEach(x => {
							var l = temp.filter(t => t.id == x.id);
							if (l.length <= 0) {
								temp = temp.concat(x);
							}
						})
					}
					self.teacherList=temp;
					
					self.loading = false;
					if (callback != null) {
						if (typeof(callback) == 'function') {
							callback(temp);
						}
					}
                }).catch((res)=>{
                    this.$message.error(res.msg);
                    this.load_model.close();
                })
        	},

            // getTeacherList(query) { //授课老师
            //     if (query && query.trim()) {
            //         this.queryTeacherList(query).then(data => {
            //             let teachersList = data.data;
            //             let selectedTeacher = this.filterSelectedTeacher();
            //             selectedTeacher.forEach(item1 => {
            //                 let findItem = teachersList.find(item2 => item2.id==item1.id);
            //                 if(!findItem){
            //                     teachersList.push(item1);
            //                 }
            //             });
            //             console.log(this.teachersList,'老师列表')
            //             var arrb = this.teachersList.concat(teachersList)
            //             // arrb = arrb.reserve();
            //             this.teachersList = this.unique(arrb)

            //         });
            //     }
            // },
            // 从teachersListBak里面找出table里面所有选中的老师
            filterSelectedTeacher(){
                let teachersList = [];
                this.tableData.forEach(row=>{
                    row.teacher_ids.forEach(teacher_id=>{
                        let findItem = this.teachersListBak.find(item1=>item1.id==teacher_id);
                        if(findItem && !teachersList.find(item2=>item2.id==findItem.id)){
                            teachersList.push(findItem);
                        }
                    });
                });
                return teachersList;
            },

            conflictCheck() { //冲突检查
                this.$refs.progressConflictDialog.openDialog(this.pramsItem);
            },

            addExceptionItems() { //添加例外条目
                this.editDialogTitle = "添加例外条目"
                this.addExceptionForm.teaching_form_item = "";
                this.addExceptionForm.schedule_item_date = "";
                this.addExceptionForm.teaching_content_item = "";
                this.addExceptionForm.area_item = "";
                this.addExceptionForm.groups = [];
                this.addExceptionForm.teachers = [];
                this.getareas();
                this.addExceptionItemsMark = true;
                this.is_edit = false;
            },
            getareas(callback) { //获取授课场地_op:/course/menuList
                
                // this.$http.get(`_op:/areas/combox/search/${query}`).then(data => {
                //     if (data.code == 0) {
                //         this.areas = data.data;
                       
                //     } else {
                //         this.$message.error(data.msg);
                //     }
                // })

                  var url = encodeURI(`_op:/areas/combox/search`);
                this.$http.get(url)
                    .then(data => {
                        if (data.code == 0) {
                            this.areas = data.data;
                        } else {
                            this.$message.error(data.msg);
                        }
                        if (typeof(callback) === 'function') {
                            callback(this.areas);
                        }
                    }).catch(res => {
                        this.$message.error(res.msg);
                        this.load_model.close();
                    })
            },
            teachingformChange() {
                this.addExceptionForm.groups = [];
                this.getGroups()
            },
            getGroups(row, index) {

                let row_teaching_form = "";
                if (row) {
                    row_teaching_form = row.teaching_form;
                } else {
                    row_teaching_form = this.addExceptionForm.teaching_form_item.id;
                }
                return this.$http.get(`_ed:/coursecls/group/cls/${this.pramsItem.cls_id}/teachingform/${row_teaching_form}`).then(data => {
                    if (data.code == 0) {
                        this.groupList = data.data;
                        if (row) {
                            this.$set(this.tableData[index], "groupList", this.groupList);
                        }

                    } else {
                        this.$message.error(data.msg);
                    }
                })
            },
          
            addExceptionSave(addExceptionForm) { //添加例外条目 和编辑明细
                
                this.$refs[addExceptionForm].validate((valid) => { //表单校验
                    if (valid) {
                        let sectionnodelist = []; //课节
                        let groups = []; //分组
                        let teachers = []; //授课老师
                        this.addExceptionForm.sectionnodelist.map((item, index) => {
                            sectionnodelist.push({
                                section_nodeid: item.id,
                                section_nodename: item.name
                            });
                        });
                        this.addExceptionForm.groups.map((item, index) => {
                            groups.push({
                                id: item.id,
                                group_number: item.group_number,
                                group_name: item.name
                            });
                        });
                        let url = "";
                        let jsonData = {};
                        let msg = '';
                   
                        let area_itemarrId =[] 
                        // let area_itemarrname = []
                        this.addExceptionForm.area_item.map(item=>{
                            area_itemarrId.push(item.id)
                          
                        })
                        var area_itemarrname = this.addExceptionForm.area_item.map(x => x.name);
                        
                        area_itemarrname = area_itemarrname.join(',')
                        if (!this.is_edit) {
                            this.addExceptionForm.teachers.map((item, index) => {
                                teachers.push({
                                    id: item.id,
                                    teacher_name: item.name
                                });
                            });
                            url = "_ed:/schedule/detail/exception/add";
                            jsonData = {
                                schedule_id: this.subPrams,
                                schedule_item_date: this.addExceptionForm.schedule_item_date,
                                teaching_form: this.addExceptionForm.teaching_form_item.id, //授课形式id
                                teaching_formname: this.addExceptionForm.teaching_form_item.name, //授课形式
                                teaching_content_id: this.addExceptionForm.teaching_content_item[0].id,
                                teaching_content_ids: this.addExceptionForm.teaching_content_item.map(x => {return x.id;}),
                                teaching_content: this.addExceptionForm.teaching_content_item.name,
                                area_ids:area_itemarrId,
                                area_id: area_itemarrId[0],
                                area_name:area_itemarrname,
                                sectionnodelist: sectionnodelist,
                                groups: groups,
                                teachers: teachers
                            };
                            
                            msg = "成功添加明细";
                        } else {
                            let self = this
                            console.info(self.addExceptionForm.teachers);
                            self.addExceptionForm.teachers.map((item, index) => {
                                teachers.push(item.id);
                            });
                            url = "_ed:/schedule/detail/edit2";
                            jsonData = {
                                id: self.edit_rowid,
                                // 场地可编辑
                                area_ids:area_itemarrId,
                                area_id: area_itemarrId[0],
                                area_name:area_itemarrname,
                                // 时间可编辑
                                schedule_item_date:self.addExceptionForm.schedule_item_date,
                                // 课节可编辑
                                sectionnodelist: sectionnodelist,
                                // 老数据
                                schedule_item_date: self.addExceptionForm.schedule_item_date,
                                teaching_content: self.addExceptionForm.teaching_content_item.name,
                                teaching_content_id: self.addExceptionForm.teaching_content_item[0].id,
                                teaching_content_ids: self.addExceptionForm.teaching_content_item.map(x => x.id),
                                groups: groups,
                                teacherIds: teachers,
                                allow_teacher_conflict: this.allow_teacher_conflict ? 1 : 0
                            };
                            
                            msg = "编辑明细成功";
                        }
                        this.$http.post(url, jsonData).then(data => {
                            if (data.code == 0) {
                                this.addExceptionItemsMark = false;
                                this.$message.success(msg);
                                this.getTableList();
                            } else {
                                if(data.data.length > 0){
                                    
                                    this.datamsgnone = false
                                    this.datamsglist = data.data
                                }
                                // var tips = "";
                                // if (data.data.length > 0) {
                                //     tips = data.data.join("/")
                                // }
                                // if (tips) {
                                //     this.$message.error(data.msg + ": " + tips);
                                // } else {
                                //     this.$message.error(data.msg);
                                // }
                                
                            }
                        });
                    } else {
                       
                        return false;
                    }
                });
            },

            itemEdit(row, copy) { //单个编辑
                let self = this;
                this.load_model = this.$loading({
                    lock: true,
                    text: "数据准备中...",
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                this.is_edit = copy == true ? false : true;
                this.editDialogTitle = copy == true ? "复制条目明细" : "编辑条目明细"
                this.edit_rowid = row.id;
                this.addExceptionItemsMark = true;
                this.allow_teacher_conflict = row.allow_teacher_conflict;
                let group_names = row.group_names.split(",");
                let group_names1 = row.group_names;
                let teacher_names = row.teacher_names.split(",");
                let section_nodenames = row.section_nodenames.split(',');
                let teachers = [];
                let groups = [];
                this.addExceptionForm.groups = [];
                //日期
                this.addExceptionForm.schedule_item_date = JSON.stringify(row.schedule_item_date)
                // row.schedule_item_date;
                this.addExceptionForm.sectionnodelist = [];
                //课节
                row.section_nodeids.map((item, index) => {
                    this.addExceptionForm.sectionnodelist.push({
                        id: item,
                        name: section_nodenames[index]
                    });
                });
                //授课场地
                // this.addExceptionForm.area_item = {
                //     id: row.area_id,
                //     name: row.area_name
                // };
                
                this.addExceptionForm.area_item = row.area_ids.map(x => {
                    var o = {
                        id: x
                    }
                    return o;
                });
                //授课形式
                var f = this.comboxList.filter(x => x.id == row.teaching_form);
                this.addExceptionForm.teaching_form_item = {
                    id: row.teaching_form,
                    categoryId: f[0].categoryId,
                    name: row.teaching_formname
                }
                //授课内容 
                if(row.teaching_content_ids!=null){
                    this.addExceptionForm.teaching_content_item = row.teaching_content_ids.map(x => {
                        var o = {
                            id: x
                        }
                        return o;
                    });
                }
                
                // 变更：当场地获取完成后，依据当前编辑或拷贝数据的场地id过滤出场地对象
                // 将过滤出来的场地对象绑定到下拉框中
                var temp = new Array();
                row.area_ids.forEach(id => {
                    temp = temp.concat(this.areas.filter(a => a.id == id));
                });

                this.addExceptionForm.area_item = [].concat(temp);
                this.getCourseContent().then(this.getGroups).then(() => {
                    // 分组
                    if(row.group_ids.length > 1) {
                        row.group_ids.map((item, index) => {
                            this.addExceptionForm.groups.push({
                                id: item,
                                name: group_names[index],
                                group_number: row.group_numbers[index]
                            });
                        }); 
                    }else{
                        row.group_ids.map((item, index) => { 
                            this.addExceptionForm.groups.push({
                                id: item,
                                name: group_names1,
                                group_number: row.group_numbers[index]
                            });
                        });
                    }
                }).then(() => {
                    //授课老师
                    this.addExceptionForm.teachers = [];
                    if(row.teacher_names != null || row.teacher_names.length){
                        this.getTeacher(row.teacher_names, (teachers) => {
                            this.addExceptionForm.teachers=teachers.filter(teacherItem=>row.teacher_ids.find(teacher_idItem=>teacherItem.id==teacher_idItem));
                            ;
                        });
                    }
                }).then(res =>{
                    this.load_model.close()
                }).catch(err => {
                    this.load_model.close()
                })
            },
            prostateDel(row) { //删除
                this.$confirm('确认删除？').then(_ => {
                    this.$http.post("_ed:/schedule/detail/delete", {
                        id: row.id,
                        create_user: this.create_user,
                        create_username: this.create_user
                    }).then(data => {
                        if (data.code == 0) {
                            this.$message.success("删除成功");
                            this.getTableList();
                        } else {
                            this.$message.error(data.msg);
                        }
                    })
                }).catch(_ => {});

            },
            onScheduleSus(res, file) {
                let self = this;
                this.errorList = [];
                this.errorList2 = [];
                if(res.msg === 'OK' || (!res.data.errorMsg || res.data === null)){
                    self.$message.success("导入成功！");
                    self.getTableList();
                    self.filterlist()
                    self.getCourseContent()
                }else{
                    if(res.data.errors){
                        let message = res.data.errors;
                        let new_msg = [];
                        for(let key in message){
                            new_msg.push({
                                key: key,
                                value: message[key].join(';')
                            })
                        }
                        this.errorList = new_msg;
                    }
                    if(res.msg && res.msg !== 'OK' && JSON.parse(res.msg).length){
                        let errorlist = JSON.parse(res.msg);
                        let new_msg = [];
                        errorlist.map(item => {
                            item.map(item2 => {
                                new_msg.push(item2)
                            })
                        })
                        this.errorList2 = new_msg;
                    }
                    this.showErrorDialog = true;

                    // 没有找到‘找不到’就刷新
                    if(!this.errorList.find(item=>item.value=='找不到')&&!this.errorList2.find(item=>item.conflict=='找不到')){
                        this.getTableList();
                    }
                }
                // self.getTableList();
            },
            onExceptionSus(res, file) {
                let type = "success";
                let message = "导入成功！";
                if (res.code != 0) {
                    type = "error";
                    if (res.data) {
                        message = res.msg + "：" + res.data;
                    } else {
                        message = res.msg;
                    }
                }
                this.$message({
                    type: type,
                    message: message
                });
                this.getTableList();
            },
            confi_detail(row) {
                this.confi_detail_mark = true;
                this.gridData2 = row.items;
                this.studentConflicts = row.studentConflicts;
                this.confi_type = row.type;
                this.confi_title = row.desc;
            },

            donwloadScheduleItemTemplates() {
                let query = {
                    schedule_id: this.subPrams,
                    teacher_id: this.newData1,
                    area_id: this.newData2,
                    teaching_form: this.newData3,
                    group_id: this.newData4
                }
              
                let grade= this.pramsItem.grade*1

                this.$http2.post(`_ed:/schedule/exportResult`,query).then(datas => {
                    let url = window.URL.createObjectURL(new Blob([datas]));
                    let y = this.$refs.exportExcel;
                    y.href = url;
                    y.setAttribute("download",  `${grade}-${this.pramsItem.course_name}-${this.pramsItem.cls_name}-进度表.xls`);
                    y.click();
                    window.URL.revokeObjectURL(url);
                })
            }
        }
    }
</script>

<style lang="less" scoped="scoped">
    .datamsg{
    position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    z-index: 100000;
    }
    .datamsgdelis{
    position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 100001;
    }
    .none{
    display: none;
    }
    .datamsg .datamhsbody,.datamsgdelis .datamhsbody{
        background:#f5f7fa;
    width:85%;
        border: solid 1px #ddd;
        margin: 100px auto;
        padding: 20px 20px;
    }
    .datamsg .datamhsbody{
    background:#f5f7fa;
    width:72%;
    
    }
    .datamhsbody /deep/.dialog-footer{
        /* padding: 10px 20px 20px; */
        text-align: right;
    }
    /* 下方返回键盘设置 */
    
    .returnBackBoxTop {
        position: relative;
    }
    
    .returnBack_TopStyle {
        position: absolute;
        right: 20px;
        height: 28px;
        margin-top: 6px;
    }
    /* 下方返回键盘设置 */
    
    .returnBackBoxBottom {
        position: relative;
    }
    
    .returnBack_BottomStyle {
        position: absolute;
        right: 30px;
    }
    
    .dv-wrap {
        display: flex;
    }
    
    .grid-table {
        margin-top: 10px;
    }
    
    .el-dropdown-link {
        font-size: 12px;
    }
    
    .table-footer {
        border: 1px solid #ddd;
        overflow: hidden;
    }
    
    .table-footer .item {
        overflow: hidden;
    }
    
    .table-footer .item div {
        line-height: 30px;
        border-left: 1px solid #ddd;
    }
    
    .table-footer .item div {
        float: left;
    }
    
    .colorread {
        color: red;
    }
    .textstyle{
        display: inline-block;
        width:369px;
    }
    .el-input--suffix .el-input__inner {
    padding-right: 30px;
    width: 369px;
}
.detail{
    /* padding-left: 30px; */
}
.boxStyle{
    width:400px;
}

</style>