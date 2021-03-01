import Vue from "vue";
import Router from "vue-router";
import login from "./views/login_page/login";
import Index from "./views/index";
Vue.use(Router);


export default new Router({
    routes: [{
            path: "/",
            name: "login",
            component: login
        },

        // { //调课管理-处理
        //     path: "/teaching_management/adjust_lesson_check",
        //     name: "adjust_lesson_check",
        //     component: (resolve) => require(["./views/teaching_management/children/adjust_lesson_check"], resolve)
        // },
        {
            path: "/index",
            component: Index,
            children: [
                /* 首页 */
                { //首页
                    path: "/login_page/index",
                    name: "index",
                    // component: require("./views/login_page/index").default
                    component: (resolve) => require(['./views/login_page/index'], resolve)
                },
                /* 教务管理 */
                { //授课形式维护
                    path: "/basic_management/teaching_management",
                    name: "teaching_management",
                    component: (resolve) => require(["./views/basic_management/teaching_management"], resolve)
                },
                { //培养方案
                    path: "/educational_admin/training_program",
                    name: "training_program",
                    component: (resolve) => require(["./views/educational_admin/training_program"], resolve)
                },
                { //课程详情
                    path: "/educational_admin/course_details",
                    name: "course_details",
                    component: (resolve) => require(["./views/educational_admin/children/course_details"], resolve)
                },
                
                { //培养方案明细维护
                    path: "/educational_admin/detailed_maintenance",
                    name: "detailed_maintenance",
                    component: (resolve) => require(["./views/educational_admin/detailed_maintenance"], resolve)
                },

                // 消息通知
                { //培养方案明细维护
                    path: "/message_center/messages",
                    name: "messages",
                    component: (resolve) => require(["./views/message_center/messages"], resolve)
                },

                { //教学任务管理
                    path: "/educational_admin/teaching_task",
                    name: "teaching_task",
                    component: (resolve) => require(["./views/educational_admin/teaching_task"], resolve)
                },
                { //课程内容库
                    path: "/educational_admin/course_content",
                    name: "course_content",
                    component: (resolve) => require(["./views/educational_admin/course_content"], resolve)
                },
                { // 老师优先级
                    path: "/educational_admin/teacher_priority",
                    name: "teacher_priority",
                    component: (resolve) => require(["./views/educational_admin/children/teacher_priority"], resolve)
                },
                { // 场地优先级
                    path: "/educational_admin/place_priority",
                    name: "place_priority",
                    component: (resolve) => require(["./views/educational_admin/children/place_priority"], resolve)
                },

                /*成绩管理*/
                //学年测评
                { //学年测评项目
                    path: "/achievement_manage/academic_year",
                    name: "academic_year",
                    component: (resolve) => require(["./views/achievement_manage/academic_year"], resolve)
                },
                { //学年测评关联课程
                    path: "/achievement_manage/academicyear_courses", //  代用
                    name: "academicyear_courses",
                    component: (resolve) => require(["./views/achievement_manage/children/academicyear_courses"], resolve)
                },
                { //学年测评方案
                    path: "/achievement_manage/academicyear_rogram",
                    name: "academicyear_rogram",
                    component: (resolve) => require(["./views/achievement_manage/academicyear_rogram"], resolve)
                },
                { //学年综合测评
                    path: "/achievement_manage/academicyear_comprehensive",
                    name: "academicyear_comprehensive",
                    component: (resolve) => require(["./views/achievement_manage/academicyear_comprehensive"], resolve)
                },
                { //学年综合测评(老师查询)
                    path: "/achievement_manage/academicyear_comprehensive_teacher",
                    name: "academicyear_comprehensive_teacher",
                    component: (resolve) => require(["./views/achievement_manage/academicyear_comprehensive_teacher"], resolve)
                },
                //毕业测评
                { //毕业测评项目
                    path: "/achievement_manage/graduation_assessment",
                    name: "graduation_assessment",
                    component: (resolve) => require(["./views/achievement_manage/graduation_assessment"], resolve)
                },
                { //毕业测评关联课程   
                    path: "/achievement_manage/graduation_courses",
                    name: "graduation_courses",
                    component: (resolve) => require(["./views/achievement_manage/children/graduation_courses"], resolve)
                },
                { //毕业测评方案
                    path: "/achievement_manage/graduation_rogram",
                    name: "graduation_rogram",
                    component: (resolve) => require(["./views/achievement_manage/graduation_rogram"], resolve)
                },
                { //毕业综合测评
                    path: "/achievement_manage/graduation_comprehensive",
                    name: "graduation_comprehensive",
                    component: (resolve) => require(["./views/achievement_manage/graduation_comprehensive"], resolve)
                },
                //成绩管理
                { //缓考申请录入
                    path: "/achievement_manage/application_entry",
                    name: "application_entry",
                    component: (resolve) => require(["./views/achievement_manage/application_entry"], resolve)
                },
                { //补缓考安排
                    path: "/achievement_manage/makeup_exam_plan",
                    name: "makeup_exam_plan",
                    component: (resolve) => require(["./views/achievement_manage/makeup_exam_plan"], resolve)
                },
                //成绩修改
                { //成绩修改申请
                    path: "/achievement_manage/modify_application",
                    name: "modify_application",
                    component: (resolve) => require(["./views/achievement_manage/modify_application"], resolve)
                },
                { //成绩修改审批
                    path: "/achievement_manage/modify_verify",
                    name: "modify_verify",
                    component: (resolve) => require(["./views/achievement_manage/modify_verify"], resolve)
                },
                //成绩管理
                { //补考名单管理
                    path: "/achievement_manage/repair_management",
                    name: "repair_management",
                    component: (resolve) => require(["./views/achievement_manage/repair_management"], resolve)
                },
                { //补考名单查询
                    path: "/achievement_manage/repair_query",
                    name: "repair_query",
                    component: (resolve) => require(["./views/achievement_manage/repair_query"], resolve)
                },
                { //补缓考成绩录入
                    path: "/achievement_manage/relieve_score",
                    name: "relieve_score",
                    component: (resolve) => require(["./views/achievement_manage/relieve_score"], resolve)
                },
                { //成绩录入
                    path: "/achievement_manage/resultInput_entry",
                    name: "resultInput_entry",
                    component: (resolve) => require(["./views/achievement_manage/resultInput_entry"], resolve)
                },

                { //形成性成绩管理
                    path: "/achievement_manage/formativeScoremanagement",
                    name: "formativeScoremanagement",
                    component: (resolve) => require(["./views/achievement_manage/formativeScoremanagement"], resolve),
                },
                { //形成性成绩管理/新增
                    path: "/achievement_manage/addachievements",
                    name: "addachievements",
                    component: (resolve) => require(["./views/achievement_manage/children/addachievements"], resolve)
                },
                { //科研创新成绩录入
                    path: "/achievement_manage/scientific_created",
                    name: "scientifiCreated",
                    component: (resolve) => require(["./views/achievement_manage/children/scientific_created"], resolve)
                },

                /*教学管理*/
                { //例外数据管理
                    path: "/teaching_management/exception_data",
                    name: "exception_data",
                    component: (resolve) => require(["./views/teaching_management/exception_data"], resolve)
                },
                { //确认的教学任务
                    path: "/teaching_management/confirm_teaching",
                    name: "confirm_teaching",
                    component: (resolve) => require(["./views/teaching_management/confirm_teaching"], resolve)
                },
                { //排课学期课程库
                    path: "/teaching_management/class_course",
                    name: "class_course",
                    component: (resolve) => require(["./views/teaching_management/class_course"], resolve)
                },
                { //排课学期课程库-内容库
                    path: "/teaching_management/course_content",
                    name: "teaching_course_content",
                    component: (resolve) => require(["./views/teaching_management/children/course_content"], resolve)
                },
                { //通过日历查课表
                    path: "/teaching_management/class_course_bydata",
                    name: "class_course_bydata",
                    component: (resolve) => require(["./views/teaching_management/class_course_bydata"], resolve)
                },

                { //上课班管理
                    path: "/teaching_management/class_management",
                    name: "class_management",
                    component: (resolve) => require(["./views/teaching_management/class_management"], resolve)
                },

                { //测试
                    path: "/teaching_management/testwang",
                    name: "testwang",
                    component: (resolve) => require(["./views/teaching_management/testwang"], resolve)
                },
                
                { //上课班管理关联学生
                    path: "/teaching_management/associate_students",
                    name: "associate_students",
                    component: (resolve) => require(["./views/teaching_management/children/associate_students"], resolve)
                },
                { //上课班管理分组关联学生
                    path: "/teaching_management/group_students",
                    name: "group_students",
                    component: (resolve) => require(["./views/teaching_management/children/group_students"], resolve)
                },
                { //上课班管理/分组设置
                    path: "/teaching_management/group_management",
                    name: "group_management",
                    component: (resolve) => require(["./views/teaching_management/children/group_management"], resolve)
                },
                { //上课组管理
                    path: "/teaching_management/class_group",
                    name: "class_group",
                    component: (resolve) => require(["./views/teaching_management/class_group"], resolve)
                },
                { //上课组管理关联学生
                    path: "/teaching_management/class_student",
                    name: "class_student",
                    component: (resolve) => require(["./views/teaching_management/children/class_student"], resolve)
                },
                { //课程表管理
                    path: "/teaching_management/curriculum_management",
                    name: "curriculum_management",
                    component: (resolve) => require(["./views/teaching_management/curriculum_management"], resolve)
                },

                { //学生冲突检查
                    path: "/teaching_management/studentsConflictReport",
                    name: "studentsConflictReport",
                    component: (resolve) => require(["./views/teaching_management/studentsConflictReport"], resolve)
                },


                { //课程表管理录入
                    path: "/teaching_management/enter_curriculum",
                    name: "enter_curriculum",
                    component: (resolve) => require(["./views/teaching_management/children/enter_curriculum"], resolve)
                },
                { //进度表撤回设置
                    path: "",
                    name: "",
                    component: (resolve) => require(["./views/"], resolve)
                },
                { //进度表管理
                    path: "/teaching_management/schedule_management",
                    name: "schedule_management",
                    component: (resolve) => require(["./views/teaching_management/schedule_management"], resolve)
                },
                { //查看进度表
                    path: "/teaching_management/schedule_view",
                    name: "schedule_view",
                    component: (resolve) => require(["./views/teaching_management/children/schedule_view"], resolve)
                },
                { //进度表填报
                    path: "/teaching_management/progress_statement",
                    name: "progress_statement",
                    component: (resolve) => require(["./views/teaching_management/progress_statement"], resolve)
                },
                { //进度表填报明细
                    path: "/teaching_management/fill_details",
                    name: "fill_details",
                    component: (resolve) => require(["./views/teaching_management/fill_details"], resolve)
                },
                { //进度表填报明细查看
                    path: "/teaching_management/submission_filled",
                    name: "submission_filled",
                    component: (resolve) => require(["./views/teaching_management/submission_filled"], resolve)
                },
                { //冲突检查
                    path: "/teaching_management/conflict_check",
                    name: "conflict_check",
                    component: (resolve) => require(["./views/teaching_management/conflict_check"], resolve)
                },
                { //课程表查询(老师)
                    path: "/teaching_management/course_table_query",
                    name: "course_table_query",
                    component: (resolve) => require(["./views/teaching_management/course_table_query"], resolve)
                },
                { //课程表查询(学生)
                    path: "/teaching_management/student_course_table",
                    name: "course_table_query",
                    component: (resolve) => require(["./views/teaching_management/student_course_table"], resolve)
                },
                { //场地使用情况
                    path: "/teaching_management/site_status",
                    name: "site_status",
                    component: (resolve) => require(["./views/teaching_management/site_status"], resolve)
                },
                { //场地预约
                    path: "/teaching_management/site_status_order",
                    name: "site_status_order",
                    component: (resolve) => require(["./views/teaching_management/site_status_order"], resolve)
                },
                { //场地使用情况/场地学期使用情况
                    path: "/teaching_management/site_status_term",
                    name: "site_status_term",
                    component: (resolve) => require(["./views/teaching_management/site_status_term"], resolve)
                },
                { //场地使用情况/场地学期使用情况
                    path: "/teaching_management/site_status_term_2",
                    name: "site_status_term_2",
                    component: (resolve) => require(["./views/teaching_management/site_status_term_2"], resolve)
                },
                { //预约记录查询
                    path: "/teaching_management/order_records",
                    name: "order_records",
                    component: (resolve) => require(["./views/teaching_management/order_records"], resolve)
                },
                { //我的调课
                    path: "/teaching_management/my_class",
                    name: "my_class",
                    component: (resolve) => require(["./views/teaching_management/my_class"], resolve)
                },
                { //调课记录查询
                    path: "/teaching_management/adjust_record",
                    name: "adjust_record",
                    component: (resolve) => require(["./views/teaching_management/adjust_record"], resolve)
                },
                { //我的调课/申请调课
                    path: "/teaching_management/apply_class",
                    name: "apply_class",
                    component: (resolve) => require(["./views/teaching_management/apply_class"], resolve)
                },
                { //调课管理
                    path: "/teaching_management/adjust_lesson",
                    name: "adjust_lesson",
                    component: (resolve) => require(["./views/teaching_management/adjust_lesson"], resolve)
                },
                { //调课进度表
                    path: "/teaching_management/adjustment_schedule",
                    name: "adjustment_schedule",
                    component: (resolve) => require(["./views/teaching_management/adjustment_schedule"], resolve)
                },
                { //课程表查询
                    path: "/teaching_management/curriculum_query",
                    name: "curriculum_query",
                    component: (resolve) => require(["./views/teaching_management/curriculum_query"], resolve)
                },
                { //自动排课/课表预览
                    path: "/teaching_management/timetablepreview",
                    name: "timetablepreview",
                    component: (resolve) => require(["./views/teaching_management/timetablepreview"], resolve)
                },

                // 可视化排课
                { //可视化排课-列表
                    path: "/teaching_management/visualized_course/visualized_list",
                    name: "visualized_list",
                    component: (resolve) => require(["./views/teaching_management/visualized_course/visualized_list"], resolve)
                },
                { //可视化排课-录入
                    path: "/teaching_management/visualized_course/write_down",
                    name: "write_down",
                    component: (resolve) => require(["./views/teaching_management/visualized_course/write_down"], resolve)
                },
                { //可视化排课-生成进度表
                    path: "/teaching_management/visualized_course/schedule",
                    name: "schedule",
                    component: (resolve) => require(["./views/teaching_management/visualized_course/schedule"], resolve)
                },
                // { //排课设置--优先级设置 --- p
                //     path: "/teaching_management/setting_priority",
                //     name: "setting_priority",
                //     component: (resolve) => require(["./views/teaching_management/arrange_course/setting_priority"], resolve)
                // },
                { //排课设置--课程约束设置
                    path: "/teaching_management/course_constraint",
                    name: "course_constraint",
                    component: (resolve) => require(["./views/teaching_management/arrange_course/course_constraint"], resolve)
                },
                { //排课设置--老师约束设置
                    path: "/teaching_management/teacher_constraint",
                    name: "teacher_constraint",
                    component: (resolve) => require(["./views/teaching_management/arrange_course/teacher_constraint"], resolve)
                },
                { //排课设置--场地不可排设置
                    path: "/teaching_management/place_not_arrange",
                    name: "place_not_arrange",
                    component: (resolve) => require(["./views/teaching_management/arrange_course/place_not_arrange"], resolve)
                },
                { //排课设置--时间不可排设置
                    path: "/teaching_management/time_not_arrange",
                    name: "time_not_arrange",
                    component: (resolve) => require(["./views/teaching_management/arrange_course/time_not_arrange"], resolve)
                },
                { //自动排课--自动排课
                    path: "/teaching_management/automatic_arrange",
                    name: "automatic_arrange",
                    component: (resolve) => require(["./views/teaching_management/automatic_arrange_course/automatic_arrange"], resolve)
                },
                { //自动排课--课表预览
                    path: "/teaching_management/class_schedule_preview",
                    name: "class_schedule_preview",
                    component: (resolve) => require(["./views/teaching_management/automatic_arrange_course/class_schedule_preview"], resolve)
                },
                { //教学管理--自动排课--自动创建上课班
                    path: "/teaching_management/automatic_placement",
                    name: "automatic_placement",
                    component: (resolve) => require(["./views/teaching_management/automatic_placement"], resolve)
                },
                { //教学管理--学时统计
                    path: "/teaching_management/period_statistic",
                    name: "period_statistic",
                    component: (resolve) => require(["./views/teaching_management/period_statistic"], resolve)
                },
                { //教学管理--学时统计--详细统计信息
                    path: "/teaching_management/period_statistic_detail",
                    name: "period_statistic_detail",
                    component: (resolve) => require(["./views/teaching_management/period_statistic_detail"], resolve)
                },

                /*个人中心 */
                {//课表查询
                    name: "stu_schedule",
                    path: "/personal_center/stu_schedule",
                    component: (resolve) => require(["./views/personal_center/stu_schedule"],resolve)
                },
                {//基本信息
                    path: "/personal_center/basic_information",
                    name: "basic_information",
                    component: (resolve) => require(["./views/personal_center/basic_information"],resolve)
                },
                {//课程成绩查询
                    path: "/personal_center/stu_course_result_enquiry",
                    name: "stu_course_result_enquiry",
                    component: (resolve) => require(["./views/personal_center/stu_course_result_enquiry"],resolve)
                },
                { //课程表查询(学生pc)
                    path: "/personal_center/stu_course_table_pc",
                    name: "course_table_pc",
                    component: (resolve) => require(["./views/personal_center/stu_course_table_pc"], resolve)
                },
                { // 选修课pc
                    path: "/personal_center/stu_elective_course",
                    name: "stu_elective_course",
                    component: (resolve) => require(["./views/personal_center/stu_elective_course"], resolve)
                },
                /*学生管理*/
                { //学生管理
                    path: "/student_management",
                    name: "student_management",
                    component: (resolve) => require(["./views/student_management/student_management"], resolve)
                },
                { //学生照片导入
                    path: "/student_management/uploading_picture",
                    name: "uploading_picture",
                    component: (resolve) => require(["./views/student_management/uploading_picture"], resolve)
                },
                { //学生核对信息设置
                    path: "/student_management/verify_set",
                    name: "verify_set",
                    component: (resolve) => require(["./views/student_management/verify_set"], resolve)
                },
                { //学籍核对管理
                    path: "/student_management/verify_manage",
                    name: "verify_manage",
                    component: (resolve) => require(["./views/student_management/verify_manage"], resolve)
                },
                { //学籍核对管理
                    path: "/student_management/add_student",
                    name: "add_student",
                    component: (resolve) => require(["./views/student_management/add_student"], resolve)
                },
                { //学生信息核对修改头部
                    path: "/student_management/verify_student",
                    name: "verify_student",
                    component: (resolve) => require(["./views/student_management/verify_student"], resolve)
                },
                { //学籍异动
                    path: "/student_management/school_rool_change",
                    name: "school_rool_change",
                    component: (resolve) => require(["./views/student_management/school_rool_change"], resolve)
                },
                { //批量成绩认定
                    path: "/student_management/grade_ide",
                    name: "grade_ide",
                    component: (resolve) => require(["./views/student_management/grade_ide"], resolve)
                },
                { //毕业管理
                    path: "/student_management/graduate_management",
                    name: "graduate_management",
                    component: (resolve) => require(["./views/student_management/graduate_management"], resolve)
                },
                { //学位管理
                    path: "/student_management/degree_management",
                    name: "degree_management",
                    component: (resolve) => require(["./views/student_management/degree_management"], resolve)
                },
                // { //学生信息核对修改主题信息
                //     path: "/student_management/add_student",
                //     name: "add_student",
                //     component: (resolve) => require(["./views/student_management/add_student"], resolve)
                // },

                /*教职工*/
                { //教职工
                    path: "/teaching_staff",
                    name: "teaching_staff",
                    component: (resolve) => require(["./views/base_data/teaching_staff"], resolve)
                },

                /*基础数据*/
                /*属性类*/
                { //汉字拼音库
                    path: "",
                    name: "",
                    component: (resolve) => require(["./views/"], resolve)
                },
                { //国家代码
                    path: "/country-code",
                    name: "country-code",
                    component: (resolve) => require(["./views/platform_management/dictionary_management"], resolve)
                },
                { //民族代码
                    path: "/nation-code",
                    name: "nation-code",
                    component: (resolve) => require(["./views/platform_management/dictionary_management"], resolve)
                },
                { //性别维护
                    path: "/sex-code",
                    name: "sex-code",
                    component: (resolve) => require(["./views/platform_management/dictionary_management"], resolve)
                },
                { //办学类型
                    path: "/school-running",
                    name: "school-running",
                    component: (resolve) => require(["./views/platform_management/dictionary_management"], resolve)
                },
                { //政治面貌
                    path: "/political-status",
                    name: "political-status",
                    component: (resolve) => require(["./views/platform_management/dictionary_management"], resolve)
                },
                { //证件类别
                    path: "/ID-category",
                    name: "ID-category",
                    component: (resolve) => require(["./views/platform_management/dictionary_management"], resolve)
                },
                { //省市区
                    path: "/provincial_area",
                    name: "provincial_area",
                    component: (resolve) => require(["./views/platform_management/provincial_area"], resolve)
                },
                /*行政类*/
                { //学校维护
                    path: "/base_data/school_maintenance",
                    name: "school_maintenance",
                    component: (resolve) => require(["./views/base_data/school_maintenance"], resolve)
                },
                { //院系维护
                    path: "/basic_management/department_maintenance",
                    name: "department_maintenance",
                    component: (resolve) => require(["./views/basic_management/department_maintenance"], resolve)
                },
                { //部门管理
                    path: "/department_management",
                    name: "department_management",
                    component: (resolve) => require(["./views/platform_management/organizational/department_management"], resolve)
                },
                { //组织类型
                    path: "/organization-category",
                    name: "organization-category",
                    component: (resolve) => require(["./views/platform_management/dictionary_management"], resolve)
                },
                /*专业类*/
                { //学历层次
                    path: "/educational-level",
                    name: "educational-level",
                    component: (resolve) => require(["./views/platform_management/dictionary_management"], resolve)
                },
                { //学位类别
                    path: "/degree_category",
                    name: "degree_category",
                    component: (resolve) => require(["./views/platform_management/degree_category"], resolve)
                },
                { //学习形式
                    path: "/learning-form",
                    name: "learning-form",
                    component: (resolve) => require(["./views/platform_management/dictionary_management"], resolve)
                },
                { //招生季节
                    path: "/admissions-season",
                    name: "admissions-season",
                    component: (resolve) => require(["./views/platform_management/dictionary_management"], resolve)
                },
                { //专业门类
                    path: "/professional_category",
                    name: "professional_category",
                    component: (resolve) => require(["./views/platform_management/professional_category"], resolve)
                },
                { //专业代码
                    path: "/professional_code",
                    name: "professional_code",
                    component: (resolve) => require(["./views/platform_management/professional_code"], resolve)
                },
                { //学制维护
                    path: "/schooling-length",
                    name: "schooling-length",
                    component: (resolve) => require(["./views/platform_management/dictionary_management"], resolve)
                },
                { //校内专业维护
                    path: "/school_major",
                    name: "school_major",
                    component: (resolve) => require(["./views/basic_management/school_major"], resolve)
                },
                /*课程类*/
                { //课程类别
                    path: "/course-category",
                    name: "course-category",
                    component: (resolve) => require(["./views/platform_management/dictionary_management"], resolve)
                },
                { //课程性质
                    path: "/course-nature",
                    name: "course-nature",
                    component: (resolve) => require(["./views/platform_management/dictionary_management"], resolve)
                },
                { //课程库
                    path: "/base_data/course_library",
                    name: "course_library",
                    component: (resolve) => require(["./views/base_data/course_library"], resolve)
                },
                { //课程平台库
                    path: "/base_data/course_platform",
                    name: "course_platform",
                    component: (resolve) => require(["./views/base_data/course_platform"], resolve)
                },
                { //课程内容状态报告  新增页面
                    path: "/base_data/course_content_status_report",
                    name: "course_content_status_report",
                    component: (resolve) => require(["./views/base_data/course_content_status_report"], resolve)
                },
                /*场地类*/
                { //场地类型
                    path: "/place-category",
                    name: "place-category",
                    component: (resolve) => require(["./views/platform_management/dictionary_management"], resolve)
                },
                { //楼宇维护
                    path: "/base_data/building_manage",
                    name: "building_manage",
                    component: (resolve) => require(["./views/base_data/building_manage"], resolve)
                },
                { //楼栋距离 
                    path: "/base_data/calculate_building_distance",
                    name: "calculate_building_distance",
                    component: (resolve) => require(["./views/base_data/calculate_building_distance"], resolve)
                },
                { //场地维护
                    path: "/base_data/site_manage",
                    name: "site_manage",
                    component: (resolve) => require(["./views/base_data/site_manage"], resolve)
                },
                { //校区维护
                    path: "/base_data/campus_manage",
                    name: "campus_manage",
                    component: (resolve) => require(["./views/base_data/campus_manage"], resolve)
                },
                /*时间类*/
                { //学期管理
                    path: "/base_data/semester_management",
                    name: "semester_management",
                    component: (resolve) => require(["./views/base_data/semester_management"], resolve)
                },
                { //节假日设置
                    path: "/base_data/holiday_manage",
                    name: "holiday_manage",
                    component: (resolve) => require(["./views/base_data/holiday_manage"], resolve)
                },
                { //课节管理
                    path: "/base_data/periods_management",
                    name: "periods_management",
                    component: (resolve) => require(["./views/base_data/periods_management"], resolve)
                },
                /*班级类*/
                { //行政班管理
                    path: "/base_data/administrative_class",
                    name: "administrative_class",
                    component: (resolve) => require(["./views/base_data/administrative_class"], resolve)
                },
                /*数据同步*/
                {
                    path: "/synchronous_data",
                    name: "synchronous_data",
                    component: (resolve) => require(["./views/base_data/synchronous_data"], resolve)
                },

                /*成绩管理*/

                { // 成绩管理---基础设置---成绩计分方式       1   OK
                    path: "/achievement_manage/performance_scoring",
                    name: "performance_scoring",
                    component: (resolve) => require(["./views/achievement_manage/basic_setting/performance_scoring"], resolve)
                },
                { //成绩管理---基础设置---成绩类型开关设置     2   OK
                    path: "/achievement_manage/performance_type",
                    name: "performance_type",
                    component: (resolve) => require(["./views/achievement_manage/basic_setting/performance_type"], resolve)
                },
                { //成绩管理---基础设置---学生考试状态         3   OK
                    path: "/achievement_manage/student_examination_status",
                    name: "student_examination_status",
                    component: (resolve) => require(["./views/achievement_manage/basic_setting/student_examination_status"], resolve)
                },
                { //成绩管理---基础设置---考试类型              4   OK
                    path: "/achievement_manage/examination_type",
                    name: "examination_type",
                    component: (resolve) => require(["./views/achievement_manage/basic_setting/examination_type"], resolve)
                },
                { //成绩管理---基础设置---考试类型关联课程        5  OK
                    path: "/achievement_manage/examination_type_curriculum",
                    name: "examination_type_curriculum",
                    component: (resolve) => require(["./views/achievement_manage/basic_setting/examination_type_curriculum"], resolve)
                },
                { //成绩管理---基础设置---课程模型定义            6    OK
                    path: "/achievement_manage/curriculum_model_definition",
                    name: "curriculum_model_definition",
                    component: (resolve) => require(["./views/achievement_manage/basic_setting/curriculum_model_definition"], resolve)
                },
                { //成绩管理---基础设置---课程阶段成绩模型 （ 6：按方案维护跳转页面）    7 OK
                    path: "/achievement_manage/achievement_model_proportion",
                    name: "achievement_model_proportion",
                    component: (resolve) => require(["./views/achievement_manage/basic_setting/achievement_model_proportion"], resolve)
                },

                { //  成绩管理---CET资格--- CET报名资格定义        8     OK
                    path: "/achievement_manage/enrolment_qualification_definition",
                    name: "enrolment_qualification_definition",
                    component: (resolve) => require(["./views/achievement_manage/cet_qualifications/enrolment_qualification_definition"], resolve)
                }, { // 成绩管理---CET资格---  CET报名资格查询      9    ok 
                    path: "/achievement_manage/enrolment_qualification_query",
                    name: "enrolment_qualification_query",
                    component: (resolve) => require(["./views/achievement_manage/cet_qualifications/enrolment_qualification_query"], resolve)
                }, { // 成绩管理----CET资格---国家考试最高分查询     10   ok
                    path: "/achievement_manage/highest_score_query",
                    name: "highest_score_query",
                    component: (resolve) => require(["./views/achievement_manage/cet_qualifications/highest_score_query"], resolve)
                }, { //成绩管理---CET资格---国家考毕业归档           11   ok
                    path: "/achievement_manage/national_examination_archive",
                    name: "national_examination_archive",
                    component: (resolve) => require(["./views/achievement_manage/cet_qualifications/national_examination_archive"], resolve)
                },
                { //成绩管理---成绩记载表管理                         12 OK
                    path: "/achievement_manage/achievement_list_administration",
                    name: "achievement_list_administration",
                    component: (resolve) => require(["./views/achievement_manage/achievement_list_administration"], resolve),
                },
                { //成绩管理---交换生成绩录入                         
                    path: "/achievement_manage/exchange_student_grade_entring",
                    name: "exchange_student_grade_entring",
                    component: (resolve) => require(["./views/achievement_manage/exchange_student_grade_entring"], resolve)
                },
                { //成绩管理---成绩报表---不及格成绩查询      failed_grade_query           13  OK
                    path: "/achievement_manage/failed_grade_query",
                    name: "failed_grade_query",
                    component: (resolve) => require(["./views/achievement_manage/achievement_list/failed_grade_query"], resolve)
                },
                { //成绩管理---成绩报表---补考记录成绩查询     remedial_record_query          14
                    path: "/achievement_manage/remedial_record_query",
                    name: "remedial_record_query",
                    component: (resolve) => require(["./views/achievement_manage/achievement_list/remedial_record_query"], resolve)
                },
                { // 成绩管理---成绩报表---学生成绩查询      student_achievement                15
                    path: "/achievement_manage/student_achievement",
                    name: "student_achievement",
                    component: (resolve) => require(["./views/achievement_manage/achievement_list/student_achievement"], resolve)
                },
                { // 成绩管理---成绩报表---学生成绩查询      student_achievement                15
                    path: "/achievement_manage/course_Achienements",
                    name: "course_Achienements",
                    component: (resolve) => require(["./views/achievement_manage/achievement_list/course_Achienements"], resolve)
                },
                { // 成绩管理---成绩报表---学生成绩打印      student_score_print                
                    path: "/achievement_manage/student_score_print",
                    name: "student_score_print",
                    component: (resolve) => require(["./views/achievement_manage/achievement_list/student_score_print"], resolve)
                },
                { // 成绩管理---成绩报表---课程成绩查询      course_result_enquiry                
                    path: "/achievement_manage/course_result_enquiry",
                    name: "course_result_enquiry",
                    component: (resolve) => require(["./views/achievement_manage/achievement_list/course_result_enquiry"], resolve)
                },
                {   //成绩管理-历史成绩导入
                    path: "/achievement_manage/historical_score_import",
                    name: "historical_score_import",
                    component: (resolve) => require(["./views/achievement_manage/historical_score_import"], resolve)
                },


                { // 报表管理---  高基报表  11
                    path: "/report_management/high_base_report",
                    name: "high_base_report",
                    component: (resolve) => require(["./views/report_management/high_base_report"], resolve)
                },
                { //报表管理 --- 培养方案报表  22
                    path: "/report_management/training_plan_report",
                    name: "training_plan_report",
                    component: (resolve) => require(["./views/report_management/training_plan_report"], resolve)
                },
                { //报表管理 --- 培养方案课程报表  33
                    path: "/report_management/training_plan_curriculum_report",
                    name: "training_plan_curriculum_report",
                    component: (resolve) => require(["./views/report_management/training_plan_curriculum_report"], resolve)
                },
                { //报表管理 --- 学生籍报表  55
                    path: "/report_management/student_report",
                    name: "student_report",
                    component: (resolve) => require(["./views/report_management/student_report"], resolve)
                },
                { //报表管理 --- 学期教学任务 44
                    path: "/report_management/teaching_task_report",
                    name: "teaching_task_report",
                    component: (resolve) => require(["./views/report_management/teaching_task_report"], resolve)
                },
                { //学生管理 --- 学生信息核对管理111
                    path: "/report_management/student_info_management",
                    name: "student_info_management",
                    component: (resolve) => require(["./views/report_management/student_info_management"], resolve)
                },
                { //学生管理 --- 学生信息核对管理--学生信息核对修改
                    path: "/report_management/student_info_modify",
                    name: "student_info_modify",
                    component: (resolve) => require(["./views/report_management/student_info_modify"], resolve)
                },
                { //学生管理 --- 学籍核对222
                    path: "/report_management/my_info_modify",
                    name: "my_info_modify",
                    component: (resolve) => require(["./views/report_management/my_info_modify"], resolve)
                },

                { //  录入-校内课程成绩
                    path: "/achievement_manage/entering_course",
                    name: "entering_course",
                    component: (resolve) => require(["./views/achievement_manage/entering_course"], resolve)
                },
                { // 录入-德育成绩
                    path: "/achievement_manage/entering_moral",
                    name: "entering_moral",
                    component: (resolve) => require(["./views/achievement_manage/entering_moral"], resolve)
                },
                { // 录入-国家考试成绩
                    path: "/achievement_manage/entering_state_examination",
                    name: "entering_state_examination",
                    component: (resolve) => require(["./views/achievement_manage/entering_state_examination"], resolve)
                },
                { // 录入-教学科成绩
                    path: "/achievement_manage/entering_teaching",
                    name: "entering_teaching",
                    component: (resolve) => require(["./views/achievement_manage/entering_teaching"], resolve)
                },




                /*权限管理*/
                { //角色权限
                    path: "/character_authority",
                    name: "character_authority",
                    component: (resolve) => require(["./views/platform_management/organizational/character_authority"], resolve)
                },
                { //人员权限
                    path: "/human_authority",
                    name: "human_authority",
                    component: (resolve) => require(["./views/platform_management/organizational/human_authority"], resolve)
                },
                { //自动排课
                    path: "/automatic_sort",
                    name: "automatic_sort",
                    component: (resolve) => require(["./views/automatic_sort/automatic_sort"], resolve)
                },
                { //自动排课
                    path: "/add_new",
                    name: "add_new",
                    component: (resolve) => require(["./views/automatic_sort/add_new"], resolve)
                }
            ]
        }
    ]
});