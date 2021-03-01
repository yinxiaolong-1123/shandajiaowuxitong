<template>
    <div class="page-container"> 
        <div id="print-container">
            <div style="padding: 30px 25px 25px 30px;color:#000" class="page w3cbbs" v-for="(val,index) in printData" :key="index"> 
            <div class="subpage">
                <div style="line-height:50px;">
                    <img  style="position: absolute; right:43px; " :src="logoUrl" width="60.75" height="65.85" />
                    <div size="mini"   style="width:100%;text-align:center;font-size:22px;height:65.85px;display:flex;justify-content:center;align-items:center">
                        <span class="center" :class="{lh: printLanguage == 'En'}" style="font-weight:600" v-html="printTitleName[printLanguage][0]"> </span>   
                    </div> 
                    <div style="display:flex;justify-content:space-between;align-items:left;height:26px;line-height:26px;font-size:14px">
                        <!-- <div :style=" printLanguage == 'En' ? 'flex:0.8' : 'flex:1'"> -->
                        <span>{{printTitleName[printLanguage][1]}}:{{val.studentNo}}</span>  
                        <span style="margin-left:10px;">{{printTitleName[printLanguage][2]}}:{{val['student'+ printLanguage +'Name']}}</span>
                        <!-- </div>  -->
                        <!-- <div  style="flex:1;"> -->
                        <span>{{printTitleName[printLanguage][3]}}:{{val['major'+ printLanguage +'Name']}}</span>  
                        <span  style="margin-left:10px;">{{printTitleName[printLanguage][4]}}:{{val['lengthOfSchooling'+ printLanguage +'Name']}}</span>
                        <span style="background:url('')"></span>
                        <!-- </div>  -->
                    </div>
                </div>
                <div  style="display: flex;">
                    <table width="50%" style="flex: 1 1 0%; font-size: 12px; border-width: 2px 0px 2px 2px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;">
                        <tr style="display: flex;height:18px;line-height:18px;">
                            <td :style="'text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][10]}}</td>
                            <td :style="'text-align:center;flex:1;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][6]}}</td>
                            <td :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][7]}}</td>
                            <td :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][8]}}</td>
                            <td :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 31px; height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][9]}}</td>
                        </tr>
                        <!-- height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px; -->
                        <tr :style="'display: flex;height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'" v-for="(item,index) in val.leftTranscriptOfCourse"  :key="index">
                            <td :rowspan="item.rowSpan" :style="'text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'">{{item.itemIndex}}</td>
                            <td :rowspan="item.rowSpan" :style="item.term?'text-align:center;flex:1;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;':'text-align:left;flex:1;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'" ><div :style="'width:100%;height:100%;line-height:18px;'"  v-html="item['course'+printLanguage+'Name']"></div></td>
                            <td :rowspan="item.rowSpan" :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'">{{item.learnHour}}</td>
                            <td :rowspan="item.rowSpan" :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'">{{item.credit | showCredit}}</td>
                            <td :rowspan="item.rowSpan" :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 31px; height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'">{{item.score}}</td>
                        </tr>  
                    </table> 
                    <table width="50%" style="flex: 1 1 0%; font-size: 12px; border-width: 2px 1px 2px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;">
                        <tr style="display: flex;height:18px;line-height:18px;">
                            <td :style="'text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][10]}}</td>
                            <td :style="'text-align:center;flex:1;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][6]}}</td>
                            <td :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][7]}}</td>
                            <td :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][8]}}</td>
                            <td :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 31px; height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][9]}}</td>
                        </tr>
                        <tr :style="'display: flex;height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'" v-for="(item,index) in val.rightTranscriptOfCourse"  :key="index">
                            <td :rowspan="item.rowSpan" :style="'text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'">{{item.itemIndex}}</td>
                            <td :rowspan="item.rowSpan" :style="item.term?'text-align:center;flex:1;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;':'text-align:left;flex:1;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'" ><div :style="'width:100%;height:100%;line-height:18px;'"  v-html="item['course'+printLanguage+'Name']"></div></td>
                            <td :rowspan="item.rowSpan" :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'">{{item.learnHour}}</td>
                            <td :rowspan="item.rowSpan" :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'">{{item.credit | showCredit}}</td>
                            <td :rowspan="item.rowSpan" :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 31px; height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'">{{item.score}}</td>
                        </tr>  
                    </table>  
                </div> 
                <div :style="printLanguage == 'Cn' ? 'line-height:20px;margin-top:10px;font-size:12px;' : 'line-height:14px;margin-top:2px;font-size:12px;'"  >
                    <div style=" display: flex;  flex-wrap: wrap; justify-content: space-between;"><span v-html="printTitleName[printLanguage][11]"></span>　<span  v-html="printTitleName[printLanguage][5] +'　'+ nowTime(printLanguage)"></span></div>
                </div>
            </div>
        </div>
        </div>
    </div>
</template>
<script>
import util from '@/util';

export default {
    props:{
        printData:{
            type:Array,
            default:[]
        },
        printLanguage:{
            type:String,
            default:'Cn'
        },
    },
    data(){
        return {
            logoUrl:'img/stdx_log.png',
            printTitleName:{
                Cn:['汕头大学医学院学生成绩单','学号','姓名','专业','学制','汕头大学医学院教务处  学籍科  日期:','课程内容','学时','学分','成绩','序号','注:标有\'*\'为选修课'],
                En:['STUDENTS\' ACADEMIC RECORDS <br/> OF SHANTOU UNIVERSITY MEDICAL COLLEGE','No','Name','Speciality','Years of Study','The Student Status Section Of Dean\'s Office Of Shantou University Medical College  Date:','Courses','HRS','CRT','GRD','No','Note: Marked \'*\' as an Optional Course&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;HRS is Hours &nbsp;&nbsp;&nbsp; CRT is Credits &nbsp;&nbsp;&nbsp; GRD is Grades']
            },
            lineHeight:18,
        }
    },
    filters: { 
        showCredit(val) {
            if (val <= 0) return null;
            return val;
        }
    },
    methods:{
        nowTime(lan){
            if("Cn" === lan){
                return util.cnTime();
            }else{
                return util.enTime();
            }
        },
    }
}
</script>
<style scoped>
.lh{
    line-height: 20px;
}
.page-container{
    position: absolute;
    width: 21cm;
    left: 50%;
    transform: translateX(-50%)
}
.page {
    width: 210mm;
    height:297mm;
    max-width: 210mm;
    max-height:297mm;
}
@page {
    size: A4;
}
@media print {
    .page {
        margin: 0;
        border: initial;
        border-radius: initial;
        width: initial;
        min-height: initial;
        box-shadow: initial;
        background: initial;
        page-break-after: always;
    }

    .w3cbbs {
        page-break-after: always;
        box-sizing: border-box;
    }

    .avoidpage{
        page-break-after: avoid;
    }

    body {
        margin: 0;
        padding: 0;
        background-color: #FAFAFA;
        font: 12pt "Tahoma";
    }

    * {
        box-sizing: border-box;
        -moz-box-sizing: border-box;
    }

    .page {
        width: 21cm;
        height:297mm;
        max-width: 210mm;
        max-height:297mm;
        margin: 0 auto;
        overflow: hidden;
        background: white;
        color: #000;
        /* box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); */
    }
    .page tr,td,div{
        color: #000
    }
    .subpage {
        height: 100%;
    }
}

</style>