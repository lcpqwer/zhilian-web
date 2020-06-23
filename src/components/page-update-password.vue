<template>
    <div class="page-forget-password">
        <div class="forget-header">
            <div class="center-box d-f">
                <div class="left d-f">
                    <div class="logo">
                        <img src="../assets/images/logo-白色.png" alt="联置科技">
                    </div>
                    <span>账号安全中心</span>
                    <span>修改密码</span>
                </div>
                <router-link :to="{name:'login'}">登录</router-link>
            </div> 
            <div class="step">
                <ul class="d-f">
                    <li>
                        <span class="num" :class="{'on':step1||step2||step3||step4}">1</span>
                        <span class="txt" :class="{'on':step1||step2||step3||step4}">填写账号</span>
                    </li>
                    <li><i :class="{'on':step1,'active':step2||step3||step4}"></i></li>
                    <li>
                        <span class="num" :class="{'on':step2||step3||step4}">2</span>
                        <span class="txt" :class="{'on':step2||step3||step4}">身份验证</span>
                    </li>
                    <li><i :class="{'on':step2,'active':step3||step4}"></i></li>
                    <li>
                        <span class="num" :class="{'on':step3||step4}">3</span>
                        <span class="txt" :class="{'on':step3||step4}">重置密码</span>
                    </li>
                    <li><i :class="{'on':step3,'active':step4}"></i></li>
                    <li>
                        <span class="num" :class="{'on':step4}">4</span>
                        <span class="txt" :class="{'on':step4}">完成</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="center-box">
            <!-- 步骤1 -->
            <div class="step1" v-show="step1">
                <div class="phone">
                    <label for="phone">手机号码：</label>
                    <input type="text" id="phone" name="phone" placeholder="请输入手机号码" v-model="params.phone" required pattern="^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$">
                </div>
                <div class="code">
                    <label for="code">验证码：</label>
                    <div class="code-box d-f">
                        <input type="text" id="code" name="code" placeholder="请输入图形验证码" v-model="params.imgCode" required>
                        <div class="code-content">
                            <div class="code-img">
                                <img :src="codeImg" alt="图片加载失败">
                            </div>
                            <span @click="changeCodeImg()">看不清,换一张</span>
                        </div>
                    </div>
                </div>
                <button @click="toStep2()">确定</button>
            </div>
            <!-- 步骤2 -->
            <div class="step2 step1" v-show="step2">
                <p>验证码已发送至您的手机</p>
                <div>
                    <label for="code-inp">验证码：</label>
                    <input type="text" id="code-inp" name="code-inp" v-model="params.code" required>
                    <p @click="resetCode()">没有收到验证码？重新获取</p>
                </div>
                <button @click="toStep3()">确定</button>
            </div>
            <!-- 步骤3 -->
            <div class="step3 step1" v-show="step3">
                <div class="password">
                    <label for="psw">设置密码：</label>
                    <input type="password" id="psw" name="psw" placeholder="设置您的登录密码" v-model="params.pwd" required>
                </div>
                <div class="repeat-password">
                    <label for="reppsw">确认密码：</label>
                    <input type="password" id="reppsw" name="reppsw" placeholder="请再次输入您的登录密码" v-model="params.pwd_second" required>
                </div>
                <button @click="toStep4()">确定</button>
            </div>
            <!-- 步骤4 -->
            <div class="step4 step1" v-show="step4">
                <i class="icon iconfont">&#xe60a;</i>
                <p>登录密码设置成功！下次登录请输入新的密码</p>
                <button @click="toLogin()">确定</button>
            </div>
        </div>
        <AppAlertComponent ref="appAlert"></AppAlertComponent>
        <AppFootComponent></AppFootComponent>
    </div>
</template>

<script>
    import AppFootComponent from '../components/app-foot.vue'
    import service from '../services/service.js'
    import AppAlertComponent from './app-alert.vue'

    export default {
        name:'page-forget-password',
        components:{
            AppFootComponent,
            AppAlertComponent   
        },
        data(){
            return{
                step1:true,
                step2:false,
                step3:false,
                step4:false,
                codeImg:'https://login.asap-get.com/lianzhi/index/Login/get_img_code',
                params:{
                    phone:'',
                    code:'',
                    imgCode:'',
                    pwd:'',
                    pwd_second:'',
                    userId:''
                }
            }
        },
        methods:{
            resetCode(){
                let formdata = new FormData()
                formdata.append('phone',this.params.phone)
                service.resetCode(formdata)
            },
            toStep2(){
                if(this.params.phone){
                    let formdata=new FormData()
                    formdata.append('phone',this.params.phone)
                    formdata.append('codeimg',this.params.imgCode)

                    service.userTest(formdata).then((res)=>{
                        // window.console.log(res)
                        if(res.data.code===200){
                            this.step1=false
                            this.step2=true
                            this.step3=false
                            this.step4=false
                            this.params.userId=res.data.Id
                            this.resetCode()
                        }else{
                            this.$refs.appAlert.show(res.data.msg,true)
                            this.changeCodeImg()
                        }
                    })
                }else{
                    this.$refs.appAlert.show('请输入手机号码',true)
                }
            },
            toStep3(){
                if(this.params.code){
                    let formdata = new FormData()
                    formdata.append('reset_code',this.params.code)
                    service.verifyCode(formdata).then((res)=>{
                        window.console.log(res)
                        if(res.data.code===200){
                            this.step1=false;
                            this.step2=false;
                            this.step3=true;
                            this.step4=false;
                        }else{
                            this.$refs.appAlert.show(res.data.msg,true)
                        }
                    })
                    
                }else{
                    this.$refs.appAlert.show('请输入验证码',true)
                }
                
            },
            toStep4(){
                if(this.params.pwd&&this.params.pwd_second){
                    let formdata=new FormData()
                    formdata.append('pwd',this.params.pwd)
                    formdata.append('pwd_second',this.params.pwd_second)
                    formdata.append('Id',this.params.userId)
                    formdata.append('jwt',sessionStorage.getItem("JWT"))
                    service.updatePassword(formdata).then((res)=>{
                        // window.console.log(res)
                        if(res.data.code===200){
                            this.step1=false;
                            this.step2=false;
                            this.step3=false;
                            this.step4=true;
                            if(sessionStorage.getItem("USER")){
                                sessionStorage.removeItem("USER")
                                sessionStorage.removeItem("JWT")
                                sessionStorage.removeItem("TOKEN")
                            }
                        }else{
                            this.$refs.appAlert.show(res.data.msg,true)
                        }
                    })
                }else{
                    this.$refs.appAlert.show('请输入密码',true)
                }
            },
            toLogin(){
                this.$router.push({path:'/login'})
            },
            changeCodeImg(){
                let num=Math.ceil(Math.random()*10);//生成一个随机数（防止缓存）
                this.codeImg='https://login.asap-get.com/lianzhi/index/Login/get_img_code?'+num;
            }
        }
    }
</script>

<style scoped>
    .page-forget-password>.center-box{
        min-height: 738px;
    }
    /* 头部 */
    .forget-header{
        background-color: #006bbd;
    }
    .forget-header .center-box{
        height: 124px;
        color:#fff;
        justify-content: space-between;
        align-items: center;
    }
    .forget-header .center-box>a{
        color:#fff;
    }
    .center-box .left{
        align-items: center;
    }
    .center-box .left>span{
        padding:0 10px;
        line-height: 44px;
    }
    .center-box .left>span+span{
        border-left:1px solid #66a6d7;
    }
    .forget-header .logo{
        width: 284px;
    }
    /* 步骤 */
    .step{
        background-color: #f4f2ee;
        border-bottom:2px solid #ccc;
    }
    .step ul{
        height: 124px;
        margin:0 auto;
        justify-content: center;
        align-items: center;
    }
    .step ul li{
        text-align: center;
    }
    .step span,
    .step i{
        display: block;
    }
    .step span.txt{
        color:#aaa;
    }
    .step span.num{
        width: 45px;
        height: 45px;
        margin:0 auto 10px;
        background-color: #d8d8d8;
        border-radius: 50%;
        font-size: 18px;
        font-weight: bold;
        color:#fff;
        line-height: 45px;
        text-align: center;
    }
    .step i{
        width: 201px;
        height: 3px;
        margin:0 17px;
        background-color: #d8d8d8;
        transform: translateY(-15px);
    }
    .step span.num.on{
        background-color: #006bbd;
    }
    .step i.on{
        background-image: linear-gradient(to right,#006bbd,#d8d8d8);
    }
    .step i.active{
        background-color:#006bbd;
    }
    .step span.txt.on{
        color:#333;
    }

    /* 步骤1 */
    .step1,
    .step2,
    .step3,
    .step4{
        width: 335px;
        margin:80px auto 0;
    }
    .step1 input{
        height: 40px;
        border:1px solid #ccc;
        border-radius: 5px;
        text-indent: 10px;
    }
    .step1 label{
        display: block;
        padding-bottom:15px;
    }
    .step1>div{
        width: 280px;
        margin: 0 auto;
    }
    .step1>div+div{
        margin-top:30px;
    }
    .step1 div.phone input{
        width: 280px;
    }
    .step1 div.code input{
        width: 183px;
        margin-right:18px;
    }
    .code-content>div{
        overflow: hidden;
        width: 75px;
        height: 23px;
        border:1px solid #ccc;
        border-radius: 5px;
    }
    .code-content>span{
        font-size: 12px;
        color:#ccc;
        cursor: pointer;
    }
    .step1 button{
        width: 100%;
        height: 40px;
        margin-top:42px;
        background-color: #006bbd;
        border-radius: 5px;
        font-size: 18px;
        color:#fff;
    }
    /* 步骤2 */
    .step2>p{
        width: 280px;
        margin:0 auto 40px;
        text-align: center;
    }
    .step2 input,
    .step3 input{
        width: 280px;
    }
    .step2>div>p{
        margin-top:15px;
        font-size: 12px;
        color:#ccc;
        text-align: right;
        cursor: pointer;
    }
    /* 步骤4 */
    .step4{
        text-align: center;
    }
    .step4 i{
        font-size: 150px;
        color:#006bbd;
    }
</style>