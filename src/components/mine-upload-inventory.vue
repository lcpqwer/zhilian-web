<template>
    <div class="mine-upload-inventory">
        <div class="upload-top">
            <input ref="uploadFile" type="file" id="batch-upload" @change="batchUpload()">
            <label for="batch-upload">{{fileName}}</label>
            <button @click="toDownload()">下载批量模板</button>   
        </div>
        <div class="upload-content">
            <form action="" @submit="uploadSucess($event)">
                <div class="d-f">
                    <label for="size">型号<span>*</span></label>
                    <input type="text" placeholder="请输入产品型号" v-model="form.model" required>
                </div>
                <div class="d-f">
                    <label for="num">数量<span>*</span></label>
                    <input type="text" id="num" placeholder="请输入产品数量" v-model="form.stock_number" required pattern="^[1-9][0-9.]{0,}">
                </div>
                <div class="d-f">
                    <label for="price">价格</label>
                    <input type="text" id="price" placeholder="请输入产品未税单价" v-model="form.price" pattern="^[0-9][0-9.]{0,}">
                </div>
                <div class="d-f">
                    <label for="time">货期<span>*</span></label>
                    <!-- <input type="text" placeholder="请输入货期" v-model="form.shipment_date" required> -->
                    <select name="" id="time" v-model="form.shipment_date" required>
                        <option value="">请选择货期</option>
                        <option value="当天发货">当天发货</option>
                        <option value="1-3个工作日">1-3个工作日</option>
                        <option value="7-12个工作日">7-12个工作日</option>
                    </select>
                </div>
                <div class="radio-box d-f">
                    <label for="">类型<span>*</span></label>
                    <div>
                        <input type="radio" name="upload-radio1" id="upload-radio1" :checked="form.type==='1'" value="1" v-model="form.type" >
                        <label class="radio" for="upload-radio1">现货</label>
                    </div>
                    <div>   
                        <input type="radio" name="upload-radio1" id="upload-radio2" value="2" v-model="form.type" >
                        <label class="radio" for="upload-radio2">期货</label>
                    </div>
                </div>
                <div class="radio-box d-f">
                    <label for="">是否持续备货<span>*</span></label>
                    <div>
                        <input type="radio" name="upload-radio2" id="upload-radio3" :checked="form.continuous_stock==='1'" value="1" v-model="form.continuous_stock">
                        <label class="radio" for="upload-radio3">是</label>
                    </div>
                    <div>
                        <input type="radio" name="upload-radio2" id="upload-radio4" value="2" v-model="form.continuous_stock">
                        <label class="radio" for="upload-radio4">否</label>
                    </div>
                </div>
                <button>提交</button>
                <p>带*为必选项</p>
            </form>
        </div>
        <AppAlertComponent ref="alert"></AppAlertComponent>
        <MineUploadSuccessComponent ref="uploadSucess"></MineUploadSuccessComponent>
    </div>
</template>

<script>
    import MineUploadSuccessComponent from './mine-upload-success.vue'
    import AppAlertComponent from './app-alert.vue'

    import service from '../services/service.js'

    export default {
        name:'mine-upload-inventory',
        components:{
            MineUploadSuccessComponent,
            AppAlertComponent
        },
        data(){
            return{
                form:{
                    type:'1',
                    model:'',
                    stock_number:'',
                    continuous_stock:'1',
                    shipment_date:'',
                    price:''
                },
                fileName:'批量上传',
                isShowPay:false,
                ordid:''
            }
        },
        methods:{
            uploadSucess(e){
                e.preventDefault()
                let user=JSON.parse(sessionStorage.getItem("USER"))
                let jwt=sessionStorage.getItem("JWT")
                let formdata=new FormData()
                formdata.append('jwt',jwt)
                formdata.append('uid',user.Id)
                formdata.append('model',this.form.model)
                formdata.append('stock_number',this.form.stock_number)
                formdata.append('continuous_stock',this.form.continuous_stock)
                formdata.append('shipment_date',this.form.shipment_date)
                formdata.append('type',this.form.type)
                if(this.form.price){
                    formdata.append('price',this.form.price)
                }
                
                service.singleUpload(formdata).then((res)=>{
                    if(res.data.code===200){
                        this.$refs.uploadSucess.show()
                        setTimeout(()=>{
                            this.$refs.uploadSucess.cancel()
                        },1000)
                        this.form.type='1'
                        this.form.model=''
                        this.form.stock_number=''
                        this.form.continuous_stock='1'
                        this.form.shipment_date=''
                        this.form.price=''
                    }else{
                        this.refs.alert.show('上传失败',true)
                    }
                })
                
            },
            toDownload(){
                location.href='https://login.asap-get.com/lianzhi/public/model/Template.csv'  
            },
            batchUpload(){
                let file=this.$refs.uploadFile.files[0]
                let reader = new FileReader()
                reader.onload=()=>{
                    if(file.type!='text/csv'&&file.type!='application/vnd.ms-excel'){
                        this.$refs.alert.show('文件格式不正确',true)
                        return
                    }
                    this.fileName=file.name
                    let formdata=new FormData()
                    let jwt=sessionStorage.getItem("JWT")
                    let user=JSON.parse(sessionStorage.getItem("USER"))
                    formdata.append('excel',file)
                    formdata.append('jwt',jwt)
                    formdata.append('uid',user.Id)

                    service.batchUpload(formdata).then(res=>{
                        if(res.data.code===200){
                            this.$refs.alert.show("上传成功")
                        }else{
                            this.$refs.alert.show("上传失败",true)
                        }
                    })
                }
                reader.readAsDataURL(file)
            },
        }
    }
</script>

<style scoped>
    .mine-upload-inventory{
        padding:20px 0;
        background-color: #fff;
    }
    .upload-top{
        margin-bottom:20px; 
        text-align: right;
    }
    .upload-top button,
    .upload-top label{
        display: inline-block;
        padding:14px 25px;
        margin-right:20px;
        border-radius: 10px;    
        font-size: 20px;
        cursor: pointer;
    }
    .upload-top button{
        padding:16px 25px
    }
    .upload-top input:nth-child(1){
        display: none;
    }
    .upload-top label:nth-child(2){
        background-color: #fff;
        border:1px solid #ccc;
    }
    .upload-top button:nth-child(3){
        background-color: #f17f3a;
        border:1px solid #f17f3a;
        color:#fff;
    }
    .upload-content form{
        width: 452px;
        margin:auto;
    }
    .upload-content form>div{
        margin-bottom:20px;
        align-items: center;
    }
    .upload-content form>div:not([class='radio-box d-f']) input,
    select#time{
        width: 400px;
        height: 40px;
        background-color: #eaeaea;
        border-radius: 10px;
        text-indent: 10px;
    }
    select#time{
        outline: none
    }
    .upload-content form>div:not([class='radio-box d-f']) label{
        display: inline-block;
        width: 80px;
    }
    .upload-content form label span,
    .upload-content form p{
        color:red;
    }
    .upload-content form button{
        display: block;
        width: 335px;
        height: 40px;
        margin:80px auto 20px;
        background-color: #f6b243;
        border-radius: 10px;
        color:#fff;
    }
    .upload-content form p{
        font-size: 12px;
        text-align: center;
    }
    .radio-box label:nth-child(1){
        margin-right:34px;
    }
    .radio-box input{
        display: none;
    }
    .radio-box input:checked+label{
        background-color: #f6b243;
        color:#fff;
    }
    .radio-box .radio{
        display: inline-block;
        width: 100px;
        height: 40px;
        margin-right:20px;
        background-color: #eaeaea;
        border-radius: 10px;
        line-height: 40px;
        text-align: center;
        cursor: pointer;
    } 
    /* 支付 */
    .pay-alert{
        position: fixed;
        top:0;
        left:0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.6);
        z-index: 999;
    }
    .pay-alert .pay-alert-content{
        position: absolute;
        overflow: hidden;
        top:50%;
        left:0;
        right:0;
        width: 300px;
        height: 250px;
        margin:0 auto;
        background-color: #fff;
        border-radius: 10px;
        text-align: center;
        transform: translateY(-50%)
    }
    .pay-alert-content>div{
        width: 80%;
        margin:40px auto 30px;
    }
    .pay-alert-content input{
        width: 180px;
        height: 30px;
        margin-top:10px;
        border:1px solid #ccc;
        border-radius: 5px;
        text-indent: 10px   
    }
    .pay-alert-content button{
        width: 80%;
        height: 42px;
        background-color: #f6b243;
        border-radius: 5px;
        font-size: 20px;
        color:#fff
    }
    .pay-alert-content i{
        position: absolute;
        right:10px;
        top:4px;
        font-size: 24px;
        cursor: pointer;
    }
    .tips{
        font-size: 12px;
        color:#ccc;
        line-height: 16px;
        text-align:start
    }
</style>