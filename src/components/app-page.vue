<template>
    <div id="app-page" class="d-f" v-if="page>1">
        <p class="num-all">共计{{count}}条信息</p>
        <div class="change-page1">
            <button :disabled="index===1" @click="prePage()">上一页</button>
            <span>{{index}}/{{page}}</span>
            <button :disabled="index===page" @click="nextPage()">下一页</button>
        </div>
        <ul class="change-page2 d-f" v-if="page<=5">
            <li 
                v-for="(item,idx) of page" 
                :class="{'on':index===idx+1}" 
                :key="idx"
                @click="changePage(idx+1)"
            >{{idx+1}}</li>
        </ul>
        <ul class="change-page2 d-f" v-if="page>5">
            <li v-if="btn3!==3">···</li>
            <li @click="showPreBtn()" :class="{'on':index===btn1}">{{btn1}}</li>
            <li @click="changePage(btn2)" :class="{'on':index===btn2}">{{btn2}}</li>
            <li @click="showNextBtn()" :class="{'on':index===btn3}">{{btn3}}</li>
            <li v-if="(btn3!==page)&&(btn3!==page-1)">···</li>
            <li @click="changePage(page)" v-if="btn3!==page" :class="{'on':index===page}">{{page}}</li>
        </ul>
        <div class="change-page3">
            <button :disabled="index===1" @click="toFirstPage()">首页</button>
            <button :disabled="index===page" @click="toLastPage()">末页</button>
        </div>
    </div>
</template>

<script>
// 重新显示分页的时候需要用refs把分页的index变为1
    export default {
        name:'app-page',
        props:{
            // 数据总条数
            count:{
                default:0,
                type:Number
            },
            // 总页数
            page:{
                default:0,
                type:Number
            }
        },
        data(){
            return{
                index:1,//当前页数
                isFirst:true,
                isLast:false,
                btn1:1,
                btn2:2,
                btn3:3
            }
        },
        methods:{
            isDisabled(){
                if(this.index===1){
                    this.isFirst=true
                }
                if(this.index===this.page){
                    this.isLast=true
                }
            },
            changePage(index){
                if(index!==this.index){
                    this.index=index
                    this.$emit('eventpage',this.index)
                }
            },
            showNextBtn(){
                this.index=this.btn3
                this.$emit('eventpage',this.index)
                if(this.btn3+1>=this.page){
                    this.btn3=this.page
                }else{
                    this.btn3+=1
                }

                this.btn1=this.btn3-2
                this.btn2=this.btn3-1
            },
            showPreBtn(){
                this.index=this.btn1
                this.$emit('eventpage',this.index)
                if(this.btn3-2<=1){
                    this.btn3=3
                }else{
                    this.btn3-=1
                }
                this.btn1=this.btn3-2
                this.btn2=this.btn3-1
            },
            toFirstPage(){
                this.index=1
                this.$emit('eventpage',this.index)
                this.btn1=1
                this.btn2=2
                this.btn3=3
            },
            toLastPage(){
                this.index=this.page
                this.$emit('eventpage',this.index)
                this.btn1=this.page-2
                this.btn2=this.page-1
                this.btn3=this.page
            },
            nextPage(){
                this.index=this.index+1
                if(this.index===this.btn3){
                    this.showNextBtn()
                }else{
                    this.$emit('eventpage',this.index)
                }
            },
            prePage(){
                this.index=this.index-1
                if(this.index===this.btn1){
                    this.showPreBtn()
                }else{
                    this.$emit('eventpage',this.index)
                }
            },
        },
        created(){
            this.isDisabled()
        }
    }
</script>

<style scoped>
    #app-page{
        align-items: center
    }
    button{
        background-color: transparent;
    }
    .change-page1{
        margin:0 20px;
    }
    .change-page1 span{
        display: inline-block;
        height: 36px;
        padding:0 28px;
        border-radius: 5px;
        background-color: #d8d8d8;
        line-height: 36px;
    }
    .change-page2 li{
        padding:0 14px;
        margin-right:10px;
        background-color: #d8d8d8;
        border-radius: 5px;
        line-height: 36px;
        cursor: pointer;
    }
    .change-page2 li.on{
        background-color: #f6b243;
        color:#fff;
    }
    button:disabled{
        color:#ccc;
        cursor: no-drop
    }
</style>