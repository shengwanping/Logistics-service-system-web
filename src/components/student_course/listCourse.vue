<template>
    <div >
        <el-carousel :interval="4000" type="card" height="200px" style="width: 80%;margin: auto">
            <el-carousel-item v-for="item in courseList" :key="item.courseLink">
                <el-image :src="item.courseLink" style="height: 200px"></el-image>
            </el-carousel-item>
        </el-carousel>
        <div v-for="fit in courseList" :key="fit.courseLink">
            <div class="courseList" @click="singleCourse(fit.courseId)">
                <el-image class="courseList_img" :src="fit.courseLink">
                </el-image>
                <div class="courseList_div" ></div>
                <p>开始学习</p>
            </div >
        </div>
    </div>
</template>

<script>
    export default {
        name: "listCourse",
            data() {
                return {
                    courseList:[], //获取数据显示到表格内
                    userNo:this.$route.query.userName, //获取学生id
                }
            },

            created() { //进入页面便获取数据，获取所有课程
                this.axios.get("/user/queryAllCourse", {
                    params:{
                        userNo:this.userNo,
                    }
                }).then( response=>
                    //console.log(response.data),
                    this.courseList=response.data[0].studentClass.courses,
                ).catch(
                    error=>console.info(error)
                )
            },

            methods: {
                singleCourse(courseId){ //根据课程id和学生用户名，学习该课程
                    this.axios.get("/publishCourse/querySingleCourse",{
                        params:{
                            userNo:this.userNo,
                            courseId:courseId
                        }
                    }).then(response=>{
                        if(response.data.length>0){
                            //console.log(response.data)
                            this.$router.push({ //获取数据后跳转
                                path:"/homepage/singleCourse",
                                query:{
                                    singleCourseList:response.data,
                                    userNo:this.userNo
                                }
                            })
                        }else{
                            this.$alert('老师还未发布课程哦，先学习其他课程吧O(∩_∩)O', '提示', {
                                confirmButtonText: '确定',
                                    });
                        }
                    }).catch(
                        error=>console.info(error)
                    )
                }
            },
    }
</script>

<style >
    .courseList{
        width: 330px;
        height: 200px;
        float: left;
        margin: 40px;
        position: relative;
    }
    .courseList_img{
        width: 330px;
        height: 200px;
        position: absolute;
        left: 0px;
        top: 0px
    }
    .courseList_div{
        background-color: #494f54;
        opacity: 0.4;
        width: 330px;
        height: 200px;
        position: absolute;
        left: 0px;
        top: 0px;
        display: none;
        cursor: pointer; /*鼠标编程点击模式*/
    }
    .courseList>p{
        position: absolute;
        left: 120px;
        top: 60px;
        background-color: black;
        width: 80px;
        height: 40px;
        line-height: 40px;
        color: #d4edda;
        border-radius: 20px;
        opacity: 0.8;
        display: none;
        cursor: pointer; /*鼠标编程点击模式*/
        padding-left: 15px;
    }
    .courseList:hover .courseList_div{
        display:block;
    }
    .courseList:hover p{
        display:block;
    }
</style>