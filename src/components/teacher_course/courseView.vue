<template>
    <div>
    <el-input class="el-input-2"
            placeholder="请输入课程名"
            prefix-icon="el-icon-search"
            v-model="inputSearch"
            clearable
    >
    </el-input><button class="botton-search" @click="bottonSearch">搜  索</button>
        <el-button plain style="float: right;margin: 10px" @click="addCourse">添加课程</el-button>
<!--        stripe属性可以创建带斑马纹的表格-->
<!--        data	显示的数据	array-->
<!--        ref 表格名称     sortable排序-->
<!--        highlight-current-row	是否要高亮当前行-->
<!--        label	显示的标题-->
<!--        lazy 懒加载-->
<!--        prop对应列内容的字段名，也可以使用 property 属性 string-->
            <el-table
                    lazy
                    v-loading="loading"
                    ref="singleTable"
                    :data="tableData"
                    style="width: 100%;" stripe>
                <el-table-column
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
                                 property="newDate"
                                 label="发布时间"
                                 min-width="100px"
                                 style="width: 15%" sortable>
                </el-table-column>
                <el-table-column align="center"
                        property="startTime"
                        label="开始时间"
                        min-width="100px"
                        style="width: 15%" sortable>
                </el-table-column>
                <el-table-column align="center"
                        property="endTime"
                        label="截止时间"
                        min-width="100px"
                        style="width: 15%" sortable>
                </el-table-column>
                <el-table-column align="center"
                        property="courseStatus"
                        label="状态"
                        min-width="100px"
                        style="width: 15%" sortable>
                    <template slot-scope="scope">
                        <el-switch
                                v-if="scope.row.courseStatus=='0'"
                                active-text="未审核"
                                disabled>
                        </el-switch
                        >
                        <el-switch
                                v-if="scope.row.courseStatus=='1'"
                                v-model="value"
                                active-text="审核通过"
                                active-color="#13ce66"
                                disabled
                        >
                        </el-switch>
                        <el-switch
                                v-if="scope.row.courseStatus=='2'"
                                active-text="审核未通过"
                                inactive-color="#ff4949"
                                disabled>
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="操作"
                        min-width="200px"
                        style="width: 30%">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="small" @click="alterCourse"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="small" @click="removeCourse(scope.$index, scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>


    </div>
</template>

<script>
    export default {
        name: "courseView",
            data() {
                return {
                    value:true,
                    loading: false,//加载
                    inputSearch:'', //搜索框内容
                    tableData: [], //获取数据显示到表格内
                }
            },
            created() { //进入页面便获取数据
                this.axios.get("/publishCourse/selectAll", {
                    params:{
                        userNo:this.$route.query.userName,
                        courseName:''
                    }
                }).then( response=>
                    this.tableData=response.data
                ).catch(
                    error=>console.info(error)
                )
            },
            methods: {
                bottonSearch(){ //点击搜索按钮
                    this.axios.get("/publishCourse/selectAll", {
                        params:{
                            userNo:this.$route.query.userName,
                            courseName:this.inputSearch
                        }
                    }).then( response=>
                        this.tableData=response.data, //表格获取数据
                        this.loading=true, //启动加载
                        setTimeout( ()=> {
                            this.loading=false
                            },1000
                        )
                    ).catch(
                        error=>console.info(error)
                    )
                },
                addCourse(){//添加课程
                    this.axios.get("/teacherClassCourse/selectOne", { //获取课程
                        params:{
                            userNo:this.$route.query.userName
                        }
                    }).then( res=>{ //判断课程是否全部发布，获取课程>0说明没有，则进入增加课程页面，否则不进入
                        console.info(res.data.length)
                        res.data.length>0?this.$router.push({
                            path:"/homepage/addCourse",
                            query:{
                                userName:this.$route.query.userName
                            }
                        }):this.$alert('已发布所有课程，是否返回编辑课程', '提示', {
                            confirmButtonText: '确定',
                        });
                        }
                    ).catch(
                        error=>console.info(error)
                    )
                },
                removeCourse(index,row){
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
                alterCourse(){//修改课程

                }
            },
    }
</script>

<style >
    .el-input-2{
        /*改变光标颜色*/
        outline: none;/*取消轮廓,让点击的时候没有黑色边框轮廓*/
        margin-top: 10px !important;
        opacity: 0.8;
        width: 80%!important;
        border: 0!important;
        box-shadow: none!important;
    }
    .botton-search{
        min-width: 60px;
        outline: none;
        background-color: firebrick;
        margin-left: 3px;
        width: 8%!important;
        height: 40px;
        color: white;
    }
    .el-table{
        margin-top: 10px;
        border-top: #990000 10px solid;
    }

</style>