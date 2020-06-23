<template>
  <div id="buy-pay-confirm" v-if="state">
      <div class="confirm-content">
          <div class="con-top">
              <button @click="cancel"><i class="icon iconfont icon-quxiao"></i></button>
          </div>
          <p>支付状态：</p>
          <div class="btn-box">
              <button @click="pay">我已支付</button>
              <button @click="cancel">未支付</button>
          </div>
      </div>
      <AppAlertComponent ref="alert"></AppAlertComponent>
  </div>
</template>

<script>
    import service from '../services/service'
    import AppAlertComponent from './app-alert.vue'
    export default {
        name:'buy-pay-confirm',
        components:{
            AppAlertComponent,
        },
        data(){
            return {
                state:false,
            }
        },
        methods:{
            show(){
                this.state=true
            },
            cancel(){
                this.state=false
            },
            pay(){
                let formdata=new FormData()
                window.console.log(JSON.parse(sessionStorage.getItem("USER")).Id)
                formdata.append("uid",JSON.parse(sessionStorage.getItem("USER")).Id)
                formdata.append("type",2)
                service.payConfirm(formdata).then(res=>{
                    window.console.log(res)
                    if(res.data.code===200){
                        this.$refs.alert.show('支付成功')
                        setTimeout(()=>{
                            this.cancel()
                            this.$router.push({path:'/main/low-price/low-price-home',query:{data:res.data.data}})
                            location.reload()
                        },1500)
                    }else{
                        this.$refs.alert.show('支付失败',true)
                    }
                })
            }
        }
    }
</script>

<style scoped>
    #buy-pay-confirm{
        position: fixed;
        top:0;
        left:0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.6);
        z-index: 999;
    }
    .confirm-content{
        position: absolute;
        top:50%;
        left:0;
        right:0;
        width: 240px;
        height: 160px;
        padding: 20px;
        margin:0 auto;
        background-color: #fff;
        border-radius: 10px;
        transform: translateY(-50%);
    }
    .con-top{
        text-align: right;
    }
    .btn-box{
        text-align: center;
    }
    .btn-box button{
        width: 100px;
        height: 42px;
        margin-right: 20px;
        border:1px solid #333;
        border-radius: 10px;
        font-size: 20px;
    }
    .btn-box button:nth-child(1){
        background-color: #f6b243;
        border:none;
        color:#fff;
    }
    p{
        margin:20px 0;
        font-size: 20px;
        text-align: center;
    }
</style>