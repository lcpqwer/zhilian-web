<template>
    <div class="page-forget-password">
        <div class="forget-header">
            <div class="center-box d-f">
                <div class="left d-f">
                    <div class="logo">
                        <img src="../assets/images/logo-白色.png" alt="联置科技">
                    </div>
                    <span>账号安全中心</span>
                    <span>账号绑定</span>
                </div>
                <router-link :to="{name:'login'}">登录</router-link>
            </div> 
            <div class="step">
                <ul class="d-f">
                    <li>
                        <span class="num" :class="{'on':step2||step3||step4}">1</span>
                        <span class="txt" :class="{'on':step2||step3||step4}">身份验证</span>
                    </li>
                    <li><i :class="{'on':step2,'active':step3||step4}"></i></li>
                    <li>
                        <span class="num" :class="{'on':step3||step4}">2</span>
                        <span class="txt" :class="{'on':step3||step4}">输入新的手机号</span>
                    </li>
                    <li><i :class="{'on':step3,'active':step4}"></i></li>
                    <li>
                        <span class="num" :class="{'on':step4}">3</span>
                        <span class="txt" :class="{'on':step4}">完成</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="center-box">
            
            <!-- 步骤2 -->
            <div class="step2 step1" v-show="step2">
                <div>
                    <p class="now-phone">当前手机号：{{params.phone1|phone}}</p>
                    <div class="password d-f">
                        <input type="text" id="now-phone" name="now-phone" v-model="params.code1" required placeholder="请输入手机验证码"> 
                        <button class="now-phone" @click="sendCode1()" :disabled="isDisabled1">{{btnMsg}}</button>
                    </div>
                </div>
                <button @click="toStep3()" :disabled="!isDisabled1">确定</button>
            </div>
            <!-- 步骤3 -->
            <div class="step3 step1" v-show="step3">
                <div class="password">
                    <label for="phone2">设置绑定手机号码：</label>
                    <input type="text" id="phone2" name="phone2" placeholder="设置您的新手机号" v-model="params.phone2" required pattern="^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$">
                </div>
                <div class="password d-f">
                    <input type="text" id="new-phone" name="new-phone" v-model="params.code2" required placeholder="请输入手机验证码"> 
                    <button class="now-phone" @click="sendCode2()" :disabled="isDisabled2">{{btnMsg2}}</button>
                </div>
                <button @click="toStep4()" :disabled="!isDisabled2">确定</button>
            </div>
            <!-- 步骤4 -->
            <div class="step4 step1" v-show="step4">
                <i class="icon iconfont">&#xe60a;</i>
                <p>手机号码修改成功！请重新登录</p>
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
                step2:true,
                step3:false,
                step4:false,
                params:{
                    phone1:'',
                    phone2:'',
                    code1:'',
                    code2:'',
                    pwd:'',
                    pwd_second:'',
                    userId:''
                },
                isDisabled1:false,
                isDisabled2:false,
                btnMsg:'发送验证码',
                btnMsg2:'发送验证码'
            }
        },
        methods:{
            sendCode1(){
                let formdata = new FormData()
                formdata.append('phone',this.params.phone1)
                formdata.append('jwt',sessionStorage.getItem("JWT"))
                formdata.append('Id',JSON.parse(sessionStorage.getItem("USER")).Id)
                service.updatePhoneSendCode(formdata).then((res)=>{
                    if(res.data.code===200){
                        localStorage.setItem('SEND_TIME','60')
                        this.isDisabled1=true;
                        this.time=60
                        this.btnMsg=`重新发送(${this.time}s)`
                        let timer=setInterval(()=>{
                            if(this.time>0){
                                this.btnMsg=`重新发送(${--this.time}s)`
                                localStorage.setItem('SEND_TIME',`${this.time}`)
                            }else{
                                clearInterval(timer)
                                this.isDisabled1=false
                                this.btnMsg='发送验证码'
                                localStorage.removeItem('SEND_TIME')
                            }
                        },1000)
                    }
                })
            },
            sendCode2(){
                if(this.params.phone2){
                    let formdata = new FormData()
                    formdata.append('phone',this.params.phone2)
                    formdata.append('jwt',sessionStorage.getItem("JWT"))
                    service.updatePhoneBindingCode(formdata).then((res)=>{
                        if(res.data.code===200){
                            localStorage.setItem('SEND_TIME','60')
                            this.isDisabled2=true;
                            this.time=60
                            this.btnMsg2=`重新发送(${this.time}s)`
                            let timer=setInterval(()=>{
                                if(this.time>0){
                                    this.btnMsg2=`重新发送(${--this.time}s)`
                                    localStorage.setItem('SEND_TIME',`${this.time}`)
                                }else{
                                    clearInterval(timer)
                                    this.isDisabled2=false
                                    this.btnMsg2='发送验证码'
                                    localStorage.removeItem('SEND_TIME')
                                }
                            },1000)
                        }else{
                            this.$refs.appAlert.show(res.data.msg,true)
                        }
                    })
                }else{
                    this.$refs.appAlert.show("请输入新手机号",true)
                }
                
            },
            toStep3(){
                if(this.params.code1){
                    let formdata = new FormData()
                    formdata.append('reset_code',this.params.code1)
                    formdata.append('jwt',sessionStorage.getItem("JWT"))
                    service.updatePhoneVerification(formdata).then((res)=>{
                        window.console.log(res)
                        if(res.data.code===200){
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
                if(this.params.code2){
                    let formdata=new FormData()
                    formdata.append('jwt',sessionStorage.getItem("JWT"))
                    formdata.append('phone',this.params.phone2)
                    formdata.append('Id',JSON.parse(sessionStorage.getItem("USER")).Id)
                    formdata.append('binding_code',this.params.code2)

                    service.updatePhoneBindingVerification(formdata).then((res)=>{
                        window.console.log(res)
                        if(res.data.code===200){
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
                    this.$refs.appAlert.show('请输入验证码',true)
                }
            },
            toLogin(){
                this.$router.push({path:'/login'})
            }
        },
        filters:{
            phone(value){
                return value.substring(0,3)+'****'+value.substring(7,11)
            }
        },
        created(){
            this.params.phone1=JSON.parse(sessionStorage.getItem("USER")).phone
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
    .step2 .password,
    .step3 .password{
        align-items: center;
        justify-content: space-between
    }
    .step2 input,
    .step3 input#new-phone{
        width: 160px;
    }
    .step2 .password button.now-phone,
    .step3 .password button.now-phone{
        width: 110px;
        margin:0;
    }
    .step3 input{
        width: 280px;
    }
    .step2>div>p{
        margin-bottom:15px;
        color:#ccc;
    }
    /* 步骤4 */
    .step4{
        text-align: center;
    }
    .step4 i{
        font-size: 150px;
        color:#006bbd;
    }
    .page-forget-password button:disabled{
        background-color: #ccc;
        cursor:no-drop;
    }
</style>