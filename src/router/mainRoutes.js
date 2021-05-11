import Vue from 'vue'
import Router from 'vue-router'
//使用模块化机制编程，導入Vue和VueRouter，要调用 Vue.use(VueRouter)
Vue.use(Router)
import login from "../components/login/login";
import homepage from "../components/homepage/homepage";
import mainPage from "../components/homepage/mainPage";
import userInfo from "../components/user_management/userInfo";
import userAudit from "../components/user_management/user_audit";
import alterPassword from "../components/user_management/alterPassword";
import news from "../components/system_management/news";




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
                { //用户管理-》用户信息管理
                    path: '/user/info',
                    name:'userInfo',
                    components:{
                        default:userInfo
                    }
                },
                { //用户管理-》用户审核
                    path: '/user/audit',
                    name:'userAudit',
                    components:{
                        default:userAudit
                    }
                },
                { //个人中心-》修改密码
                    path: '/user/alterPassword',
                    name:'alterPassword',
                    components:{
                        default:alterPassword
                    }
                },
                { //个人中心-》新闻管理
                    path: '/systemCenter/news',
                    name:'news',
                    components:{
                        default:news
                    }
                }
            ]
        },
        ]

})
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
export default router