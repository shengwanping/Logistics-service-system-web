<template>
    <div style="text-align: center">
        <div style="margin-bottom: 10px;margin-top: -10px">
            <h1 >章节{{testSection}}视频播放</h1>
            <el-progress type="circle" :percentage="progressValue" :width="40"
                         style=""></el-progress>
        </div>

            <video ref="video" id="video" :src="sectionVideo" style="width: 700px;">
                <span>您的浏览器不支持video标签，请换个浏览器试一下吧</span>
            </video>
            <div>
                <progress id="progress" value="0" max="100" style="width: 450px"></progress>
                <span id="curTime">00:00</span>/<span id="totalTime">01:31</span>
            </div>
            <div>
                <button id="btn_play" style="margin-right:10px">播放</button>
                <button id="btn_pause" style="margin-right:10px">暂停</button>
                <button id="btn_muted" style="margin-right:10px">静音</button>
                <input type="range" value='1' name="range" id="btn_volume" min="0" max="1" step='0.1' style="margin-right: 10px">
                <button id="btn_go" style="margin-right: 10px">加速</button>
                <button id="btn_back">减速</button>
            </div>
    </div>
</template>

<script>

    export default {
        name: 'singleCourseSub2',
        data(){
          return{
              progressValue:0, //视频进度
              courseId:'', //课程id
              testSection:"",  //章节
              uerNo:this.$route.query.userNo //学生id
          }
        },
        computed:{ //每次进入页面自动更新数据
            sectionVideo(){
                this.testSection=this.$route.query.section.courseSection //章节
                this.courseId=this.$route.query.section.courseId //课程id
                this.progressValue=0;
                return this.$route.query.section.sectionVideo;
            },
        },

        mounted() {
            let video=document.getElementById("video");
            let btn_play = document.getElementById('btn_play');
            let btn_pause = document.getElementById('btn_pause');
            let btn_muted = document.getElementById('btn_muted');
            let btn_volume = document.getElementById('btn_volume');
            let btn_go = document.getElementById('btn_go');
            let btn_back = document.getElementById('btn_back');
            let pro = document.getElementById('progress');
            let curTimeSpan = document.getElementById("curTime");
            let totalTimeSpan=document.getElementById("totalTime");


            /**显示视频总时间**/
            video.oncanplay=function(){//oncanplay当视频正常显示

                let tss=Math.floor(video.duration/60);//duration返回音频/视频的总长度（以秒计），计算分
                let tmm=Math.floor(video.duration%60);//计算秒，并转换为数字类型
                tss=tss<10?('0'+tss):tss;//当tss小于10，在前面加个0，否则不变
                tmm=tmm<10?('0'+tmm):tmm;
                totalTimeSpan.innerHTML=tss+':'+tmm;//显示视频总时间
            }

            /**设置播放和暂停按钮**/
            btn_play.disabled=false;//disabled禁用，对button按钮起禁用作用
            btn_pause.disabled=true;
            btn_play.onclick=function () {//点击播放时
                video.play();//play()播放视频
                btn_play.disabled=true;//播放禁用
                btn_pause.disabled=false;//暂停开启
            }
            btn_pause.onclick=function () {//点击暂停时
                video.pause();//pause()暂停视频
                btn_play.disabled=false;
                btn_pause.disabled=true;
            }

            /**静音**/
            btn_muted.onclick=function () {
                video.muted=!video.muted;//取反，点击静音时禁用，点击取消静音时取消禁音
                btn_muted.innerHTML=video.muted?"取消静音":"静音";
            }

            /**调节音量**/
            btn_volume.onchange=function () {//change改变，当改音量条的时候
                video.volume=btn_volume.value;//volume视频音量，等于调后的音量
            }

            /**增加播放速度，减慢播放速度**/
            btn_go.onclick=function () {
                video.playbackRate<2?video.playbackRate += 0.1:'';//playbackRate视频播放速度
            }
            btn_back.onclick=function () {
                video.playbackRate>0.6?video.playbackRate-=0.1:'';
            }

            let _this=this
            /**用进度条修改视频播放时间段**/
            pro.onclick=function(event){
                let x=event.offsetX;//设置或获取鼠标指针位置相对于触发事件的对象的 x 坐标
                let nowTime =x/this.offsetWidth*video.duration //当前进度条x除以进度条总长度offsetWidth，乘视频总时间duration，等于视频播放的时间段currentTime

                if(nowTime<_this.progressValue*video.duration/100){ //必须小于自己所看得最大时间，否则不能拖动
                    video.currentTime=nowTime;
                }else{
                    video.currentTime=_this.progressValue*video.duration/100;//可以动的最大时间段
                }
            }

            /**获取视频当前时间，且根据视频播放时间段自动修改进度条长度**/
            video.ontimeupdate=function () {//timeupdate当目前的播放位置已更改时
                pro.value=video.currentTime/video.duration*100;//视频当前时间currentTime，除以总时间duration，再乘100为进度条显示值pro.value
                let ss=Math.floor(video.currentTime/60);
                let mm=Math.floor(video.currentTime%60);
                ss=ss<10?('0'+ss):ss;
                mm=mm<10?('0'+mm):mm;
                curTimeSpan.innerHTML=ss+':'+mm;//显示当前观看到的视频时间
                setTimeout(()=>{ //每隔一秒记录时长
                    let maxTime = parseInt(video.currentTime/video.duration*100);
                    _this.$axios.post("/score/insertByMaxTime",{ //大于保存时间则插入数据返回-1；否则没有插入数据，返回数据库最大时长
                        userNo:_this.uerNo ,
                        courseId:_this.courseId ,
                        testSection:_this.testSection ,
                        maxTime:maxTime
                    }).then(response=>{
                        if(response.data == -1){
                            _this.progressValue=maxTime
                        }else{
                            _this.progressValue=response.data
                        }
                    }).catch(error=>{

                    })
                },1000)
            }
        },

    }

</script>

<style >

</style>