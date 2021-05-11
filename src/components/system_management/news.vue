<template>
    <div>
        <el-input class="el-input-2"
                  placeholder="请输入标题"
                  prefix-icon="el-icon-search"
                  v-model="inputSearch"
                  clearable
        >
        </el-input><button class="botton-search" @click="bottonSearch">搜  索</button>
        <el-button type="primary" style="width: 90px;float: right;margin: 10px" @click="dialogVisible1 = true">新 增</el-button>
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
                             property="title"
                             label="新闻标题"
                             min-width="100px"
                             style="width: 7%" sortable>
            </el-table-column>
            <el-table-column align="center"
                             property="shortContent"
                             label="新闻内容"
                             min-width="100px"
                             style="width: 8%;overflow: hidden;white-space:nowrap;text-overflow:ellipsis;" sortable>
            </el-table-column>

            <el-table-column
                    align="center"
                    label="操作"
                    min-width="200px"
                    style="width: 20%"
                    property="type">
                <template slot-scope="scope">
                    <el-link type="primary" @click="dialogVisible = true,details(scope.row)">编辑</el-link>&nbsp;
                    <el-link type="danger" @click="remove(scope.row.id)">删除</el-link>&nbsp;
                </template>
            </el-table-column>
        </el-table>

        <el-dialog
                title="编辑"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose">
            标题:<el-input v-model="row.title"></el-input>
            <div style="margin-top: 20px">内容:<el-input type="textarea" v-model="row.content"></el-input></div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false,updateStatus(row)">修改成功</el-button>
            </span>
        </el-dialog>

        <el-dialog
                title="新增"
                :visible.sync="dialogVisible1"
                width="30%"
                :before-close="handleClose">
            标题:<el-input v-model="save.title"></el-input>
            <div style="margin-top: 20px">内容:<el-input type="textarea" v-model="save.content"></el-input></div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible1 = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible1 = false,saveData()">新增</el-button>
            </span>
        </el-dialog>

        <div class="block">
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
        name: "news",
        data() {
            return {
                pageSize:5,  //页面内容数量
                studentAllCount: null,
                page:1, //从第几个数据开始查
                dialogVisible: false,
                dialogVisible1: false,
                value:true,
                loading: false,//加载
                inputSearch:'', //搜索框内容
                tableData: [], //获取数据显示到表格内
                row: {
                    title:null,
                    content:null
                },
                save:{
                    title:null,
                    content:null
                }
            }
        },
        created() { //进入页面便获取数据
            // 获取数据总长度
            this.axios.get("/news").then(response=>
                this.studentAllCount = response.data.data.length
            ).catch(
                error=>console.info(error)
            ),
                // 获取分页数据
                this.axios.get("/news", {
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
                this.$axios.get("/news",{//获取当前显示学生
                    params:{
                        title:this.inputSearch,
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
                this.$axios.get("/news",{//获取当前显示学生
                    params:{
                        title:this.inputSearch,
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
            details(row){
                this.row = row
            },
            bottonSearch(){ //点击搜索按钮
                // 获取数据总长度
                this.axios.get("/news", {
                    params:{
                        title:this.inputSearch,
                    }
                }).then(response=>
                    this.studentAllCount = response.data.data.length
                ).catch(
                    error=>console.info(error)
                ),
                    // 获取数据
                    this.axios.get("/news", {
                        params:{
                            title:this.inputSearch,
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
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },
            remove(id){
                this.$confirm('将删除该新闻, 是否确定?', '提示', { //确认框
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.axios.post( //跳转到删除
                        "/news/"+id+"/delete"
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
            updateStatus(row){
                this.$confirm('是否确定修改?', '提示', { //确认框
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.axios.post(
                        "/news/"+row.id+"/update",
                        {
                            title : row.title,
                            content : row.content
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
            },
            saveData(){
                this.$confirm('是否确定新增新闻?', '提示', { //确认框
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let that = this
                    this.axios.post(
                        "/news",
                        {
                            title: that.save.title,
                            content: that.save.content
                        }
                    ).then( ()=>
                            this.bottonSearch(),
                        this.$message({  //提示
                            type: 'success',
                            message: '新增成功'
                        })
                    )
                }).catch(() => {
                    this.$message({  //提示
                        type: 'warning',
                        message: '已取消新增'
                    });
                });
            }
        }
    }
</script>

<style scoped>
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