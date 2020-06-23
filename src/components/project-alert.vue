<template>
    <div class="project-alert" v-show="isShow">
        <div class="content">
            <h3>快速开启合作</h3>
            <button @click="cancel()"><i class="icon iconfont">&#xe667;</i></button>
            <p>20秒快速完成申请</p>
            <form action="" @submit="formSubmit($event)">
                <div>
                    <label for="username">联系人</label>
                    <input type="text" id="username" placeholder="请输入您的姓名" v-model="params.username" required >
                </div>
                <div>
                    <label for="phone">联系电话</label>
                    <input type="text" id="phone" placeholder="请输入您的联系电话" v-model="params.phone" required pattern="^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$">
                </div>
                <div>
                    <label for="com-name">公司名称</label>
                    <input type="text" id="com-name" placeholder="请输入您的公司名称（全称）" v-model="params.company" required >
                </div>
                <button>立即预约合作</button>
            </form>
        </div>
		<AppAlertComponent ref="appalert"></AppAlertComponent>
    </div>
</template>

<script>
    import service from '../services/service.js'
    import AppAlertComponent from './app-alert.vue'
    
    export default {
        name:'project-alert',
        components:{
            AppAlertComponent
        },
        data(){
            return{
                isShow:false,
                params:{
                    username:'',
                    phone:'',
                    company:''
                }
            }
        },
        methods:{
            show(){
                this.isShow=true;
            },
            cancel(){
                this.isShow=false
            },
            formSubmit(e){
                e.preventDefault()
                let formdata = new FormData()
                formdata.append('name',this.params.username)
                formdata.append('phone',this.params.phone)
                formdata.append('company',this.params.company)

                service.projectSubmit(formdata).then((res)=>{
                    window.console.log(res)
                    if(res.data.code===200){
                        this.$refs.appalert.show(res.data.msg)
                        setTimeout(() => {
                            this.isShow=false
                        }, 1500)
                    }else{
                        this.$refs.appalert.show('申请合作失败')
                        setTimeout(() => {
                            this.isShow=false
                        }, 1500)
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .project-alert{
        position: fixed;
        top:0;
        left:0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.6);
        z-index: 9999
    }
    .content{
        position: absolute;
        top:0;
        left:0;
        right:0;
        bottom:0;
        width: 614px;
        height: 380px;
        padding:20px;
        margin:auto;
        background-color: #fff;
        border-radius: 10px;
    }
    .content h3{
        margin-top:15px;
        font-size: 24px;
        text-align: center;
    }
    .content p{
        margin:20px 0;
        font-size: 12px;
        color:#ccc;
        text-align: center;
    }
    .content>button{
        position: absolute;
        top:16px;
        right:16px;
        color:#a4a4a4;
        background-color:transparent;
    }
    .content form>div+div{
        margin-top:20px;
    }
    .content form>div input{
        width: 280px;
        height: 40px;
        margin-left:10px;
        border:1px solid #979797;
        border-radius: 10px;
        text-indent: 10px;
    }
    .content form{
        width: 392px;
        margin:0 auto;
    }
    .content form label{
        display: inline-block;
        width: 80px;
        line-height: 40px;
    }
    .content form>button{
        display: block;
        width: 335px;
        height: 40px;
        margin:30px auto 0;
        background-color: #f6b243;
        border-radius: 10px;
        color:#fff;
    }
    input::-webkit-input-placeholder {
        color: #ccc;
    }
    input::-moz-input-placeholder {
        color: #ccc;
    }
    input::-ms-input-placeholder {
        color: #ccc;
    }
</style>