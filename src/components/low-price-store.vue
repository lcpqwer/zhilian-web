<template>
    <div class="low-price-store">
        <div class="center-box">
            <div class="store-search d-f">
                <div class="input d-f">
                    <!-- <i class="icon"></i>
                    <input type="text" placeholder="请输入想要搜索的型号">
                    <button>确认搜索</button> -->
                </div>
                <div class="order d-f" @click="toOrder()">
                    <i class="icon"></i>
                    <span>我的订单</span>
                </div>
                <div class="shoppingcar d-f"  @click="toShoppingcar()">
                    <i class="icon"></i>
                    <span>我的购物车</span>
                </div>
            </div>
            <div class="crumbs">
                <span>您的位置：</span>
                <router-link :to="{path:'/main/low-price'}">低价抛售</router-link>
                <i class="icon iconfont">&#xe624;</i>
                <span class="last">官方自营</span>
            </div>
            <div class="low-price-top">
				<div class="list-top">
                    <div class="search d-f">
                        <div>
                            <label for="category">分类</label>
                            <select name="category" id="category" v-model="category">
                                <option value="">全部</option>
                                <option value="1">现货</option>
                                <option value="2">期货</option>
                            </select>
                        </div>
                        <div>
                            <label for="model">型号</label>
                            <input type="text" v-model="model" id="model">
                        </div>
                        <div>
                            <label for="manufacturer">品牌</label>
                            <input type="text" v-model="manufacturer" id="manufacturer"> 
                        </div>
                        <button class="btn-search" @click="getInventoryList()">搜索</button>
                    </div>
                    <div class="chk d-f">
                        <ul class="d-f">
                            <li :class="{'on':classState===0}" @click="allSort()">综合</li>
                            <li :class="{'on':classState===1}" @click="changeNumberSort()">数量<i class="icon iconfont">&#xe66c;</i></li>
                            <li :class="{'on':classState===2}" @click="changePriceSort()">价格<i class="icon iconfont">&#xe66c;</i></li>
                        </ul>
                        <div class="price d-f">
                            <input type="text" placeholder="最低价" v-model="minPrice">
                            <span>~</span>
                            <input type="text" placeholder="最高价" v-model="maxPrice">
                            <button @click="changePriceRange()">确定</button>
                        </div>
                    </div>
                </div>
			</div>
            <div class="table-list">
                <table>
                    <thead>
                        <tr>
                            <td>类型</td>
                            <td>品牌</td>
                            <td>最小包装</td>
                            <td>型号</td>
                            <td>价格（元/个）</td>
                            <td>数量（个）</td>
                            <td>仓库</td>
                            <td>购买数量</td>
                            <td>操作</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item of inventories" :key="item.Id">
                            <td>{{item.type|category}}</td>
							<td>{{item.manufacturer}}</td>
							<td>{{item.minimum}}</td>
							<td>{{item.model}}</td>
							<td>{{item.price}}</td>
							<td>{{item.stock_number}}</td>
							<td>{{item.address}}</td>
                            <td class="btn-box">
                                <button @click="sub(item)">-</button>
                                <input type="number" v-model="item.buyNum" onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))">
                                <button @click="item.buyNum++">+</button>
                            </td>
                            <td class="buy">
                                <button @click="toAddtoShoppingcar(item)">加入购物车</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p class="empty" v-if="(!inventories.length)&&(!isShowLoading)">暂无数据</p>
				<p class="empty" v-if="isShowLoading">加载中...</p>
				<!-- 分页 -->
				<div class="page d-f">
					<AppPageComponent :count="count" :page="page" @eventpage="changePage"></AppPageComponent>
				</div>
            </div>
        </div>
        <AppAlertComponent ref="alert"></AppAlertComponent>
    </div>
</template>

<script>
    import AppPageComponent from './app-page.vue'
    import AppAlertComponent from './app-alert.vue'

	import service from '../services/service.js'

    export default{
        name:'low-price-store',
        components:{
            AppPageComponent,
            AppAlertComponent
        },
        data(){
            return {
                inventories:[],
				index:1,
				count:0,
				page:0,
				number_rise:0,
				number_drop:0,
				price_rise:0,
				price_drop:0,
				// 价格区间
                minPrice:"",
                maxPrice:"",
                // 搜索
                category:"",        //分类
                manufacturer:"",    //生产商
                model:"",           //型号
                classState:0,
            }
        },
        methods:{
            toOrder(){
                this.$router.push({path:'/main/low-price/low-price-order'})
            },
            toShoppingcar(){
                this.$router.push({path:'/main/low-price/low-price-shoppingcar'})
            },
            toAddtoShoppingcar(item){
                if(sessionStorage.getItem("USER")){
                    if(item.buyNum>0){
                        let formdata = new FormData()
                        let user=JSON.parse(sessionStorage.getItem("USER"))
                        let jwt = sessionStorage.getItem("JWT")
                        formdata.append("Id",item.Id)
                        formdata.append("uid",user.Id)
                        formdata.append("jwt",jwt)
                        formdata.append("pay_number",item.buyNum)
                        service.addShoppingCar(formdata).then((res)=>{
                            if(res.data.code===200){
                                this.$refs.alert.show("加入成功，去购物车查看")
                            }else{
								this.$refs.alert.show(res.data.msg,true)
							}
                        })
                    }else{
                        this.$refs.alert.show("请选择购买数量")
                    }
                }else{
                    this.$router.push({path:'/login'})
                }
            },
			getInventoryList(){
				this.isShowLoading=true
                let formdata=new FormData()
                // 排序判断
                // 数量顺序
                if(this.number_rise){
                    formdata.append('number_rise',1)
                }else if(this.number_drop){
                    formdata.append('number_drop',1)
                }
                // 价格顺序
                if(this.price_rise){
                    formdata.append('price_rise',1)
                }else if(this.price_drop){
                    formdata.append('price_drop',1)
                }
                // 价格区间
                formdata.append('maximum',this.maxPrice)
                formdata.append('minimum',this.minPrice)
                // 搜索
                formdata.append('type',Number(this.category))
                formdata.append('manufacturer',this.manufacturer)
                formdata.append('model',this.model)

                formdata.append('page',this.index)
                service.getLowPriceStoreList(formdata).then((res)=>{
                    window.console.log(res)
                    if(res.data.code===200){
						this.isShowLoading=false
                        res.data.member.forEach(item => {
                            item.isChk=false
                            item.buyNum=0
                        })
                        this.inventories=res.data.member
                        this.count=res.data.count
                        this.page=Math.ceil(res.data.count/15)
                    }else{
						this.isShowLoading=false
                        this.inventories=[]
                        this.count=0
                        this.page=0
                    }
                }).catch(()=>{
					this.isShowLoading=false
				})
			},
			changePage(index){
				this.index=index
				this.getInventoryList()
			},
			changeNumberSort(){
                this.classState=1
                this.price_rise=0
                this.price_drop=0
                this.numbrt_sort=!this.numbrt_sort
                if(this.numbrt_sort){
                    this.number_rise=1
                    this.number_drop=0
                }else{
                    this.number_rise=0
                    this.number_drop=1
                }
                this.getInventoryList()
            },
            changePriceSort(){
                this.classState=2
                this.number_drop=0
                this.number_rise=0
                this.price_sort=!this.price_sort
                if(this.price_sort){
                    this.price_rise=1
                    this.price_drop=0
                }else{
                    this.price_rise=0
                    this.price_drop=1
                }
                this.getInventoryList()
            },
            allSort(){
                this.classState=0
                this.number_rise=0
                this.number_drop=0
                this.price_rise=0
                this.price_drop=0
                this.numbrt_sort=false//true为数量升序
                this.price_sort=false
                this.minPrice=''
                this.maxPrice=''
                this.getInventoryList()
            },
            changePriceRange(){
                this.classState=99
                if(this.minPrice&&this.maxPrice){
                    if(this.minPrice>=this.maxPrice){
                        this.$refs.alert.show("请填写正确的价格",true)
                        return
                    }
                    this.getInventoryList()
                }else{
                    this.$refs.alert.show("请输入价格",true)
                }
            },
            sub(item){
                if(item.buyNum>0){
                    item.buyNum--
                }
            }
        },
        created(){
            if(this.$route.query.keywords){
                this.model=this.$route.query.keywords
            }
            this.getInventoryList()
		},
		filters:{
            category(value){
                return value===1?"现货":"期货"
            },
            stockUp(value){
                return value===1?"是":"否"
            }
        },
    }
</script>

<style scoped>
    .low-price-store{
		padding-top:166px;
		background-color: #e7e4e3;
    }
    .low-price-store .center-box{
		padding-top:80px;
		background-color: #fff;
    }
    /* 面包屑导航 */
    .crumbs{
        margin:0 40px 0;
        padding-bottom:24px;
        border-bottom:1px solid #ccc;
        font-size: 18px;
        color:#a9a9a9;
    }
    .crumbs a{
        color:#a9a9a9;
    }
    .crumbs>span:nth-child(4){
        color:#f6b243;
    }
    .crumbs i{
        margin:0 10px;
    }
    /* 搜索栏 */
    .store-search{
        padding:0 40px;
        margin-bottom:20px;
        justify-content: space-around;
    }
    .store-search .input{
        overflow: hidden;
        width: 874px;
        height: 60px;
        /* background-color: #f8f6f4; */
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
    .shoppingcar{
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        cursor: pointer;
    }
    .order i{
        width: 24px;
        background-image: url(../assets/images/订单.png);
    }
    .shoppingcar i{
        width: 32px;
        background-image: url(../assets/images/购物车.png);
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
    table tbody tr:hover{
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
        padding:0;
		border: 1px solid #ccc;
		font-size: 12px;
	}
	table td.btn-box input{
		vertical-align: middle;
		box-sizing: border-box;
		width: 60px;
		height: 20px;
		margin:0 5px;
		border:1px solid #ccc;
		text-align: center;
	}
    /* 筛选头部 */
	.low-price-top{
		margin-top:20px;
		padding:0 40px;
		background-color: #fff;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
		font-size: 14px;
	}

    .low-price-top  .list-top .search{
        height: 75px;
        justify-content: space-around;
        border-bottom:3px solid #f6b243;
    }
    .search input,
    .search select{
        width: 150px;
        height: 32px;
        margin-left:10px;
        background-color: #f8f6f4;
        border:none;
        text-indent: 10px;
    }
    
    .search>button,
	.chk button{
        width: 72px;
        height: 32px;
        background-color: #f6b243;
        border-radius: 5px;
        color:#fff;
    }
    .chk{
        background-color: #f8f6f4;
        align-items: center;
    }
    .chk>ul li{
        padding:16px 20px;
        cursor: pointer;
    }
    .chk>ul li:hover,
    .chk>ul li.on{
        color:#f6b243
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

	p.empty{
        margin:20px 0;
		text-align: center;
	}
    div.page{
		margin:30px;
		flex-direction: row-reverse
	}
    
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button{
        -webkit-appearance: none !important; 
    }/* chrome */

    input[type="number"]{
        -moz-appearance:textfield;/* firefox */
    }
</style>