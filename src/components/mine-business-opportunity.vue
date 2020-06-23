<template>
    <div id="mine-business-opportunity" class="mine-seller-chat r-list">
        <div class="r-top d-f">
            <div class="search">
                <input type="text" placeholder="搜索型号" name="kewords" v-model="keywords">
                <button @click="search()">搜索</button>
            </div>
        </div>
        <table class="list-table myprice">
            <thead>
                <tr>
                    <th>求购时间</th>
                    <th>型号</th>
                    <th>数量</th>
                    <th>未税单价</th>
                    <th>求购/实单</th>
                </tr>
            </thead>
            <tbody>
                <tr @click="showSellerChat()" v-for="(item) of list" :key="item.Id">
                    <td>{{item.time}}</td>
                    <td>{{item.model}}</td>
                    <td>{{item.number}}件</td>
                    <td>{{item.untaxedprice}}</td>
                    <td class="on"><button :class="{'on':item.type==='1'}">{{item.type|listType}}</button></td>
                </tr>
            </tbody>
        </table>
        <p class="empty" v-if="(!list.length)&&(!isShowLoading)">暂无数据</p>
        <p class="empty" v-if="isShowLoading">加载中...</p>
        <!-- 分页 -->
        <div class="page d-f">
            <AppPageComponent :count="count" :page="page" @eventpage="changePage"></AppPageComponent>
        </div>
    </div>
</template>

<script>
    import service from '../services/service.js'
    import AppPageComponent from './app-page.vue'
    export default {
        name:'mine-seller-chat',
        components:{
            AppPageComponent
        },
        data(){
            return {
                isShowLoading:false,
                list:[],
                keywords:'',
                page:0,
                count:0,
                index:1
            }
        },
        methods:{
            showSellerChat(){
				this.$router.push({path:'/main/buy'})
            },
            loadAllBuyList(){
				this.isShowLoading=true
				let formdata=new FormData()
                let jwt = sessionStorage.getItem("JWT")
                let user=JSON.parse(sessionStorage.getItem("USER"))
                formdata.append('jwt',jwt)
                formdata.append('uid',user.Id)
				formdata.append('model',this.keywords)
				formdata.append('page',this.index)
				formdata.append('wanttobuy',1)

				service.showBuyList(formdata)
					.then((res)=>{
						window.console.log(res)
						if(res.data.code===200){
							this.isShowLoading=false
							this.list=res.data.data
							this.count=res.data.count
							this.page=Math.ceil(this.count/15)
						}
					})
					.catch(()=>{
						this.isShowLoading=false
					})
            },
			changePage(index){
				this.index=index
				this.loadAllBuyList()
            },
            search(){
				if(this.keywords){
					this.loadAllBuyList()
				}else{
					this.$refs.appalert.show("请输入型号",true)
				}
			},
        },
        filters:{
			listType(value){
				return value==='1'?"实单":"询价"
			},
			time(value){
				return value.substring(0,10)
			}
        },
        created(){
            this.loadAllBuyList()
        }
    }
</script>

<style scoped>
    .mine-seller-chat{
        background-color: #fff;
    }
    .r-top{
		height: 95px;
		margin-bottom:35px;
		border-bottom:1px solid #8b8b8d;
		align-items: center;
	}
	.r-top .search input{
		width: 200px;
		height: 30px;
		margin-right:10px;
		background-color: #f8f6f4;
		border-radius: 5px;
		font-size: 12px;
		text-indent: 10px;
	}
	.r-top .search button{
		width: 60px;
		height: 30px;
		background-color: #f6b243;
		border-radius: 5px;
		color:#fff;
	}
	/* 列表 */
	table th{
		padding-bottom:10px;
		font-weight: normal;
	}
	table tr{
		cursor: pointer;
	}
	table:not([class="list-table myissue"]) tbody tr:hover{
		background-color: #fdf0d9;
	}
	.r-list>table{
		width: 100%;
		border-collapse: collapse;
		text-align: center;
	}
	.r-list>table td{
		height: 90px;
		border-bottom:1px solid #8b8b8d;
	}
	.r-list>table td>button{
		width: 60px;
		height: 30px;
		color:#fff;
		background-color: #f6b243;
		border-radius: 5px;
	}
    p.empty{
        margin:20px 0;
		text-align: center;
	}
	div.page{
		margin-right:30px;
		margin-top:30px;
		flex-direction: row-reverse
	}
</style>
