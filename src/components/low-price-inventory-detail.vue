<template>
    <div class="inventory-detail" v-if="state">
        <div class="detail-content">
            <div class="content-title">
                <i class="icon iconfont" @click="cancel()">&#xe667;</i>
            </div>
            <div class="bottom">
                <h4>联系卖家</h4>
                <table>
                    <thead>
                        <tr>
                            <td>购买类型</td>
                            <td>最小包装</td>
                            <td>型号</td>
                            <td>价格</td>
                            <td>卖家</td>
                            <td>QQ</td>
                            <td>操作</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>按个数</td>
                            <td>1</td>
                            <td>{{item.model}}</td>
                            <td>{{item.price}}</td>
                            <td>{{item.manufacturer}}</td>
                            <!-- phone字段存的qq -->
                            <td>{{item.phone}}</td>
                            <td>
                                <button>
                                    <a :href="`tencent://message/?uin=${item.phone}&Site=http://vps.shuidazhe.com&Menu=yes`">立即沟通</a>
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>按包装数量</td>
                            <td>{{item.minimum}}</td>
                            <td>{{item.model}}</td>
                            <td>{{item.price*item.minimum}}</td>
                            <td>{{item.manufacturer}}</td>
                            <!-- phone字段存的qq -->
                            <td>{{item.phone}}</td>
                            <td>
                                <button>
                                    <a :href="`tencent://message/?uin=${item.phone}&Site=http://vps.shuidazhe.com&Menu=yes`">立即沟通</a>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name:'inventory-detail',
        data(){
            return {
                state:false,
                item:{}
            }
        },
        methods:{
            show(item){
                this.state=true;
                this.item=item
            },
            cancel(){
                this.state=false;
            }
        },
		filters:{
            category(value){
                return value===1?"现货":"期货"
            },
            stockUp(value){
                return value===1?"是":"否"
            }
        },
    }
</script>

<style scoped>
    .inventory-detail{
        position: fixed;
        top:0;
        left:0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .6);
    }
    .detail-content{
        position: absolute;
        top:50%;
        left:0;
        right:0;
        width: 900px;
        padding:40px;
        margin:0 auto;
        background-color: #fff;
        border-radius: 10px;
        transform: translateY(-50%);
    }
    /*  */
    .content-title{
        text-align: right
    }
    .content-title i{
        font-size: 20px;
        color:#a5a5a5;
        cursor: pointer;
    }
    /*  */
    .introduce{
        align-items: center;
    }
    .introduce .img{
        width: 156px;
        height: 156px;
        margin-right:15px;
        background-color: #ccc;
    }
    .introduce ul li{
        line-height: 36px;
    }
    /*  */
    .bottom h4{
        margin:30px 0;
        font-size: 24px;
        font-weight: bold;
        text-align: center;
    }
    .bottom table{
        width: 100%;
        border-collapse: collapse;
        text-align: center;
    }
    .bottom table td{
        height:52px;
    }
    .bottom table td button{
        width: 104px;
        height: 32px;
        background-color: #f6b243;
        border-radius: 5px;
    }
    .bottom table td button a{
        color:#fff
    }
</style>
