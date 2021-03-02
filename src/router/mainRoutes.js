import Vue from 'vue'
import Router from 'vue-router'
//使用模块化机制编程，導入Vue和VueRouter，要调用 Vue.use(VueRouter)
Vue.use(Router)
import login from "../components/login/login";
import homepage from "../components/homepage/homepage";
import mainPage from "../components/homepage/mainPage";
import courseView from "../components/teacher_course/courseView";
import addCourse from "../components/teacher_course/addCourse";
import alterPassword from "../components/teacher_course/alterPassword";
import courseProgress from "../components/teacher_course/courseProgress";
import studentAdmin from "../components/admin_course/studentAdmin";

import courseAudit from "../components/admin_course/course_audit";

import listCourse from "../components/student_course/listCourse";
import singleCourse from "../components/student_course/singleCourse";
import singleCourseSub from "../components/student_course/singleCourseSub";
import singleCourseSub2 from "../components/student_course/singleCourseSub2";
import singleCourseSub3 from "../components/student_course/singleCourseSub3";
import courseCheck from "../components/admin_course/course_check";



const router = new Router({
    routes:[
        {
            path:'/', //在一加载就默认跳转
            name:'login',
            components:{
            default:login,
            },
        },
        { //主页面
            path:'/homepage',
            name:'homepage',
            components:{
                default:homepage,
            },
            children:[ //主页的子路由，即主页的main里面显示的内容
                { //主页视图
                    path: '/',
                    name:'mainPage',
                    components:{
                        default:mainPage
                    }
                },
                { //教师-》课程管理
                    path: '/homepage/courseView',
                    name:'courseView',
                    components:{
                        default:courseView
                    }
                },
                { //教师-》课程管理-》增加课程
                    path: '/homepage/addCourse',
                    name:'addCourse',
                    components:{
                        default:addCourse
                    }
                },
                { //教师-》学习统计-》课程学习统计
                    path: '/homepage/courseProgress',
                    name:'courseProgress',
                    components:{
                        default:courseProgress
                    }
                },
                { //教师-》个人信息修改-》修改密码
                    path: '/homepage/alterPassword',
                    name:'alterPassword',
                    components:{
                        default:alterPassword
                    }
                },
                { //管理员-》用户管理-》学生管理
                    path: '/homepage/studentAdmin',
                    name:'studentAdmin',
                    components:{
                        default:studentAdmin
                    }
                },
                { //管理员-》课程审核
                    path: '/homepage/courseAudit',
                    name:'courseAudit',
                    components:{
                        default:courseAudit
                    }
                },
                { //管理员-》课程查看
                    path: '/homepage/courseCheck',
                    name:'courseCheck',
                    components:{
                        default:courseCheck
                    }
                },
                { //学生-》课程学习
                    path: '/homepage/listCourse',
                    name:'listCourse',
                    components:{
                        default:listCourse
                    }
                },
                { //学生-》课程学习-》单个课程
                    path: '/homepage/singleCourse',
                    name:'singleCourse',
                    components:{
                        default:singleCourse
                    },
                    children:[ //学生-》课程学习-》单个课程->视频，课件，测试页面
                        { //主页视图
                            path: '/homepage/singleCourse/singleCourseSub',
                            name:'singleCourseSub',
                            components:{
                                a:singleCourseSub,
                                b:singleCourseSub2,
                                c:singleCourseSub3,
                            }
                        },
                    ]
                },
            ]
        },
        ]

})
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
export default router