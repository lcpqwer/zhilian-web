<template>
    <div id="mine-chat" class="mine-chat r-list">
        <div class="r-top d-f">
            <div class="search">
                <input type="text" placeholder="搜索型号" name="kewords" v-model="keywords">
                <button @click="search()">搜索</button>
            </div>
        </div>
        <ul class="list-table myissue">
            <li>
                <span>求购时间</span>
                <span>型号</span>
                <span>数量</span>
                <span>未税单价</span>
                <span>求购/实单</span>
                <button>标记已读</button>
            </li>
            <li @click="showChat()" v-for="(item,index) of list" :key="item.Id">
                <div class="txt">
                    <span>{{item.time|time}}</span>
                    <span>{{item.model}}</span>
                    <span>{{item.number}}件</span>
                    <span>{{item.untaxedprice}}</span>
                    <span class="on"><button :class="{'on':item.type==='1'}">{{item.type|listType}}</button><span v-if="item.chat_number">{{item.chat_number}}</span></span>
                    <button @click="read(item.Id,2,index)" :disabled="item.chat_number<=0">已读</button>
                </div>
                <p class="num">以有3位供应商与您沟通过</p>
            </li>
        </ul>
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
        name:'mine-chat',
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
            showChat(){
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
				formdata.append('uidtype',1)

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
    .mine-chat{
        min-height: 536px;
        padding-bottom:30px;
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
	.myissue li span{
		display: inline-block;
		width: 150px;
		line-height: 92px;
		text-align: center;
	}
	.myissue li:nth-child(1) span{
		line-height: 0;
	}
	.myissue li{
		cursor: pointer;
	}
	.myissue li p.num{
		height: 30px;
		padding-right:50px;
		text-align: right;
	}
	.myissue li:nth-child(2n+3){
		background-color: #fff4e3;
	}
	.myissue li .txt>button,
	.myprice button.read{
		width: 120px;
		background-color: transparent;
		color:#f17f3a
	}
	.myissue li>button{
		width: 120px;
	}
	.myissue li span>button{
		width: 60px;
		height: 30px;
		color:#fff;
		background-color: #f6b243;
		border-radius: 5px;
	}
	#mine-chat button:disabled{
		color:#ccc;
		cursor: no-drop
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
    span.on{
        position: relative;
    }
    span.on span{
		position: absolute;
		display:block;
		top:26px;
		right:37px;
		width: 14px;
		height: 14px;
		background-color: red;
		border-radius: 50%;
		font-size: 12px;
		color:#fff;
		line-height: 14px;
		text-align: center;
	}
    #mine-chat button.on{
        background-color: #f17f3a;
    }
</style>