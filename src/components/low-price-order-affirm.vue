<template>
    <div class="order-affirm">
        <div class="center-box">
            <div class="crumbs">
                <span>您的位置：</span>
                <router-link :to="{path:'/main/low-price'}">低价抛售</router-link>
                <i class="icon iconfont">&#xe624;</i>
                <router-link :to="{path:'/main/low-price/low-price-store'}">官方自营</router-link>
                <i class="icon iconfont">&#xe624;</i>
                <span class="last">确认订单</span>
            </div>
            <div class="step">
                <ul class="d-f">
                    <li class="on">
                        <span>1</span>
                        <span>1、确认订单</span>
                    </li>
                    <li><i></i></li>
                    <li>
                        <span>2</span>
                        <span>2、付款方式</span>
                    </li>
                    <li><i></i></li>
                    <li>
                        <span>3</span>
                        <span>3、确认收货</span>
                    </li>
                </ul>
            </div>
            <div class="address">
                <h4 class="claerfix">选择收货地址 <span class="f-r" @click="toMineAddress()">管理收货地址</span></h4>
                <ul>
                    <li class="d-f" v-for="(item,index) of userAddress" :class="{'on':index===addressIndex}"  :key="item.Id" @click="changeAddress(item,index)">
                        <div class="chkbox">
                            <input type="checkbox" id="address-chk" name="address-chk">
                            <label for="address-chk"></label>
                        </div>
                        <div class="txt">
                            <p>{{item.provincename}} {{item.cityname}} {{item.areaname}} {{item.address}}（{{item.name}} 收）</p>
                            <span class="phon">{{item.phone}}</span>
                        </div>
                        <span v-if="item.type===1">默认地址</span>
                    </li>
                </ul>
            </div>
            <div class="commodity-information">
                <h4>确认订单信息</h4>
                <div class="item" v-for="item of list" :key="item.Id">
                    <div class="list-content">
                        <ul class="c-center d-f">
                            <li>
                                <span>型号：{{item.model}}</span>
                                <span>品牌：{{item.manufacturer}}</span>
                            </li>
                            <li>
                                <span>类型：{{item.type|listType}}</span>
                                <span>仓库：{{item.address}}</span>
                            </li>
                            <li>
                                <span>购买类型：按包装量（{{item.minimum}}/包）</span>
                                <span>单价：{{item.price}}元/包</span>
                            </li>
                            <li>
                                <span>购买数量：{{item.pay_number?item.pay_number:item.number}}</span>
                                <span>总价：{{(item.price*(item.pay_number?item.pay_number:item.number))|money}}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="invoice-information">
                <h4>发票信息</h4>
                <p>{{invo.invoice_type|invoiceType}}-{{invo.invocie_content|invoiceContent}}-上海联置电子科技有限公司<span class="change" @click="showInvoice()">修改</span></p>
                <div class="clearfix">
                    <div class="f-r">
                        <p>实付款：￥<span>{{total}}</span></p>
                        <p>寄送至：{{address.provincename}} {{address.cityname}} {{address.areaname}} {{address.address}}</p>
                        <p>收货人：{{address.name}} {{address.phone}}</p>
                    </div>
                </div>
                <div class="btn">
                    <button @click="showConfirm()">立即购买</button>
                </div>
            </div>
        </div>
        <div class="confirm-wrap" v-if="isShowConfirm">
            <div class="confirm-content">
                <p>您确定要支付吗？</p>
                <div class="btn">
                    <button @click="submitOrder()">确定</button>
                    <button @click="cancelConfirm()">取消</button>
                </div>
            </div>
        </div>
        <LowPriceInvoiceComponent ref="invoice" @saveinvoice='saveInvoice'></LowPriceInvoiceComponent>
    </div>
</template>

<script>
    import LowPriceInvoiceComponent from './low-price-invoice.vue'
    import service from '../services/service.js'

    export default {
        name:'order-affirm',
        components:{
            LowPriceInvoiceComponent
        },
        data(){
            return {
                list:[],
                total:0,
                userAddress:[],
                addressIndex:0,
                user:{},
                address:{},
                invo:{
                    invoice_type:1,
                    invoice_rise:'',
                    invoice_taxnumber:'',
                    invocie_content:1,
                    add_address:'',
                    add_phone:'',
                    add_name:''
                },
                isShowConfirm:false,
                state:0
            }
        },
        methods:{
            showInvoice(){
                this.$refs.invoice.show(this.address)
            },
            getMineDetail(){
                let jwt = sessionStorage.getItem("JWT")
                let formdata=new FormData()
                formdata.append("jwt",jwt)
                formdata.append("Id",this.user.Id)
                service.getMineDetail(formdata).then((res)=>{
                    this.userAddress=res.data.member.address
                    this.userAddress.sort((a,b)=>{
                        return a.type-b.type
                    })
                    this.address=this.userAddress[0]
                    this.invo.add_address=this.address.provincename+this.address.cityname+this.address.areaname+this.address.address
                    this.invo.add_phone=this.address.phone
                    this.invo.add_name=this.address.name
                })
            },
            toMineAddress(){
                this.$router.push({path:'/main/mine/mine-home',query:{state:1}})
            },
            changeAddress(address,index){
                this.addressIndex=index
                this.address=address
            },
            saveInvoice(invoice){
                this.invo=invoice
                window.console.log(this.invo)
            },
            submitOrder(){
                // let formdata=new FormData()
                let uid=JSON.parse(sessionStorage.getItem("USER")).Id
                let jwt = sessionStorage.getItem("JWT")
                let url1='http://login.asap-get.com/lianzhi/Alipay/goods?'
                let url2='http://login.asap-get.com/lianzhi/index/Alipay/onlygoods?'
                window.console.log(this.state)
                if(this.state===0){
                    this.list.forEach((item)=>{
                        url1+=`&&data[]=${JSON.stringify({Id:item.Id,pay_number:item.pay_number?item.pay_number:item.number})}`
                    })
                    window.open(`${url1}&&uid=${uid}&&jwt=${jwt}&&aid=${this.address.Id}
                    &&invoice_type=${this.invo.invoice_type}&&invoice_rise=${this.invo.invoice_rise}&&invoice_taxnumber=${this.invo.invoice_taxnumber}&&invocie_content=${this.invo.invocie_content}
                    &&add_address=${this.invo.add_address}&&add_phone=${this.invo.add_phone}&&add_name=${this.invo.add_name}`)
                }else if(this.state===1){
                    // window.console.log(this.list)
                    url2+=`Id=${this.list[0].Id}`
                    window.open(`${url2}&&uid=${uid}&&jwt=${jwt}&&aid=${this.address.Id}
                    &&invoice_type=${this.invo.invoice_type}&&invoice_rise=${this.invo.invoice_rise}&&invoice_taxnumber=${this.invo.invoice_taxnumber}&&invocie_content=${this.invo.invocie_content}
                    &&add_address=${this.invo.add_address}&&add_phone=${this.invo.add_phone}&&add_name=${this.invo.add_name}`)
                }
                
                sessionStorage.removeItem("ORDERS")
                this.$router.push({path:'/main/low-price/low-price-order'})
            },
            showConfirm(){
                this.isShowConfirm=true
            },
            cancelConfirm(){
                this.isShowConfirm=false
            }
        },
        created(){
            if(this.$route.query.state){
                this.state=this.$route.query.state
            }
            
            this.list=JSON.parse(sessionStorage.getItem("ORDERS"))
            
            this.user=JSON.parse(sessionStorage.getItem("USER"))
            
            this.list.forEach((item)=>{
                this.total+=item.price*(item.pay_number?item.pay_number:item.number)
            })
            this.getMineDetail()
        },
        filters:{
            money(value){
                return '￥'+value
            },
            listType(value){
				return value==1?"现货":"期货"
            },
            invoiceType(value){
                return value==1?"普通纸质发票":"增值税专用发票"
            },
            invoiceContent(value){
                return value==1?"明细":"类别"
            }
        }
    }
</script>

<style scoped>
    .order-affirm{
		padding-top:166px;
		background-color: #e7e4e3;
    }
    .order-affirm .center-box{
		padding:80px 40px;
		background-color: #fff;
    }
    /* 面包屑导航 */
    .crumbs{
        padding-bottom:24px;
        border-bottom:1px solid #ccc;
        font-size: 18px;
        color:#a9a9a9;
    }
    .crumbs a{
        color:#a9a9a9;
    }
    .crumbs>span.last{
        color:#f6b243;
    }
    .crumbs i{
        margin:0 10px;
    }
    /*  */
    .step ul{
        margin-top:30px;
        justify-content: center;
        align-items: center;
    }
    .step ul li>span,
    .step ul li>i{
        display: block;
    }
    .step ul li>span:nth-child(1){
        width: 45px;
        height: 45px;
        margin:0 auto 20px;
        border:1px solid #ccc;
        border-radius: 50%;
        font-size: 20px;
        line-height: 45px;
        text-align: center;
    }
    .step ul li.on>span:nth-child(1){
        background-color: #f6b243;
        color:#fff;
    }
    .step ul li>i{
        width: 140px;
        height: 1px;
        margin:0 20px;
        background-color:#979797;
        transform: translateY(-15px)
    }
    /* 商品详情 */
    .commodity-information h4,
    .invoice-information h4,
    .address h4{
        border-bottom:2px solid #979797;
        font-size: 18px;
        line-height: 65px;
    }
    .commodity-information{
        margin-bottom:30px;
    }
    .commodity-information .item{
        padding:20px 0 15px;
        border-radius: 10px;
        background-color: #fff;
    }
    .list-content{
        justify-content: space-around;
        align-items: center;
    }
    .list-content .c-left .pic{
        width: 146px;
        height: 146px;
        margin-right:10px;
        background-color: #ccc;
    }
    .c-left li{
        line-height: 38px;
    }
    .c-center{
        line-height: 70px;
        justify-content: space-around
    }
    .c-center li span:nth-child(1){
        margin-right:20px;
    }
    .c-center li span
    /* 发票信息 */
    .invoice-information>p{
        margin:20px 0;
    }
    .invoice-information .clearfix>div{
        width: 465px;
        padding:20px 40px;
        border:1px solid #f17f3a;
        border-radius: 10px;
    }
    .invoice-information .clearfix>div span{
        font-size: 22px;
        color:#f17f3a;
    }
    .invoice-information .clearfix>div p+p{
        margin-top:30px;    
    }
    .btn{
        text-align: right;
    }
    .btn button{
        width: 224px;
        height: 40px;
        background-color: #f6b243;
        border-radius: 5px;
        color:#fff;
        font-size: 20px;
    }
    span.change{
        font-size: 12px;
        color:#f6b243;
        cursor: pointer;
    }
    /* 地址选择 */
    .address h4 span{
        font-weight: normal;
        color:#f6b243;
        cursor: pointer;
    }
    .address .chkbox{
        margin-right:30px;
    }
    .address .chkbox input{
        display: none;
    }
    .address .chkbox label{
        display: inline-block;
        width: 30px;
        height: 30px;
        border:1px solid #ccc;
        border-radius: 50%;
        cursor: pointer;
    }
    .address ul{
        margin:30px 0;
    }
    .address li{
        padding-left:86px;
        color:#a6a6a6;
        line-height: 30px;
        align-items: center;
        cursor: pointer;
    }
    .address li.on{
        padding-top:30px;
        padding-bottom:30px;
        background-color: #fff4e3;
        border:1px solid #f17f3a;
        color:#333;
        font-weight: bold;
    }
    .address li.on .chkbox label{
        border-color: #f17f3a;
        background-image: url(../assets/images/地址选择.png);
        background-size: contain;
    }
    .address li+li{
        margin-top:20px;
    }
    .address li>span{
        display: inline-block;
        margin-left:80px;
        color:#f6b243;
        cursor: pointer;
        font-weight: normal;
    }
    .item+.item{
        border-top:1px solid #ccc
    }
    /* 确定支付 */
    .confirm-wrap{
        position: fixed;
        top:0;
        left:0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.6);
        z-index: 999
    }
    .confirm-wrap .confirm-content{
        position: absolute;
        top:50%;
        left: 0;
        right:0;
        width: 300px;
        height: 200px;
        margin:0 auto;
        background-color: #fff;
        border-radius: 10px;
        text-align: center;
        transform: translateY(-50%)
    }
    .confirm-wrap .confirm-content .btn{
        margin-top:50px;
        text-align: center
    }
    .confirm-wrap .confirm-content button{
        width: 100px;
        height: 42px;
        border-radius: 5px;
    }
    .confirm-wrap .confirm-content button+button{
        margin-left:20px;
    }
    .confirm-wrap .confirm-content p{
        margin-top:50px;
    }
    .confirm-wrap .confirm-content button:nth-child(2){
        background-color: #fff;
        border:1px solid #ccc;
        color:#333;
    }
</style>