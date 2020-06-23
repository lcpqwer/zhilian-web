<template>
    <div id="mine-detail">
        <div class="center-box d-f">
            <div class="left">
                <ul class="nav">
                    <li>账号管理</li>
                    <li class="on">个人资料</li>
                    <li>
                        <router-link :to="{path:'/update-phone'}">账号绑定</router-link>
                    </li>
                    <li>
                        <router-link :to="{name:'update-password'}">修改密码</router-link>
                    </li>
                </ul>
            </div>
            <div class="right">
                <div class="mine-data">
                    <div class="data-btn">
                        <button :class="{'on':state===0}" @click="state=0">基本信息</button>
                        <button :class="{'on':state===1}" @click="state=1">头像设置</button>
                    </div>
                    <div v-show="state===0" class="data-content">
                        <form @submit="changeInformation($event)">
                            <div>
                                <label for="username">用户名</label>
                                <input type="text" id="username" name="username" placeholder="请输入用户名" v-model="user.username">
                            </div>
                            <div>
                                <label for="qq">QQ号码</label>
                                <input type="text" id="qq" name="qq" placeholder="请输入用户名" v-model="user.qq">
                            </div>
                            <div>
                                <label for="companyname">单位名称</label>
                                <input type="text" id="companyname" name="companyname" placeholder="请输入单位名称" v-model="user.enterprise_name">
                            </div>
                            <div class="d-f">
                                <span>会员等级</span>
                                <span class="level">VIP{{user.level}}</span>
                            </div>
                            <div class="d-f">
                                <span>信用积分</span>
                                <ul class="d-f">
                                    <li><i class="icon iconfont icon-xingxing-kong" :class="{'icon-xingxing-shi':user.credit>=1}"></i></li>
                                    <li><i class="icon iconfont icon-xingxing-kong" :class="{'icon-xingxing-shi':user.credit>=2}"></i></li>
                                    <li><i class="icon iconfont icon-xingxing-kong" :class="{'icon-xingxing-shi':user.credit>=3}"></i></li>
                                    <li><i class="icon iconfont icon-xingxing-kong" :class="{'icon-xingxing-shi':user.credit>=4}"></i></li>
                                    <li><i class="icon iconfont icon-xingxing-kong" :class="{'icon-xingxing-shi':user.credit===5}"></i></li>
                                </ul>
                            </div>
                            <div class="d-f">
                                <span>账号积分</span>
                                <p>{{user.score}}分</p>
                            </div>
                            <button>提交修改</button>
                        </form>
                    </div>
                    <div v-show="state===1" class="mine-header d-f">
                        <div class="pic-left">
                            <div class="upload-pic">
                                <input type="file" id="upload-pic" name="upload-pic" @change="changeImg($event)">
                                <label for="upload-pic">上传照片</label>
                                <p class="tips">仅支持JPG、JPEG、GIF、PNG、BMP格式，文件小于4M</p>
                            </div>
                            <div class="now-pic">
                                <span>当前头像</span>
                                <div class="pic-box">
                                    <div class="pic">
                                        <img :src="imgUrl" alt="">
                                    </div>
                                </div>  
                            </div>
                            <button @click="uploadImg()">保存</button>
                        </div>
                        <div class="pic-right">
                            <h4>效果预览</h4>
                            <p class="tips">您上传的图片会自动生成两种尺寸，请注意小尺寸头像是否清晰</p>
                            <div class="pic100">
                                <img :src="imgUrl" alt="">
                            </div>
                            <span class="tips">100*100像素</span>
                            <div class="pic50">
                                <img :src="imgUrl" alt="">
                            </div>
                            <span class="tips">50*50像素</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <AppAlertComponent ref="alert"></AppAlertComponent>
    </div>
</template>

<script>
    import service from '../services/service.js'
    import AppAlertComponent from './app-alert.vue'

    export default {
        name:'mine-detail',
        components:{
            AppAlertComponent
        },
        data(){
            return {
                state:0,
                imgUrl:'',
                img:null,
                user:{},
            }
        },
        methods:{
            uploadImg(){
                if(this.img){
                    let user=JSON.parse(sessionStorage.getItem("USER"))
                    let jwt=sessionStorage.getItem("JWT")
                    let formdata=new FormData()
                    formdata.append('jwt',jwt)
                    formdata.append('Id',user.Id)
                    formdata.append('image',this.img)
                    service.uploadImg(formdata).then((res)=>{
                        window.console.log(res)
                        if(res.data.code===200){
                            this.$refs.alert.show("上传成功")
                        }else{
                            this.$refs.alert.show("上传失败",true)
                        }
                    })
                }else{
                    this.$refs.alert.show("请先选择您要上传的头像",true)
                }
            },
            changeImg(e){
                let file=e.target.files[0]
                let reader=new FileReader()
                let typeArr=['image/jpg','image/jpeg','image/png','image/gif','image/bmp']
                reader.onload=()=>{
                    let idx=typeArr.findIndex((item)=>{
                        return file.type===item
                    })
                    if(idx===-1){
                        this.$refs.alert.show("文件类型不正确",true)
                        return
                    }
                    if(file.size>4*1024*1024){
                        this.$refs.alert.show("文件大小不能超过4M",true)
                        return
                    }
                    this.imgUrl=reader.result
                    this.img=file
                }
                reader.readAsDataURL(file);
            },
            getMineDetail(){
                let jwt = sessionStorage.getItem("JWT")
                let formdata=new FormData()
                formdata.append("jwt",jwt)
                formdata.append("Id",JSON.parse(sessionStorage.getItem("USER")).Id)
                service.getMineDetail(formdata).then((res)=>{
                    window.console.log(res)
                    this.user=res.data.member
                    this.imgUrl=res.data.member.img
                    window.console.log(this.user)
                })
            },
            changeInformation(e){
                e.preventDefault()
                let formdata=new FormData()
                formdata.append('username',this.user.username)
                formdata.append('jwt',sessionStorage.getItem("JWT"))
                formdata.append('enterprise_name',this.user.enterprise_name)
                formdata.append('Id',this.user.Id)
                formdata.append('qq',this.user.qq)

                service.updataMineInformation(formdata).then((res)=>{
                    window.console.log(res)
                    if(res.data.code===200){
                        this.$refs.alert.show("更新成功")
                    }else{
                        this.$refs.alert.show("更新失败")
                    }
                })
            }
        },
        created(){
            if(sessionStorage.getItem("USER")){
                this.getMineDetail()
            }
            
        }
    }
</script>

<style scoped>
    #mine-detail{
        padding-top:186px;
        background-color: #f4f2ee;
    }
    .center-box .left{
        width: 246px;
        min-height: 600px;
        padding:40px 0;
        background-color: #fff;
    }
    .center-box .left li{
        margin-bottom:40px;
        text-align: center;
        cursor: pointer;
    }
    .center-box .left li.on{
        color:#f6b243
    }
    .center-box .left li:nth-child(1){
        font-size: 20px;
        font-weight: bold;
    }
    .center-box .right{
        flex:1;
        min-height: 600px;
        padding:40px;
        margin-left:20px;
        background-color: #fff;
    }
    .center-box .right .data-btn{
        margin-bottom:40px;
    }
    .right .data-btn button{
        margin-left:20px;
    }
    .right .data-btn button.on{
        border-bottom:2px solid #f6b243;
        color:#f6b243;
    }
    .center-box form{
        width: 454px;
        margin:0 auto;
    }
    .center-box form>div+div{
        margin-top:20px;
    }
    .center-box form select {
        width: 278px;
        height: 40px;
        border:1px solid #979797;
        border-radius: 5px;
    }
    .center-box form input:not([type='checkbox']){
        width: 278px;
        height: 40px;
        border:1px solid #979797;
        border-radius: 5px;
        text-indent: 10px;
    }
    .center-box form label,
    .center-box form>div>span:nth-child(1){
        display: inline-block;
        width: 80px;
        margin-right:20px;
        text-align: right;
    }
    .center-box form button{
        display: block;
        width: 335px;
        height: 40px;
        margin:30px auto 0;
        background-color: #f6b243;
        border-radius: 5px;
        color:#fff;
    }
    span.credit{
        margin-left:30px;
        font-size: 12px;
        color:#ccc;
    }
    /* 头像 */
    .mine-header .upload-pic>input{
        display: none;
    }
    .mine-header .upload-pic>label{
        display: inline-block;
        width: 112px;
        height: 45px;
        background-color: #f6b243;
        border-radius: 5px;
        font-size: 20px;
        color:#fff;
        line-height: 45px;
        text-align: center;
        cursor: pointer;
    }
    .mine-header .tips{
        font-size: 12px;
        color:#ccc;
        line-height: 20px;
    }
    .now-pic{
        margin-top:20px;
    }
    .now-pic>span{
        font-size: 14px;
        color: #ccc;
        line-height: 32px;
    }
    .now-pic .pic-box{
        width: 440px;
        height: 150px;
        padding:25px 0;
        background-color: #f4f2ee;
        border:1px solid #979797;
    }
    .now-pic .pic-box .pic{
        width: 150px;
        height: 150px;
        margin:0 auto;
        background-color: #ccc;
    }
    img{
        height: 100%;   
    }
    .pic-left{
        margin-right:40px;
    }
    .pic-left>button{
        width: 335px;
        height: 42px;
        margin-top:40px;
        background-color: #f6b243;
        border-radius: 5px;
        font-size: 20px;
        color:#fff;
    }
    .pic-right{
        height: 408px;
        padding-left:30px;
        border-left:1px solid #ccc;
    }
    .pic-right h4{
        font-size: 20px;
    }
    .pic-right .tips{
        display: inline-block;
        margin-bottom:30px; 
    }
    .pic-right .pic100{
        width: 100px;
        height: 100px;
        background-color: #ccc;
    }
    .pic-right .pic50{
        width: 50px;
        height: 50px;
        background-color: #ccc;
    }
    i.icon-xingxing-shi{
        color:#f6b243
    }
</style>