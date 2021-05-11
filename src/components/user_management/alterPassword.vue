<template>
    <div>
        修改密码
        <div class="block">
            small:设置按钮为小的；background:数字修改为按钮样式；:page-size="10"每页数据为10条
            :pager-count="5"：按钮大于5个时隐藏为省略号
            layout="sizes，prev, pager, next" 设置按钮样式，seizes为设置每页内容按钮，prev为左箭头，pager为内容，next为右箭头,jumper跳跃到指定页
            :total="502“ 为查询数据总条数
            :page-sizes="[10, 20, 30, 40, 50]" 设置每页显示的内容条数
            <el-pagination
                    small
                    background
                    :page-size="10"
                    :pager-count="5"
                    layout="sizes, prev, pager, next, jumper"
                    :total="502"
                    :page-sizes="[5, 10, 15, 20, 25]"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    >
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: "alterPassword",
        methods:{
            handleSizeChange(){//处理页码大小触发的事件，更改每页显示内容多少时触发
                alert("处理页码大小触发的事件")
            },
            handleCurrentChange(){//当前页变动时候触发的事件，更改显示页时触发
                alert("57574")
            }
        }
    }
</script>

<style scoped>

</style>