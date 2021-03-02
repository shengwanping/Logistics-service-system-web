<template>
    <div style="margin-left: 35%">
        <div ref="myChart0" :style="{width: '300px', height: '300px',float:'left'}"></div>
    </div>
</template>

<script>
    export default {
        name: "courseProgress",
        mounted(){
            this.drawLine();
        },
        methods: {
            drawLine(){
                let yList = [], xList = [];
                this.$axios.get("/progress/teacherQueryProgress",{
                    params:{
                        userNo:this.$route.query.userName
                    },
                }).then(res=>{
                    for(let i=0;i<res.data.length;i++){
                        if(res.data[i][0]!=undefined){
                            xList[i]=res.data[i][0].class_no
                            yList[i]=res.data[i][0].avg
                        }else{
                            xList[i]=(res.data[i])
                            yList[i]=0
                        }
                    }
                    console.info(xList)
                    console.info(yList)

                    let myChart = this.$echarts.init(this.$refs.myChart0)
                    // 绘制图表
                    var bar = {
                        title: { text: '班级学习进度' },
                        tooltip: {}, //配置提示信息
                        xAxis: { //配置要在 X 轴显示的项
                            data: xList
                        },
                        yAxis: {}, //配置要在 Y 轴显示的项
                        series: [{ //每个系列通过 type 决定自己的图表类型
                            name: '学习进度',
                            type: 'bar', //柱状/条形图
                            data: yList
                        }]
                    };
                    myChart.setOption(bar);
                }).catch()
            }
        }
    }
</script>

<style >

</style>