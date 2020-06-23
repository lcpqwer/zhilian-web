<template>
    <div class="upload-success" v-show="state">
        <div class="content d-f">
            <i class="icon"></i>
            <span>上传成功</span>
        </div>
    </div>
</template>

<script>
export default {
    name:'upload-success',
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
    .upload-success{
        position: fixed;
        top:0;
        left:0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.6);
        z-index: 999;
    }
    .upload-success .content{
        position: absolute;
        top:50%;
        right:0;
        left:0;
        width: 192px;
        padding:40px 100px;
        margin:0 auto;
        background-color: #fff;
        border-radius: 10px;
        font-size: 30px;
        transform: translateY(-50%);
    }
    .upload-success .content i{
        width: 44px;
        height: 44px;
        margin-right:20px;
        background-image: url(../assets/images/success.png);
    }
</style>