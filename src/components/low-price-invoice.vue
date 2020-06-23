<template>
    <div class="low-price-invoice" v-if="state">
        <div class="content">
            <div class="c-title d-f">
                <h4>发票信息</h4>
                <i class="icon iconfont" @click="cancel()">&#xe667;</i>
            </div>
            <div class="information">
                <div class="chk-box">
                    <button :class="{'on':invoice.invoice_type===1}" @click="invoice.invoice_type=1">纸质普通发票</button>
                    <button :class="{'on':invoice.invoice_type===2}" @click="invoice.invoice_type=2">增值税专用发票</button>
                </div>
                <form @submit="saveInvoice()">
                    <div class="invoice-title d-f">
                        <label for="company">发票抬头</label>
                        <div class="input">
                            <input type="text" v-model="invoice.invoice_rise" placeholder="请填写发票抬头" :required="invoice.invoice_type===2">
                            <input type="text" v-model="invoice.invoice_taxnumber" placeholder="请填写税号" name="company" :required="invoice.invoice_type===2">
                        </div>
                    </div>
                    <div class="invoice-content d-f">
                        <label for="">发票内容</label>
                        <div class="btn-box">
                            <input type="radio" id="detail" name="invoice-content-radio" value="1" v-model="invoice.invocie_content">
                            <label for="detail">商品明细</label>
                            <input type="radio" id="category" name="invoice-content-radio" value="2" v-model="invoice.invocie_content">
                            <label for="category">商品类别</label>
                            <p><i class="icon iconfont">&#xe61f;</i> 发票内容将显示详细商品名称与价格信息</p>
                        </div>
                    </div>
                    <div class="phone">
                        <label for="phone">收票人手机</label>
                        <input type="text" id="phone" name="phone" placeholder="请输入手机号码" v-model="invoice.add_phone" required>
                    </div>
                    <div class="address">
                        <label for="address">收票人地址</label>
                        <input type="text" id="address" name="address" placeholder="请输入收票人地址" v-model="invoice.add_address" required>
                    </div>
                    <div class="name">
                        <label for="username">收票人姓名</label>
                        <input type="text" id="username" name="username" placeholder="请输入收票人姓名" v-model="invoice.add_name" required>
                    </div>
                    <div class="button-box">
                        <button type="submit">保存</button>
                        <button type="button" @click="cancel()">取消</button>
                    </div>
                </form>
            </div>  
        </div>
    </div>
</template>

<script>
    export default {
        name:'low-price-invoice',
        data(){
            return{
                state:false,
                invoice:{
                    invoice_type:1,
                    invoice_rise:'',
                    invoice_taxnumber:'',
                    invocie_content:1,
                    add_address:'',
                    add_phone:'',
                    add_name:''
                }
            }
        },
        methods:{
            show(address){
                this.state=true;
                this.invoice.add_address=address.provincename+address.cityname+address.areaname+address.address
                this.invoice.add_phone=address.phone
                this.invoice.add_name=address.name
            },
            cancel(){
                this.state=false;
            },
            saveInvoice(){
                this.$emit('saveinvoice',this.invoice)
                this.cancel()
            }
        },
        created(){
        }
    }
</script>

<style scoped>
    .low-price-invoice{
        position: fixed;
        top:0;
        left:0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .6);
    }
    .content{
        position: absolute;
        top:50%;
        left:0;
        right:0;
        width: 580px;
        padding:0 20px 30px;
        margin:0 auto;
        background-color: #fff;
        border-radius: 10px;
        transform: translateY(-50%);
    }
    /*  */
    .c-title{
        justify-content: space-between;
    }
    .c-title{
        margin:34px 0;
        font-size: 20px;
    }
    .c-title i{
        color:#a5a5a5;
        cursor: pointer;
    }
    /*  */
    .chk-box{
        margin-bottom:30px;
        text-align: center;
    }
    .chk-box>button{
        width: 156px;
        height: 32px;
        background-color: #f8f6f4;
        border-radius: 5px;
        color:#b0b0b0;
    }
    .chk-box>button.on{
        background-color: #f6b243;
        color:#fff;
    }
    .chk-box>button:nth-child(1){
        margin-right:40px;
    }
    /*  */
    form{
        width: 500px;
        margin:0 auto;  
    }
    form>div>label{
        display: inline-block;
        width: 100px;
    }
    form>div+div{
        margin-top:30px;
    }
    form input{
        width: 350px;
        height: 40px;
        background-color: #f8f6f4;
        border-radius: 5px;
        text-indent: 10px;
    }
    .invoice-title input+input{
        margin-top:10px;
    }
    .invoice-content p{
        font-size: 12px;
        color:#ccc;
        line-height: 30px;
    }
    .invoice-content .btn-box label{
        display: inline-block;
        width: 124px;
        height: 32px;
        background-color: #f8f6f4;
        border-radius: 5px;
        color:#a5a5a5;
        line-height: 32px;
        text-align: center;
        cursor: pointer;
    }
    .invoice-content .btn-box input{
        display: none;
    }
    .invoice-content .btn-box input:checked+label{
        background-color: #f6b243;
        color:#fff;
    }
    .button-box{
        margin-top:30px;
        text-align: center;
    }
    .button-box>button{
        width: 116px;
        height: 45px;
        border-radius: 5px;
        font-size: 20px;
    }
    .button-box>button:nth-child(1){
        background-color: #f6b243;
        color:#fff;
    }
    .button-box>button:nth-child(2){
        background-color: #f8f6f4;
        color:#a5a5a5;
    }
    .input{
        width: 352px;   
    }
</style>