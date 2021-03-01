<template>
    <div class="page-container"> 
        <div class="btn">
            <el-button type="primary" size="mini" @click="exportPdf">导出</el-button>
            <el-button type="primary" size="mini" @click="cancelExport">取消</el-button>
        </div>
        <div id="export-container">
            <div class="page w3cbbs" v-for="(val,index) in printData" :key="index"> 
            <div class="subpage">
                <div style="line-height:43px;">
                    <!-- <img  style="position: absolute; right:3px; " class='img' :src="logoUrl" width="75" height="85" /> -->
                    <div size="mini"   style="width:100%;text-align:center;font-size:22px;">
                        <span class="center" v-html="printTitleName[printLanguage][0]"> </span>   
                    </div> 
                    <div style="display:flex;align-items:left;">
                        <div style="margin-left: 10px;">
                        <span>{{printTitleName[printLanguage][1]}}:{{val.studentNo}}</span>  
                        <span style="margin-left:10px;">{{printTitleName[printLanguage][2]}}:{{val['student'+ printLanguage +'Name']}}</span>
                        </div> 
                        <div  style="flex:1;">
                        <span>{{printTitleName[printLanguage][3]}}:{{val['major'+ printLanguage +'Name']}}</span>  
                        <span  style="margin-left:10px;">{{printTitleName[printLanguage][4]}}:{{val['lengthOfSchooling'+ printLanguage +'Name']}}</span>
                        <span style="background:url('')"></span>
                        </div> 
                    </div>
                </div>
                <div  style="display: flex;">
                    <table width="100%" style="flex: 1 1 0%; font-size: 12px; border-width: 2px 1px 2px 2px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;">
                        <tr style="display: flex;height:16px;line-height:16px;">
                            <td :style="'text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][10]}}</td>
                            <td :style="'text-align:center;flex:1;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][6]}}</td>
                            <td :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][7]}}</td>
                            <td :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][8]}}</td>
                            <td :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][9]}}</td>
                        </tr>
                        <tr :style="'display: flex;height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'" v-for="(item,index) in val.leftTranscriptOfCourse"  :key="index">
                            <td :rowspan="item.rowSpan" :style="'text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'">{{item.itemIndex}}</td>
                            <td :rowspan="item.rowSpan" :style="item.term?'text-align:center;flex:1;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;':'text-align:left;flex:1;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'" ><div :style="'width:100%;height:100%;line-height:16px;'"  v-html="item['course'+printLanguage+'Name']"></div></td>
                            <td :rowspan="item.rowSpan" :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'">{{item.learnHour}}</td>
                            <td :rowspan="item.rowSpan" :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'">{{item.credit | showCredit}}</td>
                            <td :rowspan="item.rowSpan" :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'">{{item.score}}</td>
                        </tr>  
                    </table> 
                    <table width="100%" style="flex: 1 1 0%; font-size: 12px; border-width: 2px 1px 2px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;">
                        <tr style="display: flex;height:16px;line-height:16px;">
                            <td :style="'text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][10]}}</td>
                            <td :style="'text-align:center;flex:1;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][6]}}</td>
                            <td :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][7]}}</td>
                            <td :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][8]}}</td>
                            <td :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+lineHeight+'px;line-height:'+lineHeight+'px;'">{{printTitleName[printLanguage][9]}}</td>
                        </tr>
                        <tr :style="'display: flex;height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'" v-for="(item,index) in val.rightTranscriptOfCourse"  :key="index">
                            <td :rowspan="item.rowSpan" :style="'text-align:center;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'">{{item.itemIndex}}</td>
                            <td :rowspan="item.rowSpan" :style="item.term?'text-align:center;flex:1;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;':'text-align:left;flex:1;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial;height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'" ><div :style="'width:100%;height:100%;line-height:16px;'"  v-html="item['course'+printLanguage+'Name']"></div></td>
                            <td :rowspan="item.rowSpan" :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'">{{item.learnHour}}</td>
                            <td :rowspan="item.rowSpan" :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'">{{item.credit | showCredit}}</td>
                            <td :rowspan="item.rowSpan" :style="'text-align:right;border-width: 0px 1px 1px 0px; border-style: solid; border-color: rgb(0,0,0); border-image: initial; width: 30px; height:'+item.rowSpan*lineHeight+'px;line-height:'+item.rowSpan*lineHeight+'px;'">{{item.score}}</td>
                        </tr>  
                    </table>  
                </div> 
                <div style="line-height:20px;margin-top:10px;font-size:12px;"  >
                    <div style=" display: flex;  flex-wrap: wrap; justify-content: space-between;"><span v-html="printTitleName[printLanguage][11]"></span>　<span  v-html="printTitleName[printLanguage][5] +'　'+ nowTime(printLanguage)"></span></div>
                </div>
            </div>
        </div>
        </div>
    </div>
</template>
<script>
import util from '@/util';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
        whatsId:{
            type:String,
            default:'print-container'
        }
    },
    data(){
        return {
            logoUrl:'data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAFA3PEY8MlBGQUZaVVBfeMiCeG5uePWvuZHI////////////////////////////////////////////////////2wBDAVVaWnhpeOuCguv/////////////////////////////////////////////////////////////////////////wAARCAC1AJgDASIAAhEBAxEB/8QAGQABAQEBAQEAAAAAAAAAAAAAAAMEAgEF/8QAMRAAAgIBAwEGBQMFAQEAAAAAAQIAAxEEEjEhEzJBUWFxFCIjM3KBkaFCQ1Ji0WOx/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/ANsREBERAREQEREBETlnVBlmA94HUTxWDDKkEek9gIiICIiAiIgIiICIiBG61q2UKuc+ELqEJw2VPkZ5d9+r3lWRXGGUGB6CCMg5nsgdPtOanK+nhPO0tr+4m4eawNESaXVvw2D5GUgJlKdtqW3d1ZPUXF2KqcKP5ihbQdyDp68GBqSpazlOgPIlJ4pJHUYM8Z1QZZgIHUTOdRnpWhb1PQQK7bO/ZgeSwKPaid5hnykjqWJG1CATjJlUorThcnzMnqea/wAoGiIiAiIgIiIELvv1e8vIXffq95eAmVtSxfbWo5/eaTMK/QvG4dBA1dkHX6ijd5iRtRqUythwemDNQIIyDkTNrT0QQIVbQ2XBKjyE1HUJwgLHyAktI4DFD48S2nHyH8jA8xfZyRWP5nq6dActlj5mUZ1XvMBJNqkHdyxgd2IhQ7gMD+Jm0m7tcDu46z1+0tGbDsTy85ehNicYz4QKzPqua/ymiZ9VzX+UDRERAREQERECF336veXkLvv1e8vASF9efmC7h4j/AJLxAwLkH6Vhz/iehix2sqDMckHErqWKPkKOo5xxJUDfur8CM58jAlLVM1dTPk84A9ZJgVJBGCJRMPUa84OcjMBVWbrDuY+ZlWIqwKUBJ6bjICu0HorA+ksqABK2bqTkgQPalNj73O7H7fpNUlYXQYqTOJGvVHdiwDHn5QNcz6rmv8pomfVc1/lA0REQEREBERAz3ffq95okLvv1e8vASTXKtgQ8n+J1a/ZoW5PhJrRms7+rN1J8oFiARgjIgKF4AHtJUOSCjd5OhloHD1o/eXMz1adHUkk8kTXMyIzVEo21gxgRZCt3Z7zg8GeFHocEjg8+cqlLLYLLT4/uYsFz4rK9M97zgWW+tlzuA9DMb/VuOwcnpFydnYV5l9K6d3aA3n5wNI6CQ1XNf5TRM+q5r/KBoiIgIiICIiBC779XvKu6ou5jgSV336vee6hSQrAZ2nJEDl3W9Ci5DcgEcz0agBTvUhh0Ik7XNpBRHG3xxPFQ2I1hfr7eUCiN2e6yzoznosrXatmdvI5BmZGbeLGVnHGcSteXvNgUquMdfGBeS0/2z+RlZLT/AGz+RgcazIRSPAzkav5eq9ZoZQ6lWGQZmbSHPysMesCIzdd15M4BIOR0Im1a106MxOTjmY8HG7zMD6FT9pWG/eS1XNf5TnRN0Zf1nep/t/lAvERAREQERECF336veWkbvv1e8vAzlrLSwrwqjpk+MiqE1s4ONvTH/Zc1WKzGpwA3UgztKgtRQnOeTAihtqq3DBTnB5E0b1CbycDGZHsbCuw2DZ7dcRbS9hCghUXiBw+r6/IvTzM4r1DIMbQRnM6OkbwYGS7JyMhSRnHSBpGrQ8giDq0HAJmXs3/wb9p2unsbw2j1geWWvaQDx4ATq5ezrRPHkyy116ddzHJmWxzY5Y+MC+iHzMfSU1P9v8o0ibasn+qNT/b/ACgXiIgIiICInFjBEJJx0gQtctevZjcU5nfbuh+rXtHmI0q4qz4nmWIBGCMiBytqOcKwJnck9CMOgCnwIjTuXr+bkdDA6ssWtctMj6mxj8vyiVspe2zJICjiefB/7/xAiL7Qe+Z1XqGrGMA9cz19K693DSO0+RgaPjD/AID95y2rc8ACQnoUscAEwDMznLEkzqtAxyxwo5JlK9Kx6v8AKP5ndNa2EsR8oOFWB2b1GFrG8+AEnc1pCl68AHORNIRVOVUD2nuMjBgeIwdQynoZ1M2mIV3rz49BNMBERATO47TUqh7qjOJome09lqFsPdIwYF5Alrbmr3FVXy5MuCCMjiTspDncpKt5iBGmveWIdlwcDrKKDQoUYYseT0nK03KxIsAzz0gqclLbD14PhAo1pUfMmPLrmcB7gocgMpGcDkSbbnTJtX5c9POWBxpM/wCsCiMHUMODJ6f7Z/IzyiyvYqBuuODOK7Co2qu5ix8fWAWvtHsYNhg2BO6blK4YgNxidUoyKd2Msc9JNjp0UqQD7dYGiQ+GIUjtCByAJzWlhQfV2+k6NdxUgWgg+kCaAintFcgjkHgzTW2+tW4yJFdMcAWPlR/SJoAwMDiBHUrhRYOjKeZZTlQfMSGpfdiperE9ZdRhQPKB7ERATllDLhhkTqIGO2tqRurZtv8A8narcwyLQRNBAIweJA6bBzW5X0ge9g7d+1j7SZpRmKqGJzgseBPM2iwo1u0+BPjKKGqYl2LBuSBxAkqKyWnbx3ZYqx0gUA5xxOK+1rBC15DHIz4e87K3kdXA9AIHjIPhfmXDASJH08qSSOu7gCVLWWV9nsbcehJ4kwGD4dXYKegA6QL1ErSGsbqfOTuqVbN5GUPOPCdFHuI7QbEHh4me1vtzVb+hPiID4aojIzj0MfDY7ljLI2qqMDVZz/SDOrO0qXJu/Txgd9neOLQfcSR7VrBX2mfPHhO1ptsUF7CAfCXrqWsYUfrA5qpWvqOp8zKxEBERAREQEREDiytbBhh+sj8O69y0gTTEDP2Nx5uP6R8KDy7EzREDP2Nqda7CfQx9e3/zE0RAz/Cg8uxM8bSsRjtCR6zTEDINK68WAewlK9OqncxLH1l4gIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiIH//Z',
            // logoUrl:'img/stdx_log.png',
            printTitleName:{
                Cn:['汕头大学医学院学生成绩单','学号','姓名','专业','学制','汕头大学医学院教务处  学籍科  日期:','课程内容','学时','学分','成绩','序号','注:标有\'*\'为选修课'],
                En:['STUDENTS\' ACADEMIC RECORDS <br/> OF SHANTOU UNIVERSITY MEDICAL COLLEGE','No','Name','Speciality','Years of Study','The Student Status Section Of Dean\'s Office Of Shantou University Medical College  Date:','Courses','HRS','CRT','GRD','No','Note: Marked \'*\' as an Optional Course&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;HRS is Hours  CRT is Credits  GRD is Grades']
            },
            lineHeight:16,
            // printLanguage:'Cn',
        }
    },
    filters: { 
        showCredit(val) {
            if (val <= 0) return null;
            return val;
        }
    },
    mounted(){
        this.getImage(this.logoUrl,'img')
    },
    methods:{
         getImage:function (url,imgClass) {
            // var xhr = new XMLHttpRequest();
            // xhr.open('get', url, true);
            // xhr.responseType = 'blob';
            // xhr.onload = function () {
            //     if (this.status == 200) {
            //         Array.from(document.getElementsByClassName(imgClass)).map(item => {
            //             item.src = URL.createObjectURL(this.response)
            //         })
            //     }
            // };
            // xhr.send(null);
            Array.from(document.getElementsByClassName(imgClass)).map(item => {
                item.src = url + '?' + Math.random()
            })
        },
        nowTime(lan){
            if("Cn" === lan){
                return util.cnTime();
            }else{
                return util.enTime();
            }
        },
        exportPdf(){
            let _this = this
            html2canvas(document.querySelector('#export-container'), {
                scale: 1,
                background: "#fff",
                useCORS:true,
                allowTaint: true,
                imageTimeout:0,
                logging:false,
            }).then(function(canvas) {
                var contentWidth = canvas.width;
                var contentHeight = canvas.height;
                //一页pdf显示html页面生成的canvas高度;
                var pageHeight = Math.round(contentWidth / 595.28 * 841.89);
                //未生成pdf的html页面高度
                var leftHeight = Math.round(contentHeight / pageHeight) * pageHeight;
                // var leftHeight = contentHeight;
                //页面偏移
                var position = 0;
                //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
                var imgWidth = 595.28;
                var imgHeight = Math.round((595.28/contentWidth * contentHeight)/841.89) * 841.89;
                // var imgHeight =(parseInt(contentHeight / pageHeight) * 841.89)*(contentWidth / 595.28);
                var pageData = canvas.toDataURL('image/jpeg', 1.0);
                var pdf = new jsPDF('', 'pt', 'a4');
                //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
                //当内容未超过pdf一页显示的范围，无需分页
                var logoX = imgWidth - 75
                var x = (595.28 / contentWidth) * 75
                var y = (595.28 / contentWidth) * 85
                if (leftHeight <= pageHeight) {
                    pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight );
                    pdf.addImage(_this.logoUrl, 'JPEG', logoX, 0, x, y );
                } else {
                    while(leftHeight > 0) {
                        pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                        pdf.addImage(_this.logoUrl, 'JPEG', logoX, 0, x, y );
                        leftHeight -= pageHeight;
                        position -= 841.89;
                        //避免添加空白页
                        if(leftHeight > 0) {
                            pdf.addPage();
                        }
                    }
                }
                pdf.save("成绩单.pdf");
            });
        },
        cancelExport(){
            this.$emit('cancelExport')
        }
    }
}
</script>
<style scoped>
.page-container{
    position: absolute;
    /* width:100%;
    height:100%; */
    width: 21cm;
    /* min-height: 29.7cm; */
    left: 50%;
    transform: translateX(-50%)
}
.btn{
    display: flex;
    justify-content: flex-end;
}
.page{
    width: 210mm;
    height:297mm;
    max-width: 210mm;
    max-height:297mm;
}
@page {
    size: A4;
    margin: 0;
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
        height: 29.7cm;
        margin: 0 auto;
        border: 1px #D3D3D3 solid;
        border-radius: 5px;
        background: white;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    }

    .subpage {
        height: 100%;

    }
}

</style>