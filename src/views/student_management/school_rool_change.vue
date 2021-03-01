<template>
  <div class="school-roll-change">
    <div class="cm-breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          v-for="(item,index) in breadcrumb"
          :key="index"
          :to="{ path:item.path }"
        >{{item.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="cm-btn-con cm-fold">
      <el-form :inline="true" size="mini" :model="formInline">
        <div class="fold">
          <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
            <el-form-item class="cm-collapse" v-show="fold.showBtn">
              <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
            </el-form-item>

            <el-form-item label="学号">
              <el-input v-model.trim="formInline.stuNum" placeholder="请输入学号"></el-input>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input v-model="formInline.stuName" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="异动类型">
              <el-select filterable v-model="formInline.type" placeholder="全部">
                <el-option label="全部" value></el-option>
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="btn">
            <el-button size="mini" type="primary" @click="searchQuery">查询</el-button>
          </div>
        </div>
      </el-form>
    </div>
    <div class="cm-btn-con">
      <template v-for="item in typeList">
        <el-button
          size="mini"
          type="primary"
          v-if="item.code != 3"
          :key="item.code"
          @click="openDialog(item.code, 'add')"
        >{{item.name}}</el-button>
      </template>
      <el-button type="primary" size="mini" @click="showGradeIde()">批量成绩认定</el-button>
      <el-button size="mini" type="primary" @click="importStuScore" style="margin-left: 40px">转专业转班导入</el-button>
      <!-- <el-upload size="medium" style="display: inline-block;margin-left: 40px;margin-right: 10px;"
          class="upload-demo" :action="filePath" :headers="headers"
          :show-file-list="false" :before-upload="onBefore" :on-success="handleAvatarSuccess">
          <el-button size="mini" type="primary">导入</el-button>
      </el-upload> -->
      <a :href="`${publicPath}template/Transfe-professional-class-import-templateV2.0.xls`" class="el-button el-button--primary el-button--mini" download="转专业转班导入模板">导入模版下载</a>
      <el-button size="mini" type="primary" @click="exportExc">导出</el-button>
      <a v-show="false" ref="exportExcel"></a>
      <el-button style="margin-left: 10px;" size="mini" type="primary" @click="scoreModel">成绩模型生成</el-button>
    </div>
    <div class="cm-table">
      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        :height="tableHeight()"
        size="mini"
        v-loading="tableLoading"
        style="width: 100%"
        header-row-class-name="cm-dark"
      >
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="type" label="异动类型" width="85">
          <template slot-scope="scope">
            <template v-if="scope.row.type == 10">院内转专业</template>
            <template v-else-if="scope.row.type == 2">院内转出</template>
            <template v-else-if="scope.row.type == 3">院外转入</template>
            <template v-else-if="scope.row.type == 4">休学</template>
            <template v-else-if="scope.row.type == 5">退学</template>
            <template v-else-if="scope.row.type == 6">降级</template>
            <template v-else-if="scope.row.type == 11">转班</template>
            <template v-else-if="scope.row.type == 9">复学</template>
            <template v-else-if="scope.row.type == 12">保留学籍</template>
            <template v-else-if="scope.row.type == 1">没入学</template>
          </template>
        </el-table-column>
        <el-table-column prop="stuNum" label="学号" width="110"></el-table-column>
        <el-table-column prop="stuName" label="姓名" width="110"></el-table-column>
        <el-table-column prop="former_classname" label="原班级" width="175"></el-table-column>
        <el-table-column prop="modifiedDate" label="异动日期" width="85">
          <template slot-scope="scope">{{scope.row.modifiedDate | formatTime}}</template>
        </el-table-column>
        <el-table-column prop="present_grade" label="转入年级" width="75"></el-table-column>
        <el-table-column prop="present_majorname" label="转入专业" width="200"></el-table-column>
        <el-table-column prop="present_classname" label="转入班级" width="150"></el-table-column>
        <el-table-column prop="affirm_status" label="成绩状态" width="100"></el-table-column>
        <el-table-column prop="remarks" label="备注" width="200"></el-table-column>
        <el-table-column prop="creater" label="创建人" width="81"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="90">
          <template slot-scope="scope">{{scope.row.createTime | formatTime}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              @click="openDialog(scope.row.type, 'show', scope.row.id)"
              type="text"
              v-if="scope.row.affirm_status === '已认定'"
              size="small"
            >查看</el-button>
            <el-button
              @click="openDialog(scope.row.type, 'edit', scope.row.id)"
              type="text"
              v-else
              size="small"
            >编辑</el-button>
            <el-button
              @click="handleAffirm(scope.row, 0)"
              type="text"
              v-if="scope.row.affirm_status === '已认定'"
              size="small"
            >取消认定</el-button>
            <el-button
              @click="deleteTeacher(scope.row.id)"
              type="text"
              size="small"
              v-if="scope.row.type != 3 && scope.row.affirm_status !== '已认定'"
              style="color:red;"
            >删除</el-button>
            <template v-if="scope.row.type == 3 || scope.row.type == 10 || scope.row.type == 6 || scope.row.type == 9 ">
              <el-button @click="handleAffirm(scope.row, 1)" type="text" size="small">课程认定</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="cm-pagination">
      <el-pagination
        background
        :current-page.sync="pageNo"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        @size-change="sizeChange"
        @current-change="currentChange"
      ></el-pagination>
    </div>

    <!-- 新增/编辑  院内转专业 院内转出 休学 复学 降级 退学弹窗  注意：转班编辑也使用这个弹窗 -->
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      class="boxStyle"
      top="3vh"
      width="760px"
      custom-class="school-roll-change-dialog"
      @close="dialogClose"
      >
      <el-form
        class="teacher-priority-form"
        :inline="true"
        :rules="rules"
        ref="changeForm"
        :model="changeForm"
        label-width="121px"
      >
        <el-form-item class="input-item" label="学号" v-if="isFu ==false" prop="stuNum">
          <el-input
            :disabled="this.dialog.status!=='add'"
            v-if="isFu ==false"
            v-model="changeForm.stuNum"
            placeholder="请输入学号或姓名"
            @keyup.native="keyupHandle"
          >
            <i class="el-icon-loading el-input__icon" v-if="queryLoading" slot="suffix"></i>
          </el-input>
        </el-form-item>
        <el-form-item class="input-item" label="学号" v-if="isFu ==true" prop="stuNum">
          <el-input
            :disabled="this.dialog.status!=='add'"
            v-if="isFu ==true"
            v-model="changeForm.stuNum"
            placeholder="请输入学号"
            @keyup.native="fuKey"
          >
            <i class="el-icon-loading el-input__icon" v-if="queryLoading" slot="suffix"></i>
          </el-input>
        </el-form-item>
        <!-- <el-form-item class="input-item" label="学号999"  v-if="ywzr ==true"  prop="stuNum">
                    <el-input  :disabled="this.dialog.status!=='add'" v-if="ywzr ==true" v-model="changeForm.stuNum" placeholder="请输入学号"  @keyup.native="fuKey"><i class="el-icon-loading el-input__icon" v-if="queryLoading" slot="suffix"></i></el-input>
        </el-form-item>-->

        <el-form-item class="input-item" label="姓名">
          <el-input :disabled="true" v-model="changeForm.stuName" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <!-- 这里transferType !== 11 是编辑转班信息时不显示  -->
        <!-- 846男  847 女 -->
        <el-form-item class="input-item" label="性别">
          <el-input
            :disabled="true"
            v-model="changeForm.sex == 846 ? '男' : changeForm.sex == 847 ? '女' : ''"
            placeholder="请输入性别"
          ></el-input>
        </el-form-item>
        <el-form-item class="input-item" label="手机号码">
          <el-input :disabled="true" v-model="changeForm.mobile" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item class="input-item" label="入学日期">
          <el-input :disabled="true" v-model="changeForm.enrollmentDate" placeholder="请输入入学日期"></el-input>
        </el-form-item>
        <el-form-item class="input-item" label="年级">
          <!-- {{changeForm.formerGrade}} -->
          <el-input :disabled="true" v-model="changeForm.formerGrade" placeholder="请输入年级"></el-input>
        </el-form-item>
        <el-form-item class="input-item" label="所在专业">
          <!-- {{changeForm.formerMajorId}} -->
          <!-- <el-input v-model="changeForm.formerMajorId" :disabled="true" placeholder="请输入所在专业"></el-input> -->
          <el-select
            :disabled="true"
            v-model="changeForm.formerMajorId"
            clearable
            placeholder="请选择专业"
          >
            <el-option v-for="item in majorList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="input-item" label="所在行政班">
          <!-- <el-input v-model="changeForm.formerClassId" :disabled="true" placeholder="请输入所在行政班"></el-input> -->
          <el-select
            :disabled="true"
            v-model="changeForm.formerClassId"
            clearable
            placeholder="请选择专业"
            @change="getAdministrativeClassList"
          >
            <el-option
              v-for="item in administrativeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 编辑转班时显示 -->
        <el-form-item class="input-item" label="转入行政班" v-if="transferType == 11">
          <el-select v-model="changeForm.presentClassId" :disabled="dialog.status=='show'" clearable placeholder="请选择专业">
            <el-option
              v-for="item in administrativeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 院内转专业或院内转出 -->
        <!-- <template v-if="transferType === 'tranferIn' || transferType === 'tranferOut'"> -->
        <template v-if="transferType === 10 || transferType === 2">
          <el-form-item v-show="editFalse" label="转入年级" prop="presentGrade">
            <intelligent-year-picker
              type="year"
              v-model="changeForm.presentGrade"
              value-format="yyyy"
              :disabled="dialog.status=='show'"
              placeholder="请选择年级"
              @change="clearMajor"
            ></intelligent-year-picker>
          </el-form-item>
          <el-form-item v-show="editFalse" label="转入专业" prop="presentMajorId">
            <el-select
              :disabled="!changeForm.presentGrade || dialog.status=='show'"
              v-model="changeForm.presentMajorId"
              clearable
              placeholder="请选择专业"
              @change="getAdministrativeClassList"
            >
              <el-option
                v-for="item in majorList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="editFalse" label="转入行政班" prop="presentClassId">
            <el-select
              :disabled="!changeForm.presentMajorId || dialog.status=='show'"
              v-model="changeForm.presentClassId"
              clearable
              placeholder="请选择行政班"
            >
              <el-option
                v-for="item in administrativeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
        <!-- 休学异动 -->
        <!-- <template v-if="transferType === 'suspend'"> -->
        <template v-if="transferType === 4">
          <el-form-item label="休学类型" prop="reason">
            <el-select v-model="changeForm.reason" :disabled="dialog.status=='show'" clearable placeholder="休学类型">
              <el-option v-for="xiuxue of outOfSchoolList" :label="xiuxue.name" :value="xiuxue.id" :key="xiuxue.id"></el-option>
              <!-- <el-option label="国家政策-入伍" :value="2"></el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item label="休学周期" prop="ext5">
            <el-select v-model="changeForm.ext5" :disabled="dialog.status=='show'" clearable placeholder="休学周期">
              <el-option label="1学期" :value="1"></el-option>
              <el-option label="1学年" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="休学期电话">
            <el-input v-model="changeForm.ext1" :disabled="dialog.status=='show'" placeholder="请输入休学期电话"></el-input>
          </el-form-item>
          <el-form-item label="电子邮件">
            <el-input v-model="changeForm.ext2" :disabled="dialog.status=='show'" placeholder="请输入电子邮件"></el-input>
          </el-form-item>
          <el-form-item label="通讯人">
            <el-input v-model="changeForm.ext3" :disabled="dialog.status=='show'" placeholder="请输入通讯人"></el-input>
          </el-form-item>
          <el-form-item label="通讯地址">
            <el-input v-model="changeForm.ext4" :disabled="dialog.status=='show'" placeholder="请输入通讯地址"></el-input>
          </el-form-item>
        </template>
        <!-- 复学 -->
        <!-- <template v-if="transferType === 'reentry'"> -->
        <template v-if="transferType === 9">
          <el-form-item label="休学类型" prop="reason">
            <el-select v-model="changeForm.reason" :disabled="dialog.status=='show'" clearable placeholder="休学类型">
              <el-option v-for="xiuxue of outOfSchoolList" :label="xiuxue.name" :value="xiuxue.id" :key="xiuxue.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="休学周期">
            <el-select v-model="changeForm.ext5" :disabled="dialog.status=='show'" clearable placeholder="休学周期">
              <!-- <el-option label="休学周期" value="2"></el-option> -->
              <el-option label="1学期" :value="1"></el-option>
              <el-option label="1学年" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="复学所在级" prop="presentGrade">
            <!-- <intelligent-year-picker
              type="year"
              v-model="changeForm.presentGrade"
              value-format="yyyy"
              placeholder="请选择年级"
              @change="clearMajor"
            ></intelligent-year-picker> -->
            <el-select v-model="changeForm.presentGrade" :disabled="!this.changeForm.formerGrade || dialog.status=='show'">
              <el-option v-for="item in gradeLimitList" :key="item" :value="item" :label="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="复学专业" prop="presentMajorId">
            <el-select
              :disabled="!changeForm.presentGrade || dialog.status=='show'"
              v-model="changeForm.presentMajorId"
              clearable
              placeholder="请选择专业"
              @change="getAdministrativeClassList"
            >
              <el-option
                v-for="item in majorList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="复学行政班" prop="presentClassId">
            <el-select
              v-model="changeForm.presentClassId"
              clearable
              placeholder="请选择行政班"
              :disabled="!changeForm.presentGrade||!changeForm.presentMajorId || dialog.status=='show'"
            >
              <el-option
                v-for="item in administrativeClassList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
        <!-- 降级 -->
        <!-- <template v-if="transferType === 'lowerGrade'"> -->
        <template v-if="transferType === 6">
          <el-form-item label="转入年级" prop="presentGrade">
            <el-select v-model="changeForm.presentGrade" :disabled="!this.changeForm.formerGrade || dialog.status=='show'">
              <el-option v-for="item in gradeLimitList" :key="item" :value="item" :label="item"></el-option>
            </el-select>
            <!-- <intelligent-year-picker
              type="year"
              v-model="changeForm.presentGrade"
              @change="clearMajor"
              value-format="yyyy"
              placeholder="请选择年级"
            ></intelligent-year-picker> -->
            <!-- <el-date-picker
              v-model="changeForm.presentGrade"
              :disabled="!this.changeForm.formerGrade"
              @change="clearMajor"
              value-format="yyyy"
              type="year"
              :picker-options="pickerOptions"
              placeholder="选择年级">
            </el-date-picker> -->
          </el-form-item>
          <el-form-item label="降级类型" prop="reason">
            <el-select v-model="changeForm.reason" :disabled="dialog.status=='show'" clearable placeholder="请选择降级类型">
              <el-option v-for="jiangxue of outOfSchoolList" :label="jiangxue.name" :value="jiangxue.id" :key="jiangxue.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="转入专业" prop="presentMajorId">
            <el-select
              :disabled="!changeForm.presentGrade || dialog.status=='show'"
              v-model="changeForm.presentMajorId"
              placeholder="请选择专业"
              clearable
              @change="getAdministrativeClassList"
            >
              <el-option
                v-for="item in majorList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="转入行政班" prop="presentClassId">
            <el-select
              :disabled="!changeForm.presentMajorId || dialog.status=='show'"
              v-model="changeForm.presentClassId"
              clearable
              placeholder="请选择行政班"
            >
              <el-option
                v-for="item in administrativeClassList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>
        <!-- 退学 -->
        <!-- <template v-if="transferType === 'dropOut'"> -->

        <template v-if="transferType === 5">
          <el-form-item label="退学原因" prop="reason">
            <el-select v-model="changeForm.reason" :disabled="dialog.status=='show'" clearable placeholder="请选择退学原因">
              <el-option v-for="tuixue of outOfSchoolList" :label="tuixue.name" :value="tuixue.id" :key="tuixue.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="肄业证书" prop="certificateIssunce">
            <el-select v-model="changeForm.certificateIssunce" :disabled="dialog.status=='show'" clearable placeholder="请选择">
              <el-option label="发放" :value="0"></el-option>
              <el-option label="不发放" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </template>
        <el-form-item label="异动日期" prop="modifiedDate">
          <el-date-picker
            v-model="changeForm.modifiedDate"
            :disabled="dialog.status=='show'"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择日期"
          ></el-date-picker>
        </el-form-item>
        <template v-if="transferType === 12">
          <el-form-item label="修业年限延长" prop="ext6">
            <el-select v-model="changeForm.ext6" :disabled="dialog.status=='show'" clearable placeholder="请选择">
              <!-- <el-option label="1年" :value="0"></el-option> -->
              <el-option
                v-for="lis in schoolinglength"
                :key="lis.id"
                :lable="lis.name"
                :value="lis.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </template>

        <div class="remark-box">
          <el-form-item label="备注">
            <el-input type="textarea" :disabled="dialog.status=='show'" v-model="changeForm.remarks"></el-input>
          </el-form-item>
        </div>
        <p class="textStyleBox textStyle">支持上传照片格式为JPG ，且不超过2M</p>
        <el-form-item label="上传附件">
          <el-upload
            class="upload-demo"
            action="/operation/data/admin/uploadFile"
            :headers="headers"
            :file-list="fileList1"
            :on-change="handleChange"
            :on-success="handleUploadSuccess"
            :before-upload="beforeAvatarUpload"
            :on-preview="handlePreview"
          >
            <el-button size="small" v-if="dialog.status!=='show'" type="primary">点击上传</el-button>

            <!-- <span></span> -->
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="ensureSubmit('placeForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 转班弹窗 -->
    <el-dialog
      title="转班"
      :visible.sync="dialog.classVisible"
      :modal-append-to-body="false"
      top="3vh"
      width="900px"
      :close-on-click-modal="false"
      custom-class="school-roll-change-dialog"
      @close="dialogCloseClass"
      >
      <el-form
        :model="transferClassForm"
        :inline="true"
        :rules="transferFormRules"
        ref="transferClassForm"
        label-width="80px"
        >
        <el-form-item label="年级" prop="presentGrade">
          <!-- <el-input v-model="transferClassForm.presentGrade"></el-input> -->
          <!-- {{transferClassForm.presentGrade}} -->
          <intelligent-year-picker
            v-model="transferClassForm.presentGrade"
            type="year"
            value-format="yyyy"
            placeholder="请选择年级"
            @change="clearTransferMajor"
          ></intelligent-year-picker>
        </el-form-item>
        <el-form-item label="专业" prop="presentMajorId" style="margin-left: 196px;">
          <!-- {{transferClassForm.presentMajorId}} -->
          <!-- <el-input v-model="transferClassForm.presentMajorId"></el-input> -->
          <el-select
            v-model="transferClassForm.presentMajorId"
            @change="getShiftWork"
            :disabled="!transferClassForm.presentGrade"
            clearable
            placeholder="请选择专业"
          >
            <!-- <el-option label="全部" value=""></el-option> -->
            <el-option v-for="item in majorList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="异动日期" prop="modifiedDate">
          <el-date-picker
            v-model="transferClassForm.modifiedDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择日期"
          ></el-date-picker>
        </el-form-item>
        <div class="table-box flex-wrapper">
          <div class="flex-item">
            <!-- {{transferClassForm.formerClassId}} -->
            <el-form-item
              label="原行政班"
              class="administrative-class-select-item"
              prop="formerClassId"
            >
              <el-select
                :disabled="!transferClassForm.presentGrade||!transferClassForm.presentMajorId"
                v-model="transferClassForm.formerClassId"
                clearable
                placeholder="请选择行政班"
                @change="getStudentsByAdminisClassId($event, 'formerClassArr', true)"
              >
                <el-option
                  v-for="item in classTypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <span class="student-count">人数：{{formerClassNum}}</span>
            <div class="cm-table">
              <el-table
                :data="formerClassArr"
                border
                height="220"
                size="mini"
                style="width: 100%"
                header-row-class-name="cm-dark"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="55" label="全选"></el-table-column>
                <el-table-column prop="stuNum" label="学号"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
              </el-table>
            </div>
            <el-form-item>
              <el-checkbox
                v-model="transferClassForm.isStop"
                :disabled="isStop"
                label="转班后原班级停用"
                :true-lable="1"
                :false-lable="0"
              ></el-checkbox>
            </el-form-item>
          </div>
          <div class="flex-item">
            <el-button type="primary" size="mini" @click="addToRight" style="margin:95px 0 0 0;">
              增加
              <i class="el-icon-d-arrow-right"></i>
            </el-button>
            <p>
              <el-button size="mini" @click="addToLeft" style="margin:15px 0 0 0;">
                <i class="el-icon-d-arrow-left"></i>删除
              </el-button>
            </p>
          </div>
          <div class="flex-item">
            <el-form-item
              class="administrative-class-select-item"
              label="新行政班"
              prop="presentClassId"
            >
              <el-select
                :disabled="!transferClassForm.presentGrade||!transferClassForm.presentMajorId"
                v-model="transferClassForm.presentClassId"
                clearable
                placeholder="请选择行政班"
                @change="getStudentsByAdminisClassId($event, 'newClassArr', true)"
              >
                <el-option
                  v-for="item in classTypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <span class="student-count">人数：{{newClassNum}}</span>
            <div class="cm-table">
              <el-table
                :data="newClassArr"
                border
                height="220"
                size="mini"
                style="width: 100%"
                header-row-class-name="cm-dark"
                @selection-change="handleSelectionChangeNew"
              >
                <!-- <el-table-column type="selection" :selectable="selectable" width="55" label="全选"></el-table-column> -->
                <el-table-column type="selection" width="55" label="全选"></el-table-column>
                <el-table-column prop="stuNum" label="学号"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div class="remark-box">
          <el-form-item label="备注">
            <el-input type="textarea" v-model="transferClassForm.remarks"></el-input>
          </el-form-item>
        </div>
        <p class="textStyleBox textStyle">支持上传照片格式为JPG ，且不超过2M</p>
        <el-form-item label="上传附件">
          <el-upload
            class="upload-demo"
            action="/opration/data/admin//uploadFile"
            :headers="headers"
            :file-list="fileList2"
            :on-change="handleChange"
            :before-upload="beforeAvatarUpload"
            :on-success="handleTraClassUploadSuccess"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCloseClass">取 消</el-button>
        <el-button type="primary" @click="transferSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新批量转专业 -->
    <el-dialog
      title="院内转专业"
      :visible.sync="dialog.majorVisible"
      :modal-append-to-body="false"
      top="3vh"
      width="900px"
      :close-on-click-modal="false"
      custom-class="school-roll-change-dialog"
      @close="dialogCloseMajor"
      >
      <el-form
        :model="transferMajorForm"
        :inline="true"
        :rules="transferMajorFormRules"
        ref="transferMajorForm"
        label-width="80px"
        >
        <el-form-item label="年级" prop="formerGrade">
          <!-- <el-input v-model="transferMajorForm.presentGrade"></el-input> -->
          <!-- {{transferMajorForm.presentGrade}} -->
          <intelligent-year-picker
            v-model="transferMajorForm.formerGrade"
            type="year"
            value-format="yyyy"
            placeholder="请选择年级"
            @change="clearFormerList"
          ></intelligent-year-picker>
        </el-form-item>
        <el-form-item label="转入年级" prop="presentGrade" style="margin-left: 196px;">
          <!-- <el-input v-model="transferMajorForm.presentGrade"></el-input> -->
          <!-- {{transferMajorForm.presentGrade}} -->
          <intelligent-year-picker
            v-model="transferMajorForm.presentGrade"
            disabled
            type="year"
            value-format="yyyy"
            placeholder="请选择年级"
            @change="clearPresentList"
          ></intelligent-year-picker>
        </el-form-item>
        <el-form-item label="专业" prop="formerMajorId">
          <!-- {{transferMajorForm.presentMajorId}} -->
          <!-- <el-input v-model="transferMajorForm.presentMajorId"></el-input> -->
          <el-select
            v-model="transferMajorForm.formerMajorId"
            @change="getFormerWork"
            :disabled="!transferMajorForm.formerGrade"
            clearable
            placeholder="请选择专业"
          >
            <!-- <el-option label="全部" value=""></el-option> -->
            <el-option v-for="item in majorList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="转入专业" prop="presentMajorId" style="margin-left: 196px;">
          <!-- {{transferMajorForm.presentMajorId}} -->
          <!-- <el-input v-model="transferMajorForm.presentMajorId"></el-input> -->
          <el-select
            v-model="transferMajorForm.presentMajorId"
            @change="getPresentWork"
            :disabled="!transferMajorForm.presentGrade"
            clearable
            placeholder="请选择专业"
          >
            <!-- <el-option label="全部" value=""></el-option> -->
            <el-option v-for="item in majorList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="异动日期" prop="modifiedDate">
          <el-date-picker
            v-model="transferMajorForm.modifiedDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择日期"
          ></el-date-picker>
        </el-form-item>
        <div class="table-box flex-wrapper">
          <div class="flex-item">
            <!-- {{transferMajorForm.formerClassId}} -->
            <el-form-item
              label="原行政班"
              class="administrative-class-select-item"
              prop="formerClassId"
            >
              <el-select
                :disabled="!transferMajorForm.formerGrade||!transferMajorForm.formerMajorId"
                v-model="transferMajorForm.formerClassId"
                clearable
                placeholder="请选择行政班"
                @change="getStudentsByAdminisClassId($event, 'formerClassArr', true)"
              >
                <el-option
                  v-for="item in formerClassList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <span class="student-count">人数：{{formerClassNum}}</span>
            <div class="cm-table">
              <el-table
                :data="formerClassArr"
                border
                height="220"
                size="mini"
                style="width: 100%"
                header-row-class-name="cm-dark"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="55" label="全选"></el-table-column>
                <el-table-column prop="stuNum" label="学号"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
              </el-table>
            </div>
            <el-form-item>
              <el-checkbox
                v-model="transferMajorForm.isStop"
                :disabled="isStop"
                label="转班后原班级停用"
                :true-lable="1"
                :false-lable="0"
              ></el-checkbox>
            </el-form-item>
          </div>
          <div class="flex-item">
            <el-button type="primary" size="mini" @click="addToRight2" style="margin:95px 0 0 0;">
              增加
              <i class="el-icon-d-arrow-right"></i>
            </el-button>
            <p>
              <el-button size="mini" @click="addToLeft" style="margin:15px 0 0 0;">
                <i class="el-icon-d-arrow-left"></i>删除
              </el-button>
            </p>
          </div>
          <div class="flex-item">
            <el-form-item
              class="administrative-class-select-item"
              label="新行政班"
              prop="presentClassId"
            >
              <el-select
                :disabled="!transferMajorForm.presentGrade||!transferMajorForm.presentMajorId"
                v-model="transferMajorForm.presentClassId"
                clearable
                placeholder="请选择行政班"
                @change="getStudentsByAdminisClassId($event, 'newClassArr', true)"
              >
                <el-option
                  v-for="item in administrativeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <span class="student-count">人数：{{newClassNum}}</span>
            <div class="cm-table">
              <el-table
                :data="newClassArr"
                border
                height="220"
                size="mini"
                style="width: 100%"
                header-row-class-name="cm-dark"
                @selection-change="handleSelectionChangeNew"
              >
                <!-- <el-table-column type="selection" :selectable="selectable" width="55" label="全选"></el-table-column> -->
                <el-table-column type="selection" width="55" label="全选"></el-table-column>
                <el-table-column prop="stuNum" label="学号"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div class="remark-box">
          <el-form-item label="备注">
            <el-input type="textarea" v-model="transferMajorForm.remarks"></el-input>
          </el-form-item>
        </div>
        <p class="textStyleBox textStyle">支持上传照片格式为JPG ，且不超过2M</p>
        <el-form-item label="上传附件">
          <el-upload
            class="upload-demo"
            action="/opration/data/admin//uploadFile"
            :headers="headers"
            :file-list="fileList3"
            :on-change="handleChange"
            :before-upload="beforeAvatarUpload"
            :on-success="handleMajorUploadSuccess"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCloseMajor">取 消</el-button>
        <el-button type="primary" @click="transferMajorSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 课程认定 -->
    <el-dialog
      top="10vh"
      :title="'课程认定-'+affirmVisibletitle"
      :visible.sync="dialog.affirmVisible"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      @close="resetAffrimForm"
      custom-class="school-roll-change-dialog"
      width=90%
      >
      <!-- @close="dialogAffirmClose"> -->

      <!-- <el-form
        class="teacher-priority-form"
        :inline="true"
        :rules="affirmFormRules"
        ref="affirmForm"
        :model="affirmForm"
        :label-position="labelPosition"
    
      >-->
      <el-form
        :label-position="labelPosition"
        :rules="affirmFormRules"
        label-width="100px"
        ref="affirmForm"
        :model="affirmForm"
        >
        <el-row type="flex" justify="space-around">
          <el-col :span="12">
            <el-form-item class="input-item" label="学号" prop="stuNum">
              <el-input
                size="mini"
                v-model="affirmForm.stuNum"
                placeholder="请输入学号"
                disabled
                @keyup.native="keyupHandle"
              >
                <i class="el-icon-loading el-input__icon" v-if="queryLoading" slot="suffix"></i>
              </el-input>
            </el-form-item>
            <el-form-item label="转入专业" prop="presentMajorId">
              <el-select
                disabled
                size="mini"
                v-model="affirmForm.presentMajorId"
                clearable
                placeholder="请选择专业"
                @change="getAffirmCourseList"
              >
                <el-option
                  v-for="item in majorList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="input-item" label="姓名">
              <el-input size="mini" v-model="affirmForm.stuName" :disabled="true" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="转入年级" prop="presentGrade">
              <el-input size="mini" v-model="affirmForm.presentGrade" :disabled="true" placeholder="请选择年级"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="affirm-wrapper">
        <div class="affirm-header clear">
          <el-form :inline="true" size="mini" :model="formInline" class="right">
            <!-- <el-form-item label="学期">
              <el-select filterable v-model="formInline.term" placeholder="全部">
                <el-option label="全部" :value='0'></el-option>
                <el-option

                  v-for="item in affirmtermList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item> -->
          </el-form>
          <span>成绩认定</span>
        <!--  <el-checkbox v-if="afftype==3" style="margin-left: 40px" v-model="courseChecked">仅认定课程成绩</el-checkbox>  -->
        </div>
        <div class="affirm-list cm-table">
          <el-table
            :data="showAffirmCourseList"
            border
            size="mini"
            style="width: 100%"
            header-row-class-name="cm-dark"
            v-if="afftype==3"
          >
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column label="学期" prop="affirmTermNumber" width="70">
              <template slot-scope="scope">
                <span v-if="scope.row.affirm_term_number != null">{{`第${scope.row.affirm_term_number}学期`}}</span>
                <span v-else>{{''}}</span>
                <!-- <el-select v-else size="mini" @change="changeTerm(affirmFormBack.list[scope.$index].affirm_term_number,scope.$index)" v-model="affirmFormBack.list[scope.$index].affirm_term_number" clearable placeholder="请选择" style="width: 100%;">
                  <el-option
                    v-for="(item,key) in affirmtermList"
                    :key="key"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select> -->
              </template>
            </el-table-column>
            <el-table-column label="认定课程" prop="id" width="220" >
              <template slot-scope="scope">
                <span>{{scope.row.affirm_course_name}}</span>
                <!-- <el-select v-else size="mini" @change="changeCourse(scope.$index,affirmFormBack.list[scope.$index].affirm_course_id,affirmFormBack.list[scope.$index].affirm_term_number)" :disabled="affirmFormBack.list[scope.$index].affirm_term_number == null" filterable v-model="affirmFormBack.list[scope.$index].affirm_course_id" clearable placeholder="请先选择学期再选择课程" style="width: 100%;">
                 
                  <el-option
                    v-for="(item,key) in scope.row.affrimCourseLists"
                    :key="key"
                    :label="item.course_name"
                    :value="item.course"
                  ></el-option>
                </el-select> -->
              </template>
            </el-table-column>


            <!-- <el-table-column label="原阶段成绩" prop="former_stage_grade" width="85">
            </el-table-column> -->

            <el-table-column label="阶段成绩" prop="affirm_stage_grade" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.is_public == 1 || scope.row.can_modify == 0">
                  {{ scope.row.affirm_stage_grade }}
                </span>
                <el-input v-else :ref="`ipt1${scope.$index}`" v-model="affirmFormBack.list[scope.$index].affirm_stage_grade"  oninput ="value=value.replace(/[^0-9.]/g,'')" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="阶段补考成绩" prop="affirm_stage_bkgrade" width="94">
              <template slot-scope="scope">
                <span v-if="scope.row.is_public == 1 || scope.row.can_modify == 0">
                  {{ scope.row.affirm_stage_bkgrade }}
                </span>
                <el-input v-else :ref="`ipt2${scope.$index}`" v-model="affirmFormBack.list[scope.$index].affirm_stage_bkgrade" oninput ="value=value.replace(/[^0-9.]/g,'')" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="补考次数" prop="affirm_bktimes" width="70">
              <template slot-scope="scope">
                <span v-if="scope.row.is_public == 1 || scope.row.can_modify == 0">
                  {{ scope.row.affirm_bktimes }}
                </span>
                <el-input v-else :ref="`ipt3${scope.$index}`" v-model="affirmFormBack.list[scope.$index].affirm_bktimes" oninput ="value=value.replace(/[^0-9.]/g,'')" size="mini"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="课程成绩" prop="affirm_course_grade" width="90">
              <template slot-scope="scope">
                <el-input :ref="`ipt4${scope.$index}`" v-if="scope.row.is_course_grade == 1 && scope.row.is_public == 0 && scope.row.can_modify == 1" oninput ="value=value.replace(/[^0-9.]/g,'')" v-model="affirmFormBack.list[scope.$index].affirm_course_grade" size="mini"></el-input>
                <span v-else>
                  {{ scope.row.affirm_course_grade }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="原专业课程" prop="former_course_name" width="220">
              <template slot-scope="scope">
                
                <span v-if="scope.row.is_public == 1 || scope.row.can_modify == 0">{{ scope.row.former_course_name }}</span>
                <!-- <el-select v-else size="mini"  filterable value-key="course_name" v-model="affirmFormBack.list[scope.$index].former_course_name1" clearable placeholder="" style="width: 100%;">
                  <el-option
                    v-for="(item,key) in scope.row.affrimCourseLists"
                    :key="key"
                    :label="`${item.course_name}(第${item.stage}学期)`"
                    :value="item"
                  ></el-option>
                </el-select> -->
                <el-input v-else size="mini" v-model="affirmFormBack.list[scope.$index].former_course_name"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="原课程成绩" prop="former_course_grade" width="85">
              <template slot-scope="scope">
                <el-input :ref="`ipt6${scope.$index}`" v-if="scope.row.is_public == 0 && scope.row.can_modify == 1" oninput ="value=value.replace(/[^0-9.]/g,'')" v-model="affirmFormBack.list[scope.$index].former_course_grade" size="mini"></el-input>
                <span v-else>
                  {{ scope.row.former_course_grade }}
                </span>
              </template>
            </el-table-column>
           
            <el-table-column label="备注" prop="mark" min-width="200">
              <template slot-scope="scope">
                <el-input v-if="scope.row.is_public == 0 && scope.row.can_modify == 1" :ref="`ipt5${scope.$index}`" v-model="affirmFormBack.list[scope.$index].remark" size="mini"></el-input>
                <span v-else>
                  {{ scope.row.remark }}
                </span>
              </template>
            </el-table-column>
          </el-table>
          <el-table
            :data="showAffirmCourseList"
            border
            size="mini"
            style="width: 100%"
            header-row-class-name="cm-dark"
            v-if="(afftype==10 || afftype==6 || afftype==9) && showAffirmCourseList.length > 0 "
          >
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column label="学期" prop="former_term_name" width="70"></el-table-column>

            <el-table-column label="原课程" prop="former_course_name" width="180">
              <template slot-scope="scope">{{ scope.row.former_course_name }}</template>
            </el-table-column>

            <el-table-column label="原阶段成绩" prop="former_stage_grade" width="110">
            </el-table-column>
            <el-table-column label="原课程成绩" prop="former_course_grade" width="85">
            </el-table-column>

            <el-table-column label="认定学期" prop="affirmTermNumber" width="120">
              <template slot-scope="scope">
                <span v-if="scope.row.is_public == 1 || scope.row.can_modify == 0">{{`第${scope.row.affirm_term_number}学期`}}</span>
                <el-select v-else size="mini" @change="changeTerm(affirmFormBack.list[scope.$index].affirm_term_number,scope.$index)" v-model="affirmFormBack.list[scope.$index].affirm_term_number" clearable placeholder="请选择" style="width: 100%;">
                  <el-option
                    v-for="(item,key) in affirmtermList"
                    :key="key"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            
            <el-table-column label="认定课程" prop="id" width="220">
              <template slot-scope="scope">
                <span v-if="scope.row.is_public == 1 || scope.row.can_modify == 0">{{scope.row.affirm_course_name}}</span>
                <el-select v-else size="mini" @change="changeCourse(scope.$index,affirmFormBack.list[scope.$index].affirm_course_id,affirmFormBack.list[scope.$index].affirm_term_number)" :disabled="affirmFormBack.list[scope.$index].affirm_term_number == null" filterable v-model="affirmFormBack.list[scope.$index].affirm_course_id" clearable placeholder="请先选择学期再选择课程" style="width: 100%;">
                 
                  <el-option
                    v-for="(item,key) in scope.row.affrimCourseLists"
                    :key="key"
                    :label="item.course_name"
                    :value="item.course"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="阶段成绩" prop="affirm_stage_grade" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.is_public == 1 || scope.row.can_modify == 0">
                  {{ scope.row.affirm_stage_grade }}
                </span>
                <el-input v-else :ref="`ipt1${scope.$index}`" v-model="affirmFormBack.list[scope.$index].affirm_stage_grade"  oninput ="value=value.replace(/[^0-9.]/g,'')" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="阶段补考成绩" prop="affirm_stage_bkgrade" width="94">
              <template slot-scope="scope">
                <span v-if="scope.row.is_public == 1 || scope.row.can_modify == 0">
                  {{ scope.row.affirm_stage_bkgrade }}
                </span>
                <el-input v-else :ref="`ipt2${scope.$index}`" v-model="affirmFormBack.list[scope.$index].affirm_stage_bkgrade" oninput ="value=value.replace(/[^0-9.]/g,'')" size="mini"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="补考次数" prop="affirm_bktimes" width="70">
              <template slot-scope="scope">
                <span v-if="scope.row.is_public == 1 || scope.row.can_modify == 0">
                  {{ scope.row.affirm_bktimes }}
                </span>
                <el-input v-else :ref="`ipt3${scope.$index}`" v-model="affirmFormBack.list[scope.$index].affirm_bktimes" oninput ="value=value.replace(/[^0-9.]/g,'')" size="mini"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="课程成绩" prop="affirm_course_grade" width="90">
              <template slot-scope="scope">
                <el-input :ref="`ipt4${scope.$index}`" v-if="scope.row.is_course_grade == 1 && scope.row.is_public == 0 && scope.row.can_modify == 1" oninput ="value=value.replace(/[^0-9.]/g,'')" v-model="affirmFormBack.list[scope.$index].affirm_course_grade" size="mini"></el-input>
                <el-input :ref="`ipt9${scope.$index}`" v-else disabled oninput ="value=value.replace(/[^0-9.]/g,'')" v-model="affirmFormBack.list[scope.$index].affirm_course_grade" size="mini"></el-input>
                <!-- <span v-else>
                  {{ scope.row.affirm_course_grade }}
                </span> -->
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="mark" min-width="200">
              <template slot-scope="scope">
                <el-input v-if="scope.row.is_public == 0 && scope.row.can_modify == 1" :ref="`ipt5${scope.$index}`" v-model="affirmFormBack.list[scope.$index].remark" size="mini"></el-input>
                <span v-else>
                  {{ scope.row.remark }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 44444 -->
      <span slot="footer" class="dialog-footer" v-if="showAffirmCourseList.length > 0 && showAffirmCourseList[0].is_public == 1">
          <el-button size="medium" v-if="cancelFlag == 0" type="primary" @click="cancelAffirm('button1')">撤回修改</el-button>
          <el-button size="medium" @click="dialogAffirmClose('button1')">关 闭</el-button>
      </span>
      <span slot="footer" class="dialog-footer" v-else>
        <el-button size="medium" @click="dialogAffirmClose('button1')">取 消</el-button>
        <el-button size="medium" type="primary" @click="affirmSubmit">暂 存</el-button>
        <el-button size="medium" type="primary" @click="handlePublishCourse">提 交</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="testdialog"
      width="500px"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      >
      <p>
        <i class="el-icon-info" style="color:#e6a23c;"></i> 当前操作将会直接删除该认定课程，确定继续？
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="testdialog = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="handleDeleteAffirmCourse">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="提 示"
      :close-on-click-modal="false"
      :visible.sync="dialog.tipAffirmVisible"
      width="500px"
      :modal-append-to-body="false"
      >
      <p>
        <i class="el-icon-info" style="color:#e6a23c;"></i> 发布后成绩不能再修改且记录到成绩记载表中, 是否继续?
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialog.tipAffirmVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="handlePublic">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title
      :close-on-click-modal="false"
      :visible.sync="previewPic"
      :modal-append-to-body="false"
      :show-close="true"
      width="90%"
      >
      <img :src="previewUrl" alt style="width:100%; max-width: 100%;">
    </el-dialog>

     <el-dialog title="导入学籍异动" @close="closeUpload" :visible.sync="importstudentDialog" width="450px" append-to-body :close-on-click-modal="false" class="import-teachers-list">
      <el-upload class="upload-demo" ref="upload" action :file-list="fileList" :on-success="onSuccess" :on-change="fileSelected" :before-upload="onBefore" :auto-upload="false">
        <el-button slot="trigger" size="small">选取文件</el-button>
      </el-upload>
      <el-button style="margin-left: 10px;" size="small" type="primary" :disabled="allow" @click="submitUpload()">导入</el-button>
    </el-dialog>

    <el-dialog title="提示" width="35%" :visible="conflictVisible" @close="closeConflict" append-to-body :close-on-click-modal="false">
      <el-table :data="conflictData" size="mini" border height="500">
        <el-table-column label="分类" prop="type" width="90"></el-table-column>
        <el-table-column label="描述" prop="conflict"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="conflictVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="conflictVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import util from "@/util";
export default {
  name: "school_rool_change",
  data() {
    return {
      cancelFlag: 1,
			publicPath: process.env.BASE_URL,
      afftype: "",
      affirmFormlist: [],
      courseChecked: false,
      options1: [],
      affirmtermList: [
        { name: "第一学期", id: 1 },
        { name: "第二学期", id: 2 },
        { name: "第三学期", id: 3 },
        { name: "第四学期", id: 4 },
        { name: "第五学期", id: 5 },
        { name: "第六学期", id: 6 },
        { name: "第七学期", id: 7 },
        { name: "第八学期", id: 8 },
        { name: "第九学期", id: 9 },
        { name: "第十学期", id: 10 }
      ],
      labelPosition: "right",
      affirmVisibletitle: "转出",
      editFalse: true,
      isFu: false, //是否为复学 true为是
      breadcrumb: [{ label: "学籍管理" }, { label: "学籍异动" }],
      fold: {
        state: false,
        text: "展开",
        showBtn: false
      },
      schoolinglength: [],
      majorList: [],
      termList: [],
      administrativeClassList: [],
      administrativeList: [],
      formInline: {
        pageNo: 1,
        pageSize: 20,
        stuName: "",
        stuNum: "",
        type: "",
        term: ""
      },
      formerCourseId: null,
      pageNo: 1,
      pageSize: 20,
      totalCount: 0,
      typeList: [],
      tableData: [],
      tableLoading: false,
      dialog: {
        status: "add",
        title: "",
        visible: false,
        classVisible: false,
        affirmVisible: false,
        majorVisible: false,
        tipAffirmVisible: false
      },
      outOfSchoolList: [],
      changeForm: {
        id: "",
        type: 0, // 异动类型
        creater: '', //创建人
        stuNum: "",
        stuName: "",
        sex: "",
        mobile: "",
        enrollmentDate: "",
        formerGrade: "",
        formerMajorId: "",
        formerClassId: "",
        presentMajorId: "",
        presentGrade: "",
        presentClassId: "", // 转入班级id
        modifiedDate: "", // modifiedDate
        remarks: "", // 备注
        fileUrl: "", // 附件url
        certificateIssunce: "", //退学 ：肄业证书是否发放 0 发放 1 不发放
        ext1: "",
        ext2: "",
        ext3: "",
        ext4: "",
        ext5: "",
        ext6: "", //修业年限
        reason: ""
      },
      rules: {
        stuNum: [
          {
            required: true,
            message: "请输入学号",
            trigger: "blur"
          }
        ],
        presentMajorId: [
          {
            required: false,
            message: "请选择专业",
            trigger: "blur"
          }
        ],
        presentGrade: [
          {
            required: false,
            message: "请选择年级",
            trigger: "blur"
          }
        ],
        presentClassId: [
          {
            required: false,
            message: "请选择行政班",
            trigger: "change"
          }
        ],
        modifiedDate: [
          {
            required: true,
            message: "请选择异动日期",
            trigger: "blur"
          }
        ],
        // reason:[
        //     {required: false, message: '请选择休学类型', trigger: 'change'}
        // ],
        ext5: [
          {
            required: false,
            message: "请选择休学周期",
            trigger: "change"
          }
        ],
        reason: [
          {
            required: false,
            message: "请选择",
            trigger: "change"
          }
        ]
      },
      formerClassList: [],
      classTypeList: [],
      fileList1: [],
      fileList2: [],
      fileList3: [],
      transferType: "",
      transferClassForm: {
        creater: '',
        presentMajorId: "",
        presentGrade: "", //年级
        presentClassId: "", //现班级id
        modifiedDate: "",
        fileUrl: "",
        formerClassId: "", // 原行政班id
        remarks: "",
        stuNums: [], //转班学生学号数组
        type: "",
        isStop: "" //转班后是否原班级是否停用 1 停用
      },
      transferMajorForm: {
        creater: '',
        presentMajorId: "",
        presentGrade: "", //年级
        presentClassId: "", //现班级id
        modifiedDate: "",
        fileUrl: "",
        formerClassId: "", // 原行政班id
        formerGrade: "",
        formerMajorId: "",
        remarks: "",
        stuNums: [], //转班学生学号数组
        type: "",
        isStop: "", //转班后是否原班级是否停用 1 停用
        
      },
      transferFormRules: {
        presentMajorId: [
          {
            required: true,
            message: "请选行专业",
            trigger: "change"
          }
        ],
        presentGrade: [
          {
            required: true,
            message: "请选行年级",
            trigger: "change"
          }
        ],
        presentClassId: [
          {
            required: true,
            message: "请选新行政班",
            trigger: "change"
          }
        ],
        modifiedDate: [
          {
            required: true,
            message: "请选择异动日期",
            trigger: "blur"
          }
        ],
        formerClassId: [
          {
            required: true,
            message: "请选原行政班",
            trigger: "change"
          }
        ]
      },
      transferMajorFormRules: {
        presentMajorId: [
          {
            required: true,
            message: "请选行专业",
            trigger: "change"
          }
        ],
        formerMajorId: [
          {
            required: true,
            message: "请选行专业",
            trigger: "change"
          }
        ],
        presentGrade: [
          {
            required: true,
            message: "请选行年级",
            trigger: "change"
          }
        ],
        formerGrade: [
          {
            required: true,
            message: "请选行年级",
            trigger: "change"
          }
        ],
        presentClassId: [
          {
            required: true,
            message: "请选新行政班",
            trigger: "change"
          }
        ],
        formerClassId: [
          {
            required: true,
            message: "请选新行政班",
            trigger: "change"
          }
        ],
        modifiedDate: [
          {
            required: true,
            message: "请选择异动日期",
            trigger: "blur"
          }
        ],
        formerClassId: [
          {
            required: true,
            message: "请选原行政班",
            trigger: "change"
          }
        ]
      },
      keyupHandle: () => {},
      fuKey: () => {},
      queryLoading: false,
      tempTransferArr: [],
      tempToLeftArr: [],
      formerClassArr: [],
      newClassArr: [],
      formerClassNum: 0,
      newClassNum: 0,
      affrimCourseLists: [],
      affrimCourseListsBack: [],
      isStop: true,
      affirmModal: false, // 控制课程认定（与删除认定课程冲突）遮罩层
      affirmForm: {
        list: [],
        modifiedId: "",
        stuNum: "",
        stuName: "",
        presentGrade: "",
        presentMajorId: "",
        submitType: ""
      },
      affirmFormRules: {
        presentMajorId: [
          {
            required: true,
            message: "请选择转入年级",
            trigger: "change"
          }
        ],
        presentGrade: [
          {
            required: true,
            message: "请选择转入专业",
            trigger: "change"
          }
        ]
      },
      affirmTableList: [
        {
          label: "学期",
          prop: "termName",
          formType: "select",
          selectIdProp: "semesterId",
          selectListProp: []
        },
        {
          label: "认定课程",
          prop: "affirmCourseName",
          formType: "select",
          selectIdProp: "affirmCourseId",
          selectListProp: []
        },
        {
          label: "认定成绩",
          prop: "affirmCourseScore",
          formType: "input",
          width: "90px"
        },
        {
          label: "认定学期",
          prop: "affirmsemesterName",
          formType: "select",
          selectIdProp: "affirmsemesterId",
          selectListProp: []
        },
        {
          label: "原专业课程",
          prop: "formerCourseName",
          formType: "input"
        },
        {
          label: "原课程成绩",
          prop: "formerCourseScore",
          formType: "input",
          width: "90px"
        }
      ], // 新增认定课程列表表
      ctrl: {
        button1: false
      },
      editArr: {},
      testdialog: false,
      deleteAffirmCoureRow: {},
      deleteAffirmCoureIndex: "",
      selectSemesterId: "", // 课程认定 --> 成绩认定 --> 学期下拉选择id
      previewPic: false,
      previewUrl: "",
      allPublished: false,
      modifiedId: "",
      affirmFormBack: {},
      hadAffirmList: [],
      tableChangeFlag: 1,
      loginName: '',
      loginId: '',
      importstudentDialog: false,
      fileList: [],
      allow: false,
      conflictVisible: false,
      gradeLimitList: [],
      conflictData: [],
      userId: '',
      pickerOptions: {
        disabledDate(time) {
          // console.log(time.getFullYear())
          return time.getFullYear() > this.changeForm.formerGrade;
        },
      }
    };
  },
  created() {
    // this.getTermData();
    this.$authorize.me().then(res => {
      this.loginName = res.user.name
      this.loginId = res.attributes.login_info.id
      this.changeForm.creater = this.loginName
      this.transferClassForm.creater = this.loginName
      this.transferMajorForm.creater = this.loginName
    });
    this.getaffirmTermData();
    // this.getCourseList();
    this.getUserInfo()
    this.getMajorList();
    this.getModefiedType();
    this.handerQuery();
    this.getAdministrative();
    this.getschoolinglength(); //获取修业年限的列表
    this.keyupHandle = util.fnThrottle(this.getStuInfo, 700);
    this.fuKey = util.fnThrottle(this.getfuxueData, 700);
  },
  computed: {
    headers() {
      return {
        Authorization: util.getStorage("token")
      };
    },
    // filePath() {
    //   let str = '/operation/data/admin/modified/courseaffirm/import/' + this.loginId
    //   return str
    // },
    showAffirmCourseList() {
    
      if (this.formInline.term && this.afftype != 3) {
        var list = this.affirmForm.list.filter(
          item => item.former_term_number === this.formInline.term
        );
        return list;
      }
      if (this.formInline.term && this.afftype == 3) {
        var list = this.affirmForm.list.filter(
          item => item.affirm_term_number === this.formInline.term
        );
        return list;
      }
      if (this.courseChecked) {
        var list = this.affirmForm.list.filter(
          item => item.is_course_grade == 1
        );
        return list;
      }  
      return this.affirmForm.list;
    }
  },
  watch: {
     courseChecked(val){
      if(val){

      } 
    },
    formerClassNum() {
      if (this.formerClassNum == 0) {
        this.isStop = false;
      } else {
        this.isStop = true;
      }
    },
    'changeForm.formerGrade'(val) {
      let temp = +val
      this.gradeLimitList = []
      for (let i = temp; i < temp+20; i++) {
        this.gradeLimitList.push(i)
      }
    },
    'changeForm.presentMajorId'(val){
      this.$nextTick(()=>{
        this.getAdministrativeClassList(val,2);
      })
    }
  },
  methods: {
    getUserInfo() {
      this.$http.get('_auths:authorize/me').then(me_resp => {
          let r = me_resp.result.attributes
          if(r.login_info){
              let b = r.login_info
              this.userId = b.id
          }
      })
    },
    // handleAvatarSuccess(res, file) {
    //   let type = "success";
    //   let message = "导入成功！";
    //   if (res.code == 0) {
    //     self.$message({
    //       message: "导入成功！",
    //       type: "success"
    //     });
    //     this.handerQuery();
    //   } else {
    //     // self.$message.error(data.msg);
    //     this.conflictData = res.data
    //     this.conflictVisible = true
    //   }
    // },
    closeUpload() {
      this.fileList = []
    },
    closeConflict() {
      this.conflictData = []
      this.conflictVisible = false
    },
    importStuScore() {
      this.importstudentDialog = true;
    },
    fileSelected(file, fileList) {
      this.fileList = fileList.slice(-1);
    },
    onSuccess(res, file, fileList) {
      let type = "success";
      let message = "导入成功！";
      if (res.code != 0) {
        type = "error";
        message = res.msg;
      }
      this.$message({
        type: type,
        message: message
      });
    },
    // 休学 退学  复学  降学   下拉
    outOfSchool(type) {
      this.outOfSchoolList = []
      this.$http.post('_op:/dicts/getDictsList', {type}).then(res => {
        if(res.code ==0) {
          this.outOfSchoolList = res.data
          this.outOfSchoolList.forEach(item => {
            item.id = item.id.toString()
          })
        }
      })
    },
    onBefore(file) {
      let extension = file.name.split(".")[1] === "xls";
      let size = file.size / 1204 / 1204 < 20;
      if (!extension) {
        this.$message.warning("上传的文件格式是 xls！");
      }
      if (!size) {
        this.$message.warning("上传的文件大小不能超过20M！");
      }
      return extension && size;
    },
    submitUpload() {
      let self = this;
      self.allow = true;

      self.startImport();
      setTimeout(function() {
        self.allow = false;
      }, 1000);
    },
    startImport() {
      let self = this;
      if (self.fileList.length < 1) {
        self.$message.warning("请选择导入文件！");
        return;
      } else {
        let formData = new FormData();

        formData.append("file", self.fileList[0].raw);
        formData.append("teacherId", self.loginId);
        // formData.append("scoreType", self.scoreType);
        // formData.append("termId", self.formDetails.semester);

        let config = {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        };

        this.$http
          .post(`_op:/modified/courseaffirm/import`, formData, config)
          .then(data => {
            if (data.code == 0) {
              self.$message({
                message: "导入成功！",
                type: "success"
              });
              self.handerQuery();
              self.importstudentDialog = false;
            } else {
              this.conflictData = JSON.parse(data.msg)
              this.conflictVisible = true
            }
          })
          .catch(error => {
            self.$message.error("导入失败!");
          });
      }
    },
    showGradeIde() {
      this.$router.push({
        name: 'grade_ide',
        params:{
          tableData: this.tableData
        }
      })
    },
    exportExc(){
				let params ={
          pageNo: 1,
          pageSize: 10000,
          stuName: this.formInline.stuName,
          stuNum: this.formInline.stuNum,
          type: this.formInline.type,
      }
				this.$http2.post('_op:/modified/export/list',params).then(data=>{
						let url = window.URL.createObjectURL(new Blob([data]));
						let y = this.$refs.exportExcel;
						y.href = url;
						y.setAttribute("download", "学籍异动.xls");
						y.click();
						window.URL.revokeObjectURL(url);
				})
			},
    resetAffrimForm(){
      this.affirmForm = {
        list: [],
        modifiedId: "",
        stuNum: "",
        stuName: "",
        presentGrade: "",
        presentMajorId: "",
        isPublish: "",
        submitType: ""
      }
      this.affirmFormBack = {}
      this.courseChecked = false  
    },
    changeTerm(id,idx){
      this.affirmFormBack.list[idx].affirm_course_id = null
      this.affirmForm.list[idx].affrimCourseLists = this.affrimCourseListsBack.filter( item => {
        return item.stage == id || item.stage == 0
      })
      this.changeCourse(idx)
    },
    changeCourse(idx,val,num){
      if(this.$refs['ipt1'+idx]){
        this.affirmFormBack.list[idx].affirm__grade = null
      }
      if(this.$refs['ipt2'+idx]){
        this.affirmFormBack.list[idx].affirm_stage_bkgrade = null
      }
      if(this.$refs['ipt3'+idx]){
        this.affirmFormBack.list[idx].affirm_bktimes = null
      }
      if(this.$refs['ipt4'+idx]){
        this.affirmFormBack.list[idx].affirm_course_grade = null
      }
      if(this.$refs['ipt5'+idx]){
        this.affirmFormBack.list[idx].remark = null
      }
      this.affrimCourseLists.map( item => {
        if(item.course == val && item.stage == num){
          this.affirmFormBack.list[idx].affirm_course_name = item.course_name
          this.affirmFormBack.list[idx].affirm_term_id = item.term_id
          if(item.is_course_grade == 1 && this.$refs['ipt9'+idx] && this.affirmFormBack.list[idx].is_public == 0 && this.affirmFormBack.list[idx].can_modify == 1) {
            this.$nextTick( () => {
              this.$refs['ipt9'+idx].disabled  = false
            })
          }else {
            this.$nextTick( () => {
              this.$refs['ipt9'+idx].disabled  = true
            })
          }
        }
      })
    },
    // changeCourse1(val){
      // console.log(val)
      // console.log(this.formerCourseId)
      // this.affrimCourseLists.map( item => {
      //   if(item.course == val){
      //     this.affirmFormBack.list[idx].former_course_name = item.course_name
      //     this.affirmFormBack.list[idx].former_term_number = item.stage
      //   }
      // })
    // },
    getTermData(query) {
      if (!query) {
        query = "学期";
      }
      this.$http.get("_op:/terms/" + query).then(data => {
        if (data.code == 0) {
          this.options1 = data.data.reverse();
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    clearMajor(){
        this.changeForm.presentMajorId = ''
        this.changeForm.presentClassId = ''
    },
    clearTransferMajor(){
        this.transferClassForm.presentMajorId = ''
        this.transferClassForm.formerClassId = ''
        this.transferClassForm.presentClassId = ''
        this.formerClassArr = []
        this.newClassArr = []
    },
    clearFormerList(){
        this.transferMajorForm.presentGrade = this.transferMajorForm.formerGrade
        this.transferMajorForm.formerMajorId = ''
        this.transferMajorForm.formerClassId = ''
        this.formerClassArr = []
    },
    clearPresentList(){
        this.transferMajorForm.presentMajorId = ''
        this.transferMajorForm.presentClassId = ''
        this.newClassArr = []
    },
    tableHeight(){
        return document.body.clientHeight - 250
    },
    // /students/class/list/{grade}/{majorId}根据所在级、专业ID获取上课班列表
    // /students/{stuNum}学生核对管理—根据学号查询该学号的学生的核对信息
    // administrative/class/list/2015/91 根据年级 专业id 获取行政班
    handleStop() {},
    // 异动列表分页查询
    handerQuery() {
      // let params = {
      //     pageNo: this.pageNo,
      //     pageSize: this.pageSize,
      //     param: this.formInline
      // }
      this.tableLoading = true;
      this.$http
        .post(`_op:/modified/getList`, this.formInline)
        .then(res => {
          if (res.code === 0) {
            this.tableLoading = false;
            this.tableData = res.data.list;
            this.totalCount = res.data.count;
         
          }
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    searchQuery() {
      this.pageNo = 1
      this.formInline.pageNo = 1
      this.formInline.pageSize = 20
      this.tableLoading = true;
      this.$http
        .post(`_op:/modified/getList`, this.formInline)
        .then(res => {
          if (res.code === 0) {
            this.tableLoading = false;
            this.tableData = res.data.list;
            this.totalCount = res.data.count;
         
          }
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    sizeChange(val) {
      this.formInline.pageNo = 1;
      this.formInline.pageSize = val;
      this.handerQuery();
    },
    currentChange(val) {
      this.formInline.pageNo = val;
      this.handerQuery();
    },
    // 根据学号获取学生信息
    getStuInfo() {
      if (this.changeForm.stuNum) {
        this.queryLoading = true;
        // this.$http.get(`_op:students/${this.changeForm.stuNum}`).then(res => {
        // this.$http.get(`_op:/students/getByStuNum/${this.changeForm.stuNum}`).then(res => {
        this.$http
          .get(`_op:/students/info/${this.changeForm.stuNum}`)
          .then(res => {
            this.queryLoading = false;
            if (res.data) {
              if(this.changeForm.stuNum == res.data.name) {
                this.changeForm.stuNum = res.data.stuNum
              }
              this.changeForm.stuName = res.data.name;
              this.changeForm.formerGrade = res.data.enrollmentYear || "";
              this.changeForm.enrollmentDate = res.data.enrollmentDate || "";
              this.changeForm.sex = res.data.sex || "";
              this.changeForm.mobile = res.data.mobile || "";
              this.changeForm.formerMajorId = res.data.majorId || "";
              this.changeForm.formerClassId =
                res.data.administrativeClassId || "";
            }
          })
          .catch(err => {
            this.queryLoading = false;
          });
      }
    },
    // 打开各个异动对话框
    openDialog(type, status, id) {
      let action = ''
      if(status === "add"){
        action = "新增"
      } else if(status === 'edit') {
        action = "编辑";
      } else {
        action = '查看'
      }

      this.transferType = type;
      this.changeForm.type = type;
      this.dialog.status = status;

      for (var i = 0; i < this.typeList.length; i++) {
        // 根据异动类型显示新增编辑dialog title
        if (type === this.typeList[i].code) {
          this.dialog.title = `${action}${this.typeList[i].name}异动`;
          if (this.dialog.title == "编辑院外转入异动") {
          }
        }
      }

      if (type == 11) {
        // 转班
        this.transferClassForm.type = type;
        this.newClassArr = [];
        this.formerClassArr = [];

        if (status == "add") {
          this.dialog.classVisible = true;
        } else {
          this.dialog.visible = true; // 转班编辑
        }
      }else if(type == 10){
        // 转专业
        this.transferMajorForm.type = type;
        this.newClassArr = [];
        this.formerClassArr = [];

        if (status == "add") {
          this.dialog.majorVisible = true;
        } else {
          this.dialog.visible = true; // 转专业编辑
        }
      } else {
        this.dialog.visible = true;
      }
      if (type === 9) {
        // 院内转专业验证必填
        this.rules.presentMajorId[0].required = true;
        this.rules.presentGrade[0].required = true;
        this.rules.presentClassId[0].required = true;
      }
      if (type === 9) {
        this.isFu = true;
        let xiuxueType = "xiuxueyuanyin"
        this.outOfSchool(xiuxueType)
      } else {
        this.isFu = false;
      }
      if (type === 4) {
        // 休学周期验证必填条件
        this.rules.reason[0].required = true;
        this.rules.ext5[0].required = true;
        let xiuxueType = "xiuxueyuanyin"
        this.outOfSchool(xiuxueType)
      }
      if (type === 5) {
        // 退学验证必填条件
        this.rules.reason[0].required = true;
        let tuixueType = "tuixueyuanyin"
        this.outOfSchool(tuixueType)
      }
      if (type === 1) {
        this.editFalse = false;
      }
      if (type === 2) {
        this.editFalse = false; //院内转出 转出年纪，行政班隐藏
      }
      if (type === 6) {
        // 降级验证必填条件
        this.rules.reason[0].required = true;
        this.rules.presentMajorId[0].required = true;
        this.rules.presentGrade[0].required = true;
        this.rules.presentClassId[0].required = true;
        let jiangxueType = "jiangjileixing"
        this.outOfSchool(jiangxueType)
      }

      if (status === "edit" || status === "show") {
        this.getModifiedDetail(id, type);
      }
    },

    //复学新增调用数据
    getfuxueData() {
      if (this.changeForm.stuNum) {
        this.queryLoading = true;
        // this.$http.get(`_op:students/${this.changeForm.stuNum}`).then(res => {
        // this.$http.get(`_op:/students/getByStuNum/${this.changeForm.stuNum}`).then(res => {
        // /modified/student/info/{stuNo}
        this.$http
          .get(`_op:/modified/student/info/${this.changeForm.stuNum}`)
          .then(res => {
            this.queryLoading = false;
            let aaa = res.data.reason;
            if (aaa == 1) {
              res.data.reason = "个人原因-因病";
            } else if (aaa == 3) {
              res.data.reason = "个人原因-因事";
            }
            let bbb = res.data.ext5;
            if (bbb == 1) {
              res.data.ext5 = "1学期";
            } else if (bbb == 2) {
              res.data.ext5 = "1学年";
            }

            if (res.data) {
              // this.changeForm.stuName = res.data.name;
              this.changeForm.stuName = res.data.name;
              this.changeForm.formerGrade = res.data.enrollmentYear || "";
              this.changeForm.enrollmentDate = res.data.enrollmentDate || "";
              this.changeForm.sex = res.data.sex || "";
              this.changeForm.reason = res.data.reason || "";
              this.changeForm.ext5 = res.data.ext5 || "";

              this.changeForm.mobile = res.data.mobile || "";
              this.changeForm.formerMajorId = res.data.majorId || "";
              this.changeForm.formerClassId =
                res.data.administrativeClassId || "";
            }
          })
          .catch(err => {
            this.queryLoading = false;
          });
      }
    },
    // 课程认定 (注：批量增加学生认定课程)   发布时先获取该详情
    handleAffirm(modified, flag) {
      this.cancelFlag = flag
      this.afftype = modified.type;
      this.ctrl.button1 = false;
      this.modifiedId = modified.id;
      this.getmodifiedType(modified.type);
      this.affirmForm.submitType = 1
      this.dialog.affirmVisible = true;
      this.$http.post('_sc:/modified/courseaffirm/queryCourseList',{
        grade: modified.present_grade,
        major_id: modified.present_majorid
      }).then( res => {
        if(res.code == 0){
          this.affrimCourseLists = res.data
          this.affrimCourseListsBack = JSON.parse(JSON.stringify(res.data))
          let param = {}
          if(this.afftype == 3){
            param = {
              affirm_course_grade: modified.present_grade,
              affirm_course_major: modified.present_majorid,
              term_id: '',
              modified_id: modified.id,
              type: modified.type
            }
          }else{
            param = {
              affirm_course_grade: modified.present_grade,
              affirm_course_major: modified.present_majorid,
              term_id: '',
              student_no: modified.stuNum,
              modified_id: modified.id,
              type: modified.type
            }
          }
          this.$http.post('_sc:/modified/courseaffirm/queryDetail',param).then( res => {
            if(res.code == 0){
              this.affirmForm.stuNum = modified.stuNum
              this.affirmForm.presentMajorId = modified.present_majorid
              this.affirmForm.stuName = modified.stuName
              this.affirmForm.presentMajorName = modified.present_majorname
              this.affirmForm.presentGrade = String(modified.present_grade)
              this.affirmFormlist = res.data
              this.affirmForm.modifiedId = modified.id;
              this.affirmForm.list = res.data
              this.affirmForm.id = modified.id
              this.affirmFormBack = JSON.parse(JSON.stringify(this.affirmForm))
              this.affirmForm.list.map( item => {
                item.affrimCourseLists = this.affrimCourseLists
              })
    
              this.getAffirmCourseList();
            }else{
              this.$message.error(res.msg);
            }
          })
        }else{
          this.$message.error(res.msg);
        }
      })
    },
    // handleAffirm(modified) {
    //   this.afftype = modified.type;
    //   this.ctrl.button1 = false;
    //   this.modifiedId = modified.id;
    //   this.getmodifiedType(modified.type);
    //          this.affirmForm.submitType = 1
    //   this.dialog.affirmVisible = true;
    //   this.$http
    //     .get(`_op:/modified/courseaffirm/getDetail/${modified.id}`)
    //     .then(res => {
    //       if (res.code == 0) {
    //         this.affirmForm = res.data;
    //         this.affirmFormlist = res.data.list;
    //         for(let i=0;i< this.affirmFormlist.length;i++){
    //           if(this.affirmFormlist[i].isPublish==1){
    //              this.affirmForm.submitType = 2
    //           }
    //         }
 
    //         this.affirmForm.modifiedId = modified.id;
    //         this.affirmForm.presentMajorId = res.data.presentMajorId;
    //         this.affirmForm.presentGrade = String(res.data.presentGrade);
    //         this.getAffirmCourseList();
    //       } else {
    //         this.$message.error(res.msg);
    //       }
    //     });
    // },
    //选择不同的学期过滤
    // changeaffirName(affirtermid) {
    //   if(affirtermid == 0){
    //     this.affirmForm.list = this.affirmFormlist
    //     return
    //   }else{
    //     var arr = this.affirmFormlist.filter(
    //       item => item.former_term_number == affirtermid
    //     );
    //     this.affirmForm.list = arr;
    //   }
    // },
    getmodifiedType(type) {
      if (type == 2) {
        this.affirmVisibletitle = "院内转出";
      } else if (type == 3) {
        this.affirmVisibletitle = "院外转入";
      } else if (type == 4) {
        this.affirmVisibletitle = "休学";
      } else if (type == 5) {
        this.affirmVisibletitle = "退学";
      } else if (type == 6) {
        this.affirmVisibletitle = "降级";
      } else if (type == 7) {
        this.affirmVisibletitle = "";
      } else if (type == 8) {
        this.affirmVisibletitle = "";
      } else if (type == 9) {
        this.affirmVisibletitle = "复学";
      } else if (type == 10) {
        this.affirmVisibletitle = "院内转专业";
      } else if (type == 11) {
        this.affirmVisibletitle = "转班";
      } else if (type == 12) {
        this.affirmVisibletitle = "保留学籍";
      }
    },

    // 发布课程认定获取该课程id的详情
    handlePublishCourse() {
      this.dialog.tipAffirmVisible = true;
      // this.$http
      //   .get(`_op:/modified/courseaffirm/getDetail/${this.modifiedId}`)
      //   .then(res => {
      //     let statusArr = [];

      //     for (var i = 0; i < res.data.list.length; i++) {
      //       statusArr.push(res.data.list[i].isPublish);
    
      //     }

      //     if (statusArr.length < 1) {
      //       this.$message.warning("没有待认定的课程，请先添加");
      //       return false;
      //     }

      //     if (this.affirmForm.list.length > res.data.list.length) {
      //       this.$message.warning("新增的认定课程请先暂存再提交");
      //       return false;
      //     }
      //     if (!(statusArr.indexOf(0) > -1)) {
      //       this.$message.warning(
      //         "当前学生的认定课程已发布过，暂时不需要再发布"
      //       );
           
      //       return false;
      //     }
      //     this.dialog.tipAffirmVisible = true;
      //   });
    },
    // 课程认定提交（也就是发布）
    handlePublic() {
      // 课程认定确定提交(暂存)
      this.affirmForm.submitType = 1;
      if (this.affirmForm.list.length < 1) {
        this.$message.warning("没有待认定的课程，请先添加");
        return;
      }
      let params = {
        modifiedId: this.affirmFormBack.modifiedId,
        presentGrade: this.affirmFormBack.presentGrade,
        presentMajorId: this.affirmFormBack.presentMajorId,
        presentMajorName: this.affirmFormBack.presentMajorName,
        stuName: this.affirmFormBack.stuName,
        stuNum: this.affirmFormBack.stuNum,
        submitType: this.affirmForm.submitType,
        list: []
      }
      this.affirmFormBack.list.map( item => {
        params.list.push({
          affirmCourseId: item.affirm_course_id,
          affirmCourseName: item.affirm_course_name,
          affirmCourseScore: (item.affirm_course_grade === '' || item.affirm_course_grade ==  null) ? null : Number(item.affirm_course_grade),
          affirmTermNumber: item.affirm_term_number,
          affirm_bktimes: (item.affirm_bktimes === '' || item.affirm_bktimes ==  null) ? null : Number(item.affirm_bktimes),
          affirm_stage_bkgrade: (item.affirm_stage_bkgrade === '' || item.affirm_stage_bkgrade ==  null) ? null : Number(item.affirm_stage_bkgrade),
          affirm_stage_grade: (item.affirm_stage_grade === '' || item.affirm_stage_grade ==  null) ? null : Number(item.affirm_stage_grade),
          affirm_term_id: item.affirm_term_id,
          formerCourseId: item.former_course_id,
          formerCourseName: item.former_course_name,
          formerCourseScore: item.former_course_grade,
          formerTermNumber: item.former_term_number,
          id: this.affirmFormBack.id,
          isPublish: item.is_public,
          is_course_grade: item.is_course_grade,
          semesterId: item.semester_id,
          semesterName: item.semester_name,
          termName: item.former_course_name,
          termNumber: item.former_term_number,
          affirm_course_grade: (item.affirm_course_grade === '' || item.affirm_course_grade ==  null) ? null : Number(item.affirm_course_grade),
          remark: item.remark,
        })
      })
      this.$http
        .post(`_op:/modified/courseaffirm/addBatch`, params)
        .then(res => {
          if (res.code == 0) {
            // this.$message.success("课程提交成功");
            this.dialog.tipAffirmVisible = false;
            // this.dialog.affirmVisible = false;
            this.$http.post('_sc:/modified/courseaffirm/submitCourseAffirm',{
              modified_id: this.affirmFormBack.modifiedId,
              user_id: 0
            }).then( res => {
              if(res.data == '' || res.data == null) {
                this.dialog.affirmVisible = false;
                this.$http.get(`_op:/modified/courseaffirm/modifyStatus/${this.affirmFormBack.modifiedId}`).then( res => {
                  
                })
              }else {
                this.$message({
                  type: 'error',
                  message: res.data,
                  duration: 8000,
                  showClose: true
                })
              }
            })
          } else {
            this.$message.error(res.msg);
          }
        });

      // this.$refs.affirmForm.validate(valid => {
      //   if (valid) {
      //     var arrar = this.affirmForm.list;
      //     for (var i = 0; i < arrar.length; i++) {
      //       if (!arrar[i].isPublish) {
      //         arrar[i].isPublish = 0;
      //       }
      //     }
      //     let arr2 = [];
      //     for (let i = 0; i < arrar.length; i++) {
      //       //通过字段过滤没有填的
      //       if (arrar[i].affirmCourseScore) {
      //         arrar[i].formerTermNumber = arrar[i].termNumber;
      //         arr2.push(arrar[i]);
      //       }
      //     }
      //     this.affirmForm.list = arr2;
          
          // this.affirmForm.list = arrList;
      //     this.affirmForm.formerTermNumber = this.affirmForm.termNumber;

      //     this.$http
      //       .post(`_op:/modified/courseaffirm/addBatch`, this.affirmForm)
      //       .then(res => {
      //         if (res.code == 0) {
      //           this.$message.success("课程提交成功");
      //           this.dialog.tipAffirmVisible = false;
      //           this.dialog.affirmVisible = false;
      //         } else {
      //           this.$message.error(res.msg);
      //         }
      //       });
      //   }
      // });
    },
    // 根据异动id删除认定课程 （注：单个删除学生认定课程）
    deleteAffirCourse(affirmId) {
      this.$confirm(`确定删除该认定课程`, `提示`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .delete(`_op:/modified/courseaffirm/delete/${affirmId}`)
            .then(res => {
              if (res.code == 0) {
                this.$message.success("删除成功");
                this.handleAffirm();
              }
            });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    addItem(tableList, tableData, ctrlButton) {
      this.ctrl[ctrlButton] = true; // 控制新增按钮
      let editItem = {
        editing: true,
        id: ""
      };
      for (let key of this[tableList]) {
        editItem[key.prop] = "";
        editItem[key.selectIdProp] = ""; // new 循环
      }

      this[tableData].list.unshift(editItem);
    },
    handleEdit(tableList, tableData, row, index, ctrlButton) {
      if (row.isPublic == 1) {
        this.$message.warning("该认定课程已经发布不能再进行编辑");
        return;
      }
      if (this.ctrl[ctrlButton]) {
        this.$message.warning("每次只能新增或编辑一条成绩认定");
        return;
      }
      row.editing = true;
      this.ctrl[ctrlButton] = true;

      this.editArr[`${tableList}Row`] = {
        ...row
      };
      this.$set(this[tableData].list, index, row);
      // 点击编辑时获取认定课程下拉列表
      this.selectSemesterId = row.semesterId;
      this.getAffirmCourseList();
    },
    openDeleteDialog(tableList, tableData, row, index) {
      this.deleteAffirmCoureRow = row;
      this.deleteAffirmCoureIndex = index;

      if (!this.deleteAffirmCoureRow.id) {
        // 如果是新增按钮没有确定提交的则没有id
        this["affirmForm"].list.splice(this.deleteAffirmCoureRow, 1);
      } else {
        this.testdialog = true;
      }

      // this.$confirm(`该操作将会直接删除“${row.affirmCourseName}”认定课程，确定继续？`, `提示`, {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      // }).then(() => {
      //     this.$http.delete(`_op:/modified/courseaffirm/delete/${row.id}`).then(res => {
      //         if (res.code == 0) {
      //             this.$message.success('删除成功');
      //             // this.handleAffirm();
      //             this[tableData].list.splice(index, 1);
      //         } else {
      //             this.$message.error(res.msg);
      //         }
      //     })
      // }).catch(() => {
      //     this.affirmModal = false;
      //     this.$message.info('已取消删除')
      // })
    },
    handleDeleteAffirmCourse(row, index) {
      let newListData = [];
      let affirmForm = this.affirmForm;
      let oldData = this.affirmForm.list;
      oldData.splice(this.deleteAffirmCoureIndex, 1);
      affirmForm.list = oldData;
      this.affirmForm = affirmForm;
      this.affirmForm.submitType = 1;
      this.testdialog = false;
      //  this.affirmForm=this.newListData;
      //  this.handleAffirm(this.newListData)
      //  this.$http.post(`_op:/modified/courseaffirm/addBatch`, this.newListData).then(res => {
      //         if (res.code == 0) {
      //             this.$message.success('课程认定成功');
      //             // if (!(this.affirmForm.list.length > this.hadAffirmList.length)) {
      //             //     this.dialogAffirmClose();
      //             // }
      //         } else {
      //             this.$message.error(res.msg);
      //         }
      //     })

      //  }

      // this.$http.delete(`_op:/modified/courseaffirm/delete/${this.deleteAffirmCoureRow.id}`).then(res => {
      //     if (res.code == 0) {
      //         this.$message.success('删除成功');
      //         // this.handleAffirm();
      //         this['affirmForm'].list.splice(this.deleteAffirmCoureRow, 1); // 删除成功直接删除表格行显示
      //         this.testdialog = false;
      //     } else {
      //         this.testdialog = false;
      //         this.$message.error(res.msg);
      //     }
      // })
    },
    handleSaveItem(tableList, tableData, row, index, ctrlButton) {
      let patt1 = /^(?:[1-9]?\d|100)$/;
      if (row.semesterId === "") {
        this.$message.error("新增保存不能为空");
        return false;
      }

      if (!patt1.test(row.affirmCourseScore) && row.affirmCourseScore) {
        this.$message.error("[认定成绩]请输入0-100的正整数");
        return;
      }
      if (!patt1.test(row.formerCourseScore) && row.formerCourseScore) {
        this.$message.error("[原课程成绩]请输入0-100的正整数");
        return;
      }

      this.editArr[`${tableList}Row`] = null;
      row.editing = false;
      delete row.editing;
      this.$set(this[tableData].list, index, row);
      // if (this.ctrl[ctrlButton] && index === 0) { // 控制新增按钮
      this.ctrl[ctrlButton] = false;
      // }
      this.selectSemesterId = ""; //
    },
    handleCancel(tableList, tableData, row, index, ctrlButton) {
      // this.editObj
      this.ctrl[ctrlButton] = false; // 2222222222
      if (this.editArr[`${tableList}Row`]) {
        this.$set(this[tableData].list, index, this.editArr[`${tableList}Row`]);
        this[tableData].list[index].editing = false;
        this.editArr[`${tableList}Row`] = null;
      } else {
        this.ctrl[ctrlButton] = false;
        this[tableData].list.shift();
      }
    },
    // 成绩模型生成
    scoreModel() {
      let postData = {
        courseId: 0,
        grade: "0",
        majorId: "0",
        pageNo: 1,
        pageSize: 20,
      }
      this.$http.post('_sc:/courseScoreModel/ScoreModelList', postData).then(res => {
        if(res.code == 0) {
          this.$message.success('生成成功')
        }else{
          this.$message.error('生成失败')
        }
      })
    },
    changeName(data, tableList, tableData, index, arr, prop) {
      let name;

      arr.map(item => {
        if (item.id === data || item.courseId === data) {
          // 因为不是所有下拉字段一致  所以增加不同判断及选择
          name = item.name || item.courseName;
        }
      });
      this.$set(this[tableData].list[index], prop, name);

      // 当选择的下拉是选择学期时  将请求认定课程下拉
      if (prop === "semesterName") {
        this.selectSemesterId = data;
        this.getAffirmCourseList();
      }
    },
    cancelAffirm() {
      let params = {
        id:0,
        type:1003,
        extend: JSON.stringify({
          modified_id: this.affirmFormBack.modifiedId
        }),
        user_id: this.userId
      }
      this.$http.post(`_sc:/scoreRecord/pTransCom`, params).then(res => {
        if(res.code == 0) {
          this.$message.success("撤回成功");
          this.dialog.affirmVisible = false
          this.searchQuery()
        }else {
          this.$message.error(res.msg)
        }
      });
    },
    // 课程认定确定提交(暂存)
    affirmSubmit() {
      this.affirmForm.submitType = 1;
      if (this.affirmForm.list.length < 1) {
        this.$message.warning("没有待认定的课程，请先添加");
        return;
      }
      let params = {
        modifiedId: this.affirmFormBack.modifiedId,
        presentGrade: this.affirmFormBack.presentGrade,
        presentMajorId: this.affirmFormBack.presentMajorId,
        presentMajorName: this.affirmFormBack.presentMajorName,
        stuName: this.affirmFormBack.stuName,
        stuNum: this.affirmFormBack.stuNum,
        submitType: this.affirmFormBack.submitType,
        list: []
      }
      this.affirmFormBack.list.map( item => {
        params.list.push({
          affirmCourseId: item.affirm_course_id,
          affirmCourseName: item.affirm_course_name,
          affirmCourseScore: (item.affirm_course_grade === '' || item.affirm_course_grade ==  null) ? null : Number(item.affirm_course_grade),
          affirmTermNumber: item.affirm_term_number,
          affirm_bktimes: (item.affirm_bktimes === '' || item.affirm_bktimes ==  null) ? null : Number(item.affirm_bktimes),
          affirm_stage_bkgrade: (item.affirm_stage_bkgrade === '' || item.affirm_stage_bkgrade ==  null) ? null : Number(item.affirm_stage_bkgrade),
          affirm_stage_grade: (item.affirm_stage_grade === '' || item.affirm_stage_grade ==  null) ? null : Number(item.affirm_stage_grade),
          affirm_term_id: item.affirm_term_id,
          formerCourseId: item.former_course_id,
          formerCourseName: item.former_course_name,
          formerCourseScore: item.former_course_grade,
          formerTermNumber: item.former_term_number,
          id: this.affirmFormBack.id,
          isPublish: item.is_public,
          is_course_grade: item.is_course_grade,
          semesterId: item.semester_id,
          semesterName: item.semester_name,
          termName: item.former_course_name,
          termNumber: item.former_term_number,
          affirm_course_grade: (item.affirm_course_grade === '' || item.affirm_course_grade ==  null) ? null : Number(item.affirm_course_grade),
          remark: item.remark,
        })
      })
      this.$http
        .post(`_op:/modified/courseaffirm/addBatch`, params)
        .then(res => {
          if (res.code == 0) {
            this.$message.success("课程暂存成功");
            this.dialog.affirmVisible = false;

          } else {
            this.$message.error(res.msg);
          }
        });
      // this.$refs.affirmForm.validate(valid => {
      //   if (valid) {
      //     var arrar = this.affirmForm.list;
      //     for (var i = 0; i < arrar.length; i++) {
      //         this.affirmTableList[1].selectListProp.map((item)=>{
      //            if(arrar[i].affirmCourseId==item.courseId){
      //                arrar[i].affirmCourseName = item.courseName
      //            }
      //          })
           
      //       if (!arrar[i].isPublish) {
      //         arrar[i].isPublish = 0;
      //       }
      //     }

      //     let arr2 = [];
      //     for (let i = 0; i < arrar.length; i++) {
      //       //通过字段过滤没有填的
      //       if (arrar[i].affirmCourseScore) {
      //         arrar[i].formerTermNumber = arrar[i].termNumber;
      //         arr2.push(arrar[i]);
      //       }
      //       if(arrar[i].affirmCourseScore&&arrar[i].affirmCourseScore<0){
      //          this.$message.error('输入的成绩不正确')
      //          return
      //       }
      //     }
      //     this.affirmForm.list = arr2;
      //     this.affirmForm.formerTermNumber = this.affirmForm.termNumber;
          // this.$http
          //   .post(`_op:/modified/courseaffirm/addBatch`, this.affirmForm)
          //   .then(res => {
          //     if (res.code == 0) {
          //       this.$message.success("课程暂存成功");
          //       this.dialog.affirmVisible = false;
  
          //     } else {
          //       this.$message.error(res.msg);
          //     }
          //   });
      //   }
      // });
    },
    // 各异动种类新增弹窗卷宗
    dialogClose() {
      this.dialog.visible = false;
      this.editFalse = true;
      this.$refs.changeForm.clearValidate(); // 移除表单项的校验结果
      if (this.transferType === 10) {
        this.rules.presentMajorId[0].required = false;
        this.rules.presentGrade[0].required = false;
        this.rules.presentClassId[0].required = false;
      }
      for (let key in this.changeForm) {
        if (key !== "creater") {
          this.changeForm[key] = "";
        }
      }
      this.fileList1 = [];
    },
    // 关闭转班弹窗
    dialogCloseClass() {
      this.dialog.classVisible = false;
      this.classTypeList = []
      this.formerClassNum = 0;
      this.newClassNum = 0;
      this.$refs.transferClassForm.clearValidate();
      for (let key in this.transferClassForm) {
        if (key !== "creater") {
          if (key == "stuNums") {
            this.transferClassForm[key] = [];
          } else {
            this.transferClassForm[key] = "";
          }
        }
      }
      this.fileList2 = [];
    },
    dialogCloseMajor() {
      this.dialog.majorVisible = false;
      this.formerClassList = []
      this.formerClassNum = 0;
      this.newClassNum = 0;
      this.$refs.transferMajorForm.clearValidate();
      for (let key in this.transferMajorForm) {
        if (key !== "creater") {
          if (key == "stuNums") {
            this.transferMajorForm[key] = [];
          } else {
            this.transferMajorForm[key] = "";
          }
        }
      }
      this.fileList3 = [];
    },
    // 关闭课程认定弹窗'button1'
    dialogAffirmClose(ctrlButton) {
      this.dialog.affirmVisible = false;
      this.formInline.term = ''
      // this.ctrl[ctrlButton] = false;
    },
    // 新增\编辑异动
    ensureSubmit() {
      let api = "";
      if (this.dialog.status === "add") {
        api = "_op:/modified/transferOne";
        this.changeForm.id = "";
      } else if (this.dialog.status === "edit") {
        api = "_op:/modified/update";
      }
      this.changeForm.transferOne = util.getStorage('loginName')
      this.$refs.changeForm.validate(valid => {
        if (valid) {
          this.$http.post(api, this.changeForm).then(res => {
            if (res.code === 0) {
              this.handerQuery();
              this.dialogClose();
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    transferSubmit() {
      this.$refs.transferClassForm.validate(valid => {
        if (valid) {
          let params = this.transferClassForm.isStop;

          if (params == true) {
            this.transferClassForm.isStop = 1;
          } else {
            this.transferClassForm.isStop = 0;
          }
          this.$http
            .post(`_op:/modified/transferClass`, this.transferClassForm)
            .then(res => {
              this.dialogCloseClass();
              this.handerQuery();
              this.fileList = [];
            });
        }
      });
    },
    transferMajorSubmit() {
      this.$refs.transferMajorForm.validate(valid => {
        if (valid) {
          let params = this.transferMajorForm.isStop;

          if (params == true) {
            this.transferMajorForm.isStop = 1;
          } else {
            this.transferMajorForm.isStop = 0;
          }
          this.$http
            .post(`_op:/modified/transferClass`, this.transferMajorForm)
            .then(res => {
              this.dialogCloseMajor();
              this.handerQuery();
              this.fileList3 = [];
            });
        }
      });
    },
    //设置reson
    setReson() {
      // if (this.changeForm.reason == 1) {
      //   this.changeForm.reason = "个人原因-因病";
      // } else if (this.changeForm.reason == 3) {
      //   this.changeForm.reason = "个人原因-因事";
      // } else {
      //   this.changeForm.reason = "国国家政策-入伍"; //、、2???
      // }
    },
    //获取异动详情
    async getModifiedDetail(id, type) {
      this.$http.get(`_op:/modified/get/${id}`).then(res => {
        for (let key in this.changeForm) {
          this.changeForm[key] = res.data[key];
          if (type == 3) {
            // this.changeForm.stuName = res.data.name;
            // this.changeForm.enrollmentDate = res.data.enrollmentDate  || '';
            // this.changeForm.sex = res.data.sex || '';
            // this.changeForm.reason = res.data.reason || '';
            // this.changeForm.ext5 = res.data.ext5 || '';
            this.changeForm.formerGrade = res.data.enrollmentDate || "";
            this.changeForm.formerMajorId = res.data.presentMajorId || ""; //专业
            this.changeForm.formerClassId = res.data.presentClassId || ""; //行政班
          }
          let aaa = this.changeForm.ext5;
          if (aaa == 1) {
            this.changeForm.ext5 = "1学期";
          } else if ((aaa = 2)) {
            this.changeForm.ext5 = "1学年";
          }
        }
        this.setReson();
        this.fileList1 = [];
        // this.fileList1[0].response.data.url = res.data.fileUrl;
        if (res.data.fileUrl) {
          let obj = {
            name: "点击查看附件",
            // url: 'http://192.168.0.200/group1/M00/00/BB/wKgAyFxFhoaAe2RkAAB5TrOBYHo625.png'
            // url: `http://192.168.0.200/${res.data.fileUrl}`
            url: `/${res.data.fileUrl}`
          };
          this.fileList1.push(obj);
        }
        this.changeForm.fileUrl = res.data.fileUrl;
        this.changeForm.presentGrade = String(res.data.presentGrade);
        this.changeForm.modifiedDate = util.getTime1(res.data.modifiedDate);
      });
    },
    //  删除当前异动
    deleteTeacher(id) {
      this.$confirm(`确定删除当前的异动类型吗`, `提示`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        distinguishCancelAndClose: true,
        type: "warning"
      })
        .then(_ => {
          this.$http.get(`_op:/modified/delete/${id}`).then(res => {
            if(res.code == 0) {
              this.$message.success("删除成功");
              this.handerQuery();
            }else {
              this.$message.error(res.msg)
            }
          });
        })
        .catch(_ => {
          this.$message.info("已取消删除");
        });
    },
    handleSelectionChange(arr) {
      this.tempTransferArr = arr;
    },
    handleSelectionChangeNew(arr) {
      this.tempToLeftArr = arr;
    },
    // 根据行政id获取行政班学生
    getStudentsByAdminisClassId(classId, prop, flag) {
      // this.$http.get(`_op:/students/student/list/${classId}`).then(res => {
      this.$http.get(`_op:/students/list/${classId}/1/100`).then(res => {
        this[prop] = res.data.records;
        this.transferClassForm.stuNums = []
        this.transferMajorForm.stuNums = []
        if (prop == "formerClassArr") {
          this.formerClassNum = res.data.total;
          if(this.transferClassForm.presentClassId && flag) {
            this.getStudentsByAdminisClassId(this.transferClassForm.presentClassId, 'newClassArr', false)
          }
          if(this.transferMajorForm.presentClassId && flag) {
            this.getStudentsByAdminisClassId(this.transferMajorForm.presentClassId, 'newClassArr', false)
          }
        } else if (prop == "newClassArr") {
          this.newClassNum = res.data.total;
          if(this.transferClassForm.formerClassId && flag) {
            this.getStudentsByAdminisClassId(this.transferClassForm.formerClassId, 'formerClassArr', false)
          }
          if(this.transferMajorForm.formerClassId && flag) {
            this.getStudentsByAdminisClassId(this.transferMajorForm.formerClassId, 'formerClassArr', false)
          }
        }
      });
    },
    // 新行政班新行政班学生不可选控制
    // selectable (row, index){
    //     if (row.selectAble) {
    //         return true
    //     } else {
    //         return false;
    //     }
    // },
    // 增加到右表格
    addToRight() {
      if (this.tempTransferArr.length < 1) {
        this.$message.warning("您还没选择转班学生");
        return false;
      }
      if (!this.transferClassForm.presentClassId) {
        this.$message.warning("您还没选择新行政班");
        return false;
      }
      if(this.transferClassForm.formerClassId&&(this.transferClassForm.formerClassId === this.transferClassForm.presentClassId)) {
        this.$message.warning("班级相同");
        return false;
      }
      let reduceArr = [];
      // this.transferClassForm.stuNums = [];
      for (let j = 0; j < this.tempTransferArr.length; j++) {
        this.transferClassForm.stuNums.push(this.tempTransferArr[j].stuNum);
      }
      this.newClassArr = this.newClassArr.concat([...this.tempTransferArr]);
      for (var i = 0; i < this.tempTransferArr.length; i++) {
        // this.tempTransferArr[i].selectAble = true;
        this.removeAaary(this.formerClassArr, this.tempTransferArr[i]);
      }
      this.formerClassArr = this.formerClassArr;
      this.formerClassNum = this.formerClassArr.length;
      this.newClassNum = this.newClassArr.length;
    },
    addToRight2() {
      if (this.tempTransferArr.length < 1) {
        this.$message.warning("您还没选择转班学生");
        return false;
      }
      if (!this.transferMajorForm.presentClassId) {
        this.$message.warning("您还没选择新行政班");
        return false;
      }
      let reduceArr = [];
      // this.transferClassForm.stuNums = [];
      for (let j = 0; j < this.tempTransferArr.length; j++) {
        this.transferMajorForm.stuNums.push(this.tempTransferArr[j].stuNum);
      }
      this.newClassArr = this.newClassArr.concat([...this.tempTransferArr]);
      for (var i = 0; i < this.tempTransferArr.length; i++) {
        // this.tempTransferArr[i].selectAble = true;
        this.removeAaary(this.formerClassArr, this.tempTransferArr[i]);
      }
      this.formerClassArr = this.formerClassArr;
      this.formerClassNum = this.formerClassArr.length;
      this.newClassNum = this.newClassArr.length;
    },
    addToLeft() {
      let reduceArr = [];

      this.formerClassArr = this.formerClassArr.concat([...this.tempToLeftArr]);
      for (var i = 0; i < this.tempToLeftArr.length; i++) {
        this.removeAaary(this.newClassArr, this.tempToLeftArr[i]);
      }
      this.newClassArr = this.newClassArr;
      this.formerClassNum = this.formerClassArr.length;
      this.newClassNum = this.newClassArr.length;
    },
    // 获取异动类型
    getModefiedType() {
      // this.$http.get(`http://192.168.1.181:8080/operation/data/admin/modified/getType`).then(res => {
      this.$http.get(`_op:/modified/getType`).then(res => {
        if (res.data) {
          this.typeList = res.data;
          this.typeList.push({
            name: "没入学",
            code: 1
          })
        }
      });
    },
    getAdministrativeClassList(val,status=1) {
      if(status == 1){
        this.$set(this.changeForm,'presentClassId','');
      }
      if(this.changeForm.presentGrade && val){
        this.$http
        .get(
          `_op:administrative/class/list/${this.changeForm.presentGrade}/${val}`
        )
        .then(res => {
          this.administrativeClassList = res.data;
        });
      }
    },
    handleChange() {},
    // 上传图片
    handleUploadSuccess(response, file, fileList) {
      this.fileList1 = fileList.slice(-1);
      this.changeForm.fileUrl = response.data.url;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/bmp";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    handlePreview(file) {
      if (/\.jpg|\.png|\.jpeg/.test(file.url)) {
        this.previewUrl = file.url;
        this.previewPic = true;
      } else {
        // 如果不是图片类型的则下载
        // window.open(file.url);
        // let eleIframe = document.createElement('iframe');
        // eleIframe.src = file.url;
        // eleIframe.style.display = 'none';
        // document.body.appendChild(eleIframe);

        var form = document.createElement("form");
        form.style.display = "none";
        form.setAttribute("target", "");
        form.setAttribute("method", "get");
        form.setAttribute("action", file.url);
        document.body.appendChild(form);
        form.submit(); //表单提交
      }
    },
    handleTraClassUploadSuccess(response, file, fileList) {
      this.fileList2 = fileList.slice(-1);
      this.transferClassForm.fileUrl = response.data.url;
    },
    handleMajorUploadSuccess(response, file, fileList) {
      this.fileList3 = fileList.slice(-1);
      this.transferMajorForm.fileUrl = response.data.url;
    },
    collapseShow() {
      this.fold.state = !this.fold.state;
      this.fold.text = this.fold.state ? "收起" : "展开";
    },
    getMajorList() {
      //专业列表
      this.$http.get("_op:/major/combox").then(res => {
        if (res.code == 0) {
          this.majorList = res.data;
        }
      });
    },
    getschoolinglength() {
      // let type = 'study-year'
      let self = this;
      this.$http
        .get("_op:/dicts/combox/study-year")
        .then(data => {
          self.schoolinglength = data.data;
        })
        .catch(err => {});
    },
    //转班获取行政班  根据年级，专业获取行政班
    getShiftWork(val) {
      this.$http
        .get(
          `_op:administrative/class/list/${
            this.transferClassForm.presentGrade
          }/${val}`
        )
        .then(res => {
          this.classTypeList = res.data;
        });
    },
    getFormerWork(val) {
      this.$http
        .get(
          `_op:administrative/class/list/${
            this.transferMajorForm.formerGrade
          }/${val}`
        )
        .then(res => {
          this.formerClassList = res.data;
        });
    },
    getPresentWork(val) {
      this.$http
        .get(
          `_op:administrative/class/list/${
            this.transferMajorForm.presentGrade
          }/${val}`
        )
        .then(res => {
          this.administrativeList = res.data;
        });
    },
    getAdministrative() {
      this.$http
        .post("_op:/administrative/class/list", {
          pageNo: 1,
          pageSize: 100,
          param: {}
        })
        .then(data => {
          this.administrativeList = data.result;
        })
        .catch(() => {});
    },
    // 获取学期下拉
    // getTermData(query) {
      // if (!query) {
      //   query = "学期";
      // }
      // this.$http.get("_op:/terms/" + query).then(data => {
      //   if (data.code == 0) {
      //     this.termList = data.data;
      //     this.affirmTableList[0].selectListProp = data.data; // 表格内下拉赋值
      //   } else {
      //     this.$message.error(data.msg);
      //   }
      // });
    // },
    getaffirmTermData() {
      let arr = [
        { name: "第一学期", id: 1 },
        { name: "第二学期", id: 2 },
        { name: "第三学期", id: 3 },
        { name: "第四学期", id: 4 },
        { name: "第五学期", id: 5 },
        { name: "第六学期", id: 6 },
        { name: "第七学期", id: 7 },
        { name: "第八学期", id: 8 },
        { name: "第九学期", id: 9 },
        { name: "第十学期", id: 10 }
      ];
      this.affirmtermList = arr;
      this.affirmTableList[0].selectListProp = arr;
      this.affirmTableList[3].selectListProp = arr;
    },
    // 获取排课课程
    getCourseList() {
      this.$http.get("_op:/course/combox").then(data => {
        if (data.code == 0) {
          this.courseList = data.data;
          this.affirmTableList[1].selectListProp = data.data; // 暂用
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 获取认定课程
    getAffirmCourseList() {
      // let self = this;
      // self.selectSemesterId = 0;
      // if (self.affirmForm.presentGrade && self.affirmForm.presentMajorId) {
      //   this.$http
      //     .get(
      //       `_ed:/trainplan/termIds/grade/${
      //         self.affirmForm.presentGrade
      //       }/major/${self.affirmForm.presentMajorId}/term/${
      //         self.selectSemesterId
      //       }`
      //     )
      //     .then(res => {
      //       if (res.code == 0) {
      //         var arr = res.data;
      //         var map = {};
      //         let dest = [];
      //         for (var i = 0; i < arr.length; i++) {
      //           var ai = arr[i];
      //           if (!map[ai.courseId]) {
      //             dest.push({
      //               courseId: ai.courseId,
      //               courseName: ai.courseName,
      //               grade: ai.grade,
      //               majorId: ai.majorId,
      //               majorName: ai.majorName,
      //               data: [ai]
      //             });
      //             map[ai.courseId] = ai;
      //           } else {
      //             for (var j = 0; j < dest.length; j++) {
      //               var dj = dest[j];
      //               if (dj.courseId == ai.courseId) {
      //                 dj.data.push(ai);
      //                 break;
      //               }
      //             }
      //           }
      //         }

      //         self.affirmTableList[1].selectListProp = dest;
      //       }
      //     });
      // }
    },
    removeAaary(arr, obj) {
      var length = arr.length;
      for (var i = 0; i < length; i++) {
        if (arr[i] == obj) {
          if (i == 0) {
            arr.shift(); //删除并返回数组的第一个元素
            return arr;
          } else if (i == length - 1) {
            arr.pop(); //删除并返回数组的最后一个元素
            return arr;
          } else {
            arr.splice(i, 1); //删除下标为i的元素
            return arr;
          }
        }
      }
    }
  },
  filters: {
    formatTime: util.getTime1,

    showTermName: function(val, terms) {
      for (var i = 0; i < terms.length; i++) {
        if (val == terms[i].id) {
          return terms[i].name;
        }
      }
    },

    showAffirmCourseName(val, courses) {
      for (var i = 0; i < courses.length; i++) {
        if (val == courses[i].courseId) {
          return courses[i].courseName;
        }
      }
    }
  }
};
</script>

<style lang="less" scope>
.upload-demo {
  position: relative;
  padding-left: 240px;
  margin-bottom: 20px;
}
.import-teachers-list .upload-demo /deep/ .el-upload-list {
  position: absolute;
  top: 0;
  left: 0;
  width: 230px;
  min-height: 30px;
  border: 1px solid #ddd;
  border-radius: 3px;
  max-height: 60px;
  overflow-y: scroll;
}
.school-roll-change{
  .el-dialog__body{
    padding: 10px 20px 30px 20px;
  }
  .el-form-item{
    margin-bottom: 4px;
  }
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type='number'] {
  -moz-appearance: textfield;
}
.cm-table /deep/ .el-button--small{
  padding: 0px;
}
.cm-table /deep/ .el-table--mini td{
  padding: 4px 0;
}
.cm-btn-con {
    padding: 0 20px 10px 20px;
}
.school-roll-change {
  .school-roll-change-dialog {
    .el-form-item {
      .el-date-editor.el-input {
        width: 217px;
      }

      .el-form-item__content {
        width: 217px;
        box-sizing: border-box;

        .el-select {
          width: 100%; // edge
        }
      }

      .el-input.is-disabled .el-input__inner {
        color: #666;
      }
    }

    .administrative-class-select-item {
      margin-bottom: 18px;
    }

    .remark-box {
      .el-form-item {
        margin-right: 0;
        width: 100%;
      }

      .el-form-item__content {
        width: 568px;
      }
    }

    .flex-wrapper {
      margin: 10px 0;
      display: flex;
      // align-items:center;
      justify-content: space-between;

      .flex-item {
        align-items: center;
      }
    }

    .cm-table {
      padding: 0;

      .el-table {
        border-bottom: 1px solid #ebeef5;
      }

      .el-table__body-wrapper {
        z-index: 333;
      }
    }

    .student-count {
      display: inline-block;
      line-height: 40px;
    }

    .affirm-wrapper {
      padding: 0 20px;
      .affirm-header {
        margin: 10px 0;
      }
    }
  }
}
.textStyleBox {
  position: relative;
}
.textStyle {
  //   text-align: 2em;
  text-indent: 4em;
  padding-bottom: 20px;
}
.element.style {
  //   margin-top: 7vh !important;
  width: 760px;
}
/deep/ .boxStyle {
  margin-top: 100px !important;
  width: 760px;
}
// .addClass /deep/ .element.styl {
//   width: 100%;
// }
// .boxStyle {
//   margin-top: 7vh !important;
//   //   margin-top: 100px !important;
// }
// .element.style {
//   margin-top: 1vh !important;
//   width: 760px;
// }
// element.style {
//   margin-top: 1vh !important;
//   width: 760px;
// }
</style>