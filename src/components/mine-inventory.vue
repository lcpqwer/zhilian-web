<template>
    <div class="inventory">
        <div class="center-box">
            <div class="crumbs">
                <span>您的位置：</span>
                <router-link :to="{path:'/main/mine'}">个人中心</router-link>
                <i class="icon iconfont">&#xe624;</i>
                <span class="last">库存管理</span>
            </div>
            <div class="list">
                <div class="list-top">
                    <div class="search d-f">
                        <div>
                            <label for="category">分类</label>
                            <input type="text" v-model="category" id="category">
                        </div>
                        <div>
                            <label for="model">型号</label>
                            <input type="text" v-model="model" id="model">
                        </div>
                        <div>
                            <label for="manufacturer">品牌</label>
                            <input type="text" v-model="manufacturer" id="manufacturer"> 
                        </div>
                        <button class="btn-search" @click="getInventoryList()">搜索</button>
                    </div>
                    <div class="chk d-f">
                        <ul class="d-f">
                            <li :class="{'on':classState===0}" @click="allSort()">综合</li>
                            <li :class="{'on':classState===1}" @click="changeNumberSort()">数量<i class="icon iconfont">&#xe66c;</i></li>
                            <li :class="{'on':classState===2}" @click="changePriceSort()">价格<i class="icon iconfont">&#xe66c;</i></li>
                        </ul>
                        <div class="price d-f">
                            <input type="text" placeholder="最低价" v-model="minPrice">
                            <span>~</span>
                            <input type="text" placeholder="最高价" v-model="maxPrice">
                            <button @click="changePriceRange()">确定</button>
                        </div>
                        <button class="load-model" @click="loadModel()">批量下载模板</button>
                    </div>
                </div>
                <table v-if="num">
                    <thead>
                        <tr>
                            <th>
                                <input class="chk-input" type="checkbox" name="chk-all" id="chk-all" v-model="isChkAll" @change="chkAll()">
                                <label class="chk-label" for="chk-all"></label>
                                <label for="chk-all">全选</label>
                            </th>
                            <th>型号</th>
                            <th>品牌</th>
                            <th>数量（个）</th>
                            <th>价格（元/个）</th>
                            <th>最小包装</th>
                            <th>持续备货</th>
                            <th>类型</th>
                        </tr> 
                    </thead>
                    <tbody>
                        <tr v-for="item of inventories" :key="item.Id">
                            <td>
                                <input class="chk-input" type="checkbox" name="chk-single" :id="'chk-single'+item.Id" v-model="item.isChk" @change="singleChk()">
                                <label class="chk-label" :for="'chk-single'+item.Id"></label>
                            </td>
                            <td>{{item.model}}</td>
                            <td>{{item.manufacturer}}</td>
                            <td>{{item.stock_number}}</td>
                            <td>{{item.price}}</td>
                            <td>{{item.minimum}}</td>
                            <td>{{item.continuous_stock|stockUp}}</td>
                            <td>{{item.type|category}}</td>
                        </tr>
                    </tbody>
                </table>
                <p v-if="!count" class="empty">暂无数据</p>
                <p class="empty" v-if="isShowLoading">加载中...</p>
                <div class="inventory-bottom d-f">
                    <!-- 删除 -->
                    <div class="delete-box">
                        <button class="delete-all" @click="deleteChk()">删除选中</button>
                    </div>
                    <!-- 分页按钮 -->
                    <AppPageComponent :count="count" :page="num" @eventpage="changePage"></AppPageComponent>
                </div>
            </div>
        </div>
        <AppAlertComponent ref="alert"></AppAlertComponent>
    </div>
</template>

<script>
    import service from '../services/service.js'
    import AppAlertComponent from './app-alert.vue'
    import AppPageComponent from './app-page.vue'

    export default {
        name:'inventory',
        components:{
            AppAlertComponent,
            AppPageComponent
        },
        data(){
            return {
                page:1,
                inventories:[],
                count:0,
                num:0,
                number_rise:0,
                number_drop:0,
                price_rise:0,
                price_drop:0,
                numbrt_sort:false,//true为数量升序
                price_sort:false,
                classState:0,
                // 价格区间
                minPrice:"",
                maxPrice:"",
                // 搜索
                category:"",        //分类
                manufacturer:"",    //生产商
                model:"",           //型号
                isShowPay:false,
                downloadArr:[],
                ordid:'',
                isShowLoading:false,
                isChkAll:false
            }
        },
        methods:{
            getInventoryList(){
                let formdata=new FormData()
                // 排序判断
                // 数量顺序
                if(this.number_rise){
                    formdata.append('number_rise',1)
                }else if(this.number_drop){
                    formdata.append('number_drop',1)
                }
                // 价格顺序
                if(this.price_rise){
                    formdata.append('price_rise',1)
                }else if(this.price_drop){
                    formdata.append('price_drop',1)
                }
                // 价格区间
                formdata.append('maximum',this.maxPrice)
                formdata.append('minimum',this.minPrice)
                // 搜索
                formdata.append('type',this.category==='现货'?1:this.category==='期货'?2:'')
                formdata.append('manufacturer',this.manufacturer)
                formdata.append('model',this.model)

                let user=JSON.parse(sessionStorage.getItem("USER"))
                let jwt=sessionStorage.getItem("JWT")
                formdata.append('jwt',jwt)
                formdata.append('uid',user.Id)
                formdata.append('page',this.page)
                service.showMineInventory(formdata).then((res)=>{
                    if(res.data.code===200){
                        res.data.member.forEach(item => {
                            item.isChk=false
                        })
                        this.inventories=res.data.member
                        this.count=res.data.count
                        this.num=Math.ceil(res.data.count/15)
                    }else{
                        this.inventories=[]
                        this.count=0
                        this.num=0
                    }
                })
            },
            deleteChk(){
                let deleteArr=[];
                this.inventories.forEach((item) => {
                    if(item.isChk===true){
                        // this.inventories.splice(index,1)
                        window.console.log(item.Id)
                        deleteArr.push(item.Id)
                    }
                })
                if(deleteArr.length){
                    // window.console.log(1)
                    window.console.log(deleteArr)
                    let formdata=new FormData()
                    let jwt=sessionStorage.getItem("JWT")
                    let user=JSON.parse(sessionStorage.getItem("USER"))

                    formdata.append('uid',user.Id)
                    formdata.append('jwt',jwt)
                    deleteArr.forEach(item=>formdata.append('Id[]',item))
                    service.deleteAllInventory(formdata).then((res)=>{
                        window.console.log(res)
                        if(res.data.code===200){
                            this.$refs.alert.show('删除成功')
                            this.getInventoryList()
                        }else{
                            this.$refs.alert.show('删除失败',true)
                        }
                    })
                }else{
                    this.$refs.alert.show('请选择要删除的项',true)
                }
            },
            changeNumberSort(){
                this.classState=1
                this.price_rise=0
                this.price_drop=0
                this.numbrt_sort=!this.numbrt_sort
                if(this.numbrt_sort){
                    this.number_rise=1
                    this.number_drop=0
                }else{
                    this.number_rise=0
                    this.number_drop=1
                }
                this.getInventoryList()
            },
            changePriceSort(){
                this.classState=2
                this.number_drop=0
                this.number_rise=0
                this.price_sort=!this.price_sort
                if(this.price_sort){
                    this.price_rise=1
                    this.price_drop=0
                }else{
                    this.price_rise=0
                    this.price_drop=1
                }
                this.getInventoryList()
            },
            allSort(){
                this.classState=0
                this.number_rise=0
                this.number_drop=0
                this.price_rise=0
                this.price_drop=0
                this.numbrt_sort=false//true为数量升序
                this.price_sort=false
                this.minPrice=''
                this.maxPrice=''
                this.getInventoryList()
            },
            changePriceRange(){
                this.classState=99
                if(this.minPrice&&this.maxPrice){
                    if(this.minPrice>=this.maxPrice){
                        this.$refs.alert.show("请填写正确的价格",true)
                        return
                    }
                    this.getInventoryList()
                }else{
                    this.$refs.alert.show("请输入价格",true)
                }
            },
            changePage(index){
                this.page=index
                this.getInventoryList()
            },
            // 下载模板
            loadModel(){
                this.inventories.forEach((item) => {
                    if(item.isChk===true){
                        this.downloadArr.push(item.Id)
                    }
                })
                if(this.downloadArr.length){
                    let jwt=sessionStorage.getItem("JWT")
                    let data=''
                    this.downloadArr.forEach((item,index)=>{
                        data+=`&&Id[${index}]=${item}`
                    })
                    location.href=`https://login.asap-get.com/lianzhi/my/stock_export?jwt=${jwt}${data}`
                }else{
                    this.$refs.alert.show("请先选择要下载的项")
                }
                
            },
            chkAll(){
                this.inventories.forEach(item => {
                    item.isChk=this.isChkAll
                });
            },
            singleChk(){
                let idx=this.inventories.findIndex((item)=>{
                    return item.isChk===false
                })
                if(idx===-1){
                    this.isChkAll=true
                }else{
                    this.isChkAll=false
                }
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
        created(){
            this.getInventoryList()
        }
    }
</script>

<style scoped>
    .inventory{
        padding-top:186px;
        background-color: #e7e4e3;
    }
    .inventory .crumbs{
        margin-bottom:24px;
        font-size: 18px;
        color:#a9a9a9;
    }
    .inventory .crumbs a{
        color:#a9a9a9;
    }
    .inventory .crumbs>span:nth-child(4){
        color:#f6b243;
    }
    .inventory .crumbs i{
        margin:0 10px;
    }
    /* 库存管理列表 */
    .inventory .list{
        padding:40px;
        background-color: #fff;
        border-radius: 10px; 
    }
    .inventory .list .list-top .search{
        height: 75px;
        justify-content: space-around;
        border-bottom:3px solid #f6b243;
    }
    .list .search input{
        width: 150px;
        height: 32px;
        margin-left:10px;
        border:none;
        background-color: #f8f6f4;
        text-indent: 10px;
    }
    .list .search button,
    .list .chk button{
        width: 72px;
        height: 32px;
        background-color: #f6b243;
        border-radius: 5px;
        color:#fff;
    }
    .list .chk{
        background-color: #f8f6f4;
        align-items: center;
        justify-content: space-between
    }
    .list .chk>ul li{
        padding:16px 20px;
        cursor: pointer;
    }
    .list .chk>ul li:hover,
    .list .chk>ul li.on{
        color:#f6b243
    }
    .list .chk .price{
        margin-left:20px;
        align-items: center;
    }
    .list .chk .price input{
        width: 80px;
        height: 32px;
        background-color: #fff;
        border-radius: 10px;
    }
    /* 表格 */
    .list table{
        width: 100%;
        text-align: center;
    }
    .list table tbody tr:hover{
        background-color: #f8f6f4;
    }
    .list table tbody tr{
        cursor: pointer;
    }
    table th{
        height: 62px;
        font-weight: normal;
    }
    table td{
        height: 72px;
    }
    .delete-box button{
        width: 100px;
        height: 32px;
        border:1px solid #f16363;
        border-radius: 5px;
        color:#f16363
    }
    .inventory-bottom{
        margin-top:30px;
        justify-content: space-between;
        align-items: center
    }
    p.empty{
        margin:20px 0;
        text-align: center
    }
    .inventory button.load-model{
        width: 120px;
    }
    /* 支付 */
    .pay-alert{
        position: fixed;
        top:0;
        left:0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.6);
        z-index: 999;
    }
    .pay-alert .pay-alert-content{
        position: absolute;
        overflow: hidden;
        top:50%;
        left:0;
        right:0;
        width: 300px;
        height: 250px;
        margin:0 auto;
        background-color: #fff;
        border-radius: 10px;
        text-align: center;
        transform: translateY(-50%)
    }
    .pay-alert-content>div{
        width: 80%;
        margin:40px auto 30px;
    }
    .pay-alert-content input{
        width: 180px;
        height: 30px;
        margin-top:10px;
        border:1px solid #ccc;
        border-radius: 5px;
        text-indent: 10px   
    }
    .pay-alert-content button{
        width: 80%;
        height: 42px;
        background-color: #f6b243;
        border-radius: 5px;
        font-size: 20px;
        color:#fff
    }
    .pay-alert-content i{
        position: absolute;
        right:10px;
        top:4px;
        font-size: 24px;
        cursor: pointer;
    }
    .tips{
        font-size: 12px;
        color:#ccc;
        line-height: 16px;
        text-align:start
    }
    p.empty{
        margin:20px 0;
		text-align: center;
	}
    .inventory .center-box .chk-label{
        vertical-align: middle; 
        display: inline-block;
        width: 24px;
        height: 24px;
        background-size: contain;
        border:1px solid #aaa;
        border-radius: 50%;
        cursor: pointer;
    }
    .inventory .center-box .chk-input{
        display: none;
    }
    .inventory .center-box .chk-input:checked+label{
        background-image: url(../assets/images/success.png);
        border-color: #f6b243;
    }
</style>