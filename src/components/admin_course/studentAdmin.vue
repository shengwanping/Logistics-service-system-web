<template>
    <div>
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
            <el-table-column
                    align="center"
                    property="userId"
                    label="id"
                    min-width="100px"
                    style="width: 15%" sortable>
            </el-table-column>
            <el-table-column
                    align="center"
                    property="name"
                    label="姓名"
                    min-width="100px"
                    style="width: 15%" sortable>
            </el-table-column>
            <el-table-column
                    align="center"
                    property="userAge"
                    label="年龄"
                    min-width="100px"
                    style="width: 15%" sortable>
            </el-table-column>
            <el-table-column
                    align="center"
                    prop="userSex"
                    label="性别"
                    min-width="50px"
                    style="width: 5%" sortable>
                <template slot-scope="scope">{{scope.row.userSex==0?'男':'女'}}</template>
            </el-table-column>
            <el-table-column
                    align="center"
                    property="userEmail"
                    label="Email"
                    min-width="100px"
                    style="width: 15%" sortable>
            </el-table-column>
            <el-table-column
                    align="center"
                    property="userPhone"
                    label="电话"
                    min-width="100px"
                    style="width: 15%" sortable>
            </el-table-column>
        </el-table>

        <div class="block">
<!--            small:设置按钮为小的；background:数字修改为按钮样式；:page-size="10"每页数据为10条-->
<!--            :pager-count="5"：按钮大于5个时隐藏为省略号-->
<!--            layout="sizes，prev, pager, next" 设置按钮样式，seizes为设置每页内容按钮，prev为左箭头，pager为内容，next为右箭头,jumper跳跃到指定页-->
<!--            :total="502“ 为查询数据总条数-->
<!--            :page-sizes="[10, 20, 30, 40, 50]" 设置每页显示的内容条数-->
            <el-pagination
                    small
                    background
                    :page-size="pageSize"
                    :pager-count="5"
                    layout="sizes, prev, pager, next,jumper"
                    :total="studentAllCount"
                    :page-sizes="[2, 3, 4, 20]"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
            >
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: "studentAdmin",
        data(){
           return{
               pageSize:2,  //页面内容数量
               loading:false,
               tableData:[],
               studentAllCount:1 ,//获取所有学生,为了能显示按钮个数
               page:1 //从第几个数据开始查
           }
        },
        created() {
            /*只有一个作用，获取所有学生的个数*/
            this.$axios.get("/user/queryLimitStudent",{//获取所有学生
                params:{
                    index:0,
                    count:0
                }
            }).then(response=>{ this.studentAllCount=response.data.length
            }).catch(error=>{console.info(error)
            }),
            /*让一进入就显示数据，获取当前显示学生*/
            this.$axios.get("/user/queryLimitStudent",{//获取当前显示学生
                params:{
                    index:0,
                    count:this.pageSize
                }
            }).then(response=>{
                this.tableData=response.data  //获取所有学生
                //console.info(this.tableData)
            }).catch(error=>{
                console.info(error)
            })
        },
        methods:{
            handleSizeChange(size){//处理页码大小触发的事件，更改每页显示内容多少时触发
                this.pageSize=size  //修改页面内容数量
                //console.info(size)
                this.$axios.get("/user/queryLimitStudent",{//获取当前显示学生
                    params:{
                        index:(this.page-1)*this.pageSize,
                        count:this.pageSize
                    }
                }).then(response=>{
                    this.tableData=response.data  //获取所有学生
                    //console.info(this.tableData)
                }).catch(error=>{
                    console.info(error)
                })
            },
            handleCurrentChange(index){//当前页变动时候触发的事件，更改显示页时触发
                this.page=index //获取当前页
                this.$axios.get("/user/queryLimitStudent",{//获取当前显示学生
                    params:{
                        index:(index-1)*this.pageSize,
                        count:this.pageSize
                    }
                }).then(response=>{
                    this.tableData=response.data  //获取所有学生
                    //console.info(this.tableData)
                }).catch(error=>{
                    console.info(error)
                })
            },
        },
    }
</script>

<style>

</style>