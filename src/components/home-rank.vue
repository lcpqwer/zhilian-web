<template>
    <div class="rank">
        <HomeTitleComponent msg='封神榜'></HomeTitleComponent>
        <div class="center-box">
            <ul class="list">
                <li class="d-f" v-for="item of rankList" :key="item.Id">
                    <div class="r-pic">
                        <img :src="`http://${item.deify_img}`" alt="te">
                    </div>
                    <p class="text">{{item.deify_main}}</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import HomeTitleComponent from './home-title.vue'
import service from '../services/service.js'

export default {
    name:'rank',
    components:{
        HomeTitleComponent
    },
    data(){
        return {
            rankList:[]
        }
    },
    methods:{
        getRankList(){
            service.getRankList().then((res)=>{
                if(res.data.code===200){
                    let max = res.data.data.length>3?3:res.data.data.length
                    for(let i=0;i<max;i++){
                        this.rankList.push(res.data.data[i])
                    }
                }
            })
        }
    },
    created(){
        this.getRankList()
    }
}
</script>

<style scoped>
    .rank{
        background-color: #f4f2ee;
    }
    ul.list li{
        overflow: hidden;
        height: 136px;
        background-color: #fff;
        justify-content: space-around;
        align-items: center;
    }
    ul.list li+li{
        margin-top:20px;
    }
    ul.list li .r-pic{
        width:200px;
    }
    ul.list li .text{
        overflow: hidden;
        display: -webkit-box;
        width: 766px;
        color:#a4a4a4;
        line-height: 30px;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
    }
</style>