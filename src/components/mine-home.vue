<template>
    <div id="mine-home">
        <!-- 库存管理 -->
        <div class="center-box clearfix">
            <div class="m-left f-l">
                <ul>
                    <li>个人中心</li>
                    <li :class="{'on':state===0}" @click="state=0">个人信息</li>
                    <li :class="{'on':state===1}" @click="state=1">地址管理</li>
                </ul>
                <ul>
                    <li>急购中心</li>
                    <li :class="{'on':state===2}" @click="state=2">我的求购</li>
                </ul>
                <ul>
                    <li>我的商机</li>
                    <li :class="{'on':state===4}" @click="state=4">商机提示</li>
                    <li :class="{'on':state===5}" @click="state=5">我的沟通</li>
                </ul>
                <ul>
                    <li>我的库存</li>
                    <li :class="{'on':state===6}" @click="toInventory()">管理库存</li>
                    <li :class="{'on':state===7}" @click="state=7">上传库存</li>
                </ul>
            </div>
            <div class="m-right f-r">
                <div class="order" v-if="state===0">
                    <div class="r-top">
                        <div class="t-l d-f" @click="toMineDetail()">
                            <div class="pic">
                                <img :src="userDetail.img" alt="图片加载失败" title="点击修改">
                                <span><i>VIP{{userDetail.level}}</i></span>
                            </div>
                            <p class="nickname">{{user.username}}</p>
                            <div class="count d-f">
                                <span>积分：{{userDetail.score|times}}</span>
                                <div class="star">
                                    <i v-for="(item,index) of star" class="icon iconfont" :key="index">&#xe651;</i>
                                    <i v-for="(item,index) of emptyStar" class="icon iconfont" :key="index">&#xe649;</i>
                                </div>
                            </div>
                        </div>
                        <div class="t-r">
                            <h4>我的战绩</h4>
                            <ul class="d-f">
                                <li class="d-f">
                                    <span><i>{{userDetail.total_purchase|times}}</i>单次</span>
                                    <span>商城购买</span>
                                </li>
                                <li class="d-f">
                                    <span><i>{{userDetail.total_tips|times}}</i>次</span>
                                    <span>商机提示</span>
                                </li>
                                <li class="d-f">
                                    <span><i>{{userDetail.total_wanttobuy|times}}</i>次</span>
                                    <span>紧急求购</span>
                                </li>
                                <li class="d-f">
                                    <span><i>{{userDetail.total_praise|times}}</i>次</span>
                                    <span>聊天好评</span>
                                </li>
                                <li class="d-f">
                                    <span><i>{{userDetail.total_stock|times}}</i>次</span>
                                    <span>发布库存</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="r-center d-f">
                        <h4>我的订单</h4>
                        <ul class="chk-box d-f">
                            <li>
                                <router-link :to="{path:'/main/low-price/low-price-order',query:{state:0}}">全部</router-link>
                            </li>
                            <li>
                                <router-link :to="{path:'/main/low-price/low-price-order',query:{state:1}}">未付款</router-link>
                            </li>
                            <li>
                                <router-link :to="{path:'/main/low-price/low-price-order',query:{state:2}}">未发货</router-link>
                            </li>
                            <li>
                                <router-link :to="{path:'/main/low-price/low-price-order',query:{state:3}}">已发货</router-link>
                            </li>
                        </ul>
                    </div>
                    <div class="r-bottom d-f">
                        <button @click="state=4">商机提示</button>
                        <button @click="state=5">我的求购</button>
                    </div>
                </div>
                <MineAddressComponent v-if="state===1" :address="userAddress"></MineAddressComponent>
                <MineChatComponent v-if="state===2"></MineChatComponent>
                <MineBusinessOpportunityComponent v-if="state===4"></MineBusinessOpportunityComponent>
                <MineSellerChatComponent v-if="state===5"></MineSellerChatComponent>
                <MineUploadInventoryComponent v-if="state===7"></MineUploadInventoryComponent>
            </div>
        </div>
    </div>
</template>

<script>
    const MineChatComponent=()=>import('./mine-chat.vue')
    const MineAddressComponent=()=>import('./mine-address.vue')
    const MineSellerChatComponent=()=>import('./mine-seller-chat.vue')
    const MineUploadInventoryComponent=()=>import('./mine-upload-inventory.vue')
    const MineBusinessOpportunityComponent=()=>import('./mine-business-opportunity.vue')

    import service from '../services/service.js'

    export default {
        name:'mine-home',
        components:{
            MineChatComponent,
            MineAddressComponent,
            MineSellerChatComponent,
            MineUploadInventoryComponent,
            MineBusinessOpportunityComponent
        },
        data(){
            return {
                state:0,
                user:{},
                userDetail:{},
                userAddress:[],
                star:0,
                emptyStar:0
            }
        },
        methods:{
            toInventory(){
                this.state=6;
                this.$router.push({name:'inventory'})
            },
            getMineDetail(){
                let jwt = sessionStorage.getItem("JWT")
                let formdata=new FormData()
                formdata.append("jwt",jwt)
                formdata.append("Id",this.user.Id)
                service.getMineDetail(formdata).then((res)=>{
                    window.console.log(res)
                    this.userDetail=res.data.member
                    this.userAddress=res.data.member.address
                    this.star=this.userDetail.credit
                    this.emptyStar=5-this.userDetail.credit
                })
            },
            toMineDetail(){
                this.$router.push({path:'/main/mine/mine-detail'})
            }
        },
        filters:{
            times(value){
                return Number(value)
            }
        },
        created(){
            if(this.$route.query.state){
                this.state=this.$route.query.state
            }
            this.user=JSON.parse(sessionStorage.getItem("USER"))
            this.getMineDetail()
        }
    }
</script>

<style scoped>
    #mine-home{
        padding-top:186px;
        /* background-color: #e7e4e3; */
    }
    /* 左边导航 */
    #mine-home .m-left{
        width: 86px;
        padding:80px;
        background-color: #fff;
    }
    .m-left ul>li{
        line-height: 34px;
        text-align: center;
        cursor: pointer;
    }
    .m-left ul>li.on{
        color:#f6b243;
    }
    .m-left ul>li:nth-child(1){
        margin-bottom:20px;
        font-size: 20px;
        font-weight: bold;
    }
    /* 右边内容 */
    #mine-home{
        background-color: #f4f2ee;
    }
    #mine-home .m-right{
        width: 915px;
        padding:80px 0;
    }
    #mine-home .m-right .r-top{
        position: relative;
        width: 580px;
        padding-left: 300px;
        padding-right: 35px;
        background-color: #fff;
        border-radius: 10px;
    }
    #mine-home .m-right .r-top .t-l{
        position: absolute;
        top:-13px;
        left:0;
        width: 260px;
        height: 260px;
        background-color: #f6b243;
        border-radius: 10px;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
    }
    .r-top .t-l .pic{
        position: relative;
        margin:40px 0 15px;
        border-radius: 50%;
    }
    .r-top .t-l .pic img{
        width: 65px;
        height: 65px;
        background-color: #ccc;
        border:1px solid #fff;
        border-radius: 50%
    }
    .r-top .t-l .nickname{
        margin-bottom:50px;
    }
    .r-top .t-l .pic span{
        position: absolute;
        bottom:-5px;
        left:0;
        right:0;
        width: 50px;
        height: 20px;
        margin:0 auto;
        background-color: #000;
        border-radius: 10px;
        color:#f6b243;
        line-height: 20px;
        text-align: center;
    }
    .m-right .r-top .t-r h4{
        border-bottom:1px solid #e6e6e6;
        font-size: 18px;
        line-height: 58px;
    }
    .r-top .t-r ul{
        justify-content: space-between;
    }
    .r-top .t-r li{
        height: 172px;
        flex-direction: column;
        justify-content: space-around;
        font-size: 12px;
        text-align: center;
    }
    .r-top .t-r li i{
        font-size: 20px;
        font-style: normal;
    }

    .count{
        width: 100%;
        justify-content: space-around;
    }
    .count span{
        padding:2px 10px;
        border:1px solid #fff;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 100;   
        color:#fff;
    }
    .count .star i{
        color:#fff;
    }
    /* 我的订单列表 */
    .r-center{
        margin:50px 0;
        padding:30px 40px;
        background-color: #fff;
        border-radius: 10px;
        justify-content: space-between;
    }
    .r-center h4{
        font-size: 20px;
        line-height: 58px;
        text-align: center;
    }
    .r-center .chk-box li{
        padding:20px 64px;
        cursor: pointer;
    }
    .r-center .chk-box li+li{
        border-left:2px solid #ccc;
    }
    /* 底部按钮 */
    .r-bottom{
        justify-content: space-between;
    }
    .r-bottom button{
        width: 406px;
        height: 180px;
        border-radius: 10px;
        font-size: 40px;
        color:#fff;
    }
    .r-bottom button:nth-child(1){
        background-color: #f6b243;
    }
    .r-bottom button:nth-child(2){
        background-color: #f17f3a;
    }
    /* 地址管理 */
    /* 管理库存 */
    /* 长传库存 */
</style>