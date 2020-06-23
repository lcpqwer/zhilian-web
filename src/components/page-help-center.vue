<template>
    <div id="help-center">
        <AppHeadComponen></AppHeadComponen>
        <div class="center-box">
            <div class="d-f">
                <div class="nav">
                    <ul>
                        <li v-for="(item,index) of helpList" :key="item.Id" :class="{'on':state===item.Id}" @click="changeState(item.Id,index)">{{item.name}}</li>
                    </ul>
                </div>
                <div class="box-right" v-html="content"></div>
            </div>
        </div>
        <AppFootComponen></AppFootComponen>
    </div>
</template>

<script>
    import AppHeadComponen from './app-head.vue'
    import AppFootComponen from './app-foot.vue'
    import service from '../services/service'
    export default {
        name:'help-center',
        components:{
            AppHeadComponen,
            AppFootComponen
        },
        data(){
            return{
                state:0,
                helpList:[],
                content:''
            }
        },
        methods:{
			getHelpCenterList(){
				service.getHelpCenterList().then(res=>{
					if(res.data.code===200){
                        this.helpList=res.data.data
                        if(this.$route.query.item){
                            this.state=JSON.parse(this.$route.query.item).Id
                            this.content=JSON.parse(this.$route.query.item).main
                        }else{
                            this.state=this.helpList[0].Id
                            this.content=this.helpList[0].main
                        }
					}
				})
            },
            changeState(state,index){
                this.state=state
                this.content=this.helpList[index].main
            }
        },
        created(){
            this.getHelpCenterList()
        }
    }
</script>

<style scoped>
    #help-center{
        background-color: #e7e4e3;
    }
    .center-box{
        padding-top:248px;
    }
    .center-box>div{
        height: 800px;
        margin-bottom:80px;
        padding-bottom:20px;
        background-color: #fff;
        border-radius: 10px;
    }
    .center-box ul{
        padding-top:20px
    }
    .center-box li{
        position: relative;
        width: 250px;
        font-size: 18px;    
        line-height: 70px;
        text-align: center;
        cursor: pointer;
        transition-duration: .3s;
    }
    .center-box li.on{
        background-color: #fff4e3;
    }
    .center-box li.on::before{
        content:'';
        display: block;
        position: absolute;
        top:0;
        left:0;
        width: 3px;
        height: 100%;
        background-color: #f6b243;
    }
    /* 右内容 */
    .box-right{
        overflow: auto;
        flex: 1;
        padding:30px 20px;
        font-size: 20px;
        line-height: 24px;
        text-indent: 2rem;
    }
</style>