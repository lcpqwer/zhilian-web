<template>
    <div class="buy-chat-grade" v-if="state">
        <div class="grade-content">
            <p>感觉和对方聊的怎么样：</p>
            <div class="star-box">
                <i class="icon iconfont icon-xingxing-kong" :class="{'icon-xingxing-shi':index>=-2}" @click="changeStar(-2)"><span>-2</span></i>
                <i class="icon iconfont icon-xingxing-kong" :class="{'icon-xingxing-shi':index>=-1}" @click="changeStar(-1)"><span>-1</span></i>
                <i class="icon iconfont icon-xingxing-kong" :class="{'icon-xingxing-shi':index>=0}" @click="changeStar(0)"><span>0</span></i>
                <i class="icon iconfont icon-xingxing-kong" :class="{'icon-xingxing-shi':index>=1}" @click="changeStar(1)"><span>1</span></i>
                <i class="icon iconfont icon-xingxing-kong" :class="{'icon-xingxing-shi':index===2}" @click="changeStar(2)"><span>2</span></i>
            </div>
            <button @click="submitGrade()">提交</button>
        </div>
    </div>
</template>

<script>
    export default {
        name:'grade',
        data(){
            return{
                index:-3,
                state:false
            }
        },
        methods:{
            changeStar(index){
                this.index=index
            },
            show(){
                this.state=true
            },
            cancel(){
                this.state=false
            },
            submitGrade(){
                this.$emit("grade",this.index)
                this.index=-3
            }
        }
    }
</script>

<style scoped>
    .buy-chat-grade{
        position: fixed;
        top:0;
        left:0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.3);
        z-index: 99999
    }
    .grade-content{
        position: absolute;
        top:50%;
        left:0;
        right:0;
        width: 300px;
        height: 200px;
        margin:0 auto;
        background-color: #fff;
        border-radius: 10px;
        text-align: center
    }
    .grade-content button{
        width: 220px;
        height: 42px;
        margin-top:30px;
        background-color: #f6b243;
        border-radius: 5px;
        color:#fff;
        font-size: 20px;
    }
    .grade-content p{
        margin:30px 0;
        font-size: 20px;
    }
    .grade-content .star-box>i{
        position: relative;
        font-size: 24px;
        cursor: pointer;
    }
    .grade-content .star-box>i>span{
        position: absolute;
        left:5px;
        top:30px;
        font-size:14px;
    }
    .grade-content .star-box>i+i{
        margin-left:10px;
    }
    i.icon-xingxing-shi{
        color:#f6b243
    }
</style>