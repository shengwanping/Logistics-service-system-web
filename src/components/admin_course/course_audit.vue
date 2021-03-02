<template>
    <div>
    <el-input class="el-input-2"
            placeholder="请输入课程名"
            prefix-icon="el-icon-search"
            v-model="inputSearch"
            clearable
    >
    </el-input><button class="botton-search" @click="bottonSearch">搜  索</button>
<!--        stripe属性可以创建带斑马纹的表格-->
<!--        data	显示的数据	array-->
<!--        ref 表格名称     sortable排序-->
<!--        highlight-current-row	是否要高亮当前行-->
<!--        label	显示的标题-->
<!--        lazy 懒加载-->
<!--        prop对应列内容的字段名，也可以使用 property 属性 string-->
            <el-table
                    v-loading="loading"
                    ref="singleTable"
                    :data="tableData"
                    style="width: 100%;"
                    stripe
                    lazy>
                <el-table-column align="center"
                        type="index"
                        min-width="40px"
                        style="width: 10%">
                </el-table-column>
                <el-table-column align="center"
                        property="course.courseName"
                        label="课程名"
                        min-width="100px"
                        style="width: 15%" sortable>
                </el-table-column>
                <el-table-column align="center"
                                 property="user.name"
                                 label="教师"
                                 min-width="100px"
                                 style="width: 15%" sortable>
                </el-table-column>
                <el-table-column align="center"
                        property="newDate"
                        label="发布时间"
                        min-width="100px"
                        style="width: 15%" sortable>
                </el-table-column>
                <el-table-column align="center"
                        property="courseStatus"
                        label="状态"
                        min-width="100px"
                        style="width: 15%" sortable>
                        <el-switch
                                active-text="未审核"
                                disabled>
                        </el-switch>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="操作"
                        min-width="200px"
                        style="width: 30%">
                    <template slot-scope="scope">
                        <el-button type="warning" icon="el-icon-search" size="small" @click="checkCourse(scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="small" @click="removeCourse(scope.$index, scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>


    </div>
</template>

<script>
    export default {
        name: "course_audit",
            data() {
                return {
                    loading: false,//加载
                    inputSearch:'', //搜索框内容
                    tableData: [], //获取数据显示到表格内
                }
            },
            created() { //进入页面便获取数据，获取所有未审核课程
                this.loading=true, //启动加载
                    setTimeout( ()=> {
                            this.loading=false
                        },700
                    )
                this.axios.get("/publishCourse/selectAll", {
                    params:{
                        userNo:'',
                        courseName:''
                    }
                }).then( response=>
                    this.tableData=response.data,
                ).catch(
                    error=>console.info(error)
                )
            },
            methods: {
                bottonSearch(){ //点击搜索按钮，根据课程名搜索
                    this.axios.get("/publishCourse/selectAll", {
                        params:{
                            userNo:'',
                            courseName:this.inputSearch
                        }
                    }).then( response=>
                        this.tableData=response.data, //表格获取数据
                        this.loading=true, //启动加载
                        setTimeout( ()=> {
                            this.loading=false
                            },700
                        )
                    ).catch(
                        error=>console.info(error)
                    )
                },
                removeCourse(index,row){ //删除课程
                    // console.info(row)
                    // console.info(row.courseStatus)
                    this.$confirm('将删除该课程, 是否确定?', '提示', { //确认框
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.axios.post( //跳转到删除
                            "/publishCourse/deleteOne",
                            {
                                userNo:row.userNo,
                                newDate:row.newDate
                            }
                        ).then( response=>
                            this.bottonSearch()
                        )
                    }).catch(() => {
                        this.$message({  //提示
                            type: 'warning',
                            message: '已取消删除'
                        });
                    });
                },
                checkCourse(row){ //审核查看课程(从html获取该课程所有字段)
                    this.axios.get("/publishCourse/querySingleCourse",{
                        params:{
                            userNo:row.userNo, //老师id
                            courseId:row.courseId  //课程id
                        }
                    }).then(response=>
                        this.$router.push({ //获取数据后跳转
                            path:"/homepage/singleCourse",
                            query:{
                                singleCourseList:response.data,
                                isStatus: true //显示按钮
                            }
                        })
                    ).catch(
                        error=>console.info(error)
                    )
                }
            }
    }
</script>

<style >
    .el-input-2{
        /*改变光标颜色*/
        outline: none;/*取消轮廓,让点击的时候没有黑色边框轮廓*/
        margin-top: 10px !important;
        opacity: 0.8;
        width: 90%!important;
        border: 0!important;
        box-shadow: none!important;
    }
    .botton-search{
        min-width: 60px;
        outline: none;
        background-color: firebrick;
        margin-left: 3px;
        width: 9%!important;
        height: 40px;
        color: white;
    }
    .el-table{
        margin-top: 10px;
        border-top: #990000 10px solid;
    }

</style>