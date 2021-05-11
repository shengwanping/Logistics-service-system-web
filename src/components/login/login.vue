<template>
    <!--背景图片-->
    <div class="background-image">
        <!--    登录窗口-->
        <div class="login-interface">

            <p>管理端登录</p>
            <!--        用户名和密码框-->
            <el-input class="el-input-1"
                    placeholder="请输入用户名"
                    v-model="user.username"
                    prefix-icon="el-icon-user-solid"
                    clearable
            >
            </el-input>
            <el-input class="el-input-1"
                    placeholder="请输入密码"
                    prefix-icon="el-icon-lock"
                    v-model="user.password"
                    show-password
            >
            </el-input>
            <!--        滑动验证-->
            <div class="drag" ref="dragDiv">
                <div class="drag_bg"></div>
                <div class="drag_text">{{confirmWords}}</div>
                <div ref="moveDiv"
                     @mousedown="mousedownFn($event)"
                     :class="{'handler_ok_bg':confirmSuccess}"
                     class="handler handler_bg"
                     style="position: absolute;top: 0px;left: 0px;">

                </div>
            </div>
            <!--        登录按钮-->
            <el-button class="el-button-1"
                    type="primary"
                    @click="loginButton"
                    v-loading.fullscreen.lock="fullscreenLoading"
            >
                登 录
            </el-button>
        </div>
    </div>
</template>

<script>
    /**
     * HTML: login.html
     * author: 盛万坪
     * date: 2020-11-5
     **/
    export default {
        data(){
            return {
                slider: false,
                fullscreenLoading:false, //登录时成功时Loading加载
                /**
                 *  滑块验证
                 **/
                beginClientX:0,           /*距离屏幕左端距离*/
                mouseMoveStata:false,     /*触发拖动状态  判断*/
                maxwidth:'',               /*拖动最大宽度，依据滑块宽度算出来的*/
                confirmWords:'拖动滑块验证',   /*滑块文字*/
                confirmSuccess:false,          /*验证成功判断*/

                user:{
                    username: 'admin',
                    password: '123456'
                }
            }
        },

        methods:{
            //登录验证
            loginButton(){
                if(this.user.username == ''){
                    this.$message({  //提示
                        type: 'warning',
                        message: '请输入用户名！'
                    })
                }else if(this.user.password == ''){
                    this.$message({  //提示
                        type: 'warning',
                        message: '请输入密码！'
                    })
                }else if(this.slider==false){
                    this.$message({  //提示
                        type: 'warning',
                        message: '请安全验证！'
                    })
                }

                //后台数据库验证
                if(this.user.username != '' && this.user.password != '' && this.slider){
                    let that=this

                    this.fullscreenLoading = true; //Loading加载
                    setTimeout(() => {
                        this.fullscreenLoading = false;
                    }, 2000);
                    /*到controller查询并返回数据*/
                    that.axios.post("/user/login/admin",
                        that.user
                    ).then(function(res) {
                        if(res.data.code == 0){
                            that.$router.push({
                                path:'/homepage',
                                query:{
                                    menuList:JSON.stringify(res.data.data), //菜单列表
                                    name:res.data.data[0].name,  //用户名
                                    user:that.user
                                }
                            })
                        }else{
                            that.$message.error(res.data.msg);
                        }
                    }).catch(()=>
                        that.$message.error('系统错误！')
                    );
                }

            },
            /**
             *  滑块验证
             **/
                mousedownFn:function (e) {
                    if(!this.confirmSuccess){
                        e.preventDefault && e.preventDefault();   //阻止文字选中等 浏览器默认事件
                        this.mouseMoveStata = true;
                        this.beginClientX = e.clientX;
                    }
                },        //mousedoen 事件
                successFunction(){
                    this.confirmSuccess = true
                    this.confirmWords = '验证通过';
                    if(window.addEventListener){
                        document.getElementsByTagName('html')[0].removeEventListener('mousemove',this.mouseMoveFn);
                        document.getElementsByTagName('html')[0].removeEventListener('mouseup',this.moseUpFn);
                    }else {
                        document.getElementsByTagName('html')[0].removeEventListener('mouseup',()=>{});
                    }
                    document.getElementsByClassName('drag_text')[0].style.color = '#fff'
                    document.getElementsByClassName('handler')[0].style.left = this.maxwidth + 'px';
                    document.getElementsByClassName('drag_bg')[0].style.width = this.maxwidth + 'px';
                },                //验证成功函数
                mouseMoveFn(e){
                    if(this.mouseMoveStata){
                        let width = e.clientX - this.beginClientX;
                        if(width>0 && width<=this.maxwidth){
                            document.getElementsByClassName('handler')[0].style.left = width + 'px';
                            document.getElementsByClassName('drag_bg')[0].style.width = width + 'px';
                        }else if(width>this.maxwidth){
                            this.slider=true;
                            this.successFunction();
                        }
                    }
                },                   //mousemove事件
                moseUpFn(e){
                    this.mouseMoveStata = false;
                    var width = e.clientX - this.beginClientX;
                    if(width<this.maxwidth){
                        document.getElementsByClassName('handler')[0].style.left = 0 + 'px';
                        document.getElementsByClassName('drag_bg')[0].style.width = 0 + 'px';
                    }
                }                       //mouseup事件
            },
            /**
             *  滑块验证
            **/
            mounted(){
                this.maxwidth = this.$refs.dragDiv.clientWidth - this.$refs.moveDiv.clientWidth;
                document.getElementsByTagName('html')[0].addEventListener('mousemove',this.mouseMoveFn);
                document.getElementsByTagName('html')[0].addEventListener('mouseup',this.moseUpFn)
            }
        }
</script>

<style>
    /**
     * HTML: login.html
     * author: 盛万坪
     * date: 2020-11-5
    **/

    /************
     *  1.用户名密码框样式
     ***********/
    .background-image{/*背景图片*/
        width: 100%;
        height: 760px;
        background: url("./images/loginBackground.jpg") no-repeat;/*不重复*/
        background-size: cover; /*覆盖全屏*/
        position: relative;
        opacity: 0.9;
        margin-top: -10px;
    }
    .login-interface{/*登录界面窗口*/
        position: absolute;
        left: 35%;
        top: 25%;
        width: 400px;
        height: 290px;
        background-color: black;
        opacity: 0.7;
        color: white;
        text-align: center;
    }
    .login-interface>p{
        margin-top: 30px;
        margin-bottom: 5px;
    }
    .el-input-1{ /*用户名，密码框*/
        /*改变光标颜色*/
        caret-color:#0000FF;/*color: #7abaff;会改变字体颜色*/
        outline: none;/*取消轮廓,让点击的时候没有黑色边框轮廓*/
        width: 300px !important;
        margin-top: 10px !important;
        border: #0000FF 1px solid !important;
        border-radius: 5px;
        opacity: 0.8;
    }
    .el-input-1:hover{
        box-shadow:0 0 6px #0000FF ;/*盒子阴影0，0是阴影的方向，5px是蔓延的距离*/
        outline: none ;
    }
    .el-button-1{
        width: 300px;
        margin-top: 20px!important;
    }
    /***********
     *  2.滑动验证样式
     ************/
    .drag{
        position: relative;
        background-color: #e8e8e8;
        width: 300px;
        height: 34px;
        line-height: 34px;
        text-align: center;
        margin: 0 auto;
        margin-top: 10px;
        color: #2c3e50;
    }
    .handler{
        width: 40px;
        height: 32px;
        border: 1px solid #ccc;
        cursor: move;
    }
    .handler_bg{
        background: #fff url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0ZDhlNWY5My05NmI0LTRlNWQtOGFjYi03ZTY4OGYyMTU2ZTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTEyNTVEMURGMkVFMTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTEyNTVEMUNGMkVFMTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MTc5NzNmZS02OTQxLTQyOTYtYTIwNi02NDI2YTNkOWU5YmUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NGQ4ZTVmOTMtOTZiNC00ZTVkLThhY2ItN2U2ODhmMjE1NmU2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+YiRG4AAAALFJREFUeNpi/P//PwMlgImBQkA9A+bOnfsIiBOxKcInh+yCaCDuByoswaIOpxwjciACFegBqZ1AvBSIS5OTk/8TkmNEjwWgQiUgtQuIjwAxUF3yX3xyGIEIFLwHpKyAWB+I1xGSwxULIGf9A7mQkBwTlhBXAFLHgPgqEAcTkmNCU6AL9d8WII4HOvk3ITkWJAXWUMlOoGQHmsE45ViQ2KuBuASoYC4Wf+OUYxz6mQkgwAAN9mIrUReCXgAAAABJRU5ErkJggg==") no-repeat center;
    }
    .handler_ok_bg{
        background: #fff url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0ZDhlNWY5My05NmI0LTRlNWQtOGFjYi03ZTY4OGYyMTU2ZTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDlBRDI3NjVGMkQ2MTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDlBRDI3NjRGMkQ2MTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDphNWEzMWNhMC1hYmViLTQxNWEtYTEwZS04Y2U5NzRlN2Q4YTEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NGQ4ZTVmOTMtOTZiNC00ZTVkLThhY2ItN2U2ODhmMjE1NmU2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+k+sHwwAAASZJREFUeNpi/P//PwMyKD8uZw+kUoDYEYgloMIvgHg/EM/ptHx0EFk9I8wAoEZ+IDUPiIMY8IN1QJwENOgj3ACo5gNAbMBAHLgAxA4gQ5igAnNJ0MwAVTsX7IKyY7L2UNuJAf+AmAmJ78AEDTBiwGYg5gbifCSxFCZoaBMCy4A4GOjnH0D6DpK4IxNSVIHAfSDOAeLraJrjgJp/AwPbHMhejiQnwYRmUzNQ4VQgDQqXK0ia/0I17wJiPmQNTNBEAgMlQIWiQA2vgWw7QppBekGxsAjIiEUSBNnsBDWEAY9mEFgMMgBk00E0iZtA7AHEctDQ58MRuA6wlLgGFMoMpIG1QFeGwAIxGZo8GUhIysmwQGSAZgwHaEZhICIzOaBkJkqyM0CAAQDGx279Jf50AAAAAABJRU5ErkJggg==") no-repeat center;
    }
    .drag_bg{
        background-color: #7ac23c;
        height: 34px;
        width: 0px;
    }
    .drag_text{
        position: absolute;
        top: 0px;
        width: 100%;text-align: center;
        -moz-user-select: none;
        -webkit-user-select: none;
        user-select: none;
        -o-user-select:none;
        -ms-user-select:none;
    }
</style>