<template>
    <div>
    <el-input class="el-input-2"
            placeholder="请输入用户名"
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
                    lazy
                    v-loading="loading"
                    ref="singleTable"
                    :data="tableData"
                    style="width: 100%;margin-top: 20px;border-top: #990000 solid 10px" stripe>
                <el-table-column
                        type="index"
                        min-width="40px"
                        style="width: 5%">
                </el-table-column>
                <el-table-column align="center"
                        property="username"
                        label="用户名"
                        min-width="100px"
                        style="width: 7%" sortable>
                </el-table-column>
                <el-table-column align="center"
                                 property="name"
                                 label="名称"
                                 min-width="100px"
                                 style="width: 7%" sortable>
                </el-table-column>
                <el-table-column align="center"
                                 property="phone"
                                 label="个人电话"
                                 min-width="100px"
                                 style="width: 8%" sortable>
                </el-table-column>
                <el-table-column align="center"
                                 property="type"
                                 label="用户类型"
                                 min-width="100px"
                                 style="width: 12%" sortable>
                    <template slot-scope="scope">
                        <p v-if="scope.row.type==0">物流需求商</p>
                        <p v-if="scope.row.type==1">物流供应商</p>
                        <p v-if="scope.row.type==2">管理员</p>
                    </template>
                </el-table-column>
                <el-table-column align="center"
                                 property="companyName"
                                 label="公司名称"
                                 min-width="100px"
                                 style="width: 15%" sortable>
                </el-table-column>
                <el-table-column align="center"
                                 property="companyAddress"
                                 label="公司地址"
                                 min-width="100px"
                                 style="width: 15%" sortable>
                </el-table-column>
                <el-table-column align="center"
                        property="status"
                        label="用户状态"
                        min-width="100px"
                        style="width: 15%" sortable>
                    <template slot-scope="scope">
                        <el-switch
                                v-if="scope.row.status=='0'"
                                active-text="未审核"
                                disabled>
                        </el-switch
                        >
                        <el-switch
                                v-if="scope.row.status=='1'"
                                v-model="value"
                                active-text="审核通过"
                                active-color="#13ce66"
                                disabled
                        >
                        </el-switch>
                        <el-switch
                                v-if="scope.row.status=='2'"
                                active-text="未通过"
                                inactive-color="#ff4949"
                                disabled>
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="操作"
                        min-width="200px"
                        style="width: 20%"
                        property="type">
                    <template slot-scope="scope">
                        <el-link type="primary" v-if="scope.row.status=='0' && scope.row.type!='2'" @click="updateStatus(scope.row.id, 1)">通过审核</el-link>&nbsp;
                        <el-link type="warning" v-if="scope.row.status=='0' && scope.row.type!='2'" @click="updateStatus(scope.row.id, 2)">不通过审核</el-link>&nbsp;
                        <el-link type="warning" v-if="scope.row.status=='1' && scope.row.type!='2'" @click="updateStatus(scope.row.id, 2)">不通过审核</el-link>&nbsp;
                        <el-link type="primary" v-if="scope.row.status=='2' && scope.row.type!='2'" @click="updateStatus(scope.row.id, 1)">通过审核</el-link>&nbsp;
                        <el-link type="danger" @click="removeUser(scope.$index, scope.row)">删除</el-link>
                    </template>
                </el-table-column>
            </el-table>

        <div class="block">
            <!--            small:设置按钮为小的；background:数字修改为按钮样式；:page-size="10"每页数据为10条-->
            <!--            :pager-count="5"：按钮大于5个时隐藏为省略号-->
            <!--            layout="sizes，prev, pager, next" 设置按钮样式，seizes为设置每页内容按钮，prev为左箭头，pager为内容，next为右箭头,jumper跳跃到指定页-->
            <!--            :total="502“ 为查询数据总条数-->
            <!--            :page-sizes="[10, 20, 30, 40, 50]" 设置每页显示的内容条数-->
            <el-pagination
                    background
                    :page-size="pageSize"
                    :pager-count="5"
                    layout="sizes, prev, pager, next, jumper"
                    :total="studentAllCount"
                    :page-sizes="[5, 10, 15, 20, 25]"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    style="float: right"
            >
            </el-pagination>
        </div>


    </div>
</template>

<script>
    export default {
        name: "userInfo",
            data() {
                return {
                    pageSize:5,  //页面内容数量
                    studentAllCount: null,//获取所有学生,为了能显示按钮个数
                    page:1, //从第几个数据开始查
                    value:true,
                    loading: false,//加载
                    inputSearch:'', //搜索框内容
                    tableData: [], //获取数据显示到表格内
                }
            },
            created() {
            // 获取数据总长度
                this.axios.get("/user/list").then(response=>
                    this.studentAllCount = response.data.data.length
                ).catch(
                    error=>console.info(error)
                ),
            // 获取分页数据
                this.axios.get("/user/list", {
                    params:{
                        index:(this.page-1)*this.pageSize,
                        count:this.pageSize
                    }
                }).then(response=>
                    this.tableData=response.data.data
                ).catch(
                    error=>console.info(error)
                )
            },
            methods: {
                handleSizeChange(size){//处理页码大小触发的事件，更改每页显示内容多少时触发
                    this.pageSize=size  //修改页面内容数量
                    //console.info(size)
                    this.$axios.get("/user/list",{//获取当前显示学生
                        params:{
                            username:this.inputSearch,
                            index:(this.page-1)*this.pageSize,
                            count:this.pageSize
                        }
                    }).then(response=>{
                        this.tableData=response.data.data  //获取所有学生
                        //console.info(this.tableData)
                    }).catch(error=>{
                        console.info(error)
                    })
                },
                handleCurrentChange(index){//当前页变动时候触发的事件，更改显示页时触发
                    this.page=index //获取当前页
                    this.$axios.get("/user/list",{//获取当前显示学生
                        params:{
                            username:this.inputSearch,
                            index:(index-1)*this.pageSize,
                            count:this.pageSize
                        }
                    }).then(response=>{
                        this.tableData=response.data.data  //获取所有学生
                        //console.info(this.tableData)
                    }).catch(error=>{
                        console.info(error)
                    })
                },
                bottonSearch(){ //点击搜索按钮
                    // 获取数据总长度
                    this.axios.get("/user/list", {
                        params:{
                            username:this.inputSearch,
                        }
                    }).then(response=>
                        this.studentAllCount = response.data.data.length
                    ).catch(
                        error=>console.info(error)
                    ),
                    this.axios.get("/user/list", {
                        params:{
                            username:this.inputSearch,
                            index:0,
                            count:5
                        }
                    }).then( response=>
                        this.tableData=response.data.data, //表格获取数据
                        this.loading=true, //启动加载
                        setTimeout( ()=> {
                            this.loading=false
                            },1000
                        )
                    ).catch(
                        error=>console.info(error)
                    )
                },
                removeUser(index,row){
                    this.$confirm('将删除该用户, 是否确定?', '提示', { //确认框
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.axios.post( //跳转到删除
                            "/user/"+row.id+"/delete"
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
                updateStatus(id, status){
                    let hint = '';
                    if(status == 1){
                        hint = "将修改用户为审核通过，";
                    }else if(status == 2){
                        hint = "将修改用户为审核不通过，";
                    }
                        this.$confirm(hint+'是否确定?', '提示', { //确认框
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.axios.post(
                                "/user/"+id+"/update/status",
                                {
                                    status :  status
                                }
                            ).then( response=>
                                this.bottonSearch(),
                                this.$message({  //提示
                                    type: 'success',
                                    message: '修改成功'
                                })
                            )
                        }).catch(() => {
                            this.$message({  //提示
                                type: 'warning',
                                message: '已取消修改'
                            });
                        });
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

</style>