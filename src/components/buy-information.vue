<template>
    <div class="buy-information">
        <div class="center-box">
            <div class="r-top">
                <div class="t-l d-f">
                    <div class="pic">
                        <img :src="member.img" alt="图片加载失败" title="点击修改">
                        <span><i>VIP{{member.level}}</i></span>
                    </div>
                    <p class="nickname">{{member.username}}</p>
                    <div class="count d-f">
                        <span>积分：{{member.score}}</span>
                        <div class="star">
                            <i v-for="(item,index) of star" class="icon iconfont" :key="index">&#xe651;</i>
                            <i v-for="(item,index) of emptyStar" class="icon iconfont" :key="index">&#xe649;</i>
                        </div>
                    </div>
                </div>
                <div class="t-r">
                    <h4>求购信息</h4>
                    <div class="pay-information d-f">
                        <div class="information-box d-f">
                            <div class="information-left d-f">
                                <span class="type">{{params.type|type}}</span>
                                <span class="time">{{params.time|time}}</span>
                            </div>
                            <div class="information-right">
                                <p>型号：{{params.model}}</p>
                                <p>数量：{{params.number}}</p>
                                <p>目标单价：{{params.untaxedprice}}元</p>
                            </div>  
                        </div>
                        <div class="btn-box">
                            <button @click="toChat()">立即1v1沟通</button>
                            <button @click="goBack()">返回急购区</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import service from '../services/service.js'
    export default {
        name:'buy-information',
        data(){
            return {
                star:0,
                emptyStar:0,
                member:{},
                params:{}
            }
        },
        methods:{
            goBack(){
                this.$router.push({path:'/main/buy'})
            },
            toChat(){
                this.$router.push({path:'/main/buy',query:{data:this.params}})
            }
        },
        filters:{
            time(value){
                return `${(new Date(value)).getFullYear()}-${(new Date(value)).getMonth()+1}-${(new Date(value)).getDate()} ${(new Date(value)).getHours()}:${(new Date(value)).getMinutes()}`
            },
            type(value){
				return value==='1'?"实单":"询价"
			}
        },
        created(){
            if(this.$route.query.data){
                let formdata=new FormData()
                formdata.append('jwt',sessionStorage.getItem("JWT"))
                formdata.append('data',this.$route.query.data)
                service.getBuyOrderInformation(formdata).then(res=>{
                    window.console.log(res)
                    if(res.data.code===200){
                        this.params=res.data.order
                        this.member=res.data.member
                        this.star=res.data.member.credit
                        this.emptyStar=5-res.data.member.credit
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .buy-information{
		padding-top:248px;
        background-color: #f4f2ee;
    }
    .center-box{
        min-height: 800px;
    }
    .r-top{
        position: relative;
        width: 580px;
        padding-left: 300px;
        padding-right: 35px;
        background-color: #fff;
        border-radius: 10px;
    }
    .r-top .t-l{
        position: absolute;
        top:-13px;
        left:0;
        width: 260px;
        height: 260px;
        background-color: #f6b243;
        border-radius: 10px;
        flex-direction: column;
        align-items: center;
        box-shadow: 0 0 10px #999;
    }
    .r-top .t-l .pic{
        position: relative;
        width: 65px;
        height: 65px;
        margin:40px 0 15px;
        background-color: #ccc;
        border-radius: 50%;
    }
    .r-top .t-l .pic img{
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
    .r-top .t-r h4{
        border-bottom:1px solid #e6e6e6;
        font-size: 18px;
        line-height: 58px;
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
    .pay-information{
        height: 170px;
        justify-content: space-between;
        align-items: center
    }
    .pay-information .information-left{
        margin-right:30px;
        flex-direction: column;
        align-items: center
    }
    .information-left .type{
        display: inline-block;
        width: 50px;
        height: 30px;
        margin-bottom:10px;
        background-color: #f17f3a;
        border-radius: 5px;
        color:#fff;
        line-height: 30px;
        text-align: center
    }
    .information-left .time{
        font-size: 12px;
        color:#ccc;
    }
    .information-right{
        line-height: 25px;
    }
    .btn-box>button{
        display: block;
        width: 150px;
        height: 50px;
        border-radius: 5px;
        box-shadow: 0 5px 5px #ccc;
    }
    .btn-box>button+button{
        margin-top:20px;
    }
    .btn-box>button:nth-child(1){
        background-color: #f6b243;
        color:#fff;
    }
    .btn-box>button:nth-child(2){
        background-color: #fff;
        color:#333;
    }
</style>