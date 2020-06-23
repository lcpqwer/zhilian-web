<template>
    <div class="buy-alert" v-if="isShow">
        <div class="alert-content" :class="{'state0':addBuyParams.state===0,'state1':addBuyParams.state===1}">
            <div class="c-top">
                <button @click="addBuyParams.state=0">发布询价</button>
                <button @click="addBuyParams.state=1">发布实单<i class="icon iconfont" @click="cancel()">&#xe667;</i></button>
            </div>
            <form @submit="submitEvent($event)">
                <div>
                    <label for="size">型号<span>*</span></label>
                    <input type="text" placeholder="请输入需要的产品型号（必填）" v-model="addBuyParams.model" required>
                </div>
                <div>
                    <label for="number">数量<span>*</span></label>
                    <input type="text" placeholder="请输入需要的产品数量（必填）" v-model="addBuyParams.number" required>
                </div>
                <div>
                    <label for="price">目标未税单价<span>*</span></label>
                    <input type="text" placeholder="请输入目标未税单价（选填）" v-model="addBuyParams.untaxedprice">
                </div>
                <button>发送</button>
                <div class="batch-upload d-f">
                    <label for="batch-upload">批量求购</label>
                    <input class="input-batch-upload" type="file" ref="uploadFile" id="batch-upload" @change="batchUpload">
                    <button type="button" @click="batchDownload">下载求购模板</button>
                </div>
            </form>
        </div>
        <AppAlertComponent ref="alert"></AppAlertComponent>
    </div>
</template>

<script>
import service from '../services/service'
import AppAlertComponent from './app-alert'
export default {
    name:'buy-alert',
    components:{
        AppAlertComponent
    },
    data(){
        return {
            isShow:false,
            addBuyParams:{
                state:0,
                model:'',
                untaxedprice:'',
                number:'',
            }
        }
    },
    methods:{
        cancel(){
            this.isShow=false;
        },
        show(state){
            this.addBuyParams.state=state;
            this.isShow=true;
        },
        submitEvent(e){
            e.preventDefault()
            this.isShow=false;
            this.$emit('addbuyevent',this.addBuyParams)
            // this.addBuyParams.model=''
            // this.addBuyParams.untaxedprice=''
            // this.addBuyParams.number=''
        },
        // 下载批量模板
        batchDownload(){
            window.open('https://login.asap-get.com/lianzhi/public/Template .csv')
        },
        batchUpload(){
            if(!sessionStorage.getItem("USER")){
                this.$router.push({path:'/login'})
            }
            let file=this.$refs.uploadFile.files[0]
            let reader = new FileReader()
            reader.onload=()=>{
                if(file.type!='text/xlsx'&&file.type!='text/xls'&&file.type!='text/csv'&&file.type!='application/vnd.ms-excel'){
                    this.$refs.alert.show('格式仅支持xls,xlsx,csv',true)
                    return
                }
                this.fileName=file.name
                let formdata=new FormData()
                let jwt=sessionStorage.getItem("JWT")
                let user=JSON.parse(sessionStorage.getItem("USER"))
                formdata.append('excel',file)
                formdata.append('jwt',jwt)  
                formdata.append('uid',user.Id)

                service.uploadBatchBuy(formdata).then((res)=>{
                    if(res.data.code===200){
                        this.$refs.alert.show("上传成功")
                    }else{
                        this.$refs.alert.show("上传失败",true)
                    }
                }).catch(()=>{
                    this.$refs.alert.show("上传失败,文件不能为空",true)
                })
            }
            reader.readAsDataURL(file)
        }
    }
}
</script>

<style scoped>
    .buy-alert{
        position: fixed;
        top:0;
        left:0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.6);
        z-index: 999;
    }
    .alert-content{
        position: absolute;
        top:50%;
        left:0;
        right:0;
        width: 788px;
        height: 630px;
        margin:0 auto;
        border-radius: 10px;
        background-color: #fff;
        color:#fff;
        transform: translateY(-50%);
    }
    .alert-content.state0{
        background-color: #f6b243;
    }
    .alert-content.state1{
        background-color: #f17f3a;
    }
    .alert-content .c-top{
        margin-bottom:60px;
    }
    .alert-content .c-top>button{
        width: 50%;
        height: 72px;
        font-size: 25px;
        font-weight: 200;
        background-color: #fff;
    }
    .alert-content.state0 .c-top>button:nth-child(1){
        background-color: #f6b243;
        color:#fff;
    }
    .alert-content.state1 .c-top>button:nth-child(2){
        background-color: #f17f3a;
        color:#fff;
    }
    .alert-content .c-top>button:nth-child(1){
        border-top-left-radius: 10px;
        border-bottom-right-radius: 10px;
    }
    .alert-content .c-top>button:nth-child(2){
        position: relative;
        border-top-right-radius: 10px;
        border-bottom-left-radius: 10px;
    }
    .alert-content .c-top>button:nth-child(2) i{
        position: absolute;
        right:46px;
        top:50%;
        color:#000;
        transform: translateY(-50%);
    }
    .alert-content.state1 .c-top>button:nth-child(2) i{
        color:#fff;
    }
    .alert-content form{
        width: 405px;
        margin:0 auto;
    }
    .alert-content form>div+div{
        margin-top:36px;
    }
    .alert-content form>button,
    .alert-content form>.batch-upload button{
        display: inline-block;
        width: 100%;
        height:60px;
        margin-top:46px;
        background-color: #fff;
        border-radius: 10px;
        font-size: 20px;
    }
    .alert-content form>.batch-upload{
        justify-content: space-around
    }
    .alert-content form>.batch-upload button,
    .alert-content form>.batch-upload label{
        display: inline-block;
        width: 40%;
        margin-top:46px;
        background-color: #fff;
        border-radius: 10px;
        color:#666;
        line-height: 60px;
        text-align: center;
        cursor: pointer;
    }
    .alert-content.state0 form>button{
        color:#f6b243;
    }
    .alert-content.state1 form>button{
        color: #f17f3a;
    }
    .alert-content form label{
        display: inline-block;
        width: 130px;
        background-color:transparent;
        font-size: 20px;
        font-weight: 200;
    }
    .alert-content form input{
        width: 272px;
        height: 52px;
        border-radius: 10px;
        text-indent: 10px;
    }
    .alert-content.state0 form input{
        background-color:#fad8a1;
    }
    .alert-content.state1 form input{
        background-color: #f8bf9c;
    }

    .alert-content form>.batch-upload input.input-batch-upload{
        display: none
    }
</style>