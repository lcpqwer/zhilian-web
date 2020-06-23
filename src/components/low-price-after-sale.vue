<template>
    <div class="after-sale" v-if="state">
        <div class="after-sale-content">
            <div class="c-title">
                <i class="icon iconfont" @click="cancel()">&#xe667;</i>
            </div>
            <p>如果货品有问题请电话联系我们：</p>
            <p class="msg">
                <span class="name">李莉</span>
                <span class="phone">13666666666</span>
            </p>
            <button>复制号码</button>
        </div>
    </div>
</template>

<script>
    export default {
        name:'after-sale',
        data(){
            return {
                state:false
            }
        },
        methods:{
            show(){
                this.state=true;
            },
            cancel(){
                this.state=false;
            }
        }
    }
</script>

<style scoped>
    .after-sale{
        position: fixed;
        top:0;
        left:0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.6);
        z-index: 999;
    }
    .after-sale>div{
        position: absolute;
        top:50%;
        left:0;
        right:0;
        width: 304px;
        height: 264px;
        margin:0 auto;
        padding:0 15px 20px;
        background-color: #fff;
        border-radius: 10px;
        font-size: 14px;
        transform: translateY(-50%);
    }
    .after-sale>div p{
        line-height: 40px;
        text-align: center;
    }
    .after-sale .c-title{
        margin-bottom:30px;
        padding:18px  0;
        font-size: 20px;
        text-align: right;
    }
    .after-sale .c-title i{
        cursor: pointer;
    }
    .after-sale button{
        width: 100%;
        height: 40px;
        margin-top:55px;
        background-color: #f6b243;
        border-radius: 5px;
        color:#fff;
        font-size: 20px;
    }
</style>