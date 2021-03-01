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
          <div ref="formDetail" class="detail" style="width:100%;display:flex;flex-direction:row;">
            <el-form-item label="学期">
              <el-input v-model="row.semester_name" :disabled="true" size="mini"></el-input>
            </el-form-item>
            <el-form-item label="年级">
              <el-input v-model="row.grade" :disabled="true" size="mini" style="width: 64px;"></el-input>
            </el-form-item>
            <el-form-item label="课程表名称">
              <el-input v-model="row.name" :disabled="true" size="mini"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="mini" type="primary" @click="addGroup" v-if="row.publish_status != 2">录入</el-button>
              <el-button size="mini" type="primary" @click="addTask"  v-if="row.publish_status != 2">生成进度表</el-button>
              <el-button size="mini" @click="back">返回</el-button>
            </el-form-item>
            <el-form-item label="课程" style="margin-left:auto">
                <el-select
                size="mini"
                v-model="courseFilterText"
                filterable
                clearable
                class="course-selection"
                placeholder="请选择排课课程"
                @change="onFiltersChange">
                <el-option v-for="(f, idx) in courseFilters" :key="idx" :label="f" :value="f"></el-option>
                </el-select>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <div class="cm-table">
      <ElBigdataTable
        ref="multipleTable"
        :data="courseFiltered"
        border
        :height="tableHeight"
        style="width: 100%;"
        header-row-class-name="cm-dark"
      >
        <el-table-column label="编号" fixed type="index" width="60"></el-table-column>
        <el-table-column label="排课课程" prop="course_name" width="220"></el-table-column>
        <el-table-column label="上课班" prop="cls_name" width="300"></el-table-column>
        <el-table-column label="周次" prop="week_names"></el-table-column>
        <el-table-column label="星期" prop="weekday" width="60"></el-table-column>
        <el-table-column label="课节" prop="section_nodenames" width="60"></el-table-column>
        <el-table-column label="授课场地及分组" prop="areaAndGroup" width="400"></el-table-column>
        <el-table-column label="授课形式" prop="teaching_formname" width="120"></el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="copySchedule(scope.row)" type="text" size="small" >复制</el-button>
            <el-button @click="editSchedule(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="delTableRow(scope.row)" type="text" size="small" v-if="scope.row.publish_status==0">删除</el-button>
          </template>
        </el-table-column>
      </ElBigdataTable>
    </div>
    <!-- <div class="cm-pagination">
      <el-pagination
        background
        :current-page="pageNo"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        @size-change="sizeChange"
        @current-change="currentChange"
      ></el-pagination>
    </div> -->
    <!-- 新增分组 -->
    <el-dialog
      width="1000px"
      @closed="addClose"
      :title="dialog.title"
      :visible.sync="dialog.visible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
    >
      <el-form
        :inline="true"
        ref="addForm"
        :rules="rules"
        :model="addForm"
        size="medium"
        label-width="80px"
        :disabled="dialog.status=='show'"
      >
        <div>
          <el-form-item label="学期">
            <el-input v-model="row.semester_name" style="width: 300px;" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="所在级" v-if="dialog.status!='show'">
            <el-input
              v-model="row.grade"
              style="width: 300px;"
              :disabled="true"
              placeholder="请输入分组数"
            ></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="排课课程" prop="semester_course_id">
            <el-select
              v-model="addForm.semester_course_id"
              filterable
              clearable
              style="width: 300px;"
              placeholder="请选择排课课程"
              @change="onCourseChange"
              :disabled="dialog.status==='edit' || dialog.status==='update' ? true : false"
            >
              <el-option
                v-for="list in courseList"
                :key="list.id"
                :label="list.course_arrange+'('+list.majorNames+list.arranged_theory_hours+'/'+list.arranged_novitiate_hours+')'"
                :value="list.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上课班" prop="cls_id">
            <el-select
              v-model="addForm.cls_id"
              clearable
              style="width: 300px;"
              :disabled="dialog.status==='edit' || dialog.status==='update' || addForm.semester_course_id==''? true : false"
              placeholder="请选择上课班"
              @change="onClassChange"
            >
              <el-option
                v-for="list in classList"
                :key="list.id"
                :label="list.name"
                :value="list.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="星期" prop="weekday">
            <el-select
              v-model="addForm.weekday"
              clearable
              style="width: 200px;"
              placeholder="请选择星期"
            >
              <el-option
                v-for="item in weekData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="授课形式" prop="teaching_form" multiple>
            <el-select
              v-model="addForm.teaching_form"
              clearable
              placeholder="请选择授课形式"
              @change="onCourseTypeChange"
              :disabled="dialog.status==='update'"
            >
              <el-option
                v-for="list in teachList"
                :key="list.id"
                :label="list.name"
                :value="list.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>  
            <p>分组数：{{groupNum}}</p>
          </el-form-item>
          
        </div>
        <el-form-item label="课节">
          <div class="class-wrap">
            <div class="class-inner">
              <div class="class-margin" style>
                <div class="cm-bg">
                  <el-checkbox
                    :indeterminate="isIndeterminate1"
                    v-model="checkAll1"
                    @change="onCheckAllChange1"
                  >上午</el-checkbox>
                </div>
                <el-checkbox-group v-model="checkedClass1" @change="onCheckedClassChange1">
                  <el-checkbox v-for="item in classList1" :label="item" :key="item.id">{{item.name}}</el-checkbox>
                </el-checkbox-group>
              </div>
              <div class="class-margin">
                <div class="cm-bg">
                  <el-checkbox
                    :indeterminate="isIndeterminate2"
                    v-model="checkAll2"
                    @change="onCheckAllChange2"
                  >下午</el-checkbox>
                </div>
                <el-checkbox-group v-model="checkedClass2" @change="onCheckedClassChange2">
                  <el-checkbox v-for="item in classList2" :label="item" :key="item.id">{{item.name}}</el-checkbox>
                </el-checkbox-group>
              </div>
              <div class="class-margin">
                <div class="cm-bg">
                  <el-checkbox
                    :indeterminate="isIndeterminate3"
                    v-model="checkAll3"
                    @change="onCheckAllChange3"
                  >晚上</el-checkbox>
                </div>
                <el-checkbox-group v-model="checkedClass3" @change="onCheckedClassChange3">
                  <el-checkbox v-for="item in classList3" :label="item" :key="item.id">{{item.name}}</el-checkbox>
                </el-checkbox-group>
              </div>
              <!-- <div class="class-margin">
                        <div class="cm-bg">
                            <p>补课</p>
                        </div>
                        <el-checkbox-group v-model="checkedClass4">
                            <el-checkbox v-for="item in classList4" :label="item" :key="item.id">{{item.name}}</el-checkbox>
                        </el-checkbox-group>
              </div>-->
            </div>
            <!-- <div class="class-btn">
							<el-button type="primary" size="small" @click="exceptionDate">例外日期</el-button>
            </div> 暂时注释，以后修改-->
          </div>
        </el-form-item>

        <div class="course-tip">
          <!--新增排课提示-->
          <span class="tip">排课提示</span>
          <div class="container-tip">
            <div class="container-tip-item">
              <span style="font-size:16px;color:#409EFF; padding-bottom:5px;">法定节假日：</span>
              <ul class="tip-list">
                <template>
                  <li
                    v-for="item in courseTips"
                    class="tip-list-cycle"
                    :key="item.id"
                  >第{{item.week}}周 星期{{weekDays(item.whatDay)}} {{item.date}}</li>
                </template>
              </ul>
            </div>
            <div class="container-tip-item">
              <span style="font-size:16px;color:#409EFF; padding-bottom:5px;">例外工作日：</span>
              <ul class="exceptional-wrod">
                <li
                  v-for="item in exceptionalWorkDay"
                  class="tip-list-cycle"
                  :key="item.id"
                >第{{item.week}}周 星期{{weekDays(item.whatDay)}} {{item.date}}</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="class-wrap week-margin">
          <p class="weekly"><i style="color:red;padding-right: 5px;">*</i>周次 </p>
          <div>
            <div class="weekcheckgroup" style="display: flex;    justify-content: space-between;"  v-if="weekListarr1.length>0">  
                <el-checkbox-group v-model="checkedWeek1" @change="onCheckedWeekChangeone">
                <el-checkbox v-for="list in weekListarr1" :key="list.id" :label="list">{{list.week}}</el-checkbox>
               </el-checkbox-group>
                <el-checkbox
                  v-if="dialog.status!='show'"
                  :indeterminate="isIndeterminate41"
                  v-model="checkWeekAll1"
                  @change="onCheckAllWeekChange1"
                >全选</el-checkbox>
            </div>
            <div class="weekcheckgroup" style="display: flex;    justify-content: space-between;"  v-if="weekListarr2.length>0">  
                <el-checkbox-group v-model="checkedWeek2" @change="onCheckedWeekChangetwo">
                <el-checkbox v-for="list in weekListarr2" :key="list.id" :label="list">{{list.week}}</el-checkbox>
               </el-checkbox-group>
                <el-checkbox
                  v-if="dialog.status!='show'"
                  :indeterminate="isIndeterminate42"
                  v-model="checkWeekAll2"
                  @change="onCheckAllWeekChange2"
                >全选</el-checkbox>
            </div>
            <div class="weekcheckgroup" style="display: flex;    justify-content: space-between;"  v-if="weekListarr3.length>0">  
                <el-checkbox-group v-model="checkedWeek3" @change="onCheckedWeekChangethree">
                <el-checkbox v-for="list in weekListarr3" :key="list.id" :label="list">{{list.week}}</el-checkbox>
               </el-checkbox-group>
                <el-checkbox
                  v-if="dialog.status!='show'"
                  :indeterminate="isIndeterminate43"
                  v-model="checkWeekAll3"
                  @change="onCheckAllWeekChange3"
                >全选</el-checkbox>
            </div>
            <div class="weekcheckgroup" style="display: flex;    justify-content: space-between;"  v-if="weekListarr4.length>0">  
                <el-checkbox-group v-model="checkedWeek4" @change="onCheckedWeekChangefour">
                <el-checkbox v-for="list in weekListarr4" :key="list.id" :label="list">{{list.week}}</el-checkbox>
               </el-checkbox-group>
                <el-checkbox
                  v-if="dialog.status!='show'"
                  :indeterminate="isIndeterminate44"
                  v-model="checkWeekAll4"
                  @change="onCheckAllWeekChange4"
                >全选</el-checkbox>
            </div>
            <div class="weekcheckgroup" style="display: flex;    justify-content: space-between;"  v-if="weekListarr5.length>0">  
                <el-checkbox-group v-model="checkedWeek5" @change="onCheckedWeekChangefive">
                <el-checkbox v-for="list in weekListarr5" :key="list.id" :label="list">{{list.week}}</el-checkbox>
               </el-checkbox-group>
                <el-checkbox
                  v-if="dialog.status!='show'"
                  :indeterminate="isIndeterminate45"
                  v-model="checkWeekAll5"
                  @change="onCheckAllWeekChange5"
                >全选</el-checkbox>
            </div>
             <div class="weekcheckgroup" style="display: flex;    justify-content: space-between;" v-if="weekListarr6.length>0">  
                <el-checkbox-group v-model="checkedWeek6" @change="onCheckedWeekChangesix">
                <el-checkbox v-for="list in weekListarr6" :key="list.id" :label="list">{{list.week}}</el-checkbox>
               </el-checkbox-group>
                <el-checkbox
                  v-if="dialog.status!='show'"
                  :indeterminate="isIndeterminate46"
                  v-model="checkWeekAll6"
                  @change="onCheckAllWeekChange6"
                >全选</el-checkbox>
            </div>
            <div class="weekcheckgroup" style="display: flex;    justify-content: space-between;" v-if="weekListarr7.length>0">  
                <el-checkbox-group v-model="checkedWeek7" @change="onCheckedWeekChangeseven">
                <el-checkbox v-for="list in weekListarr7" :key="list.id" :label="list">{{list.week}}</el-checkbox>
               </el-checkbox-group>
                <el-checkbox
                  v-if="dialog.status!='show'"
                  :indeterminate="isIndeterminate47"
                  v-model="checkWeekAll7"
                  @change="onCheckAllWeekChange7"
                >全选</el-checkbox>
            </div>
          </div>
           <div style="margin-left:60px;">
             <el-button @click="checkboxWeek" size = "mini" type="primary">1-18周</el-button>
             <el-button @click="closeCheckboxWeek" size = "mini" type="primary">清除选中</el-button>
           </div>
        </div>
        <el-form-item label="场地" required class="changdi" style="width:100%">
          <el-table
            ref="siteTable"
            :data="addSiteTableList"
            border
            style="width: 100%"
        
            header-row-class-name="cm-dark"
          >
            <el-table-column type="index" label="代码" width="60"></el-table-column>
            <el-table-column label="场地名称" prop="name" >
              <template slot-scope="scope">
                 <el-select
                    v-model="scope.row.area"
                    filterable=""
                    clearable
                    placeholder="请选择"
                    value-key="id"
                    @change="onselectedarea"
                  >
                    <el-option
                      v-for="list in siteTableData"
                      :key="list.id"
                      :label="list.name"
                      :value="list"
                    ></el-option>
                  </el-select>
              </template>
                
            </el-table-column>
            <el-table-column label="容纳人数" prop="capacity" width="100">
              <template slot-scope="scope">
                {{scope.row.area.capacity}}
              </template>
                
            </el-table-column>
            <el-table-column label="组号" prop="group_num" >
              <template slot-scope="scope">
                 <el-select
                    multiple
                    v-model="scope.row.groups"
                    clearable
                    placeholder="请选择"
                    value-key="id"
                    :disabled="dialog.status==='update'"
                  >
                    <el-option
                      v-for="list in groupList"
                      :key="list.id"
                      :label="list.name"
                      :value="list"
                    ></el-option>
                  </el-select>
              </template>
                
            </el-table-column>
          
            <el-table-column label="操作" width="100" v-if="dialog.status!=='update'">
              <template slot="header" slot-scope="">
                   操作   
              </template>
              <template slot-scope="scope">
                <!-- <el-button type="danger" icon="el-icon-delete" circle  @click="delSiteItem(scope.$index,scope.row)" size="mini" ></el-button> -->
                <el-button type="text" @click="delSiteItem(scope.$index,scope.row)" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button v-if="dialog.status!=='update'" type="text" size="small"  @click="addItem">增加</el-button>
         </el-form-item>

        <el-form-item label="备注说明" prop="note">
          <el-input
            type="textarea"
            :rows="2"
            v-model="addForm.note"
            :maxlength="200"
            placeholder="如有特殊说明，请备注传递"
            style="width: 700px;"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" v-if="dialog.status!='show'">
        <el-button @click="addClose">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 例外日期 -->
    <el-dialog
      width="500px"
      title="例外日期"
      :visible.sync="dialog.datevisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
    >
      <div class="cm-table">
        <el-table
          ref="dateTable"
          :data="dateTableData"
          border
          style="width: 100%"
          header-row-class-name="cm-dark"
        >
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column
            v-for="(item,index) in dateTableList"
            :key="index"
            :prop="item.prop"
            :label="item.label"
          ></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click="dialog.datevisible=false">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 场地选择 -->
    <el-dialog
      width="800px"
      title="场地选择"
      @closed="siteClose"
      :visible.sync="dialog.sitevisible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
    >
      <div class="tips">（注：红色记录有可能会产生冲突）</div>
      <el-form :inline="true" ref="siteForm" :model="siteForm" size="medium" label-width="80px">
        <div class="sit-fold">
          <el-form-item label="场地名称">
            <el-input v-model="siteForm.name" placeholder="请输入场地名称"></el-input>
          </el-form-item>
          <el-form-item>
            <label class="el-form-item__label" style="width: 80px;">人数（&ge;）</label>
            <div class="el-form-item__content">
              <div data-v-d9328ed8 class="el-input el-input--medium">
                <input
                  type="text"
                  v-model="siteForm.num"
                  autocomplete="off"
                  class="el-input__inner"
                  placeholder="请输入人数"
                />
              </div>
            </div>
          </el-form-item>
          <div class="btn">
            <el-button type="primary" size="small" @click="onSideSearch">查询</el-button>
          </div>
        </div>
      </el-form>
      <div class="cm-table">
        <el-table
          ref="siteTable"
          :data="siteTableData"
          border
          style="width: 100%"
          height="200px"
          header-row-class-name="cm-dark"
        >
          <el-table-column type="index" label="代码" width="50px"></el-table-column>
          <el-table-column
            v-for="(item,index) in siteTableList"
            :key="index"
            :prop="item.prop"
            :label="item.label"
          ></el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="onAddSite(scope.row)" type="text" size="small">添加</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="cm-pagination" style="margin-top:10px;">
          <el-pagination
            background
            :current-page="pageNo1"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize1"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount1"
            @size-change="sizeChange1"
            @current-change="currentChange1"
          ></el-pagination>
        </div>
      </div>

      <div class="chosen-wrap">
        <div class="title">已选择列表</div>
        <div class="cm-table">
          <el-table
            ref="siteTable"
            :data="addSiteTableData"
            border
            style="width: 100%"
            height="200px"
            header-row-class-name="cm-dark"
          >
            <el-table-column type="index" label="代码" width="50px"></el-table-column>
            
            <el-table-column
              v-for="(item,index) in addSiteTableList"
              :key="index"
              :prop="item.prop"
              :label="item.label"
              :width="item.width"
            >
              <template slot-scope="scope">
                <template >
                  <el-select
                    multiple
                    style="width: 100%;"
                    v-model="scope.row.group_id"
                    clearable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="list in groupList"
                      :key="list.id"
                      :label="list.name"
                      :value="list.id"
                    ></el-option>
                  </el-select>
                </template>
                <!-- <template v-else>{{ scope.row[item.prop] }}</template> -->
              </template>
            </el-table-column>
            <el-table-column label="操作" width="60">
              <template slot-scope="scope">
                <el-button @click="delSiteItem(scope.$index,scope.row)" type="text" size="small">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="siteClose">取消</el-button>
        <el-button type="primary" size="medium" @click="closeSite">确 定</el-button>
      </span>
    </el-dialog>
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
  </section>
</template>

<script>
import util from "@/util";
import { constants } from "crypto";
const TYPE = "group-management";
const REMARK = "录入明细";
export default {
  name: TYPE,
  props: {
    isComponent:{
        default:false,
        type: Boolean,
    },
  },
  data() {
    return {
      datamsgnone:true,
      datamsglist:[],//报错的数组
      courseFilterText: '', // 课程过滤关键字
      breadcrumb: [
        {
          label: "教学管理"
        },
        {
          label: "课程表管理",
          path: "/teaching_management/curriculum_management"
        },
        {
          label: REMARK
        }
      ],
      dialog: {
        status: "add",
        visible: false,
        datevisible: false,
        sitevisible: false,
        title: "录入课程表明细"
      },
      row: {},
      editId: "",
      addForm: {
        year: "",
        group: "",
        semester_course_id: "", //排课课程
        cls_id: "", //上课班
        weekday: "",
        teaching_form: "",
        area_ids: "",
        note: ""
      },
      formInline: {
        user: "",
        region: ""
      },
      siteForm: {
        name: "",
        num: ""
      },
      rules: {
        semester_course_id: [
          {
            required: true,
            message: "请选择排课课程",
            trigger: "change"
          }
        ],
        cls_id: [
          {
            required: true,
            message: "请选择上课班",
            trigger: "change"
          }
        ],
        weekday: [
          {
            required: true,
            message: "请选择星期",
            trigger: "change"
          }
        ],
        teaching_form: [
          {
            required: true,
            message: "请选择授课形式",
            trigger: "change"
          }
        ],
        area_ids: [
          {
            required: true,
            message: "请选择场地",
            trigger: "change"
          }
        ]
      },
      tableList: [
        {
          label: "排课课程",
          prop: "course_name",
          width: 300
        },
        {
          label: "上课班",
          prop: "cls_name",
          width: 300
        },
        {
          label: "周次",
          prop: "week_names",
          width: 150
        },
        {
          label: "星期",
          prop: "weekday",
          width: 100
        },
        {
          label: "课节",
          prop: "section_nodenames",
          width: 80
        },
        {
          label: "授课场地",
          prop: "area_names",
          width: 300
        },
        {
          label: "授课形式",
          prop: "teaching_formname",
          width: 100
        }
      ],
      tableData: [],
      siteTableData: [],
      addSiteTableData: [],
      dateTableData: [
        {
          date: "2016-05-03",
          name: "基础医学",
          creator: "张三丰",
          code: 2003
        },
        {
          date: "2016-05-03",
          name: "基础医学",
          creator: "张三丰",
          code: 2003
        },
        {
          date: "2016-05-03",
          name: "基础医学",
          creator: "张三丰",
          code: 2003
        },
        {
          date: "2016-05-03",
          name: "基础医学",
          creator: "张三丰",
          code: 2003
        },
        {
          date: "2016-05-03",
          name: "基础医学",
          creator: "张三丰",
          code: 2003
        }
      ],
      dateTableList: [
        {
          label: "日期",
          prop: "date"
        },
        {
          label: "星期",
          prop: "weekDay"
        },
        {
          label: "周次",
          prop: "week"
        },
        {
          label: "例外类型",
          prop: "dateType"
        }
      ],
      siteTableList: [
        {
          label: "场地名称",
          prop: "name"
        },
        {
          label: "容纳人数",
          prop: "capacity"
        }
      ],
      addSiteTableList: [
         {
          capacity: "",
          name: "",
          groups: [],
          area: [],
        },
     
      ],
      dateOption: [
        {
          label: "全部",
          value: "全部"
        },
        {
          label: "2014",
          value: "2014"
        },
        {
          label: "2015",
          value: "2015"
        },
        {
          label: "2016",
          value: "2016"
        },
        {
          label: "2017",
          value: "2017"
        },
        {
          label: "2018",
          value: "2018"
        },
        {
          label: "2020",
          value: "2020"
        },
        {
          label: "2021",
          value: "2021"
        },
        {
          label: "2022",
          value: "2022"
        },
        {
          label: "2023",
          value: "2023"
        }
      ],
      weekData: [
        {
          name: "一",
          id: 1
        },
        {
          name: "二",
          id: 2
        },
        {
          name: "三",
          id: 3
        },
        {
          name: "四",
          id: 4
        },
        {
          name: "五",
          id: 5
        },
        {
          name: "六",
          id: 6
        },
        {
          name: "日",
          id: 7
        }
      ],
      courseTips: [], //新增
      exceptionalWorkDay: [], //新增
      weekList: [],
      weekListarr1: [],
      weekListarr2: [],
      weekListarr3: [],
      weekListarr4: [],
      weekListarr5: [],
      weekListarr6: [],
      weekListarr7: [],
      classList: [],
      classList1: [],
      classList2: [],
      classList3: [],
      classList4: [
        {
          name: "X",
          id: 9999
        }
      ],
      checkedWeek:[],
      checkedWeek1: [],
      checkedWeek2: [],
      checkedWeek3: [],
      checkedWeek4: [],
      checkedWeek5: [], 
      checkedWeek6: [],
      checkedWeek7: [],
      checkedClass1: [],
      checkedClass2: [],
      checkedClass3: [],
      checkedClass4: [],
      courseList: [],
      teachList: [],
      areaList: [],
      groupList: [],
      groupNum: "0",
      pageNo: 1,
      pageSize: 10,
      totalCount: 0,
      pageNo1: 1,
      pageSize1: 10,
      totalCount1: 0,
      fold: {
        state: false,
        text: "展开",
        showBtn: false
      },
      checkAll1: false,
      checkAll2: false,
      checkAll3: false,
      checkWeekAll1: false,
      checkWeekAll2: false,
      checkWeekAll3: false,
      checkWeekAll4: false,
      checkWeekAll5: false,
      checkWeekAll6: false,
      checkWeekAll7: false,
      isIndeterminate1: false,
      isIndeterminate2: false,
      isIndeterminate3: false,
      isIndeterminate41: false,
      isIndeterminate42: false,
      isIndeterminate43: false,
      isIndeterminate44: false,
      isIndeterminate45: false,
      isIndeterminate46: false,
      isIndeterminate47: false,
   
      userId: util.getStorage("loginId"),
      userName: util.getStorage("loginName"),
      area_grouplist: [],
      areaData: [],
    };
  },
  created() {
    if(this.isComponent){
      this.getTeachType();
      this.getCourseList();
      this.geLessonList();
      return;
    }
    this.row = JSON.parse(this.$route.query.row);
    this.getWeekly();
    this.getTableList();
    this.getCourseList();
    this.geLessonList();
    this.getTeachType();
  },
  mounted() {
    util.resize(this);
    window.onresize = () => {
      util.resize(this);
    };
  },
  computed: {
      tableHeight() {
          var height = 480;
          var result = window.matchMedia('(min-height: 720px)');
          if (result.matches) {
          
              height = 528;
          }
          result = window.matchMedia('(min-height: 768px)');
          if (result.matches) {
            height = 608
          }

          result = window.matchMedia('(min-height: 799px)');
          if (result.matches) {
        
            height = 668;
          }
          result = window.matchMedia('(min-height: 1080px)');
          if (result.matches) {
          
            height = 880;
          }
          result = window.matchMedia('(min-height: 1300px)');
          if (result.matches) {
          
            height = 880;
          }
          return height;
      },

      courseFilters() {
          if (this.tableData.length <= 0) {
              return new Array();
          }
          var filters = new Set(this.tableData.map(x => x.course_name));
          return Array.from(filters);
      },

      // 课程过滤
      courseFiltered() {
          if (this.tableData.length > 0) {
              if (this.courseFilterText) {
                  var filters = this.tableData.filter(x => x.course_name == this.courseFilterText);
                  return filters;
              } else {
                  return this.tableData;
              }
          }
          return new Array();
      }
  },
  methods: {
    onselectedarea(){

    },
    // 上课班选择
    onClassChange(val) {
      this.addForm.teaching_form = null; // 清空授课形式选择
      this.addSiteTableList.forEach(x => x.groups = []) // 清空上课组选择
    },
    decomposeweekList(arr){
        let leth =  Math.ceil(arr.length/5)
        let qmoth =  Math.floor(arr.length%5)
        if(arr.length>0){
          this.weekListarr1 = arr.slice(0,5)
        }
        if(arr.length>5){
          this.weekListarr2 = arr.slice(5,10)
        }
        if(arr.length>10){
          this.weekListarr3 = arr.slice(10,15)
        }
        if(arr.length>15){
          this.weekListarr4 = arr.slice(15,20)
        }
        if(arr.length>20){
          this.weekListarr5 = arr.slice(20,25)
        }
        if(arr.length>25){
          this.weekListarr6 = arr.slice(25, 26)
        }
    },  
    decomposeweekList2(arr){
        let leth =  Math.ceil(arr.length/5)
        if(arr.length>0){
           this.weekListarr7 = arr
        } 
    },  


    addItem(){
      this.addSiteTableList.push({
         
          capacity: "",
          name: "",
          groups: [],
          area:[],
        },)
    },
    onFiltersChange(event) {

    },
    // 返回上一页
    addTask() {
       
      const loading = this.$loading({
        lock: true,
        text: "生成中...",
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      
      this.$http
        .post("_ed:/schedule/autogenerate", {
          semester_year: this.row.semester_year,
          semester_year_number: this.row.semester_year_number,
          curriculum_id: this.row.id
        })
        .then(data => {
          loading.close();
          let type = "success";
          let message = "生成成功！";
          if (data.code == 0) {
          } else {
            type = "error";
            message = data.msg;
          }
          this.$message({
            type: type,
            message: message
          });
        })
        .catch(err => console.error(err));
    },
    back() {
      this.$router.go(-1);
    },
    courseTipsList() {
      //节假日
      let tip_arrs = [];
      this.courseTips.forEach(item => {
        if (item.whatDay !== 6 && item.whatDay !== 7 && item.holiday === true) {
          tip_arrs.push(item);
        }
      });
      return tip_arrs;
    },
    exceptionWorkDays() {
      //例外工作日
      let exceptionWork = [];
      this.exceptionalWorkDay.forEach(list => {
        if (
          (list.whatDay === 6 || list.whatDay === 7) &&
          list.holiday === false
        ) {
          exceptionWork.push(list);
        }
      });
      return exceptionWork;
    },
    weekDays(day) {
      switch (day) {
        case 1:
          day = "一";
          break;
        case 2:
          day = "二";
          break;
        case 3:
          day = "三";
          break;
        case 4:
          day = "四";
          break;
        case 5:
          day = "五";
          break;
        case 6:
          day = "六";
          break;
        case 7:
          day = "日";
          break;
      }
      return day;
    },
    sizeChange(size) {
      this.pageNo = 1;
      this.pageSize = size;
      this.getTableList();
    },
    currentChange(current) {
      this.pageNo = current;
      this.getTableList();
    },
    addClose() {
      this.groupNum = 0;
      this.checkedWeek = [];
      this.checkedWeek1 = [];
      this.checkedWeek2 = [];
      this.checkedWeek3 = [];
      this.checkedWeek4 = [];
      this.checkedWeek5 = [];
      this.checkedWeek6 = [];
      this.checkedWeek7 = [];
      this.checkedClass1 = [];
      this.checkedClass2 = [];
      this.checkedClass3 = [];
      this.checkedClass4 = [];
      this.dialog.visible = false;
      this.$refs.addForm.resetFields();
      this.checkWeekAll1 = false
      this.checkWeekAll2 = false
      this.checkWeekAll3 = false
      this.checkWeekAll4 = false
      this.checkWeekAll5 = false
      this.checkWeekAll6 = false
    },
    siteClose() {
      this.dialog.sitevisible = false;
      this.siteForm.name = "";
      this.siteForm.num = "";
      // this.addSiteTableData = [];
    },
    sizeChange1(size) {
      this.pageNo1 = 1;
      this.pageSize1 = size;
      this.getAreaList();
    },
    currentChange1(current) {
      this.pageNo1 = current;
      this.getAreaList();
    },
    onSideSearch() {
      this.pageNo1 = 1;
      this.getAreaList();
    },
    onCourseChange(val) {
      //获取上课班
      if (val) {
        this.getClassData(val);
      }
      // 清空已选上课组
      this.addSiteTableList.forEach(x => x.groups = [])
      // 清空授课形式
      this.addForm.teaching_form = null;
    },
    getClassData(val) {
      this.classList = [];
      this.addForm.cls_id = "";
      this.$http.get("_ed:/coursecls/list/semcourseid/" + val).then(data => {
        if (data.code == 0) {
          if (data.data.length > 0) {
            this.classList = data.data;
          } else {
            this.addForm.classId = "";
          }
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    onCourseTypeChange(val) {
      this.groupList = [];
      if (!this.addForm.cls_id) {
        this.$message.warning("请选择上课班!");
      }
      // 清空现有以选择的上课组
      this.addSiteTableList.forEach(x => x.groups = [])
      this.getGroupData(val);
    },
    getGroupData(val) {
      this.$http
        .get(
          "_ed:/coursecls/group/cls/" +
            this.addForm.cls_id +
            "/teachingform/" +
            val +
            "/without"
        )
        .then(data => {
          if (data.code == 0) {
            this.groupNum = data.data.length;
            this.groupList = data.data;
          } else {
            this.$message.error(data.msg);
          }
        });
      for (let list of this.teachList) {
        if (list.id == val) {
          this.teach_formname = list.name;
          
        }
      }
    },
    onCheckAllChange1(val) {
      this.checkedClass1 = val ? this.classList1 : [];
      this.isIndeterminate1 = false;
    },
    onCheckAllChange2(val) {
      this.checkedClass2 = val ? this.classList2 : [];
      this.isIndeterminate2 = false;
    },
    onCheckAllChange3(val) {
      this.checkedClass3 = val ? this.classList3 : [];
      this.isIndeterminate3 = false;
    },
    onCheckedClassChange1(value) {
      let checkedCount = value.length;
      this.checkAll1 = checkedCount === this.classList1.length;
      this.isIndeterminate1 =
        checkedCount > 0 && checkedCount < this.classList1.length;
    },
    onCheckedClassChange2(value) {
      let checkedCount = value.length;
      this.checkAll2 = checkedCount === this.classList2.length;
      this.isIndeterminate2 =
        checkedCount > 0 && checkedCount < this.classList2.length;
    },
    onCheckedClassChange3(value) {
      let checkedCount = value.length;
      this.checkAll3 = checkedCount === this.classList3.length;
      this.isIndeterminate3 =
        checkedCount > 0 && checkedCount < this.classList3.length;
    },
    onCheckedWeekChangeone(value) {
      let checkedCount = value.length;
      this.checkWeekAll1 = checkedCount === this.weekListarr1.length;
      this.isIndeterminate41 =  checkedCount > 0 && checkedCount < this.weekListarr1.length;
    
    },
    onCheckedWeekChangetwo(value) {
      let checkedCount = value.length;
      this.checkWeekAll2 = checkedCount === this.weekListarr2.length;
      this.isIndeterminate42 =  checkedCount > 0 && checkedCount < this.weekListarr2.length;
    
    },
    onCheckedWeekChangethree(value) {
      let checkedCount = value.length;
      this.checkWeekAll3 = checkedCount === this.weekListarr3.length;
      this.isIndeterminate43 =  checkedCount > 0 && checkedCount < this.weekListarr3.length;
    
    },
    onCheckedWeekChangefour(value) {
      let checkedCount = value.length;
      this.checkWeekAll4 = checkedCount === this.weekListarr4.length;
      this.isIndeterminate44 =  checkedCount > 0 && checkedCount < this.weekListarr4.length;
    
    },
    onCheckedWeekChangefive(value) {
      let checkedCount = value.length;
      this.checkWeekAll5 = checkedCount === this.weekListarr5.length;
      this.isIndeterminate45 =  checkedCount > 0 && checkedCount < this.weekListarr5.length;
    
    },
    onCheckedWeekChangesix(value) {
      let checkedCount = value.length;
      this.checkWeekAll6 = checkedCount === this.weekListarr6.length;
      this.isIndeterminate46 =  checkedCount > 0 && checkedCount < this.weekListarr6.length;
    
    },
    onCheckedWeekChangeseven(value) {
      let checkedCount = value.length;
      this.checkWeekAll7 = checkedCount === this.weekListarr7.length;
      this.isIndeterminate47 =  checkedCount > 0 && checkedCount < this.weekListarr7.length;
    
    },
    onCheckAllWeekChange1(val) {
      var startIndex = 0;
      if (this.weekListarr1[0].week > 0) {
        startIndex = 0;
      }
      let arr =  this.weekListarr1.slice(startIndex, startIndex + this.weekListarr1.length)
    
      this.checkedWeek1 = val ? arr : [];
      this.isIndeterminate41 = false;
     
    },
     onCheckAllWeekChange2(val) {
      var startIndex = 0;
      if (this.weekListarr2[0].week > 0) {
        startIndex = 0;
      }
      let arr =  this.weekListarr2.slice(startIndex, startIndex + this.weekListarr2.length)
    
      this.checkedWeek2 = val ? arr : [];
      this.isIndeterminate42 = false;
     
    },
     onCheckAllWeekChange3(val) {
      var startIndex = 0;
      if (this.weekListarr3[0].week > 0) {
        startIndex = 0;
      }
      let arr =  this.weekListarr3.slice(startIndex, startIndex + this.weekListarr3.length)
    
      this.checkedWeek3 = val ? arr : [];
      this.isIndeterminate43 = false;
     
    },
     onCheckAllWeekChange4(val) {
      var startIndex = 0;
      if (this.weekListarr4[0].week > 0) {
        startIndex = 0;
      }
      let arr =  this.weekListarr4.slice(startIndex, startIndex + this.weekListarr4.length)
    
      this.checkedWeek4 = val ? arr : [];
      this.isIndeterminate44 = false;
     
    },
     onCheckAllWeekChange5(val) {
      var startIndex = 0;
      if (this.weekListarr5[0].week > 0) {
        startIndex = 0;
      }
      
      let arr =  this.weekListarr5.slice(startIndex, startIndex + this.weekListarr5.length)
    
      this.checkedWeek5 = val ? arr : [];
      this.isIndeterminate45 = false;
     
    },
    onCheckAllWeekChange6(val) {
      
      var startIndex = 0;
      
      if (this.weekListarr6[0].week > 0) {
        startIndex = 0;
      }
      let arr =  this.weekListarr6.slice(startIndex, startIndex + this.weekListarr6.length)
    
      this.checkedWeek6 = val ? arr : [];
      this.isIndeterminate46 = false;
     
    },
   onCheckAllWeekChange7(val) {
      var startIndex = 0;
      // if (this.weekListarr7[0].week > 0) {
      //   startIndex = 0;
      // }
      let arr =  this.weekListarr7.slice(startIndex, startIndex + this.weekListarr7.length)
    
      this.checkedWeek7 = val ? arr : [];
      this.isIndeterminate47 = false;
     
    },
   
   checkboxWeek() {
     this.checkWeekAll1 = true
     this.checkWeekAll2 = true
     this.checkWeekAll3 = true
     this.checkedWeek4 = []
     this.checkedWeek5 = []
     this.checkedWeek6 = []
     this.checkedWeek7 = []
     this.weekList.forEach(item => {
       if(item.week <= 5) {
         this.checkedWeek1.push(item)
       }
       if(item.week > 5 && item.week <= 10) {
         this.checkedWeek2.push(item)
       }
       if(item.week > 10 && item.week <= 15) {
         this.checkedWeek3.push(item)
       }
       if(item.week > 15 && item.week <= 18) {
         this.checkedWeek4.push(item)
       }
     })
   },
   closeCheckboxWeek() {
    this.checkedWeek1 = []
    this.checkedWeek2 = []
    this.checkedWeek3 = []
    this.checkedWeek4 = []
    this.checkedWeek5 = []
    this.checkedWeek6 = []
    this.checkedWeek7 = []
    this.checkWeekAll1 = false
    this.checkWeekAll2 = false
    this.checkWeekAll3 = false
    this.checkWeekAll4 = false
    this.checkWeekAll5 = false
    this.checkWeekAll6 = false
    this.checkWeekAll7 = false
   },
    exceptionDate() {
      this.getExceptionDate();
      this.dialog.datevisible = true;
    },
    onChose() {
      // this.getAreaList();
     
      // this.dialog.sitevisible = true;
    },
    onAddSite(row) {
      this.addSiteTableData.push(row);
      this.$set(this.addSiteTableData, "group_id", "");
    },
    delSiteItem(index, row) {
      this.addSiteTableList.splice(index, 1);
    },
    addGroup() {
      
      this.getAreaList()
      this.dialog.status = "add";
      this.dialog.visible = true;
      this.dialog.title = "录入课程表明细";
      this.addSiteTableData = [];
      this.addSiteTableList = [];
      this.checkedWeek1 = [];
      this.checkedWeek2 = [];
      this.checkedWeek3 = [];
      this.checkedWeek4 = [];
      this.checkedWeek5 = [];
      this.checkedWeek6 = [];
      this.checkedWeek7 = [];
      // 刘钧要求，默认给一个空行
      this.addSiteTableList.push({
        capacity: "",
        name: "",
        groups: [],
        area: '',
      });
      // 清空所有选择框
      this.checkWeekAll1 = false
      this.isIndeterminate41 = false;
      this.checkWeekAll2 = false
      this.isIndeterminate42 = false;
      this.checkWeekAll3 = false
      this.isIndeterminate43 = false;
      this.checkWeekAll4 = false
      this.isIndeterminate44 = false;
      this.checkWeekAll5 = false
      this.isIndeterminate45 = false;
      this.checkWeekAll6 = false
      this.isIndeterminate46 = false;
      this.checkWeekAll7 = false
      this.isIndeterminate47 = false;
      // 清空完成
      // 清空上课组
      this.groupList.splice(0);
      // 清空完成
      
    },
    copySchedule(row) {
      this.dialog.status = "copy";
      this.dialog.visible = true;
      this.dialog.title = "复制课程表明细";
      this.getItemDetail(row);
         this.getAreaList()
    
    },
    showSchedule(row,semesterName,term_id){
      this.dialog.status = "show";
      this.dialog.visible = true;
      this.editId = row.id;
      this.dialog.title = "课程表明细";
      this.row.semester_name = semesterName;
      this.getAreaList();
      this.getWeekly(term_id)
      .then(_=>{
        this.getItemDetail(row);
      });
    },
    editSchedule(row) {
      if(row.status==2){
        // this.$message.error('此条记录生成的进度表如果提交，不可修改，如果想修改，请先将进度表撤回！')
        this.$confirm('此条记录的进度表已提交，确认修改吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.dialog.status = "update";
            this.dialog.visible = true;
            this.editId = row.id;
            this.dialog.title = "编辑课程表明细";
            this.getItemDetail(row);
            this.getAreaList()

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
      }
      if(row.status==1){
        this.$confirm('此条记录已生成进度表，如果修改，系统将自动将相关进度表删除，修改后请手动点击“生成进度表”才能查询到相关进度表，确认修改吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.dialog.status = "edit";
            this.dialog.visible = true;
            this.editId = row.id;
            this.dialog.title = "编辑课程表明细";
            this.getItemDetail(row);
            this.getAreaList()

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
      }
      if(row.status==0){
          this.dialog.status = "edit";
          this.dialog.visible = true;
          this.editId = row.id;
          this.dialog.title = "编辑课程表明细";
          this.getItemDetail(row);
          this.getAreaList()
      }
   
    },
    getItemDetail(row) {
      this.area_grouplist = [];
      this.$http.get("_ed:/curriculum/detail/" + row.id).then(data => {
        if (data.code == 0) {
          let obj = data.data;
          //上课班
          this.getClassData(obj.semester_course_id);

          this.checkedClass1 = [];
          this.checkedClass2 = [];
          this.checkedClass3 = [];
          this.checkedClass4 = [];
          this.checkedWeek = [];
          this.checkedWeek1 = [];
          this.checkedWeek2 = [];
          this.checkedWeek3 = [];
          this.checkedWeek4 = [];
          this.checkedWeek5 = [];
          this.checkedWeek6 = [];
          this.checkedWeek7 = [];
          
          this.addForm = obj;

          this.addForm.area_ids = obj.area_names;
          this.areaData = obj.area_clsgroups;
          if (Array.isArray(this.areaData) && this.areaData.length > 0) {
            this.addSiteTableList = this.areaData.map(x=>{
              
              var d = {
                name:x.area_name,
                area:{
                  id: x.area_id,
                  name :x.area_name,
                  capacity:x.capacity,
                },
                groups: x.group_ids.map(g => {
                  var t = {
                    id: g
                  };
                  
                  return t;
                })
              }
              return d;
            })
          
          }

          //场地编辑
          // let list = obj.area_names.split(",");
          let areasArr = obj.area_clsgroups;
          for (let i = 0, len = areasArr.length; i < len; i++) {
            this.area_grouplist.push({
              area_id: areasArr[i].area_id,
              area_name: areasArr[i].area_name,
              grouplist: areasArr[i].group_ids,
              capacity: areasArr[i].capacity
            });
          }
          // 课节
          for (let value1 of this.classList1) {
            for (let val1 of obj.section_nodeids) {
              if (value1.id == val1) {
                this.checkedClass1.push(value1);
              }
            }
          }

          for (let value2 of this.classList2) {
            for (let val2 of obj.section_nodeids) {
              if (value2.id == val2) {
                this.checkedClass2.push(value2);
              }
            }
          }
          for (let value3 of this.classList3) {
            for (let val3 of obj.section_nodeids) {
              if (value3.id == val3) {
                this.checkedClass3.push(value3);
              }
            }
          }
          for (let value4 of this.classList4) {
            for (let val4 of obj.section_nodeids) {
              if (value4.id == val4) {
                this.checkedClass4.push(value4);
              }
            }
          }
         
          // 周次
          let self = this
         self.weekList.forEach(item => {
           obj.week_numbers.forEach(Element => {
             if(item.week == Element) {
               if(item.week>0&&item.week<=5){
                  self.checkedWeek1.push(item)
                }
                if(item.week > 5 && item.week <= 10){
                    self.checkedWeek2.push(item)
                }
                if(item.week > 10 && item.week <=15){
                    self.checkedWeek3.push(item)
                 }
                 if(item.week >15 && item.week <=20){
                    self.checkedWeek4.push(item)
                 }
                 if(item.week >20 && item.week <= 25){
                    self.checkedWeek5.push(item)
                 }
                 if(item.week >-5 && item.week < 1){
                    self.checkedWeek6.push(item)
                 }
                 if(item.week >-10 && item.week <-5){
                    self.checkedWeek7.push(item)
                 }
             }
           })
         })
          //获取分组
          this.getGroupData(this.addForm.teaching_form);
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    closeSite() {
      let that = this;
      let area_names = [];
      let groupNum = [];
      this.area_grouplist = [];

      
      if (this.groupList.length == 0) {
        this.$message.warning(
          "此授课形势下暂无分组，请到上课班分组设置里进行维护！"
        );
        return;
      }

      //组装数据并且把选择的值赋给场地
    
      for (let i = 0, len = this.addSiteTableData.length; i < len; i++) {
        if (this.addSiteTableData[i].group_id.length == 0) {
          this.$message.warning("请选择组号！");
          return;
        }
        let groupIds = this.addSiteTableData[i].group_id;
        for (let j = 0, lens = groupIds.length; j < lens; j++) {
          groupNum.push(groupIds[j]);
        }

        this.area_grouplist.push({
          area_id: this.addSiteTableData[i].id,
          area_name: this.addSiteTableData[i].name,
          grouplist: this.addSiteTableData[i].group_id,
          capacity: this.addSiteTableData[i].capacity
        });
        area_names.push(this.addSiteTableData[i].name);
      }
    
      //检查是否有重复组号
      let groupIds = [];
      for (let x = 0, ls = groupNum.length; x < ls; x++) {
        for (var z = x; z < groupNum.length - 1; z++) {
          if (groupNum[x] == groupNum[z + 1]) {
            this.$message.warning("组号选择重复，请重新选择！");
            return;
          }
        }
      }
      this.dialog.sitevisible = false;
      this.addForm.area_ids = area_names.join(",");
      this.siteForm.num = "";
      this.siteForm.name = "";
     
    },
    addConfirm() {


      let url;
      let option = {};
      let weekId = [];
      let classId = [];

     
      this.area_grouplist = this.addSiteTableList.map(item => {
        var grp = {};
        grp.area_id = item.area.id;
        grp.area_name = item.area.name;
        grp.grouplist = item.groups.map(g => g.id);
        grp.capacity = item.area.capacity;
        return grp;
      });
     
      // 获取周次id
      this.checkedWeek = this.checkedWeek1.concat(this.checkedWeek2).concat(this.checkedWeek3).concat(this.checkedWeek4).concat(this.checkedWeek5).concat(this.checkedWeek6).concat(this.checkedWeek7)
      
      
      for (let list of this.checkedWeek) {
        weekId.push(list.week);
        
      }
      
      
      for(let i=0;i<this.addSiteTableList.length;i++){
        if(this.addSiteTableList[i].area==''){
          
          this.$message.warning("请选择场地！");
          return;
        }
      }
      // 获取课节id
      for (let item1 of this.checkedClass1) {
        classId.push({
          section_nodeid: item1.id,
          section_nodename: item1.name
        });
      }
      for (let item2 of this.checkedClass2) {
        classId.push({
          section_nodeid: item2.id,
          section_nodename: item2.name
        });
      }
      for (let item3 of this.checkedClass3) {
        classId.push({
          section_nodeid: item3.id,
          section_nodename: item3.name
        });
      }
      for (let item4 of this.checkedClass4) {
        classId.push({
          section_nodeid: item4.id,
          section_nodename: item4.name
        });
      }
      if (classId.length == 0) {
        this.$message.warning("请选择课节！");
        return;
      }
  
     
      if (weekId.length == 0) {
        this.$message.warning("请选择周次！");
        return;
      }
      if(this.dialog.status == "update"){
        url = "_ed:/scheduleVisualizing/updateScheduleByCurriculumDetail";
        let areaidgroup = [];
        let section_nodeids = [];
        this.area_grouplist.forEach(area => {
          areaidgroup.push(`${area.area_id}-${area.grouplist.join("a")}`)
        })
        classId.forEach(item=>{
          section_nodeids.push(item.section_nodeid)
        })
        option = {
          detail_visual_id: 0,
          curriculum_visual_id: 0,
          curriculum_detail_id: this.addForm.id,
          weekday: this.addForm.weekday,
          areaidgroup: areaidgroup,
          section_nodeids: section_nodeids,
          week_numbers: weekId
        }
      } else if (this.dialog.status == "add" || this.dialog.status == "copy") {
        url = "_ed:/curriculum/detail/add";
        option = {
          curriculum_id: this.row.id,
          semester_course_id: this.addForm.semester_course_id,
          cls_id: this.addForm.cls_id,
          teaching_form: this.addForm.teaching_form,
          teaching_formname: this.teach_formname,
          weekday: this.addForm.weekday, //星期
          week_numbers: weekId, //周次
          note: this.addForm.note,
          // create_user:this.userId,
          create_username: this.userName,
          sectionnodelist: classId, //课节id
          area_grouplist: this.area_grouplist
        };
      } else {
        url = "_ed:/curriculum/detail/edit";
        option = {
          id: this.editId,
          teaching_form: this.addForm.teaching_form,
          teaching_formname: this.teach_formname,
          weekday: this.addForm.weekday, //星期
          week_numbers: weekId,
          note: this.addForm.note,
          sectionnodelist: classId,
          area_grouplist: this.area_grouplist,
          // cls_id: this.row.cls_id,
          cls_id: this.addForm.cls_id,
          // semester_course_id: this.row.semester_course_id
          semester_course_id: this.addForm.semester_course_id
        };
      
      }
      this.$http({
        method: "post",
        url: url,
        data: {
          ...option
        }
      }).then(data => {
        
        let type = "success";
        let message;
        if (this.dialog.status == "add") {
          message = "录入成功！";
        } else if (this.dialog.status == "copy") {
          message = "复制成功！";
        } else {
          message = "编辑成功！";
        }
        console.info(data)
        if(data.code<0){
          this.datamsglist = data.data;
          this.datamsgnone = false
          return
        }
        if (data.code == 0) {
          this.dialog.visible = false;
          this.getTableList();
        }
        if(data.code==1){
            if(Object.prototype.toString.call(JSON.parse(data.msg)) == "[object Array]"){
              this.datamsglist = JSON.parse(data.msg);
              this.datamsgnone = false;
              return
            }
            if (data.data) {
              type = "error";
              message = data.msg + "：" + data.data;
            }
        }
        
        this.$message({
          type: type,
          message: message
        });
      });
    },
    colsedatamsg(){
      this.datamsgnone = true
      this.datamsglist = []
    },
    delTableRow(row) {
      this.$confirm(
        `此操作将永久删除“${row.course_name}”所维护的信息, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$http
            .delete("_ed:/curriculum/detail/delete/" + row.id)
            .then(data => {
              let type = "success";
              let message = "删除成功！";
              if (data.code == 0) {
                if (this.tableData.length == 1) {
                  this.pageNo = 1;
                }
                this.getTableList();
              } else {
                type = "error";
                message = data.msg;
              }
              this.$message({
                type: type,
                message: message
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    getTableList() {
      this.$http
        .post("_ed:/curriculum/detail/query", {
          curriculum_id: this.row.id,
          request_page: this.pageNo,
          page_size: this.pageSize
        })
        .then(data => {
          if (data.code == 0) {
            this.totalCount = data.data.total_records;
            if (data.data.dataList) {
              this.tableData = data.data.dataList;
            }
          } else {
            this.$message.error(data.msg);
          }
        });
    },
    getCourseList() {
      this.$http
        .post("_ed:/semestercourse/query", {
          grade: this.row.grade,
          semester_year: this.row.semester_year,
          semester_year_number: this.row.semester_year_number
        })
        .then(res => {
          if (res.code == 0) {
            this.courseList = res.data.dataList;
          } else {
            this.$message.error(data.msg);
          }
        });
    },
    geLessonList() {
      //获取课节
      let self = this;
      this.$http.get("_op:/sections/find").then(res => {
        if (res.code == 0) {
          if (res.data) {
            let datas = res.data;
             
            for (let i = 0; i < datas.length; i++) {
              if ("13:00:00" >= String(datas[i].endTime)) {
                self.classList1.push({
                  name: datas[i].name,
                  id: datas[i].id
                });
              }
              if (
                "13:00:00" < String(datas[i].endTime) &&
                "19:00:00" >= String(datas[i].endTime)
              ) {
                self.classList2.push({
                  name: datas[i].name,
                  id: datas[i].id
                });
              }

              if ("19:00:00" < String(datas[i].endTime)) {
                self.classList3.push({
                  name: datas[i].name,
                  id: datas[i].id
                });
              }
            }
          }
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    getAreaList() {
      
      //获取场地信息
      this.$http.post("_op:/areas/list", {
          pageNo:1,
     
          pageSize: 1000,
          param: {
            name: this.siteForm.name,
            capacity: this.siteForm.num
          }
        })
        .then(data => {
          
          if (data.code == 0) {
            
            this.totalCount1 = data.data.total;
            this.siteTableData = data.data.records;
            // console.log(this.siteTableData,'场地')

          } else {
            this.$message.error(data.msg);
          }
        });
    },
    getExceptionDate() {
      //获取例外数据
      this.$http
        .post("_op:/holidays/exceptiondate", {
          semesterYear: this.row.semester_year,
          semesterYearNo: this.row.semester_year_number
        })
        .then(data => {
          if (data.code == 0) {
            this.dateTableData = data.data;
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(() => {
          this.dateTableData = [];
        });
    },
    getWeekly(termId) {
      //获取周次
      let weekArr1 = {}
	  var weekArr12 = []
      let self = this;
      let term_id = this.row.term_id;
      if(this.dialog.status=='show'){
        term_id = termId;
      }
      return this.$http
        .get("_op:/week/term/list/all/" + term_id)
        .then(res => {
          if (res.code == 0) {
            let datas = res.data;
            
            self.weekList = [];
            for (let i = 0, len = datas.length; i < len; i++) {
              let item = datas[i]; 
              // item.week = item.week + 1;
              if (item.holiday === true && item.whatDay !== 6 && item.whatDay !== 7) {  //法定节假日
                self.courseTips.push(item);
              }
              
              if(item.holiday === false && (item.whatDay === 6 || item.whatDay === 7)){ //例外工作日
                self.exceptionalWorkDay.push(item);
              }
              if(item.week < 0) {
			   weekArr1 = item
			   weekArr12.push(item)
              }
              // console.log('11',self.exceptionalWorkDay)
              self.weekList[item.week] = item;
              
            }
            var arr1 = []
            var arr2 = []
           
            arr1 = self.weekList.slice(-2)
           
            self.weekList.forEach(item => {
              if(item.week < 1){
                arr1.push(item)
                
              }else if (item.week < arr1[0].week){
                arr2.push(item)
              }
            })
            if(JSON.stringify(weekArr1) !== "{}") {
			//   arr1.push(weekArr1) 
				for(let i=0 ;i<weekArr12.length;i++){
					if(i==0){
						arr1.push(weekArr12[weekArr12.length - i -1])
					}else if(weekArr12[weekArr12.length - i -1].week !== weekArr12[weekArr12.length - i ].week ){
						arr1.push(weekArr12[weekArr12.length - i -1])
					}
				}
            }
            // for(let i=0;i<self.weekList.length;i++){
            //   if(self.weekList[i].week<1){
            //     arr1.push(self.weekList[i])
            //   }else{
            //     arr2.push(self.weekList[i])
            //   }
            // }

            this.decomposeweekList(arr2) //正的数组
            this.decomposeweekList2(arr1) //负的数组
            //周次没有0 (又要有第0周了，刘均要求的)
            // self.weekList.splice(0, 1);
          } else {
            self.$message.error(data.msg);
          }
        });
    },
    getTeachType() {
      this.$http.get("_op:/teaching/form/combox").then(data => {
        if (data.code == 0) {
          this.teachList = data.data;
        } else {
          this.$message.error(data.msg);
        }
      });
    }
  }
};
</script>
<style scoped>
.datamsg{
  position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
 
  z-index: 100000;
}
.none{
  display: none;
}
.datamsg .datamhsbody{
  background:#f5f7fa;
  width: 30%;
    border: solid 1px #ddd;
    margin: 100px auto;
    padding: 20px 20px;
  }
    
.datamhsbody /deep/.dialog-footer{
    /* padding: 10px 20px 20px; */
    text-align: right;
}
.class-margin {
  min-width: 75px;
  border-left: solid 2px #ddd;
}

.course-tip {
  width: 100%;
  margin-bottom: 20px;
}

.tip {
  padding: 0 12px;
  float: left;
}

.container-tip {
  width: 83%;
  padding: 6px 10px;
  /* max-height: 180px; */
  /* overflow: scroll; */
  border: solid #ccc 1px;
  display: inline-block;
}
.container-tip-item{
  display: flex;
}
.container-tip-item>span{
  white-space:nowrap;
}

.tip-list,
.exceptional-wrod {
  font-size: 0;
}

.tip-list-cycle {
  width: 160px;
  display: inline-block;
  font-size: 13px;
  line-height: 24px;
  padding: 0 5px;
}
/* .cm-fold {
        padding-top: 10px;
		background-color: #f7f7f7;
	} */

.cm-btn-others {
  padding: 0 20px 10px;
}

.class-wrap {
  display: flex;
}

.class-inner {
  display: flex;
  overflow: auto;
  border: 1px solid #ddd;
}
.changdi /deep/ .el-form-item__label{
  text-align: center;
}
.changdi /deep/ .el-form-item__content{
  width: 80%
}
.class-wrap /deep/ .el-checkbox + .el-checkbox {
  margin-left: 10px;
}

.class-wrap /deep/ .el-checkbox-group {
  margin-left: 10px;
}

.class-wrap[data-v-e66abd64] .el-checkbox.el-checkbox {
  margin-left: 10px;
  margin-right: 10px;
}

.cm-bg p {
  padding: 0 20px;
}

.class-make {
  padding-left: 26px;
}

.class-wrap .weekly {
  width: 52px;
  text-align: right;
  margin-right: 16px;
}

.week-margin {
  margin-bottom: 20px;
}

.class-btn {
  padding-top: 54px;
  margin-left: 30px;
}

.common-style {
  display: flex;
}

.common-style p {
  padding-top: 6px;
  padding-left: 10px;
}

.common-style /deep/ .el-checkbox + .el-button--text {
  height: 40px;
  padding: 0;
}

.common-style /deep/ .el-button--text span {
  text-decoration: underline;
}

.class-margin /deep/ .el-checkbox {
  margin-right: 10px;
  margin-left: 10px;
}

.tips {
  position: absolute;
  top: 22px;
  left: 100px;
  font-size: 12px;
  color: red;
}

.sit-fold {
  display: flex;
}

.chosen-wrap {
  /* padding-top: 10px; */
}

.title {
  font-size: 16px;
  margin-bottom: 10px;
}

.cm-bg {
  display: flex;
  justify-content: center;
  border: 1px solid #ccc;
  background-color: #dcdfe6;
}

.weekcheckgroup /deep/.el-checkbox {
  width: 45px;
 margin-right: 16px;
}

.course-selection {
  width: 140px;
}

@media screen and (max-width: 1366) {
  .course-selection {
    width: 96px;
  }
}
@media screen and (max-width: 1920) {
  .course-selection {
    width: 300px;
  }
}
</style>