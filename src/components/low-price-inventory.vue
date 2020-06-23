<template>
    <div class="low-price-inventory">
        <div class="center-box">
            <div class="crumbs">
                <span>您的位置：</span>
                <router-link :to="{path:'/main/low-price'}">低价抛售</router-link>
                <i class="icon iconfont">&#xe624;</i>
                <span class="last">库存市场</span>
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
							<td>持续备货</td>
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
							<td>{{item.continuous_stock|stockUp}}</td>
							<td class="look">
								<button @click="toInventoryDetail(item)">查看<span class="specail" v-if="item.state===1">特</span></button>
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
		<LowPriceInventoryDetailComponent ref="inventoryDetail"></LowPriceInventoryDetailComponent>
    </div>
</template>

<script>
	const LowPriceInventoryDetailComponent=()=>import('./low-price-inventory-detail.vue')
	import AppPageComponent from './app-page.vue'

	import service from '../services/service.js'

    export default{
        name:'low-price-inventory',
        components:{
			LowPriceInventoryDetailComponent,
			AppPageComponent
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
			toInventoryDetail(item){
				this.$refs.inventoryDetail.show(item);	
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
                service.getLowPriceInventoryList(formdata).then((res)=>{
                    window.console.log(res)
                    if(res.data.code===200){
                        this.isShowLoading=false
                        res.data.member.forEach(item => {
                            item.isChk=false
                        })
                        this.inventories=res.data.member
                        this.count=res.data.count
                        this.page=Math.ceil(res.data.count/15)
                    }else{
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
            }
		},
		created(){
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
    .low-price-inventory{
		padding-top:166px;
		background-color: #e7e4e3;
    }
    .low-price-inventory .center-box{
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
    /* 库存列表 */
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
		color:#f6b243;
		text-align: center;
	}
    table td.look button{
		position: relative;
		width: 72px;
		height: 30px;
		background-color: #f6b243;
		border-radius: 5px;
		color:#fff;
	}	
	table td.look button>.specail{
		position: absolute;
		top:-10px;
		right:-10px;
		width: 20px;
		height: 20px;
		background-color: red;
		border-radius: 50%;
		line-height: 20px;
		text-align: center;
		color:#fff;
		font-size: 12px;
	}
	p.empty{
        margin:20px 0;
		text-align: center;
	}
	div.page{
		margin:30px;
		flex-direction: row-reverse
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
</style>