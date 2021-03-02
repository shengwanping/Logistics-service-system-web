<template>
    <div class="singleCourse">
            <!--            router	是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转	boolean	—	false-->
            <!--        tostring（）转换为字符串，index是一个字符串索引,随便写-->
            <el-menu
                    class="el-menu-vertical-demo"
                    background-color="#cccccc"
                    >
                <div style="margin-bottom: 20px"><h1 style="margin: 5px">课程学习进度</h1><el-progress
                        :text-inside="true" :stroke-width="14" style="width:100%;"  :percentage="sumProgress" status="success">
                </el-progress>
                </div>
                <el-menu-item
                        class="el-menu-item-student"
                        @click="gotoSub(item)"
                        :index="item.sectionCourseware"
                        v-for="(item,index) in singleCourseList"
                        :key="'course'+index">
                    <i class="el-icon-tickets" style="color: black"></i>
                    <span>章节{{item.courseSection}}</span>
                </el-menu-item>
            </el-menu>

        <div style="float: left;width: 70%;min-height: 600px">
            <el-tabs type="border-card" style="width: 100%;min-height: 600px">
                <el-tab-pane>
                    <span slot="label"><i class="el-icon-date"></i> 课件</span>
                    <router-view name="a"></router-view>
                </el-tab-pane>
                <el-tab-pane label="视频">
                    <router-view name="b"></router-view>
                </el-tab-pane>
                <el-tab-pane label="测试">
                    <router-view name="c"></router-view>
                </el-tab-pane>
            </el-tabs>
        </div>
        <!--管理员显示的按钮-->
        <div class="divBackgrund" v-if="isStatus">
            <el-button @click="auditOk" type="primary" style="margin-top:100%;width:100px;margin-left: 10px">审核通过</el-button><br>
            <el-button @click="auditNo" type="danger" style="margin-top: 20px;width:100px;margin-left: 10px">审核不通过</el-button>
        </div>
    </div>
</template>
<script>
    export default {
        name: "singleCourse",
        data(){
            return{
                singleCourseList:this.$route.query.singleCourseList, //显示所有章节
                singleCourseListOne:this.$route.query.singleCourseList[0], //获取该课程来改变status
                isStatus:this.$route.query.isStatus ,//是否显示管理员右侧按钮
                courseTestList:[] ,//获取测试题
                userNo:this.$route.query.userNo ,//学生id
                sum:0
            }
        },
        computed:{
            sumProgress(){
                this.$axios.post("/progress/queryALLProgress",{
                    userNo:this.$route.query.userNo,
                    courseId:this.singleCourseListOne.courseId
                }).then(response=>{ //获取该课程总进度
                    if(response.data>0){
                        this.sum=parseInt(response.data/this.singleCourseList.length)
                    }else{
                        this.sum=0
                    }
                }).catch(error=>{console.info(error)})
                return this.sum
            }
        },
        methods: {
            gotoSub(section){ //点击章节，把内容传递过去
                /*查看是否已经做过测试*/
                this.$axios.post("/score/queryScore",{
                        userNo:section.userNo,
                        courseId:section.courseId,
                        courseSection:section.courseSection,
                        score:{ //这个属性表示表单集合
                            userNo:this.userNo
                        }
                }).then(response=>{
                    let res=response.data
                    //console.info(response.data)
                    if(response.data.length>0){ //1.当有成绩和答案时，进入查看成绩页面
                        //console.info(response.data)
                        /*答案成绩页面*/
                        this.$axios.get("/test/queryBySection",//2.否则进入做题页面
                            {
                                params:{
                                    userNo:section.userNo,
                                    courseId:section.courseId,
                                    courseSection:section.courseSection
                                }
                            }).then(response=>{//获取测试题
                            this.courseTestList=response.data;
                            this.$router.push({ //跳转到相应课程
                                path:"/homepage/singleCourse/singleCourseSub",
                                query:{
                                    section:section, //章节课程
                                    courseTestList:this.courseTestList ,//章节测试 //(为了防止页面得不到数据出错，没有实际用处)
                                    userNo:this.userNo ,//学生id //(为了防止页面得不到数据出错，没有实际用处)
                                    score:res, //章节成绩及答案
                                    isScore:1,//判断是否有成绩
                                    testSectionScore:res[0].score.testSectionScore
                                }
                            })
                        }).catch(error=>{
                            console.info(error)
                        })
                        /*答案成绩页面 end*/
                    }else{
                        /*选题页面*/
                        this.$axios.get("/test/queryBySection",//2.否则进入做题页面
                            {
                                params:{
                                    userNo:section.userNo,
                                    courseId:section.courseId,
                                    courseSection:section.courseSection
                                }
                            }).then(response=>{//获取测试题
                            this.courseTestList=response.data;
                            //console.info(this.courseTestList)
                            this.$router.push({ //跳转到相应课程
                                path:"/homepage/singleCourse/singleCourseSub",
                                query:{
                                    section:section, //章节课程
                                    courseTestList:this.courseTestList ,//章节测试
                                    userNo:this.userNo ,//学生id
                                    score:res,//(为了防止页面得不到数据出错，没有实际用处)
                                    isScore:2, //判断是否有成绩
                                    clickMe:1,
                                    isStatus:this.isStatus //管理员页面
                                }
                            })
                            //console.info(this.courseTestList)
                        }).catch(error=>{
                            console.info(error)
                        })
                        /*选题页面 end*/
                    }
                }).catch(error=>{
                    console.info(error)
                })
            },
            auditOk(){ //通过审核（管理员）
                this.$confirm("确定发布课程吗？","提示",{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(()=> {
                    this.$axios.get('/publishCourse/updateCourseStatus',{
                        params:{
                            userNo:this.singleCourseListOne.userNo,
                            courseId:this.singleCourseListOne.courseId,
                            status:1
                        }
                    }).then(response=> {
                            if (response.data > 0) { //判断是否修改成功
                                this.$message({
                                    type: 'success',
                                    message: '课程发布成功!'
                                });
                                this.$router.push({
                                    path: "/homepage/courseAudit", //回到审核页面
                                });
                            };
                        }
                    )
                }).catch(()=>{
                    this.$message({
                        type:"info",
                        message:'已取消发布'
                    })
                })
            },
            auditNo(){ //未通过审核（管理员）
                this.$confirm("确定拒绝课程发布吗？","提示",{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(()=> {
                    this.$axios.get('/publishCourse/updateCourseStatus',{
                        params:{
                            userNo:this.singleCourseListOne.userNo,
                            courseId:this.singleCourseListOne.courseId,
                            status:2
                        }
                    }).then(response=> {
                            if (response.data > 0) { //判断是否修改成功
                                this.$message({
                                    type: 'success',
                                    message: '已拒绝课程发布!'
                                });
                                this.$router.push({
                                    path: "/homepage/courseAudit", //回到审核页面
                                });
                            };
                        }
                    )
                }).catch(()=>{
                    this.$message({
                        type:"info",
                        message:'已取消操作'
                    })
                })
            },
        }
    }
</script>

<style >
    /*章节样式*/
    .el-menu-item-student{
        outline: none;
        border: #cccccc 2px outset !important;
        color: black !important;
        background-color: #cccccc  !important;
        font-family: 黑体 ;
        font-size: 20px;
        height: 50px!important;
        line-height: 40px
    }
    .el-menu-item-student:hover{
        background-color: #cccccc!important;
    }
    .el-menu-item-student:focus{
        background-color: burlywood!important;
        color: black !important;
    }
    /*章节样式 end*/
    .divBackgrund{ /*右侧背景*/
        width: 10%;
        float: left;
        background: url('./images/img_01.png') no-repeat;
        background-size: cover;
        min-height: 600px;
    }
    .singleCourse>.el-menu-vertical-demo{ /*菜单背景*/
        width: 14% !important;
        float: left;
        outline: none;
        border:0;
        min-height: 600px!important;
        background: url('./images/img_01.png') no-repeat;
        background-size: cover;
    }
</style>