<template>
   <div v-loading="loaDing">
       <!-- 1.未发布测试-->
        <div v-show="!isShow " style="text-align: center;color: #494f54">
            快去叫老师发布测试吧n(*≧▽≦*)n
        </div>
       <!-- 2.进入测试-->
       <div v-show="isShow && aop==2 && isStatus==2 && clickMe==1">
           <el-button @click="clickTest">
               点击测试
           </el-button>
       </div>
       <!-- 3.测试题-->
        <div style="width: 100%;" v-show="isShow && aop==2 && isStatus==2 && clickMe==2">
            <h1 style="margin-left: 42%" >章 节 测 试</h1>
            <div v-for="(item,index) in courseTest" :key="item.testTopic+index" style="margin-left:10%;">
                <div style="margin-bottom: 5px;margin-top: 15px;">{{index+1+'.  '}}{{item.testTopic}}</div>
                <el-radio v-model="answer[index].optionAnswer" label="A">A.{{item.testOptionA}}</el-radio>
                <el-radio v-model="answer[index].optionAnswer" label="B">B.{{item.testOptionB}}</el-radio>
                <el-radio v-model="answer[index].optionAnswer" label="C">C.{{item.testOptionC}}</el-radio>
                <el-radio v-model="answer[index].optionAnswer" label="D">D.{{item.testOptionD}}</el-radio>
            </div>
            <el-button @click="submitAnswer" style="margin-left: 40%;margin-top: 20px">提 交</el-button>
        </div>
       <!-- 4.完成测试-->
       <h1 v-show="clickMe==3">完成测试</h1>
       <!-- 5.查看分数-->
        <div v-show="aop==1">
            <h1 style="margin-left: 42%;font-size: 30px;margin-top: 0;margin-bottom: 0px">测试查看</h1>
            <div style="margin-left: 45%;margin-bottom: -20px;font-size: 18px;color: red">{{'分数  '+testSectionScore}}</div>
            <div v-for="(list,index) in scoreList" :key="index+list.testTopic" style="margin-top:40px;margin-left: 25%">
                <div style="margin-bottom: 5px;margin-top: 15px;">
                    {{index+1+'.  '}}{{list.testTopic}}
                    <span style="margin-left: 10px;">{{'('+list.answer.optionAnswer+')'}}</span>
                </div>
                <div>
                    <span style="margin-left: 30px;color: red">{{'正确答案'+list.testAnswer}}</span>
                </div>
                <div class="div-span">
                    <div>A.{{list.testOptionA}}</div>
                    <div>B.{{list.testOptionB}}</div>
                    <div>C.{{list.testOptionC}}</div>
                    <div>D.{{list.testOptionD}}</div>
                </div>
            </div>
        </div>
       <!-- 4.管理员页面-->
       <div v-show="isStatus==1">
           <div v-for="(item2,index) in courseTest" :key="index+item2.testTopic+index" style="margin-top:40px;margin-left: 25%">
               <div style="margin-bottom: 5px;margin-top: 15px;">
                   {{index+1+'.  '}}{{item2.testTopic}}
               </div>
               <div class="div-span">
                   <div>A.{{item2.testOptionA}}</div>
                   <div>B.{{item2.testOptionB}}</div>
                   <div>C.{{item2.testOptionC}}</div>
                   <div>D.{{item2.testOptionD}}</div>
               </div>
           </div>
       </div>

    </div>

</template>

<script>
    export default {
        name: "singleCourseSub3",
        data(){
            return {
                clickMe:this.$route.query.clickMe, //开始测试的按钮
                loaDing:false, //加载
                isShow: true, //判断有没有测试题的显示
                courseTestList: [], //存放测试题
                answer: [],//申明存放答案的数组
                userNo: this.$route.query.userNo, //学生id
                scoreList:this.$route.query.score,//学生成绩和答案
                testSectionScore:this.$route.query.testSectionScore,//分数
                isStatus:this.$route.query.isStatus?1:2 ,//显示管理员页面
            }
        },
        computed:{ //每次进入页面自动更新数据
            courseTest(){ //获取测试题
                //console.info(this.isStatus)
                this.clickMe=this.$route.query.clickMe, //开始测试的按钮
                this.scoreList=this.$route.query.score//学生成绩和答案
                this.courseTestList=this.$route.query.courseTestList; //获取选择题
                this.courseTestList.length==0?this.isShow=false:this.isShow=true //没有题的时候显示“没有发布测试”
                this.answer=[]; //重置保存答案的数组
                for(let i=0;i<this.courseTestList.length;i++){ //创建一个数组装答案
                    this.answer.push({
                        userNo:this.userNo,
                        courseId:this.courseTestList[i].courseId,
                        testSection:this.courseTestList[i].courseSection,
                        testTopic:this.courseTestList[i].testTopic,
                        optionAnswer:''
                    })
                }
                return this.courseTestList;
            },
            aop(){
                this.loaDing=true, //启动加载
                    setTimeout( ()=> {
                            this.loaDing=false
                        },700
                    )
                this.testSectionScore=this.$route.query.testSectionScore//成绩
                return this.$route.query.isScore
            },
        },

        methods:{
            clickTest(){//点击开始测试
                this.$confirm("确定开始测试吗？","提示",{
                    confirmButtonText:"确定",
                    cancelButtonText:"取消",
                    type:"warning"
                }).then(()=>{
                    this.loaDing=true, //启动加载
                        setTimeout( ()=> {
                                this.loaDing=false
                            },1000
                        )
                    this.clickMe=2;
                }).catch(()=>{})
            },
            submitAnswer(){ //提交测试
                for(let i=0;i<this.answer.length;i++){ //判断是否完成所有选择题
                    if(this.answer[i].optionAnswer==''){
                        //console.info(this.answer[i].optionAnswer)
                        this.$alert('请完成所有选项后在提交！','提示',{
                            confirmButtonText: '确定',
                        }).catch();
                        break
                    }else if(i==this.answer.length-1){
                        this.$axios.post("/answer/insert",this.answer,{
                            headers: {
                                "Content-Type": "application/json;charset=utf-8"  //头部信息
                            }
                        }).then(response=>{
                            let sum=0
                            if(response.data>0){   //插入数据成功,则计算成绩
                                for(let j=0;j<this.answer.length;j++){
                                    if(this.courseTestList[j].testAnswer==this.answer[j].optionAnswer){ //判断成绩是否相等
                                        sum += 100/this.answer.length
                                    }
                                };
                                this.$axios.post("/score/insert", { //插入分数表
                                    userNo:this.userNo,
                                    courseId:this.courseTestList[i].courseId,
                                    testSection:this.courseTestList[i].courseSection,
                                    testSectionScore:sum
                                }).then(()=>{
                                    this.$message({
                                        message: '提交成功！',
                                        type: 'success'
                                    });
                                    this.clickMe=3; //完成了测试
                                    this.loaDing=true, //启动加载
                                        setTimeout( ()=> {
                                                this.loaDing=false
                                            },700
                                        )

                                });
                            }
                        }).catch(error=>{
                            console.info(error)
                        });
                    }
                }
            }
        }
    }
</script>

<style>
    .div-span{
        margin-top: 10px;
    }
    .div-span>div{
        float: left;
        margin-left: 30px;
    }
</style>