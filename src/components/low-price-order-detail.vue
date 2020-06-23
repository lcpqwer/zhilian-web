<template>
    <div class="order-detail">
        <div class="center-box">
            <div class="crumbs">
                <span>您的位置：</span>
                <router-link :to="{path:'/main/low-price'}">低价抛售</router-link>
                <i class="icon iconfont">&#xe624;</i>
                <router-link :to="{path:'/main/low-price/low-price-store'}">官方自营</router-link>
                <i class="icon iconfont">&#xe624;</i>
                <span class="last">订单详情</span>
            </div>
            <div class="step">
                <ul class="d-f">
                    <li class="on">
                        <span>1</span>
                        <span>1、确认订单</span>
                    </li>
                    <li><i></i></li>
                    <li class="on">
                        <span>2</span>
                        <span>2、付款方式</span>
                    </li>
                    <li><i></i></li>
                    <li class="on">
                        <span>3</span>
                        <span>3、确认收货</span>
                    </li>
                </ul>
            </div>
            <div class="order-information">
                <h4>订单信息</h4>
                <div class="information-con clearfix">
                    <div class="con-left f-l">
                        <div class="l-top d-f">
                            <p class="title">收货地址：</p>
                            <div class="address">
                                <p>{{order.courier_name}} {{order.courier_phone}}</p>
                                <p>{{order.courier_address}}</p>
                            </div>
                        </div>
                        <p class="title">订单编号：<span>{{order.ordid}}</span></p>
                    </div>
                    <div class="con-right f-l">
                        <h5 class="order-state">
                            <i class="icon" v-if="order.order_type!==1"></i>
                            <span>订单状态：{{order.order_type|orderType1}}</span>
                        </h5>
                        <p v-if="order.order_type!==1&&logistics.length">物流：{{brand}} 运单号：{{order.courier_number}}</p>
                        <p v-for="item of logistics.data" :key="item.time">
                            <span class="date">{{item.time}}</span>
                            <span class="address">{{item.context}}</span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="commodity-information">
                <h4>商品信息</h4>
                <div class="item">
                    <div class="list-content d-f">
                        <div class="c-left d-f">
                            <ul>
                                <li>型号：{{order.model}}</li>
                                <li>品牌：{{order.manufacturer}}</li>
                                <li>类型：{{order.type|listType}}</li>
                                <li>仓库：{{order.address}}</li>
                            </ul>
                        </div>
                        <ul class="c-center">
                            <li>
                                <span>购买类型：按包装量</span>
                                <span>单价：{{order.price}}元/包</span>
                            </li>
                            <li>
                                <span>购买数量：{{order.number}}</span>
                                <span>总价：{{order.total}}元</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="invoice-information">
                <h4>发票信息</h4>
                <p>{{order.invoice_type|invoiceType}}-{{order.invoiceContent|invoiceContent}}-上海联置电子科技有限公司</p>
                <div class="clearfix">
                    <div class="f-r">
                        <p>商品总价：{{order.total|money}}</p>
                        <p>运费：￥0.00</p>
                        <p>实付款：￥<span>{{order.total}}</span></p>
                    </div>
                </div>
                <div class="btn">
                    <button @click="orderBtnClick()">{{order.order_type|buttonType}}</button>
                </div>
            </div>
        </div>
        <LowPriceAfterSaleComponent ref="afterSale"></LowPriceAfterSaleComponent>
        <LowPriceInvoiceComponent ref="invoice"></LowPriceInvoiceComponent>
        <AppAlertComponent ref="alert"></AppAlertComponent>
    </div>
</template>

<script>
    import LowPriceAfterSaleComponent from '../components/low-price-after-sale.vue'
    import LowPriceInvoiceComponent from '../components/low-price-invoice.vue'
    import AppAlertComponent from './app-alert.vue'

    import service from '../services/service'

    export default {
        name:'order-detail',
        components:{
            LowPriceAfterSaleComponent,
            LowPriceInvoiceComponent,
            AppAlertComponent
        },
        data(){
            return{
                order:{},
                logistics:{},
                brand:''
            }
        },
        methods:{
            confirmOrder(){
                let formdata=new FormData()
                formdata.append("jwt",sessionStorage.getItem("JWT"))
                formdata.append("Id",this.order.Id)

                service.confirmOrder(formdata).then((res)=>{
                    window.console.log(res)
                    if(res.data.code===200){
                        this.$refs.alert.show("收货成功")
                        setTimeout(()=>{
                            this.$router.push({path:'/main/low-price/low-price-order'})
                        },1500)
                    }else{
                        this.$refs.alert.show(res.data.msg,true)
                    }
                })
            },
            remind(item){
                let formdata=new FormData()
                formdata.append("jwt",sessionStorage.getItem("JWT"))
                formdata.append("Id",item.Id)

                service.remindOrder(formdata).then((res)=>{
                    window.console.log(res)
                    if(res.data.code===200){
                        this.$refs.alert.show("提醒成功")
                    }else{
                        this.$refs.alert.show("请勿重复提醒",true)
                    }
                })
            },
            toOrderAffirm(item){
                let arr=[]
                arr.push(item)
                window.console.log(item)
                sessionStorage.setItem("ORDERS",JSON.stringify(arr))
                this.$router.push({name:'low-price-order-affirm'})
            },
            orderBtnClick(){
                switch(this.order.order_type){
                    case 1:
                        window.console.log("111")
                        this.toOrderAffirm(this.order)
                        break
                    case 2:
                        window.console.log("222")
                        this.remind(this.order)
                        break
                    case 3:
                        window.console.log("333")
                        this.confirmOrder()
                        break
                    case 4:
                        this.$refs.afterSale.show()
                        break
                }
            },
            toInvoice(){
                this.$refs.invoice.show()
            },
            getOrderLogistics(){
                let formdata =new FormData()
                formdata.append("jwt",sessionStorage.getItem("JWT"))
                formdata.append("Id",this.order.Id)
                service.getOrderLogistics(formdata).then((res)=>{
                    if(res.data.code===0){
                        this.logistics=res.data.data[0]
                        this.brand=res.data.data[0].brand
                    }
                })
            }
        },
        created(){
            window.console.log(JSON.parse(this.$route.query.order))
            this.order=JSON.parse(this.$route.query.order)
            this.getOrderLogistics()
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
            },
            buttonType(value){
                switch(value){
                    case 1:
                        return "立即付款"
                    case 2:
                        return "提醒发货"
                    case 3:
                        return "确认收货"
                    case 4:
                        return "申请售后"
                }
            },
            orderType1(value){
                switch(value){
                    case 1:
                        return "订单未付款"
                    case 2:
                        return "订单待发货"
                    case 3:
                        return "订单已发货"
                    case 4:
                        return "订单已完成"
                }
            },
            orderType2(value){
                switch(value){
                    case 1:
                        return "一小时后自动关闭"
                    case 2:
                    case 3:
                    case 4:
                        return "查看物流"
                }
            },
            
        }
    }
</script>

<style scoped>
    .order-detail{
		padding-top:166px;
		background-color: #e7e4e3;
    }
    .order-detail .center-box{
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
    /* 订单信息 */
    .order-information{
        margin-bottom:30px;
    }
    .order-information>h4,
    .commodity-information>h4,
    .invoice-information>h4{
        border-bottom:2px solid #979797;
        font-size: 18px;
        line-height: 65px;
    }
    .information-con p.title{
        font-size: 18px;
        font-weight: bold;
    }
    .information-con p.title span{
        font-size: 16px;
        font-weight: normal;
    }
    .con-left{
        line-height: 50px;
    }
    .con-right{
        width: 600px;
        min-height: 200px;
        margin-left:40px;
        padding-left:40px;
        border-left:1px solid #979797;
    }
    .con-right .order-state{
        margin:20px 0;
        font-size: 22px;
    }
    .con-right .order-state i{
        vertical-align: middle;
        width: 30px;
        height: 30px;
        background-image: url(../assets/images/success.png);
    }
    .con-right .order-state span{
        vertical-align: middle;
    }
    .con-right p{
        font-size: 14px;
        line-height: 24px;
    }
    .con-right p:nth-child(2){
        margin-bottom:20px;
        font-size: 16px;
        font-weight: 500
    }
    .con-right a{
        display: inline-block;
        padding:20px 0;
        font-size: 14px;
        color:#a5a5a5;
    }
    /* 商品详情 */
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
    }
    .c-center li span:nth-child(1){
        margin-right:80px;
    }

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
    .address p {
        width: 210px;
    }
</style>