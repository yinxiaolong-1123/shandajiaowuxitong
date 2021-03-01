const Mock=require('mockjs')
const Random = Mock.Random;
Mock.mock('/api/user',{
    'list|1-10':[{
        'id|+1':1,// 序号 属性值自动加 1，初始值为 1
        'businesscode':/\d{1,10}/,// 商户ID
        'proversion|1':['标准版','企业版','试用版'],// 产品版本 随机选取 1 个元素
        'storecode':/\d{1,10}/,// 门店编码
        'storename':'@cname',// 门店名称
        'status|1':['试用','使用','续用'],//状态 随机选取 1 个元素
        'effectdate':'@date("yyyy-MM-dd")',// 有效日期
    }],
    'userlist|1':[{
        'id|+1':9527,// 序号 属性值自动加 1，初始值为 1
        'uid':/\d{6,8}/,// 用户ID
        'username':'@cname',// 用户名称
        'title': '@title',
        'image': Random.image('200x200', '#50B347', '#FFF', 'Mock.js'),
        'statusdec|1':['启用','禁用'],//状态 随机选取 1 个元素
        'status|1':['0','1'],//状态 随机选取 1 个元素
        'effectdate':'@date("yyyy-MM-dd")',// 有效日期
        'date2': '@dateTime',
        // 手机号
        'phone': /^1[385][1-9]\d{8}/,
        // 链接
        // 'url': '@url("http")',
        // 邮箱
        'email': '@email',
        // 汉字
        'ctitle': '@ctitle(8)',
        'friends|2': ['jack', 'jim'] // 重复2次属性值生成一个新数组
    }]
});
Mock.mock('/api/role',{
    'role|8':[{
        'label|+1':1,// 序号 属性值自动加 1，初始值为 1
        'name|+1':[
            '教务管理员',
            '课程负责人',
            '学籍科',
            '教学科',
            '教学秘书',
            '授课老师',
            '系统管理员',
            '学生',
        ],
    }]
});
Mock.mock('/api/navlist',{
    'navlist|8':[{
        'name|+1':[
            '首页',
            '智能助教',
            '在线考试',
            '在线学习',
            'OSCE',
            '住院轮转',
            '实习生管理',
            '明日良医',
        ],
    }]
});
Mock.mock('/api/menulist',{
    'menulist|10':[{
        'id|+1':1,
        'name|+1':[
            '首页',
            '消息中心',
            '教务管理',
            '课程管理',
            '考试管理',
            '成绩管理',
            '人员管理',
            '异动管理',
            '基础数据',
            '报表查询',
        ],
        'url|+1':[
            '/index'
        ],
        'icon|+1':[
            'shouye',
            'xiaoxi',
            'jiaowu',
            'kecheng',
            'kaoshi',
            'chengji',
            'renyuan',
            'yidong',
            'jichu',
            'baobiao',
        ],
        'children|3':[
            {
                'id|+1':10,
                'name|+1':[
                    '国家管理',
                    '学生管理',
                    '学校维护',
                ],
                'url|+1':[
                    '/NationalManagement',
                    '/StudentManagement',
                    '/SchoolMaintenance',
                ]
            },
        ]
    }],
    'menurouter':[
        {
            path:'/NationalManagement',
            name:'NationalManagement',
            type:'baseData',
            meta:{
                title:'国家专业管理'
            }
        },
        {
            path:'/StudentManagement',
            name:'StudentManagement',
            type:'studentManagement',
            meta:{
                title:'学生管理'
            }
        },
        {
            path:'/SchoolMaintenance',
            name:'SchoolMaintenance',
            type:'baseData',
            meta:{
                title:'学校维护'
            }
        }
    ]
});


