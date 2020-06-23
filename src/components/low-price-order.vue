<template>
    <div class="low-price-order">
        <div class="center-box">
            <div class="order-top">
                <div class="crumbs">
                    <span>您的位置：</span>
                    <router-link :to="{path:'/main/low-price'}">低价抛售</router-link>
                    <i class="icon iconfont">&#xe624;</i>
                    <router-link :to="{path:'/main/low-price/low-price-store'}">官方自营</router-link>
                    <i class="icon iconfont">&#xe624;</i>
                    <span class="last">我的订单</span>
                </div>
                <div class="store-search d-f">
                    <div class="input d-f">
                        
                    </div>
                    <div class="order d-f" @click="toShoppingcar()">
                        <i class="icon"></i>
                        <span>购物车</span>
                    </div>
                    <div class="back d-f"  @click="goBack()">
                        <i class="icon"></i>
                        <span>返回商城</span>
                    </div>
                </div>
                <div class="order-nav">
                    <ul class="d-f">
                        <li :class="{'on':order_type===0}" @click="changeOrderState(0)">全部订单</li>
                        <li :class="{'on':order_type===1}" @click="changeOrderState(1)">未付款</li>
                        <li :class="{'on':order_type===2}" @click="changeOrderState(2)">未发货</li>
                        <li :class="{'on':order_type===3}" @click="changeOrderState(3)">已发货</li>
                        <li :class="{'on':order_type===4}" @click="changeOrderState(4)">已完成</li>
                    </ul>
                </div>
            </div>
            <ul class="order-list">
                <li v-for="(item,index) of orders" :key="item.Id">
                    <div class="list-top clearfix">
                        <span class="date f-l">{{item.time}}</span>
                        <span class="order-id f-l">订单编号：{{item.ordid}}</span>
                        <button class="f-r" type="button" @click="orderBtnClick(item,index)">{{item.order_type|buttonType}}</button>
                    </div>
                    <div class="list-content d-f">
                        <div class="c-left d-f">
                            <ul>
                                <li>型号：{{item.model}}</li>
                                <li>品牌：{{item.manufacturer}}</li>
                                <li>类型：{{item.type|listType}}</li>
                                <li>仓库：{{item.address}}</li>
                            </ul>
                        </div>
                        <ul class="c-center">
                            <li>
                                <span>购买类型：按包装量</span>
                                <span>单价：{{item.price}}元/包</span>
                            </li>
                            <li>
                                <span>购买数量：{{item.number}}</span>
                                <span>总价：{{item.total}}元</span>
                            </li>
                        </ul>
                        <ul class="c-right">
                            <li>{{item.order_type|orderType1}}</li>
                            <li @click="toOrderDetail(item)">查看订单</li>
                            <li>{{item.order_type|orderType2}}</li>
                        </ul>
                    </div>
                </li>
            </ul>
            <p class="empty" v-if="(!orders.length)&&(!isLoading)">暂无订单</p>
            <p class="empty" v-if="isLoading">加载中...</p>
            <!-- 分页 -->
            <div class="page d-f">
                <AppPageComponent ref="page" :count="count" :page="page" @eventpage="changePage"></AppPageComponent>
            </div>
        </div>
        <AppAlertComponent ref="alert"></AppAlertComponent>
        <LowPriceAfterSaleComponent ref="afterSale"></LowPriceAfterSaleComponent>
    </div>
</template>

<script>
    import service from '../services/service.js'
    import AppAlertComponent from './app-alert.vue'
    import AppPageComponent from './app-page.vue'
    import LowPriceAfterSaleComponent from '../components/low-price-after-sale.vue'

    export default{
        name:'low-price-order',
        components:{
            AppAlertComponent,
            AppPageComponent,
            LowPriceAfterSaleComponent
        },
        data(){
            return{
                orders:[],
                index:1,
                order_type:0,
                isLoading:false,
                page:0,
                count:0,
            }
        },
        methods:{
            toShoppingcar(){
                this.$router.push({path:'/main/low-price/low-price-shoppingcar'})
            },
            goBack(){
                this.$router.push({path:'/main/low-price/low-price-store'})
            },
            toOrderDetail(item){
                this.$router.push({path:'/main/low-price/low-price-order-detail',query:{order:JSON.stringify(item)}})
            },
            getOrderList(){
                this.isLoading=true
                let formdata=new FormData()
                let user=JSON.parse(sessionStorage.getItem("USER"))
                let jwt=sessionStorage.getItem("JWT")
                formdata.append('page',this.index)
                formdata.append('jwt',jwt)
                formdata.append('uid',user.Id)
                formdata.append('order_type',this.order_type)

                service.getOrderList(formdata).then((res)=>{
                    window.console.log(res)
                    if(res.data.code===200){
                        this.isLoading=false
                        this.orders=res.data.member
                        this.count=res.data.count
                        this.page=Math.ceil(this.count/15)
                    }
                }).catch(()=>{
                    this.isLoading=false
                })
            },
            changePage(index){
				this.index=index
				this.getOrderList()
            },
            changeOrderState(state){
                this.order_type=state
                this.index=1
                this.$refs.page.index=this.index
                this.getOrderList()
            },
            confirmOrder(item,index){
                let formdata=new FormData()
                formdata.append("jwt",sessionStorage.getItem("JWT"))
                formdata.append("Id",item.Id)

                service.confirmOrder(formdata).then((res)=>{
                    window.console.log(res)
                    if(res.data.code===200){
                        this.$refs.alert.show("收货成功")
                        this.orders[index].order_type=4
                        this.orders.splice(index,1)
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
                this.$router.push({name:'low-price-order-affirm',query:{state:1}})
            },
            orderBtnClick(item,index){
                switch(item.order_type){
                    case 1:
                        window.console.log("111")
                        this.toOrderAffirm(item)
                        break
                    case 2:
                        window.console.log("222")
                        this.remind(item)
                        break
                    case 3:
                        window.console.log("333")
                        this.confirmOrder(item,index)
                        break
                    case 4:
                        this.$refs.afterSale.show()
                        break
                }
            },
        },  
        created(){
            if(this.$route.query.state){
                this.order_type=this.$route.query.state
            }
            this.getOrderList()
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
                        return "取消订单"
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
            }
        }
    }
</script>

<style scoped>
    .low-price-order{
		padding-top:166px;
		background-color: #e7e4e3;
    }
    .center-box .order-top{
        padding:80px 40px 0;
		background-color: #fff;
    }
    .center-box{
        padding-bottom:60px;
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
     /* 搜索栏 */
    .store-search{
        margin-top:20px;
        justify-content: space-around;
    }
    .store-search .input{
        overflow: hidden;
        width: 874px;
        height: 60px;
        border-radius: 5px;
        align-items: center;
    }
    
    .store-search div i{
        height: 30px;
    }
    .order,
    .back{
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        cursor: pointer;
    }
    .order i{
        width: 32px;
        background-image: url(../assets/images/购物车.png);
    }
    .back i{
        width: 32px;
        background-image: url(../assets/images/返回.png);
    }
    /* 订单导航 */
    .order-nav ul{
        margin:20px 0;
        border-bottom:1px solid #ccc;
    }
    .order-nav li{
        position: relative;
        padding:14px;
        margin-right:20px;
        font-size: 20px;
        cursor: pointer;
    }
    .order-nav li.on{
        color:#f6b243;
    }
    .order-nav li.on::after{
        content:'';
        display: block;
        position: absolute;
        bottom:-1px;
        left:0;
        width: 100%;
        height: 3px;
        background-color: #f6b243;
    }
    /* 订单列表 */
    .order-list>li{
        padding:20px 40px 15px;
        border-radius: 10px;
        background-color: #fff;
    }
    .order-list>li+li{
        margin-top:20px;
    }
    .list-top{
        margin-bottom:15px;
        padding-bottom:10px;
        border-bottom:2px solid #979797;
    }
    .list-top span{
        font-size: 14px;
        line-height: 60px;
    }
    .list-top span.date{
        font-weight: bold;
    }
    .list-top span+span{
        margin-left:40px;
    }
    .list-top button{
        width: 134px;
        height: 60px;
        background-color: #f6b243;
        border-radius: 5px;
        font-size: 20px;
        color:#fff;
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
    .c-right{
        width: 154px;
        border-left:1px solid #979797;
        text-align: center;
        line-height: 46px;
    }
    .c-right li{
        cursor: pointer;
    }
    p.empty{
        margin:20px 0;
		text-align: center;
	}
    div.page{
		margin:30px;
		flex-direction: row-reverse
	}
</style>