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
      <el-form size="mini" :inline="true" :model="formInline">
        <div class="fold">
          <div ref="formDetail" class="detail" :class="{'detail-show':fold.state}">
            <el-form-item class="cm-collapse" v-show="fold.showBtn">
              <el-button type="text" @click="collapseShow">{{fold.text}}</el-button>
            </el-form-item>
            <el-form-item label="学期">
              <el-input v-model="team" clearable placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="所在级">
              <intelligent-year-picker
                v-model="enrollmentYear"
                type="year"
                value-format="yyyy"
                placeholder="请选择"
              ></intelligent-year-picker>
            </el-form-item>

            <el-form-item label="专业">
              <el-select v-model="majorId" placeholder="请选择" clearable filterable>
                <el-option
                  v-for="item in majorList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="授课场地">
              <el-input v-model="teacherspalce" clearable placeholder="请输入证件号"></el-input>
            </el-form-item>

            <el-form-item label="授课老师">
              <el-input v-model="teachersteach" clearable placeholder="请输入证件号"></el-input>
            </el-form-item>

            <el-form-item label="上课班">
              <el-select v-model="administrativeClassId" placeholder="请选择" clearable filterable>
                <el-option
                  v-for="item in administrativeList"
                  :key="item.id"
                  :label=" item.grade +'-'+ item.name "
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="btn">
            <el-button type="primary" size="mini" @click="serchFn" v-if="btnPerObj.edit">查询</el-button>
          </div>
        </div>
      </el-form>
    </div>

    <div class="cm-table" style="position: relative;">
      <div class="btn_class">
              <el-button size="small" v-if="monthly" @click="seebyweek()">  查看周课表 </el-button>
                <el-button size="small" v-else @click="seebymonth()">  返回 </el-button>
        </div>
      
      <el-carousel :autoplay="false" :interval="5000" height="800px" arrow="always" v-if="!monthly">
        <el-carousel-item v-for="(lis,index) in tableData" :key="index" >
          <div class="tab_top">
           
            <p>
              {{lis.nowday}}
              <span class="todays">
                <span>{{lis.tiemerstarts}}</span>至
                <span>{{lis.tiemerend}}</span>
              </span>
            </p>
          </div>
          <table border="1" class="tabtimer" >
            <tr class="tabtop">
              <td>课节/星期</td>
              <td>星期一</td>
              <td>星期二</td>
              <td>星期三</td>
              <td>星期四</td>
              <td>星期五</td>
              <td>星期六</td>
              <td>星期日</td>
            </tr>
            <tr v-for="(item,aaaa) in lis.list1" :key="aaaa">
              <td>{{aaaa+1}}</td>

              <td v-for="(list,keys) in item.content2" :key="keys"  :rowspan="list.classday"  @click="adjustment_class(list,keys,item.content2)" >
                  
                <div  class="tab_cin"  @mouseenter ="seetecherinfo(list,keys,item.content2)" @mouseleave="colsetcherinfo(list,keys,item.content2)">
                      <template v-if="list.contentList">
                          <template v-for="item in list.contentList">
                            {{item.name}}|
                          </template>
                      </template>
                    <template v-else>
                          {{list.content}}
                      </template>
                    <div v-if="list.showpop" :class="{showcontent:nosix,showcontent2:ifsix}" style="z-index:10000">
                        <div class="changeclass" @click.stop="mutual_adjustment(list,keys,item.content2)">
                            互调 
                        </div>
                            <div class="changeclass" @click.stop="class_adjustment(list,keys,item.content2)">
                            调课
                        </div>
                        <div class="changeclass" @click.stop="colsecontent(list,keys,item.content2)">
                            关闭
                        </div>
                    </div>
                    <div v-if="list.seeinfo" :class="{showcontent3:teachernosix,showcontent4:teacherifsix}">
                        详情
                    </div>
                </div>
              </td>
            </tr>
          </table>
        </el-carousel-item>
      </el-carousel>
      <template v-else></template>
        <div  class="tab_top">
          <p>
            <span>
                <span> </span> 
                <span> </span>
            </span>
          </p>
        </div>
        <table border="1" class="tabtimer" >
            <tr class="tabtop">
              <td>课节/星期</td>
              <td>星期一</td>
              <td>星期二</td>
              <td>星期三</td>
              <td>星期四</td>
              <td>星期五</td>
              <td>星期六</td>
              <td>星期日</td>
            </tr>
            <tr v-for="(item,aaaa) in zonglist1" :key="aaaa">
              <td>{{aaaa+1}}</td>
               <td v-for="(list,keys) in item.content2" :key="keys"  :rowspan="list.classday"  @click="adjustment_class(list,keys,item.content2)" >
                  
                <div  class="tab_cin"  @mouseenter ="seetecherinfo(list,keys,item.content2)" @mouseleave="colsetcherinfo(list,keys,item.content2)">
                      <template v-if="list.contentList">
                          <template v-for="item in list.contentList">
                            {{item.name}}|
                          </template>
                      </template>
                    <template v-else>
                          {{list.content}}
                      </template>
                    <div v-if="list.showpop" :class="{showcontent:nosix,showcontent2:ifsix}" style="z-index:10000">
                        <div class="changeclass" @click.stop="mutual_adjustment(list,keys,item.content2)">
                            互调 
                        </div>
                            <div class="changeclass" @click.stop="class_adjustment(list,keys,item.content2)">
                            调课
                        </div>
                        <div class="changeclass" @click.stop="colsecontent(list,keys,item.content2)">
                            关闭
                        </div>
                    </div>
                    <div v-if="list.seeinfo" :class="{showcontent3:teachernosix,showcontent4:teacherifsix}">
                        详情
                    </div>
                    <div v-if="list.t_dalong" class="tan_dalong">
                      <P style="height: 50px;line-height: 50px;">调课的弹窗</p>
                     <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
                      <el-form-item label="审批人">
                        <el-input v-model="formInline.user" placeholder="审批人"></el-input>
                      </el-form-item>
                      <el-form-item label="活动区域">
                        <el-select v-model="formInline.region" placeholder="活动区域">
                          <el-option label="区域一" value="shanghai"></el-option>
                          <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                      </el-form-item>
                      <!-- <el-form-item>
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                      </el-form-item> -->
                    </el-form>
                      <span style="">
                        <el-button size="mini" @click.stop="colsedalong(list,keys,item.content2)">取消</el-button>
                        <el-button  size="mini" @click.stop="onsubdalong(list,keys,item.content2)">确定</el-button>
                      </span>
                      
                    </div>
                </div>
              </td>
            </tr>
        </table>
    </div>
  </section>
</template>

<script>
import util from "@/util";
// import addStudent from './add_student'
import { mapState } from "vuex"; //引入状态
export default {
  name: "student-management",
  data() {
    return {
      breadcrumb: [{ label: "自动排课" }, { label: "课表预览" }],
      item: [1, 2, 3, 4],
      monthly:true,//为TRUE 就是按月
      ifsix:false,//最后一个
      nosix:false,//不是最后一个
      teacherifsix:false,
      teachernosix:false,
      ifshowpop:false,//调课的弹窗
      popovercontent: false,
      showinfo:true,
      go_adjustment:false,
        formInline: {
          user: '',
          region: ''
        },
      tableData: [
        {
          nowday: "第一周",
          tiemerstarts: "2019-3-4",
          tiemerend: "2019-3-8",
          list1: [
            {
              content1: "1",
              content2: [
               
                {
                  content: "内科学122",
                  classday: 1,
                  showpop:false,
                  seeinfo:false
                },
                {
                  content: "内科学1",
                  classday: 1,
                  showpop:false,
                  seeinfo:false
                },
                {
                  content: "内科学1",
                  classday: 1,
                  showpop:false,
                  seeinfo:false
                },

                {
                  content: "内科学1",
                  classday: 1,
                  showpop:false,
                  seeinfo:false
                },
                {
                  content: "内科学1",
                  classday: 1,
                  showpop:false,
                  seeinfo:false
                },

                {
                  content: "内科学3",
                  classday: 1,
                  showpop:false,
                  seeinfo:false
                },
                {
                  content: "内科学3",
                  classday: 1,
                  showpop:false,
                  seeinfo:false
                }
              ]
            },
            {
              content1: "1",
              content2: [
               {
                  content: "内科学1",
                  classday: 1,
                  showpop:false,
                  seeinfo:false
                },
                {
                  content: "内科学1",
                  classday: 1,
                  showpop:false,
                  seeinfo:false
                },
                {
                  content: "内科学1",
                  classday: 1,
                  showpop:false,
                  seeinfo:false
                },
                {
                  content: "内科学1",
                  classday: 1,
                  showpop:false,
                  seeinfo:false
                },

                {
                  content: "内科学1",
                  classday: 1,
                  showpop:false,
                  seeinfo:false
                },
                {
                  content: "内科学1",
                  classday: 1,
                  showpop:false,
                  seeinfo:false
                },

                {
                  content: "内科学9",
                  classday: 1,
                  showpop:false,
                  seeinfo:false
                }
              ]
            },
            {
              content1: "1",
              content2: [
               {
                  content: "内科学1",
                  classday: 1,
                  showpop:false,
                  seeinfo:false
                },
                {
                  content: "内科学1",
                  classday: 1,
                  showpop:false,
                  seeinfo:false
                },
                {
                  content: "内科学1",
                  classday: 1,
                  showpop:false,
                  seeinfo:false
                },
                {
                  content: "内科学1",
                  classday: 1,
                  showpop:false,
                  seeinfo:false
                },

                {
                  content: "内科学1",
                  classday: 1,
                  showpop:false,
                  seeinfo:false
                },
                {
                  content: "内科学1",
                  classday: 1,
                  showpop:false,
                  seeinfo:false
                },

                {
                  content: "内科学4",
                  classday: 1,
                  showpop:false,
                  seeinfo:false
                }
              ]
            }
          ]

        },
        {
          nowday: "第二周",
          tiemerstarts: "2019-3-4",
          tiemerend: "2019-3-8",
          list1: [
            {
              content1: "1",
              content2: [
                {
                  content: "内科学1",
                  classday: 3,
                  contentList:[
                    {
                       name:"内里1"
                    },
                    {
                       name:"内里2"
                    }
                   
                  ]
                },
                {
                  content: "内科学1q",
                  classday: 1
                },
                {
                  content: "内科学1w",
                  classday: 1
                },
                {
                  content: "内科学1e",
                  classday: 1
                },

                {
                  content: "内科学1r",
                  classday: 1
                },
                {
                  content: "内科学1",
                  classday: 1
                },

                {
                  content: "内科学1",
                  classday: 1
                }
              ]
            },
            {
              content1: "1",
              content2: [
                // {
                //     content:'内科学1uu',
                //     classday:3
                // },
                {
                  content: "内科学1",
                  classday: 1
                },
                {
                  content: "内科学1",
                  classday: 1
                },
                {
                  content: "内科学1",
                  classday: 1
                },

                {
                  content: "内科学1",
                  classday: 1
                },
                {
                  content: "内科学1",
                  classday: 1
                },

                {
                  content: "内科学1",
                  classday: 1
                }
              ]
            },
            {
              content1: "1",
              content2: [
        
                {
                  content: "内科学1",
                  classday: 1
                },
                {
                  content: "内科学1",
                  classday: 1
                },
                {
                  content: "内科学1",
                  classday: 1
                },

                {
                  content: "内科学1",
                  classday: 1
                },
                {
                  content: "内科学1",
                  classday: 1
                },

                {
                  content: "内科学1",
                  classday: 1
                }
              ]
            }
          ]
        },
        {
          nowday: "第三周",
          tiemerstarts: "2019-3-4",
          tiemerend: "2019-3-8",
          list1: [
            {
              content1: "1",
              content2: [
                {
                  content: "内科学1",
                  classday: 3
                },
                {
                  content: "内科学1",
                  classday: 1
                },
                {
                  content: "内科学1",
                  classday: 1
                },
                {
                  content: "内科学1",
                  classday: 1
                },

                {
                  content: "内科学1",
                  classday: 1
                },
                {
                  content: "内科学1",
                  classday: 1
                },

                {
                  content: "内科学1",
                  classday: 1
                }
              ]
            },
            {
              content1: "1",
              content2: [
                // {
                //     content:'内科学1',
                //     classday:1
                // },
                {
                  content: "内科学1",
                  classday: 1
                },
                {
                  content: "内科学1",
                  classday: 1
                },
                {
                  content: "内科学1",
                  classday: 1
                },

                {
                  content: "内科学1",
                  classday: 1
                },
                {
                  content: "内科学1",
                  classday: 1
                },

                {
                  content: "内科学1",
                  classday: 1
                }
              ]
            },
            {
              content1: "1",
              content2: [
                // {
                //     content:'内科学1',
                //     classday:1
                // },
                {
                  content: "内科学1",
                  classday: 1
                },
                {
                  content: "内科学1",
                  classday: 1
                },
                {
                  content: "内科学1",
                  classday: 1
                },

                {
                  content: "内科学1",
                  classday: 1
                },
                {
                  content: "内科学1",
                  classday: 1
                },

                {
                  content: "内科学1",
                  classday: 1
                }
              ]
            }
          ]
        },
        {
          nowday: "第四周",
          tiemerstarts: "2019-3-4",
          tiemerend: "2019-3-8",
          list1: [
            {
              content1: "1",
              content2: [
                {
                  content: "内科学1",
                  classday: 3
                },
                {
                  content: "内科学1",
                  classday: 1
                },
                {
                  content: "内科学1",
                  classday: 1
                },
                {
                  content: "内科学1",
                  classday: 1
                },

                {
                  content: "内科学1",
                  classday: 1
                },
                {
                  content: "内科学1",
                  classday: 1
                },

                {
                  content: "内科学1",
                  classday: 1
                }
              ]
            },
            {
              content1: "1",
              content2: [
                // {
                //     content:'内科学1',
                //     classday:1
                // },
                {
                  content: "内科学1",
                  classday: 1
                },
                {
                  content: "内科学1",
                  classday: 1
                },
                {
                  content: "内科学1",
                  classday: 1
                },

                {
                  content: "内科学1",
                  classday: 1
                },
                {
                  content: "内科学1",
                  classday: 1
                },

                {
                  content: "内科学1",
                  classday: 1
                }
              ]
            },
            {
              content1: "1",
              content2: [
                // {
                //     content:'内科学1',
                //     classday:1
                // },
                {
                  content: "内科学1",
                  classday: 1
                },
                {
                  content: "内科学1",
                  classday: 1
                },
                {
                  content: "内科学1",
                  classday: 1
                },

                {
                  content: "内科学1",
                  classday: 1
                },
                {
                  content: "内科学1",
                  classday: 1
                },

                {
                  content: "内科学1",
                  classday: 1
                }
              ]
            }
          ]
        }
      ],
       zonglist1: [
            {
              content1: "1",
              content2: [
               
                {
                  content: "内科学122",
                  classday: 1,
                  showpop:false,
                  seeinfo:false,                 
                  t_dalong:false
                },
                {
                  content: "内科学1",
                  classday: 1,
                  showpop:false,
                  seeinfo:false,                   
                  t_dalong:false
                },
                {
                  content: "内科学1",
                  classday: 1,
                  showpop:false,
                  seeinfo:false,                   
                  t_dalong:false
                },

                {
                  content: "内科学1",
                  classday: 1,
                  showpop:false,
                  seeinfo:false,                   
                  t_dalong:false
                },
                {
                  content: "内科学1",
                  classday: 1,
                  showpop:false,
                  seeinfo:false,                   
                  t_dalong:false
                },

                {
                  content: "内科学3",
                  classday: 1,
                  showpop:false,
                  seeinfo:false,                   
                  t_dalong:false
                },
                {
                  content: "内科学3",
                  classday: 1,
                  showpop:false,
                  seeinfo:false,                   
                  t_dalong:false
                }
              ]
            },
            {
              content1: "1",
              content2: [
               {
                  content: "内科学1",
                  classday: 1,
                  showpop:false,
                  seeinfo:false,                   
                  t_dalong:false
                },
                {
                  content: "内科学1",
                  classday: 1,
                  showpop:false,
                  seeinfo:false,                   
                  t_dalong:false
                },
                {
                  content: "内科学1",
                  classday: 1,
                  showpop:false,
                  seeinfo:false,                   
                  t_dalong:false
                },
                {
                  content: "内科学1",
                  classday: 1,
                  showpop:false,
                  seeinfo:false,                   
                  t_dalong:false
                },

                {
                  content: "内科学1",
                  classday: 1,
                  showpop:false,
                  seeinfo:false,                   
                  t_dalong:false
                },
                {
                  content: "内科学1",
                  classday: 1,
                  showpop:false,
                  seeinfo:false,                   
                  t_dalong:false
                },

                {
                  content: "内科学9",
                  classday: 1,
                  showpop:false,
                  seeinfo:false,                   
                  t_dalong:false
                }
              ]
            },
            {
              content1: "1",
              content2: [
               {
                  content: "内科学1",
                  classday: 1,
                  showpop:false,
                  seeinfo:false,                   
                  t_dalong:false
                },
                {
                  content: "内科学1",
                  classday: 1,
                  showpop:false,
                  seeinfo:false,                   
                  t_dalong:false
                },
                {
                  content: "内科学1",
                  classday: 1,
                  showpop:false,
                  seeinfo:false,                   
                  t_dalong:false
                },
                {
                  content: "内科学1",
                  classday: 1,
                  showpop:false,
                  seeinfo:false,                   
                  t_dalong:false
                },

                {
                  content: "内科学1",
                  classday: 1,
                  showpop:false,
                  seeinfo:false,                   
                  t_dalong:false
                },
                {
                  content: "内科学1",
                  classday: 1,
                  showpop:false,
                  seeinfo:false,                   
                  t_dalong:false
                },

                {
                  content: "内科学4",
                  classday: 1,
                  showpop:false,
                  seeinfo:false,                   
                  t_dalong:false
                }
              ]
            }
          ],
      team: "", //学期
      enrollmentYear: "", //所在级
      majorId: "", //专业
      teacherspalce: "", //授课场地
      teachersteach: "", //授课老师
      administrativeClassId: "", //上课班
      fold: {
        state: false,
        text: "展开",
        showBtn: false
      },
      dialogFormVisible: false,
      dialogTitle: "",
      majorList: [], //专业
      administrativeList: [], //行政班

      formInline: {
        user: "",
        region: ""
      },
      btnPerObj: {
        //按钮权限
        // add:false,//新增
        query: true, //查询
        edit: true //编辑
        // del:false,//删除
        // import:false,
        // opt:false,//批量操作
        // reset:false,//重置密码
        // download:false//下载模板
      }
    };
  },
  // components:{
  // 	addStudent
  // },
  filters: {
    statusFn(val) {
      let valText = "";
      switch (val) {
        case 1:
          valText = "在籍";
          break;
        case 2:
          valText = "非在籍";
          break;
        default:
          break;
      }
      return valText;
    }
  },
  computed: {
    ...mapState(["btnPermitList"]), //
    headers() {
      return {
        Access_Token: util.getStorage("token"),
        Authorization: util.getStorage("token")
      };
    }
  },
  methods: {
    colsedalong(item,index,content2){
        content2[index].t_dalong = false
    },
      mutual_adjustment(item,index,content2){
        this.colsecontent(item,index,content2)
       
            for(let k=0;k<this.zonglist1.length;k++){
                for(let j=0;j<this.zonglist1[k].content2.length;j++){
                    this.zonglist1[k].content2[j].t_dalong = false
                }
            }
        
        content2[index].t_dalong = true
      
      },
      class_adjustment(){
     
      },
      seebyweek(){
        this.monthly = false
      },
      seebymonth(){
          this.monthly = true
      },
      seetecherinfo(item,index,content2){
           if(index==6){
            this.teacherifsix = true
            this.teachernosix = false
        }else{
            this.teacherifsix = false
            this.teachernosix = true
        }
        for(let i=0;i<this.tableData.length;i++){
            for(let k=0;k<this.tableData[i].list1.length;k++){
                for(let j=0;j<this.tableData[i].list1[k].content2.length;j++){
                    this.tableData[i].list1[k].content2[j].seeinfo = false
                }
            }
        }
        content2[index].seeinfo = true
      
      },
     colsetcherinfo(item,index,content2){
        content2[index].seeinfo = false
       
     },
    adjustment_class(item,index,content2){
      this.colsecontent(item,index,content2)
        if(index==6){
            this.ifsix = true
            this.nosix = false
        }else{
            this.ifsix = false
            this.nosix = true
        }
        for(let i=0;i<this.tableData.length;i++){
            for(let k=0;k<this.tableData[i].list1.length;k++){
                for(let j=0;j<this.tableData[i].list1[k].content2.length;j++){
                    this.tableData[i].list1[k].content2[j].showpop = false
                }
            }
        }
        content2[index].showpop = true
        // alert('1')
      
    },
    colsecontent(item,index,content2){
        // alert('2')
        
         content2[index].showpop = false
      
    },
    //获取按钮权限
    getBtnPermit() {
      let self = this;
      let actionId = this.$route.query.actionId;
      this.$http
        .get("_auth:/privilege/getList/" + actionId + "/2")
        .then(data => {
          data.data.map(item => {
            if (item.code == "query_xueshengguanli") {
              //查询
              self.btnPerObj.query = true;
            }
            if (item.code == "add_xueshengguanli") {
              //新增
              self.btnPerObj.add = true;
            }
            if (item.code == "download_template_xueshengguanli") {
              //下载模板
              self.btnPerObj.download = true;
            }

            if (item.code == "import_students_xueshengguanli") {
              //导入
              self.btnPerObj.import = true;
            }
            if (item.code == "edit_xueshengguanli") {
              //编辑
              self.btnPerObj.edit = true;
            }
            if (item.code == "del_xueshengguanli") {
              //删除
              self.btnPerObj.del = true;
            }

            if (item.code == "opt_batch_jiaozhigong") {
              //批量操作
              self.btnPerObj.opt = true;
            }
            if (item.code == "reset_password_xueshengguanli") {
              //重置密码
              self.btnPerObj.reset = true;
            }
          });
        })
        .catch(() => {});
    },
    serchFn() {
      // this.tablePage.current=1;
      // this.getTableData();
    },
  

    getTableData() {
     
    },
    getMajorCategory() {
      //专业
      this.$http
        .get("_op:/major/combox", {})
        .then(data => {
          this.majorList = data.data;
        })
        .catch(() => {});
    },
    getAdministrative() {
      //行政班
      let params = {
        pageNo: 1,
        pageSize: 100,
        param: {
          administrativeClassName: this.administrativeClassId,
          grade: this.enrollmentYear,
          majorId: this.major
        }
      };
      this.$http
        .post("_op:/administrative/class/list", params)
        .then(data => {
          this.administrativeList = data.result;
        })
        .catch(() => {});
    },
  

    collapseShow() {
      this.fold.state = !this.fold.state;
      this.fold.text = this.fold.state ? "收起" : "展开";
    }
  },
  mounted() {
    util.resize(this);
    window.onresize = () => {
      util.resize(this);
    };

    util.openBtnPermit(this.btnPerObj);
    //          this.getBtnPermit();
  },
  created() {
    this.getTableData();
    this.getMajorCategory();
    this.getAdministrative();
  }
};
</script>

<style scoped lang="less">
.tan_dalong{
    position: absolute;
    left: 70px;
    top: 2px;
    width: 150px;
    z-index: 100000;
    background: white;
    height: 300px;
    width: 300px;
    // background: wheat;

}
.btn_class{
  position: absolute;
  z-index: 100;
  top: 10px;
  left: 30px;
}
.tab_top {
  text-align: center;
  height: 60px;
  line-height: 60px;
  background-color: #ddd;
  position: relative;
}
.tabtimer {
  width: 100%;
  text-align: center;
  .tabtop {
  }
}
.todays {
  position: absolute;
  right: 100px;
}
/deep/.el-carousel__arrow--right {
  right: 400px;
  top: 30px;
}
/deep/.el-carousel__arrow--left {
  left: 400px;
  top: 30px;
}
.tab_cin{
    position: relative;
}
.showcontent{
    position: absolute;
    left:70px;
    top: 2px;
    width: 150px;
    background: wheat;
    z-index: 1000;
    .changeclass{
        
    }
    
}
.showcontent2{
    position: absolute;
    left: -20px;
    top: 2px;
    width: 150px;
    background: wheat;
    z-index: 1000;
}
.showcontent3{
    position: absolute;
    left:70px;
    top: 2px;
    width: 150px;
    background: wheat;
    z-index: 1000;
    .changeclass{
        
    }
    
}
.showcontent4{
    position: absolute;
    left: -20px;
    top: 2px;
    width: 150px;
    background: wheat;
    z-index: 1000;
}
.detalinfo{
    position:absolute;
    background-color: chocolate;
    left: 100px;
    top:100px
;
}
</style>