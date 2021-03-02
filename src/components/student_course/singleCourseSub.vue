<template>
    <div>
        <h1>课件下载地址：</h1>
        <div>
            <el-link :href="sectionCourse">
                <el-button size="mini">点击下载</el-button>
            </el-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: "singleCourseSub",
        computed:{ //每次进入页面自动更新数据
            sectionCourse(){
                return this.$route.query.section.sectionCourseware;
            }
        },
    }
</script>

<style>

</style>