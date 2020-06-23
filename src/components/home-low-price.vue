<template>
    <div class="low-price">
        <HomeTitleComponent msg='低价抛售区'></HomeTitleComponent>  
        <div class="center-box">
            <div class="lp-list">
                <table>
                    <thead>
                        <tr>
                            <td>类型</td>
                            <td>型号</td>
                            <td>品牌</td>
                            <td>数量</td>
                            <td>价格</td>
                            <td>最小起订量</td>
                            <td>持续备货</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item of list" :key="item.Id">
                            <td>{{item.type|category}}</td>
                            <td>{{item.model}}</td>
                            <td>{{item.manufacturer}}</td>
                            <td>{{item.stock_number}}</td>
                            <td>{{item.price}}</td>
                            <td>{{item.minimum}}</td>
                            <td>{{item.continuous_stock|stockUp}}</td>
                        </tr>
                    </tbody>
                </table>
                <p class="empty" v-if="(!list.length)&&(!isShowLoading)">暂无数据</p>
				<p class="empty" v-if="isShowLoading">加载中...</p>
            </div>
            <button @click="toStore()">进入低价抛售区</button>
        </div>
    </div>
</template>

<script>
    import HomeTitleComponent from './home-title.vue'
    import service from '../services/service.js'

    export default {
        name:'low-price',
        components:{
            HomeTitleComponent
        },
        data(){
            return {
                list:[],
                isShowLoading:false
            }
        },
        methods:{
            getInventoryList(){
				this.isShowLoading=true
                let formdata=new FormData()

                formdata.append('page',1)
                service.getLowPriceStoreList(formdata).then((res)=>{
                    if(res.data.code===200){
                        this.isShowLoading=false
                        let max = res.data.member.length>4?4:res.data.member.length
						for(let i=0;i<max;i++){
                            this.list.push(res.data.member[i])
                        }
                    }
                }).catch(()=>{
					this.isShowLoading=false
				})
            },
            toStore(){
                this.$router.push({path:'/main/low-price/low-price-store'})
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
        created(){
            this.getInventoryList()
        }
    }
</script>

<style scoped>
    .low-price{
        background-color: #e7e4e3;
    }
    .lp-list{
        height: 285px;
        padding:45px 0;
        background-color: #fff;
    }
    .lp-list table{
        width: 100%;
        text-align: center;
    }
    .lp-list table th{
        font-weight: normal;
    }
    .lp-list table td{
        height: 36px;
    }
    button{
        display: block;
        width: 174px;
        height: 76px;
        margin:40px auto 0;
        background-color: #f6b243;
        border-radius: 5px;
        color:#fff;
        font-size: 18px;
    }
    p.empty{
        margin:20px 0;
		text-align: center;
	}
</style>