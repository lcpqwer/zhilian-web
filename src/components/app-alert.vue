<template>
    <div class="app-alert" :class="{'danger':isDanger}" v-if="state">
        <span>{{msg}}</span>
    </div>
</template>

<script>
    export default {
        name:'app-alert',
        data(){
            return {
                msg:'默认提示',
                isDanger:false,
                state:false
            }
        },
        methods:{
            show(msg,isDanger=false){
                this.msg=msg
                this.isDanger=isDanger
                this.state=true;
                setTimeout(() => {
                    this.state=false
                }, 1500);
            }
        }
    }
</script>

<style scoped>
    .app-alert{
        position: fixed;
        top:100px;
        left:0;
        right:0;
        width: 220px;
        height: 60px;
        padding:0 20px;
        margin:0 auto;
        background-color: #f6b243;
        border-radius: 10px;
        font-size: 20px;
        color:#fff;
        line-height: 60px;
        text-align: center;
        box-shadow: 0 0 10px #666;
        z-index: 99999999;
    }
    .app-alert.danger{
        background-color: rgb(233, 82, 82);
    }
</style>