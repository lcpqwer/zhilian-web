<template>
	<div id="low-price">
		<div class="center-box">
			<div class="specail">
				<button class="specail-btn" @click="uploadSpecail">上传特价库存</button>
			</div>
			<!-- 官方直购 -->
			<div class="low-price-store">
				<div class="store-top-batch d-f">
					<div class="title-box d-f">
						<i class="icon"></i>
						<h4>官方特价直购</h4>
					</div>
					<div class="batch-btn-box">
						<button @click="loadBatchMode">下载批量查询模板</button>
						<input type="file" class="uploadBatch" id="uploadBatch" ref="uploadFile" @change="uploadBatchExcel">
						<label for="uploadBatch">{{fileName}}(格式为xlsx,xls,csv)</label>
						<button class="export" @click="exportExcel">导出批量查询结果</button>
					</div>
				</div>
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
						<tr v-for="item of storeArr" :key="item.Id">
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
                                <button class="buy" @click="toAddtoShoppingcar(item)">加入购物车</button>
                            </td>
                        </tr>
					</tbody>
				</table>
				<p class="empty" v-if="isShowLoading">加载中...</p>
				<div class="more">
					<button @click="toStore()">查看更多</button>
				</div>
			</div>
			<!-- 库存市场 -->
			<div class="low-price-inventory low-price-store">
				<div class="store-top d-f">
					<i class="icon"></i>
					<h4>会员库存市场</h4>
				</div>
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
						<tr v-for="item of inventoryArr" :key="item.Id">
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
				<p class="empty" v-if="isShowLoading">加载中...</p>
				<div class="more">
					<button type="buttom" @click="toInventory()">查看更多</button>
				</div>
			</div>
			<!-- 批量查询结果 -->
			<div class="low-price-batch low-price-inventory low-price-store">
				<div class="store-top-batch d-f">
					<div class="title-box d-f">
						<i class="icon"></i>
						<h4>批量查询结果</h4>
					</div>
				</div>
				<table>
					<thead>
						<tr>
							<td>型号</td>
							<td>求购数量</td>
							<td>库存数量</td>
							<td>未税单价</td>
							<td>货期</td>
							<td>会员企业名</td>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item,index) of batchUploadArr" :key="index">
							<td>{{item.model}}</td>
							<td>{{item.wantbuy}}</td>
							<td>{{item.stock_number}}</td>
							<td>{{item.price}}</td>
							<td>{{item.date}}</td>
							<td>{{item.name}}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<LowPriceInventoryDetailComponent ref="inventoryDetail"></LowPriceInventoryDetailComponent>
		<AppAlertComponent ref="alert"></AppAlertComponent>
		<PayConfirmComponent ref="payconfirm"></PayConfirmComponent>
		<LowPriceSpecailComponent ref="specail"></LowPriceSpecailComponent>
	</div>
</template>

<script>
	const LowPriceInventoryDetailComponent=()=>import('./low-price-inventory-detail.vue')
	import AppAlertComponent from './app-alert.vue'
	import PayConfirmComponent from './low-price-pay-confirm.vue'
	import LowPriceSpecailComponent from './low-price-specail.vue'
	import service from '../services/service.js'
    export default{
        name:'low-price',
        components:{
			LowPriceInventoryDetailComponent,
			AppAlertComponent,
			PayConfirmComponent,
			LowPriceSpecailComponent
		},
		data(){
			return {
				storeArr:[],
				inventoryArr:[],
				isShowLoading:false,
				keywords:'',
				batchResults:[],
				fileName:'上传批量查询',
				lengthArr:[],
				batchUploadArr:[]
			}
		},
        methods:{
            toStore(){ 
                this.$router.push({name:'low-price-store'})
            },
            toInventory(){
                this.$router.push({name:'low-price-inventory'})
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
			toInventoryDetail(item){
				this.$refs.inventoryDetail.show(item);	
			},
			getLowPriceStoreList(){
				this.isShowLoading=true
                let formdata=new FormData()
				formdata.append('page',1)
				formdata.append('model',this.keywords)
                service.getLowPriceStoreList(formdata).then((res)=>{
					window.console.log(res)
                    if(res.data.code===200){
						this.isShowLoading=false
						let max=4;
						if(res.data.member.length<4){
							max=res.data.member.length
						}
						for(let i = 0 ;i<max;i++){
                            res.data.member[i].buyNum=0
							this.storeArr.push(res.data.member[i])
						}
                    }else{
                        this.storeArr=[]
                    }
                }).catch(()=>{
					this.isShowLoading=false
				})
			},
			getInventoryList(){
				this.isShowLoading=true
                let formdata=new FormData()
                
                formdata.append('page',1)
				window.console.log(this.keywords)
				formdata.append('model',this.keywords)
                service.getLowPriceInventoryList(formdata).then((res)=>{
					window.console.log(res)
                    if(res.data.code===200){
						window.console.log(res)
						this.isShowLoading=false
						let max = 4
						if(res.data.member.length<4){
							max=res.data.member.length
						}
                        for(let i = 0 ;i<max;i++){
							this.inventoryArr.push(res.data.member[i])
						}
                    }else{
                        this.inventories=[]
                    }
                }).catch(()=>{
					this.isShowLoading=false
				})
			},
			sub(item){
                if(item.buyNum>0){
                    item.buyNum--
                }
			},
			loadBatchMode(){
				window.open('https://login.asap-get.com/lianzhi/public/wantbuyTemplate.csv')
			},
			uploadBatchExcel(){
				if(!sessionStorage.getItem("USER")){
					this.$router.push({path:'/login'})
				}
				let file=this.$refs.uploadFile.files[0]
                let reader = new FileReader()
                reader.onload=()=>{
					if (file.type === ''){
						let type = file.name.split('.')[file.name.split('.').length-1]
						Object.defineProperty(file, 'type', {
							value: 'text/'+type,
							writable: true,
							configurable: true,
							enumerable: true
						})
					}
                    if(file.type!='text/xlsx'&&file.type!='text/xls'&&file.type!='text/csv'&&file.type!='application/vnd.ms-excel'){
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

                    service.uploadBatchSearch(formdata).then(res=>{
                        if(res.data.code===200){
							this.$refs.alert.show("上传成功")
							this.lengthArr=res.data.data
							localStorage.setItem('BATCH_SEARCH',JSON.stringify(res.data.data))
							res.data.data.forEach(item => {
								item.price='***'
								item.date='***'
								item.name='***'
								this.batchUploadArr.push(item)
							});
                        }else{
                            this.$refs.alert.show("上传失败",true)
                        }
                    })
                }
                reader.readAsDataURL(file)
			},
			exportExcel(){
				if(!this.lengthArr.length){
					this.$refs.alert.show("请先上传查询",true)
					return
				}
				this.$refs.payconfirm.show(2)
				window.open('https://login.asap-get.com/lianzhi/index/Excelword/wanttobuy?uid='+JSON.parse(sessionStorage.getItem("USER")).Id)
			},
			uploadSpecail(){
				this.$refs.specail.show()
			}
		},
		created(){
			// this.batchUploadArr=[]
			if(this.$route.query.keywords){
				this.keywords=this.$route.query.keywords
			}
			if(this.$route.query.data){
				let formdata=new FormData()
				formdata.append('data',this.$route.query.data)
				formdata.append('jwt',sessionStorage.getItem("JWT"))
				formdata.append('uid',JSON.parse(sessionStorage.getItem("USER")).Id)
				service.downloadBatchResult(formdata).then(res=>{
					window.console.log(res)
					if(res.status===200){
						location.href=`https://login.asap-get.com/lianzhi/index/Excelword/stock_export?data=${this.$route.query.data}&&jwt=${sessionStorage.getItem("JWT")}&&uid=${JSON.parse(sessionStorage.getItem("USER")).Id}`
						this.$router.push({path:'/main/low-price/low-price-home'})
						this.batchUploadArr=JSON.parse(localStorage.getItem('BATCH_SEARCH'))
						if(localStorage.getItem('BATCH_SEARCH')){
							localStorage.removeItem('BATCH_SEARCH')
						}
					}else {
						this.$refs.alert.show("下载失败",true)
					}
				})
			}
			this.getLowPriceStoreList()
			this.getInventoryList()
		},
		destroyed(){
			if(localStorage.getItem('BATCH_SEARCH')){
				localStorage.removeItem('BATCH_SEARCH')
			}
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
	#low-price{
		padding-top:246px;
		padding-bottom:40px;
		background-color: #e7e4e3;
	}
	.center-box>div+div{
		margin-top:20px;
	}
	.center-box>h4{
        padding:0 40px;
        background-color: #fff;
		border-bottom:1px solid #ccc; 
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
		font-size: 20px;
		font-weight: normal;
		line-height: 65px;
	}
	
	/* 官方直购 */
	.low-price-store,
	.low-price-inventory{
		padding:20px 40px;
		background-color: #fff;
		border-radius: 10px;
	}
	.store-top{
		margin-bottom:10px;
		align-items: center;
	}
	.store-top-batch{
		justify-content: space-between
	}
	.low-price-store h4{
		margin-left:10px;
	}
	.low-price-store i{
		width: 26px;
		height: 26px;
		background-image: url(../assets/images/logo单独图形.png);	
	}
	table{
		width: 100%;
		border-collapse: collapse;
		text-align: center
	}
	table td{
		height: 70px;
		border-bottom:1px solid #ccc;
	}
	table tbody tr{
		cursor: pointer;
	}
	table tbody tr:hover{
		background-color: #f8f6f4;
	}
	table td.buy button.buy{
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
	div.more{
		text-align: right;
	}
	div.more>button{
		width: 150px;
		height: 44px;
		margin-top:20px;
		border-radius: 5px;
		background-color: #f6b243;
		color:#fff;
	}
	/* 库存市场 */
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
	.bom>button{
		height: 32px;
		border-radius: 5px;
	}
	.bom>button:nth-child(1){
		margin-right:20px;
		background-color: #fff;
		border:1px solid #ccc;
	}
	.bom>button:nth-child(2){
		background-color: #f6b243;
		color:#fff;
	}
	
	p.empty{
        margin:20px 0;
		text-align: center;
	}
	input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button{
        -webkit-appearance: none !important; 
    }/* chrome */

    input[type="number"]{
        -moz-appearance:textfield;/* firefox */
    }
	.title-box{
		align-items: center
	}
	.batch-btn-box button,
	.batch-btn-box label{
		display: inline-block;
        padding:14px 25px;
        margin-right:20px;
		border:1px solid #ccc;
        border-radius: 10px;    
        font-size: 20px;
        cursor: pointer;
	}
	.batch-btn-box button.export{
		background-color: #f17f3a;
		border:none;
		color:#fff;
	}
	input.uploadBatch{
		display: none;
	}
	/* 特价 */
	.specail-btn{
		width: 120px;
		height: 42px;
		background-color: #f17f3a;
		border-radius: 5px;
		color:#fff;
	}
</style>
