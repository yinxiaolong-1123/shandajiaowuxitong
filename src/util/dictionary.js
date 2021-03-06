export default {
    'sex_code':{
        remark:'性别代码',
        type:'sex-code',
        noList:['shortName'],
    },
    'country_code':{
        remark:'国家/地区',
        type:'country-code',
    },
    'admissions_season':{
        remark:'招生季节',
        type:'admissions-season',
    },
    'course_category':{
        remark:'课程类别',
        type:'course-category',
        noList:['shortName','enName'],
        extendList:[
            {label:'旧类别码',prop:'oldCode',type:'input'},
            {label:'旧类别名',prop:'oldName',type:'input'},
        ],
    },
    'course_nature':{
        remark:'课程性质',
        type:'course-nature',
        noList:['shortName'],
    },
    'educational_level':{
        remark:'学历层次',
        type:'educational-level',
    },
    'id_category':{
        remark:'证件类别',
        type:'ID-category',
    },
    'learning_form':{
        remark:'学习形式',
        type:'learning-form',
    },
    'organization_category':{
        remark:'组织类型',
        type:'organization-category',
        noList:['shortName'],
    },
    'place_category':{
        remark:'场地类型',
        type:'place-category',
        noList:['shortName','enName'],
    },
    'political_status':{
        remark:'政治面貌',
        type:'political-status',
    },
    'school_running':{
        remark:'办学类型',
        type:'school-running',
        noList:['shortName'],
    },
    'schooling_length':{
        remark:'学制维护',
        type:'schooling-length',
        noList:['shortName'],
    },
}
