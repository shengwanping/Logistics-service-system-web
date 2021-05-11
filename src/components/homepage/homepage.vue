<template>
    <!-- 外层容器 -->
    <el-container>
        <!-- 菜单,unique-opened只有一个子菜单展开-->
        <el-menu class="el-menu-vertical-demo"
                 :collapse="isCollapse"
                 :unique-opened="true"
                 background-color="#333333"
        >
            <!--logo-->
            <el-menu-item class="el-menu-logo"><i class="el-icon-s-promotion"></i><span>小万物流系统</span></el-menu-item>
            <!--单级菜单-->
            <el-menu-item @click="page1(item.link)" v-for="item in noChildren" :key="item.link">
                <i :class="item.icon"></i>
                <span slot="title">{{item.menuName}}</span>
            </el-menu-item>
            <!--多级菜单-->
            <el-submenu :index=index.toString() v-for="(item,index) in hasChildren" :key="index">
                <template slot="title">
                    <i :class="item.icon"></i>
                    <span>{{item.menuName}}</span>
                </template >
                <el-menu-item @click="page1(subItem.link)" v-for="(subItem,subIndex) in item.child" :key="subIndex">
                    {{subItem.menuName}}
                </el-menu-item>
            </el-submenu>
        </el-menu>
        <!-- 菜单栏 end-->

        <el-container>
            <!-- 顶栏容器，文本靠右，默认高度为60px-->
            <el-header style="text-align: right; font-size: 12px;background-color: #343a40">
                <!-- 隐藏菜单栏的图标-->
                <i :class="isCollapse?'el-icon-s-unfold':'el-icon-s-fold'" @click="inn"></i>
                <!-- cursor: pointer 鼠标设为指针-->
                <span style="line-height:50px;margin-right: 50px;color: #cccccc">欢迎进入小万物流管理系统！</span>
                <!-- 将动作或菜单折叠到下拉菜单中。-->
                <el-dropdown trigger="click" style="margin-right: 50px;" size="mini">
                    <span style="cursor: pointer;color: #d4edda;outline: none;">{{name}}<i class="el-icon-caret-bottom" style="padding-left: 5px;"></i></span>
                    <!--slot="dropdown"下拉列表-->
                    <el-dropdown-menu slot="dropdown">
                        <router-link to="/">
                            <el-dropdown-item icon="el-icon-remove">退出</el-dropdown-item>
                        </router-link>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-header>
            <!-- 顶栏容器 end -->
            <!-- 主要区域容器  -->
            <el-main style="background-color: #e8e8e8;min-height: 600px">
                <router-view ></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>

    export default {
        name: "homepage",
        data() {
            return {
                isCollapse: false,
                menuList: JSON.parse(this.$route.query.menuList),
                name: this.$route.query.name
            }
        },
        computed: {  //使用过滤器分开有子菜单和没有子菜单的
            noChildren() {
                return this.menuList.filter(item =>
                    !item.child
                )
            },
            hasChildren() {
                return this.menuList.filter(item =>
                    item.child
                )
            }
        },
        methods:{ //根据菜单传来地址，跳转不同页面
            page1(link){
                this.$router.push({
                    name: link,
                    query:{ //用户id
                        name:this.name
                    }
                })
            },
            inn:function(){ //隐藏菜单的图标
                this.isCollapse=!this.isCollapse;
            }
        }
    }

</script>

<style>
    /******菜单栏******/

    .el-menu-vertical-demo>.el-menu-logo{/*logo*/
        background-color: firebrick !important;
        height: 60px !important;
    }
    .el-menu-vertical-demo>.el-menu-logo:hover{/*logo*/
        background-color: firebrick !important;
    }
    .el-menu-vertical-demo>.el-menu-logo>i{/*logo>i*/
        font-size: 30px!important;
        color: #343a40!important;
    }
    .el-menu-vertical-demo>.el-menu-logo>span{/*logo>span*/
        color: #d4edda!important;
        font-size: 22px!important;
        font-family: 新宋体!important;
    }
    .el-submenu__title,.el-menu-item{/*一级和二级菜单*/
        border: #666666 outset 1px !important;
        height: 50px!important;
        color: white!important;
    }
    .el-menu-item:hover{/*鼠标移动到el-menu-item标签*/
        background: #494f54 !important;
    }
    .el-menu-vertical-demo:not(.el-menu--collapse) {/*缩放菜单和菜单本身的宽高*/
        width: 200px!important;
        min-height: 670px!important;
    }
    /******菜单栏 end******/

    /******顶部栏******/
    .el-header{/*顶部栏*/
        position: relative;
    }
    .el-icon-s-fold,.el-icon-s-unfold{/*控制菜单图标*/
        font-size: 30px;
        position: absolute;
        left: 12px;
        top: 12px;
        color: black;
    }
    .el-icon-s-fold:hover,.el-icon-s-unfold:hover{/*控制菜单图标*/
        color: #990000;
        transition: 0.5s;
    }
    /******顶部栏 end******/

</style>