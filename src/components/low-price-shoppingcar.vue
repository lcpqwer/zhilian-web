<template>
    <div class="low-price-shoppingcar">
        <div class="center-box">
            <div class="crumbs">
                <span>您的位置：</span>
                <router-link :to="{path:'/main/low-price'}">低价抛售</router-link>
                <i class="icon iconfont">&#xe624;</i>
                <router-link :to="{path:'/main/low-price/low-price-store'}">官方自营</router-link>
                <i class="icon iconfont">&#xe624;</i>
                <span class="last">购物车</span>
            </div>
            <div class="table-list" v-if="list.length">
                <table>
                    <thead>
                        <tr>
                            <td class="chk-all-box">
                                <input type="checkbox" id="chk-all" name="chk-all" v-model="isChkAll" @change="changeChkAll()">
                                <label for="chk-all" class="chk-label"></label>
                                <label for="chk-all">全选</label>
                            </td>
                            <td>类型</td>
                            <td>生产商</td>
                            <td>最小包装</td>
                            <td>型号</td>
                            <td>价格（元/个）</td>
                            <td>数量（个）</td>
                            <td>仓库</td>
                            <td>购买数量</td>
                            <td>总价</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) of list" :key="item.Id" :class="{'disabled':item.state!==1}">
                            <td class="chk-single-box">
                                <input type="checkbox" :id="'chk-single'+item.Id" name="chk-single" v-model="item.isChkSingle" :disabled='item.state!==1' @change="changeChkSingle(index)">
                                <label :for="'chk-single'+item.Id" class="chk-label" :class="{'disabled':item.state!==1}"></label>
                            </td>
                            <td>{{item.type|listType}}</td>
                            <td>{{item.manufacturer}}</td>
                            <td>{{item.minimum}}</td>
                            <td>{{item.model}}</td>
                            <td>{{item.price}}</td>
                            <td>{{item.stock_number}}</td>
                            <td>{{item.address}}</td>
                            <td class="btn-box">
                                <button @click="sub(item)" :disabled='item.state!==1'>-</button>
                                <input :disabled='item.state!==1' type="number" name="num-input" v-model="item.pay_number" @input="changeNum(item)" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))">
                                <button @click="add(item)" :disabled='item.state!==1'>+</button>
                            </td>
                            <td class="list-total">{{(item.pay_number*item.price)|money}}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="total d-f">
                    <div class="clear-box">
                        <span class="clear-all" @click="deleteShoppingCar(1)">删除选中产品</span>
                        <span class="claer-check" @click="deleteShoppingCar(2)">清除失效产品</span>
                        <span class="claer-check" @click="deleteShoppingCar(3)">清除库存不足产品</span>
                    </div>
                    <div class="total-right d-f">
                        <p>已选商品<span>{{chkNum}}</span>件</p>
                        <p>合计：<span>{{allTotal|money}}</span></p>
                        <button type="button" @click="toOrderAffirm()" :disabled="orders.length===0">立即结算</button>
                    </div>
                </div>
            </div>
            <p class="empty" v-if="!list.length">您的购物车空空如也，去<router-link :to="{path:'/main/low-price'}">逛一逛</router-link>吧~</p>
        </div>
        <AppAlertComponent ref="alert"></AppAlertComponent>
    </div>
</template>

<script>
    import AppAlertComponent from './app-alert.vue'
    import service from '../services/service.js'

    export default{
        name:'low-price-shoppingcar',
        components:{
            AppAlertComponent
        },
        data(){
            return {
                list:[],
                isChkAll:false,
                allTotal:0,
                chkNum:0,
                orders:[]
            }
        },
        methods:{
            changeChkAll(){
                this.list.forEach((item)=>{
                    if(item.state===1){
                        item.isChkSingle=this.isChkAll
                    }
                })
                if(this.isChkAll){
                    this.list.forEach((item)=>{
                        if(item.state===1){
                            this.orders.push(item)
                            this.chkNum++
                            this.allTotal+=item.price*item.pay_number
                        }
                    })
                    window.console.log(this.orders)
                }else{
                    this.chkNum=0
                    this.allTotal=0
                    this.orders=[]
                }
            },
            changeChkSingle(index){
                let idx=this.list.findIndex((item)=>{
                    if(item.state===1){
                        return item.isChkSingle===false
                    }
                })
                if(idx===-1){
                    this.isChkAll=true
                }else{
                    this.isChkAll=false
                }
                if(this.list[index].isChkSingle){
                    this.orders.push(this.list[index])
                    this.chkNum++
                    this.allTotal+=this.list[index].price*this.list[index].pay_number
                }else{
                    this.orders.forEach((item,idx)=>{
                        if(item.Id===this.list[index].Id){
                            this.orders.splice(idx,1)
                        }
                    })
                    this.chkNum--
                    this.allTotal-=this.list[index].price*this.list[index].pay_number
                }
                
            },
            toOrder(){
                this.$router.push({path:'/main/low-price/low-price-order'})
            },
            goBack(){
                this.$router.push({path:'/main/low-price/low-price-store'})
            },
            toOrderAffirm(){
                if(this.orders.length){
                    window.console.log(this.orders)
                    sessionStorage.setItem("ORDERS",JSON.stringify(this.orders))
                    this.$router.push({name:'low-price-order-affirm'})
                }
            },
            getShoppingCarList(){
                let formdata = new FormData()
                let jwt = sessionStorage.getItem("JWT")
                let user =JSON.parse(sessionStorage.getItem("USER"))
                formdata.append('jwt',jwt)
                formdata.append('uid',user.Id)

                service.getShoppingCarList(formdata).then((res)=>{
                    window.console.log(res)
                    if(res.data.code===200){
                        res.data.msg.forEach((item)=>{
                            item.isChkSingle=false
                            if(item.state===1&&item.isChkSingle){
                                this.allTotal+=item.price*item.pay_number
                            }
                        })
                        this.list=res.data.msg
                    }
                })
            },
            changeNum(item){
                this.allTotal=0
                this.list.forEach((item)=>{
                    if(item.state===1&&item.isChkSingle){
                        this.allTotal+=item.price*item.pay_number
                    }
                })
                if(item.pay_number===''||item.pay_number<1){
                    item.pay_number=1
                    return
                }
                if(item.pay_number>item.stock_number){
                    item.pay_number=item.stock_number
                    this.$refs.alert.show("数量上限",true)
                    return 
                }
                let formdata=new FormData()
                let jwt = sessionStorage.getItem("JWT")
                let user =JSON.parse(sessionStorage.getItem("USER"))
                formdata.append('jwt',jwt)
                formdata.append('Id',item.Id)
                formdata.append('uid',user.Id)
                formdata.append('pay_number',item.pay_number)
                service.changeShoppingCarNum(formdata).then((res)=>{
                    window.console.log(res)
                    if(res.data.code===400){
                        this.$refs.alert.show(res.data.msg,true)
                    }
                })
            },
            sub(item){
                if(item.pay_number>1){
                    item.pay_number--
                    this.changeNum(item)
                }
            },
            add(item){
                item.pay_number++
                this.changeNum(item)
            },
            deleteShoppingCar(state){
                let formdata=new FormData()
                formdata.append('uid',JSON.parse(sessionStorage.getItem("USER")).Id)
                formdata.append('jwt',sessionStorage.getItem("JWT"))
                formdata.append('state',state)
                if(state===1){
                    this.list.forEach(item=>{
                        if(item.isChkSingle){
                            formdata.append('Id[]',item.Id)
                        }
                    })
                }
                service.deleteShoppingCar(formdata).then((res)=>{
                    window.console.log(res)
                    if(res.data.code===200){
                        this.getShoppingCarList()
                        this.$refs.alert.show('删除成功')
                        this.allTotal=0
                        this.chkNum=0
                    }else{
                        this.$refs.alert.show(res.data.msg,true)
                    }
                })
            }
        },
        created(){
            this.getShoppingCarList()
        },
        filters:{
            money(value){
                return '￥'+value
            },
            listType(value){
				return value===1?"现货":"期货"
			},
        }
    }
</script>

<style scoped>
    .low-price-shoppingcar{
		padding-top:166px;
		background-color: #e7e4e3;
    }
    .low-price-shoppingcar .center-box{
        min-height: 800px;
        padding:80px 40px 0;
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
    /* 搜索栏 */
    .store-search{
        margin-top:20px;
        justify-content: space-around;
    }
    .store-search .input{
        overflow: hidden;
        width: 874px;
        height: 60px;
        background-color: #f8f6f4;
        border-radius: 5px;
        align-items: center;
    }
    .store-search .input input{
        width: 726px;
        height: 100%;
        background-color: transparent;
        text-indent: 10px;
    }
    .store-search .input button{
        width: 148px;
        height: 100%;
        background-color: #f6b243;
        border-radius: 5px;
        font-size: 20px;
        color:#fff;
    }
    .store-search .input i{
        width: 30px;
        height: 30px;
        margin-left:20px;
        background-color: transparent;
        background-image: url(../assets/images/搜索.png);
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
        width: 24px;
        background-image: url(../assets/images/订单.png);
    }
    .back i{
        width: 32px;
        background-image: url(../assets/images/返回.png);
    }

    /*  */
	.chk>button{
        width: 72px;
        height: 32px;
        background-color: #f6b243;
        border-radius: 5px;
        color:#fff;
    }
    .chk{
        margin-top:20px;
        background-color: #f8f6f4;
        border-top:3px solid #f6b243;
        align-items: center;
    }
    .chk>ul li{
        padding:16px 20px;
        cursor: pointer;
    }
    .chk>ul li.on{
        background-color: #fff;
    }
    .chk .price{
        align-items: center;
    }
    .chk .price input{
        width: 80px;
        height: 32px;
        background-color: #fff;
        border-radius: 5px;
		text-indent: 10px;
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
    /* 商品列表 */
    .table-list{
        padding:0 40px 80px;
    }
    table{
		width: 100%;
		border-collapse: collapse;
		text-align: center
	}
    table tbody tr{
        cursor: pointer;
    }
    table tbody tr:not([class="disabled"]):hover{
        background-color: #f8f6f4;
    }
	table td{
		height: 70px;
		border-bottom:1px solid #ccc;
	}
	table td.buy button{
		width: 104px;
		height: 30px;
		background-color: #f6b243;
		border-radius: 5px;
		color:#fff;
	}	
	table td.btn-box button{
		width:20px;
		height: 20px;
		border: 1px solid #ccc;
		font-size: 12px;
	}
	table td.btn-box input{
		vertical-align: middle;
		box-sizing: border-box;
		width: 60px;
		height: 20px;
        padding:0;
		margin:0 5px;
		border:1px solid #ccc;
		text-align: center;
	}
    .chk-all-box input,
    .chk-single-box input{
        display: none;
    }
    .chk-all-box input:checked+label.chk-label,
    .chk-single-box input:checked+label.chk-label{
        background-image: url(../assets/images/success.png);
        border-color: #f6b243;
    }
    .chk-all-box label.chk-label,
    .chk-single-box label.chk-label{
        display: inline-block;
        width: 24px;
        height: 24px;
        background-size: contain;
        border:1px solid #aaa;
        border-radius: 50%;
        cursor: pointer;
    }
    .chk-all-box label{
        vertical-align: middle
    }
    table td:nth-child(1){
        width: 80px;
    }
    table td:nth-child(9){
        width: 120px;
    }
    tr.disabled{
        color:#ccc;
        cursor: no-drop;
    }
    /* 结算 */
    .total{
        height: 60px;
        margin-top:30px;
        align-items: center;
        justify-content: space-between;
        color:#ccc;
    }
    .total .clear-box span{
        padding-right:20px;
        cursor: pointer;
    }
    .total .total-right span{
        font-size: 20px;
        color:#f17f3a;
    }
    .total .total-right{
        align-items: center;
    }
    .total .total-right button{
        width: 224px;
        height: 60px;
        background-color: #f6b243;
        border-radius: 5px;
        font-size: 20px;
        color:#fff;
    }
    .total .total-right p:nth-child(2){
        margin:0 20px 0 40px;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button{
        -webkit-appearance: none !important; 
    }/* chrome */

    input[type="number"]{
        -moz-appearance:textfield;/* firefox */
    }
    input:disabled{
        border-color: #ccc;
        color:#ccc
    }
    .low-price-shoppingcar .center-box label.disabled{
        border-color: #ccc;
        cursor: no-drop
    }
    .low-price-shoppingcar button:disabled{
        background-color: #ccc;
        cursor: no-drop
    }
    td.list-total{
        width: 120px;
    }
    p.empty{
        margin:30px 0;
        text-align: center
    }
    p.empty a{
        color:#f6b243
    }
</style>