<template>

    <div>
        <div ref="myChart" :style="{width: '380px', height: '300px',float:'left'}"></div>
        <div ref="myChart2" :style="{width: '380px', height: '300px',float:'left'}"></div>
        <div ref="myChart3" :style="{width: '380px', height: '300px',float:'left'}"></div>
    </div>

</template>

<script>
    export default {
        name: 'mainPage',
        mounted(){
            this.drawLine();
        },
        methods: {
            drawLine(){
                    /**
                 * 1. 柱状/条形图
                 * **/
                // 基于准备好的dom，初始化echarts实例
                let myChart = this.$echarts.init(this.$refs.myChart)
                // 绘制图表
                var bar = {
                    title: { text: '条形图' },
                    tooltip: {}, //配置提示信息
                    xAxis: { //配置要在 X 轴显示的项
                        data: ["17级1班","17级2班","18级1班","18级2班"]
                    },
                    yAxis: {}, //配置要在 Y 轴显示的项
                    series: [{ //每个系列通过 type 决定自己的图表类型
                        name: '销量',
                        type: 'bar', //柱状/条形图
                        data: [ 33,20, 76, 10]
                    }]
                };
                /**
                 * 2. 折线/面积图
                 * **/
                let myChart2 = this.$echarts.init(this.$refs.myChart2)
                // 指定图表的配置项和数据
                var line = {
                    title: {
                        text: '折线图'
                    },
                    tooltip: {},
                    legend: {
                        data:['折线/面积图']
                    },
                    xAxis: {
                        data: ["20171","20172","20181","20182"]
                    },
                    yAxis: {},
                    series: [{
                        name: '',
                        type: 'line',//折线/面积图
                        data: [5, 20, 36, 10, 10, 20]
                    }]
                };
                /**
                 * 3. 饼图
                 * **/
                let myChart3 = this.$echarts.init(this.$refs.myChart3)
                // 指定图表的配置项和数据
                var pie = {
                    title: {
                        text: '饼图'
                    },
                    tooltip: {},
                    legend: {
                        data:['饼图']
                    },
                    series: [{
                        name: '测试',
                        type: 'pie',//饼图
                        data: [5, 20, 36, 10, 10, 20]
                    }]
                };
                myChart.setOption(bar);
                myChart2.setOption(line);
                myChart3.setOption(pie);

            }
        }
    }
</script>

<style >

</style>