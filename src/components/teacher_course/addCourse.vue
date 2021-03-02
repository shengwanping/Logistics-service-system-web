<template>
    <div>
        <el-form :model="ruleForm"  ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="课程" required>
                <el-select v-model="courseId" placeholder="请选择课程">
                    <el-option
                            v-for="item in teacherCourse"
                            :key="item.courseId"
                            :label="item.courseName"
                            :value="item.courseId">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="时间" required>
                    <el-date-picker
                            @change="saveTime"
                            v-model="dateTime"
                            type="datetimerange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
            </el-form-item>
            <!-- before-upload	上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。	function(file)-->
            <!-- before-remove	删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止删除。	function(file, fileList)-->
            <!-- limit	最大允许上传个数	number	-->
            <!-- on-exceed	文件超出个数限制时的钩子 function(files, fileList)-->
            <!-- on-change	文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用	function(file, fileList)-->
            <!-- file-list	上传的文件列表-->
            <!-- auto-upload	是否在选取文件后立即进行上传，默认为true-->
            <!--slot的两个属性   1.trigger触发文件选择框的内容，，2.tip提示说明文字-->
            <!--on-success成功-->
            <el-form-item v-show="isSection"
                    v-for="(domain, index) in ruleForm.domains"
                    :label="'章节' + (index + 1)"
                    :key="index"
                    >
                <el-upload
                        accept=".doc,.zip"
                        style="float: left;width: 30%"
                        class="upload-demo"
                        action="/api/upload/file"
                        :before-remove="beforeRemove"
                        :before-upload="beforeUpload"
                        :limit="1"
                        :on-exceed="handleExceed"
                        :on-success="(response, file, fileList)=>{return onSuccess(response, file, fileList,index)}"
                        >
                    <el-button  size="small" type="primary">上传课件</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传doc/zip格式文件</div>
                </el-upload>
                <el-upload
                        accept=".doc,.qlv,.mp4"
                        style="float: left;width: 30%"
                        class="upload-demo"
                        ref="upload"
                        action="/api/upload/file"
                        :before-remove="beforeRemove"
                        :before-upload="beforeUpload2"
                        :limit="1"
                        :on-exceed="handleExceed"
                        :on-success="(response, file, fileList)=>{return onSuccess2(response, file, fileList,index)}"
                         >
                    <el-button  size="small" type="primary">上传视频</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传mp4格式视频</div>
                </el-upload>
                <el-button type="primary" @click="insertTest(index + 1)" size="small">添加测试题</el-button>
                <el-button @click.prevent="removeDomain(domain)" style="margin-left: 50px" size="small">删除</el-button>
            </el-form-item>

            <el-button v-show="isSection" style="margin-left: 100px;" @click="addDomain" size="small">新增章节</el-button>
            <el-button v-show="isSection" style="margin-left: 100px;" size="small" type="success" @click="submit" v-loading.fullscreen.lock="fullscreenLoading">发布课程</el-button>

        </el-form>
        <!--添加选择题-->
        <el-dialog
                title="添加选择题"
                :visible.sync="dialogVisible"
                width="70%"
                :before-close="handleClose">

            <h1 style="margin-left: 10%;display: inline-block">题目</h1><el-input style="width: 30%;margin-bottom: 20px;margin-right: 10%;margin-left: 1%" placeholder="选项题目" v-model="testTopic" clearable></el-input>
            <el-select v-model="testAnswer" placeholder="答案" style="width: 80px">
                <el-option
                        v-for="item in options"
                        :key="item.testAnswer"
                        :label="item.testAnswer"
                        :value="item.testAnswer">
                </el-option>
            </el-select>
            <div style="width: 100%;margin: 20px;margin-left: 5%;">
                A.<el-input style="width: 30%;margin-right: 5%;margin-left: 1%" placeholder="A选项" v-model="testOptionA" clearable></el-input>
                B.<el-input style="width: 30%;margin-left: 1%" placeholder="B选项" v-model="testOptionB" clearable></el-input>
            </div>
            <div style="width: 100%;margin: 20px;margin-left: 5%;">
                C.<el-input style="width: 30%;margin-right: 5%;margin-left: 1%" placeholder="C选项" v-model="testOptionC" clearable></el-input>
                D.<el-input style="width: 30%;margin-left: 1%" placeholder="D选项" v-model="testOptionD" clearable></el-input>
            </div>

            <!--  插入取消和确定按钮-->
            <el-button type="primary" @click="refresh" style="margin-left:36%;width:100px">提交</el-button>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
        <!--添加选择题 end-->
    </div>


</template>

<script>
    /**自定义日期格式**/
    Date.prototype.format =function(format)
    {
        var o = {
            "M+" : this.getMonth()+1, //month
            "d+" : this.getDate(), //day
            "h+" : this.getHours(), //hour
            "m+" : this.getMinutes(), //minute
            "s+" : this.getSeconds(), //second
            "q+" : Math.floor((this.getMonth()+3)/3), //quarter
            "S" : this.getMilliseconds() //millisecond
        }
        if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
            (this.getFullYear()+"").substr(4- RegExp.$1.length));
        for(var k in o)if(new RegExp("("+ k +")").test(format))
            format = format.replace(RegExp.$1,
                RegExp.$1.length==1? o[k] :
                    ("00"+ o[k]).substr((""+ o[k]).length));
        return format;
    }
    /**自定义日期格式 end**/
    let i=0,j=0;
    export default {
        name: "addCourse",
        data(){
            return {
                fullscreenLoading : false, //加载
                dateTime:[], //获取选取时间
                startTime:[],  //开始时间
                endTime:[],  //结束时间
                isSection:false,  //确保选择时间后才显示章节

                teacherCourse: [], //老师所有课程
                courseId: '',  //选择课程i
                ruleForm: {
                    domains: [
                        {
                            userNo: this.$route.query.userName, //教师编号
                            courseId: this.courseId, //课程id
                            courseSection:'',  //章节
                            sectionVideo:'',  //视频
                            sectionCourseware:'',  //课件
                            startTime:'',  //开始时间
                            endTime:'',  //结束时间
                            newDate:new Date().format("yyyy-MM-dd hh:mm:ss") //创建时间
                        },
                    ],
                },
                /*选择题对话框*/
                dialogVisible: false, //对话框
                courseSectionIndex:'',
                testTopic:'', //题目
                testOptionA:'',//A
                testOptionB:'',//B
                testOptionC:'',//C
                testOptionD:'',//D
                testAnswer:'', //答案
                options: [{
                    testAnswer: 'A'
                },{
                    testAnswer: 'B'
                },{
                    testAnswer: 'C'
                },{
                    testAnswer: 'D'
                }]
            }
        },
        /**/
        mounted() { //也可以使用created函数（html构建前），这个函数是html构建后调用
            /*获取老师教的课程*/
            this.axios.get("/teacherClassCourse/selectOne", {
                params:{
                    userNo:this.$route.query.userName
                }
            }).then( res=>
                this.teacherCourse=res.data
            ).catch(
                error=>console.info(error)
            )
        },
        methods: {
            /*保存选择的时间*/
            saveTime(){ //保存开始 结束时间
                this.isSection=true //显示章节
                this.startTime=this.dateTime[0].format("yyyy-MM-dd hh:mm:ss") //改成自定义格式
                this.endTime=this.dateTime[1].format("yyyy-MM-dd hh:mm:ss")
                //console.info(this.endTime)
            },
            removeDomain(item) { //删除章节
                this.$confirm('将删除该章节, 是否确定?', '提示', { //确认框
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var index = this.ruleForm.domains.indexOf(item)
                    if (index !== -1) {
                        this.ruleForm.domains.splice(index, 1)
                        console.log(index)
                    }
                }).catch(() => {
                    this.$message({  //提示
                        type: 'warning',
                        message: '已取消删除'
                    });
                });
            },
            addDomain() { //增加章节
                this.ruleForm.domains.push({
                    userNo: this.$route.query.userName, //教师编号
                    courseId: this.courseId, //课程id
                    courseSection:'',  //章节
                    sectionVideo:'',
                    sectionCourseware:'',
                    startTime:this.startTime,
                    endTime:this.endTime,
                    newDate:this.ruleForm.domains[0].newDate,
                });
            },
            handleExceed() {  //选择文件上线限
                this.$message.warning("只能选 1 个文件");
            },
            beforeRemove(file) { //删除之前
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            onSuccess(response, file, fileList,index){ //上传课件成功方法
                index==0?this.ruleForm.domains[index].courseId=this.courseId:''
                index==0?this.ruleForm.domains[index].startTime=this.startTime:''
                index==0?this.ruleForm.domains[index].endTime=this.endTime:''
                this.ruleForm.domains[index].courseSection= index+1
                this.ruleForm.domains[index].sectionCourseware=response
            },
            onSuccess2(response, file, fileList,index){ //上传视频成功方法
                this.ruleForm.domains[index].courseSection= index+1
                this.ruleForm.domains[index].sectionVideo=response
                //console.info( this.ruleForm.domains);
            },
            submit(){ //发布课程
                let that=this
                this.$axios.post("/publishCourse/insert",this.ruleForm.domains,{
                    headers: {
                        "Content-Type": "application/json;charset=utf-8"  //头部信息
                    }
                }).then(function (response){
                    if(response.data>0){ //data>0提示成功，并跳转回到课程页面。否则提示失败
                        that.$message({
                            type: 'success',
                            message: '发布成功，请耐心等待管理员审核！'
                        });
                        that.fullscreenLoading = true,
                            setTimeout(() => {
                                that.$router.push({
                                    path:'/homepage/courseView',
                                    query:{
                                        userName:that.$route.query.userName
                                    }
                                }),
                                    that.fullscreenLoading = false
                            }, 1000);
                    }else{
                        this.$message.error('发布课程失败！')
                    }
                }).catch(error=>
                        this.$message.error('发布课程失败！')
                )
            },
            beforeUpload(file) {
                const isLt2M = file.size / 1024 / 1024 < 50     //这里做文件大小限制,小于10M
                if(!isLt2M) {
                    this.$message({
                        message: '上传文件大小不能超过 50MB!', //提示
                        type: 'warning' //提示样式
                    });
                }
            },
            beforeUpload2(file) {
                const isLt2M = file.size / 1024 / 1024 < 300     //这里做文件大小限
                if(!isLt2M) {
                    this.$message({
                        message: '上传视频大小不能超过 300MB!',
                        type: 'warning'
                    });
                }
                return isLt2M
            },
            /**
             * 选择题对话框
             * **/
            insertTest(index){
                this.courseSectionIndex=index
                this.dialogVisible = true
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },
            refresh(){ //提交并更新数据
                this.$confirm('确定添加吗？','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:"warning"
                }).then(()=>{
                    this.$axios.post("/test/insertTest",{
                        userNo: this.$route.query.userName, //教师编号
                        courseId: this.courseId, //课程id
                        courseSection:this.courseSectionIndex,//this.courseSection,
                        testTopic:this.testTopic, //题目
                        testOptionA:this.testOptionA,//A
                        testOptionB:this.testOptionB,//B
                        testOptionC:this.testOptionC,//C
                        testOptionD:this.testOptionD,//D
                        testAnswer:this.testAnswer
                    }).then(response=> {
                        this.$notify({
                            title: '成功',
                            message: '添加成功',
                            type: 'success'
                        })
                    }).catch(error=>{
                        this.$message({  //提示
                            type: 'error',
                            message: '添加失败！'
                        })
                    });
                    this.testTopic='', //题目
                        this.testOptionA='',//A
                        this.testOptionB='',//B
                        this.testOptionC='',//C
                        this.testOptionD='',//D
                        this.testAnswer='' //答案

                }).catch(()=>{
                    this.$message({  //提示
                        type: 'warning',
                        message: '已取消'
                    });
                })
            }
            /**
             * 选择题对话框 end
             * **/
        }
    }




</script>

<style scoped>

</style>