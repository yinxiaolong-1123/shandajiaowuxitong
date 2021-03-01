<!--学时统计详细统计信息-->
<template>
	<section class="cm-container">
		<div class="cm-breadcrumb">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path:item.path }">
                    {{item.label}}
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="cm-fold"
            v-loading="tableLoading"
            element-loading-text="加载中...">
            <el-row type="flex" justify="end" style="padding:10px 0;">
                <el-button type="primary" size="mini" @click="$router.back()">返回</el-button>
            </el-row>

            <table border class="detail-table" ref="printTable">
                <tbody>
                <tr>
                    <th colspan="12">详细统计信息</th>
                </tr>
                <tr>
                    <td colspan="2">授课教师</td>
                    <td colspan="10">{{$route.query.teachername || '暂无'}}</td>
                </tr>
                <tr>
                    <td colspan="2">授课形式</td>
                    <td colspan="10">{{$route.query.teachmode || '暂无'}}</td>
                </tr>
                <tr>
                    <td width="30">周别</td>
                    <td width="90">时间</td>
                    <td width="30">星期</td>
                    <td>授课内容</td>
                    <td width="30">节次</td>
                    <td width="30">节数</td>
                    <td width="120">课程</td>
                    <td width="90">课程形式</td>
                    <td width="120">授课地点</td>
                    <td>授课班级</td>
                    <td width="120">分组情况</td>
                    <td width="40">学生数</td>
                </tr>
                <template v-for="(termItem,i) in assignHoursDetailList">
                    <tr>
                        <td colspan="12" style="text-align:center;">{{termItem.semester_name}}</td>
                    </tr>
                    <tr v-for="(item,j) in termItem.itemlist">
                        <td>{{item.week}}</td>
                        <td>{{item.schedule_item_date}}</td>
                        <td>{{item.weekday}}</td>
                        <td>{{item.teaching_content}}</td>
                        <td>{{item.section_nodenames}}</td>
                        <td>{{item.section_nodenames | sectionCount}}</td>
                        <td>{{item.course_arrange}}</td>
                        <td>{{item.teaching_formname}}</td>
                        <td>{{item.area_name}}</td>
                        <td>{{item.cls_name}}</td>
                        <td>{{item.group_names}}</td>
                        <td>{{item.stu_num}}</td>
                    </tr>
                </template>

                <tr>
                    <td colspan="2">总学时</td>
                    <td colspan="10">
                        {{assignHoursTeachingForm.totalhours}}学时
                        &nbsp;
                        {{assignHoursTeachingForm.formlist | joinFormlist}}
                        {{schoolinglengthlist | joinSchoolinglengthlist}}
                    </td>
                </tr>
                <tr>
                    <td colspan="2">班级情况</td>
                    <td colspan="10">
                        <template v-for="(item,i) in assignHoursClass">
                            【{{item.cls_name}}】-{{item.course_name}}-{{item.teaching_formname}}：{{item.assign_hours}}学时<br/>
                        </template>
                        <template v-if="assignHoursClass.length==0">无</template>
                    </td>
                </tr>
                </tbody>
            </table>
            <!-- <el-button type="primary" plain size="mini" @click="previewPdf" style="margin-top:10px;">
                预览pdf
            </el-button> -->
            <el-button type="primary" plain size="mini" @click="exportPdf" style="margin-top:10px;">
                导出pdf
            </el-button>
        </div>

	</section>

</template>

<script>
    import {addfont} from '@/plugs/jspdf/simsun-normal.js'
    import jsPDF from 'jspdf';
    import 'jspdf-autotable';
	export default {
		data(){
			return {
				breadcrumb: [
                    {label: "教学管理"},
                    {label: "学时统计"}
                    
                ],
                tableLoading:false,
                assignHoursClass:[],
                assignHoursDetailList:[],
                assignHoursTeachingForm:{
                    formlist:[],
                    totalhours:0,
                },
                schoolinglengthlist:[],
			}
		},
		mounted(){
	      	this.assignHoursDetail();
        },
        filters:{
            // 计算节数
            sectionCount(str){
                if(!str){
                    return 0;
                }
                return str.split(',').length;
            },
            // 课程对应学时的数组拼接成字符串
            joinFormlist(formlist){
                if(formlist.length==0){
                    return '';
                }
                let resStr = '';
                formlist.forEach((formItem,i)=>{
                    resStr += formItem.teaching_formname+'：'+formItem.teachingformhours;
                    if(i<formlist.length-1){
                        resStr += '；';
                    }
                });
                resStr = '【'+resStr+'】';
                return resStr;
            },
            joinSchoolinglengthlist(schoolinglengthlist){
                if(schoolinglengthlist.length==0){
                    return '';
                }
                let resStr = '';
                schoolinglengthlist.forEach((schoolingItem,i)=>{
                    resStr += schoolingItem.schooling_length_name+'总学时为'+schoolingItem.hours+'学时';
                    if(i<schoolinglengthlist.length-1){
                        resStr += '，';
                    }
                });
                resStr = '（'+resStr+'）';
                return resStr;
            }
        },
		methods:{
			// 查询学时详细统计信息
            assignHoursDetail(){
                this.tableLoading = true;
                let postData = {
                    teacherid: this.$route.query.teacherid,
                    courseId: this.$route.query.courseId,
                    t_department_id: this.$route.query.t_department_id,
                    a_department_id: this.$route.query.a_department_id,
                };
                let semesterIds = this.$route.query.semesterIds;
                if(semesterIds && semesterIds.length>0){
                    postData.semesterIds = semesterIds;
                }
                let teaching_form = this.$route.query.teaching_form;
                if(teaching_form){
                    postData.teaching_form = teaching_form;
                }

                this.$http.post('_ed:term/assignHoursDetail',postData).then(res => {
                    this.tableLoading = false;
                    if (res.code == 0) {
						if(!res.data){
                            return;
                        }
                        let assignHoursClass = res.data.assignHoursClass;
                        if(assignHoursClass && assignHoursClass.length>0){
                            this.assignHoursClass = assignHoursClass;
                        }
                        let assignHoursDetailList = res.data.assignHoursDetailList;
                        if(assignHoursDetailList && assignHoursDetailList.length>0){
                            this.assignHoursDetailList = assignHoursDetailList;
                        }
                        let assignHoursTeachingForm = res.data.assignHoursTeachingForm;
                        this.assignHoursTeachingForm.totalhours = assignHoursTeachingForm.totalhours || 0;
                        if(assignHoursTeachingForm.formlist&&assignHoursTeachingForm.formlist.length>0){
                            this.assignHoursTeachingForm.formlist = assignHoursTeachingForm.formlist;
                        }
                        this.schoolinglengthlist = res.data.schoolinglengthlist || [];
					} else {
						this.$message.error(res.msg);
					}
                })
            },

            handlePdf(){
                var doc = new jsPDF('l');
                addfont(doc);
                doc.addFont('simsun-normal.ttf', 'simsun', 'normal');
                doc.setFont('simsun');

                // 标题
                doc.autoTable([''], [[this.$route.query.teachername+'教师工作量统计表']], {
                    styles: {
                        font: "simsun",
                        halign: 'center', // left, center, right
                        valign: 'middle', // top, middle, bottom
                        fontSize: 16,
                    },
                    showHead: 'never',
                    theme:'plain',
                    margin:{top:5,bottom:0}
                });

                var res = doc.autoTableHtmlToJson(this.$refs.printTable);
                doc.autoTable(
                    ['','','','','','','','','','','',''],
                    res.data,{
                        styles:{
                            font: "simsun",//表格里设置为中文字体
                            // overflow: 'linebreak'
                            // lineWidth: 0.2,
                            lineColor: 0,
                            fontSize: 8,
                            textColor:[0,0,0],
                        },
                        tableLineColor:0,
                        theme: 'grid',
                        showHead: 'never',
                        columnStyles:{
                            0:{cellWidth:10},//周别
                            1:{cellWidth:20},//时间
                            2:{cellWidth:10},//星期
                            3:{cellWidth:'auto'},//授课内容
                            4:{cellWidth:13},//节次
                            5:{cellWidth:10},//节数
                            6:{cellWidth:30},//课程
                            7:{cellWidth:18},//课程形式
                            8:{cellWidth:30},//授课地点
                            9:{cellWidth:'auto'},//授课班级
                            10:{cellWidth:25},//分组情况
                            11:{cellWidth:13},//学生数
                        },
                        margin: {left:10, right:10},
                        startY: doc.autoTable.previous.finalY,
                        didParseCell(data){
                            // if(data.row.raw.cells.length==1){
                            //     // console.log(data);
                            //     data.cell.styles.halign = 'center';
                            // }
                        }
                    }
                );
                
                // 日期
                let date = new Date();
                let dateStr = date.getFullYear()+'年'+(date.getMonth()+1)+'月'+date.getDate()+'日';
                doc.autoTable([''], [[dateStr]], {
                    styles: {
                        font: "simsun",
                        halign: 'right', // left, center, right
                        valign: 'middle', // top, middle, bottom
                    },
                    margin: {left:10, right:10},
                    showHead: 'never',
                    theme:'plain',
                });
                
                let pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
                let pageHidtht = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
                for(let i = 1; i <= pageNumber; i++){
                    doc.setPage(i);
                    doc.setFontSize(10);
                    doc.text('第'+i+'页', 10, pageHidtht-5);
                }
                return doc;
            },

            exportPdf(){
                let doc = this.handlePdf();
                doc.save(this.$route.query.teachername+'教师工作量统计表.pdf');
            },

            previewPdf(){
                let doc = this.handlePdf();
                let base64URL = doc.output('datauristring');
                let win = window.open();
                win.document.write('<iframe src="' + base64URL  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
            },
		}
	}
</script>
<style scoped>
	.detail-table{
        width: 100%;
        border: 1px solid #EBEEF5;
        font-size: 14px;
    }
    .detail-table tr:hover{
        background-color: #f5f7fa;
    }
    .detail-table th{
        background-color:#f5f7fa;
        text-align: center;
        padding: 6px 10px;
        color: #909399;
    }
    .detail-table td{
        word-break: break-all;
        padding: 6px 10px;
        color: #606266;
    }
    .detail-table th,.detail-table td{
        /* width: 12.5%; */
        font-size: 12px;
    }
    /* .detail-table tr td:nth-of-type(1){
        width: 100px;
    } */
</style>