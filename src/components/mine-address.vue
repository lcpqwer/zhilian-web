<template>
    <div class="mine-address">
        <h4>管理收货地址<i class="icon iconfont">&#xe624;</i></h4>
        <ul>
            <li class="d-f" v-for="(item,index) of address" :key="index">
                <i class="icon"></i>
                <div class="txt">
                    <p :title="`${item.provincename} ${item.cityname} ${item.areaname} ${item.address} ${item.name}收`">{{item.provincename}} {{item.cityname}} {{item.areaname}} {{item.address}}（{{item.name}} 收）</p>
                    <div class="txt-bottom d-f">
                        <p><span>{{item.phone}}</span><span class="default" v-if="item.type===1">默认收货地址</span></p>
                        <div class="address-btn">
                            <button @click="defaultAddress(item.Id,index)">设为默认地址</button>
                            <button @click="deleteAddress(item.Id,index)">删除</button>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <button class="add-adress" @click="showEdit()"><i class="icon iconfont">&#xe70a;</i>新增收货地址</button>
        <div class="address-edit" v-if="isShowAddressEdit">
            <div class="edit-content">
                <div class="edit-top">
                    <i class="icon iconfont" @click="cancelEdit()">&#xe627;</i>
                </div>
                <form @submit="addAddress($event)">
                    <div>
                        <label for="nickname">收货人姓名</label>
                        <input type="text" name="nickname" id="nickname" placeholder="请设置用户名" v-model="form.username" required>
                    </div>
                    <div>
                        <label for="phone">手机号码</label>
                        <input ref="phone" type="text" name="phone" id="phone" placeholder="请输入手机号" v-model="form.phone" required pattern="^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$">
                    </div>
                    <div>
                        <label for="province">所在省份</label>
                        <select name="province" id="province" v-model="cityParams" @change="selectProvince()" required>
                            <option value="">省份</option>
                            <option v-for="(item) of provinces" :key="item.Id" :value="`${item.Id}|${item.type}|${item.name}`">{{item.name}}</option>
                        </select>
                    </div>
                    <div>
                        <label for="city">所在市</label>
                        <select name="city" id="city" v-model="districtParams" @change="selectCity()" required>
                            <option value="">市</option>
                            <option v-for="(item) of cities" :key="item.Id" :value="`${item.Id}|${item.type}|${item.name}`">{{item.name}}</option>
                        </select>
                    </div>
                    <div>
                        <label for="district">所在区</label>
                        <select name="district" id="district" v-model="area" @change="selectDistrict()" required> 
                            <option value="">区</option>
                            <option v-for="(item) of districts" :key="item.Id" :value="`${item.Id}|${item.type}|${item.name}`">{{item.name}}</option>
                        </select>
                    </div>
                    <div>
                        <label for="address">详细地址</label>
                        <input type="text" name="address" id="address" placeholder="请输入详细地址" v-model="form.address" required>
                    </div>
                    <button>保存</button>   
                </form>
            </div>
        </div>
        <AppAlertComponent ref="alert"></AppAlertComponent>
    </div>
</template>

<script>
    import service from '../services/service.js'

    import AppAlertComponent from './app-alert.vue'

    export default {
        name:'mine-address',
        components:{
            AppAlertComponent
        },
        props:{
            address:{
                type:Array
            }
        },
        data(){
            return {
                provinces:[],
                cities:[],
                districts:[],
                isShowAddressEdit:false,
                cityParams:'',
                districtParams:'',
                districtId:'',
                form:{
                    username:'',
                    province:'',
                    city:'',
                    area:'',
                    address:'',
                    phone:'',
                },
                provincename:'',
                cityname:'',
                districtname:'',
                area:''
            }
        },
        methods:{
            getMyAdress(){

            },
            showEdit(){
                this.isShowAddressEdit=true
            },
            addAddress(e){
                e.preventDefault()
                let formdata=new FormData()
                let user=JSON.parse(sessionStorage.getItem("USER"))
                let jwt=sessionStorage.getItem("JWT")
                formdata.append('province',this.form.province)
                formdata.append('city',this.form.city)
                formdata.append('area',this.form.area)
                formdata.append('address',this.form.address)
                formdata.append('name',this.form.username)
                formdata.append('phone',this.form.phone)
                formdata.append('uid',user.Id)
                formdata.append('jwt',jwt)
                window.console.log(this.form.phone)
                service.addAddress(formdata).then((res)=>{
                    if(res.data.code===200){
                        this.isShowAddressEdit=false
                        this.address.push({
                            'provincename':this.provincename,
                            'cityname':this.cityname,
                            'areaname':this.districtname,
                            'phone':this.form.phone,
                            'name':this.form.username,
                            'address':this.form.address
                        })
                        this.$refs.alert.show('添加成功')
                    }
                })
            },
            getProvince(){
                service.getProvince().then((res)=>{
                    this.provinces=res.data.table
                })
            },
            getCity(provinceId,type,isCity=false){
                let formdata=new FormData()
                formdata.append('Id',provinceId)
                formdata.append('type',type)
                service.getCity(formdata).then((res)=>{
                    if(isCity){
                        this.cities=res.data
                    }else{
                        this.districts=res.data
                    }
                })
            },
            selectProvince(){
                let arr = this.cityParams.split('|')
                this.form.province=arr[0]
                this.getCity(arr[0],arr[1],true)
                this.provincename=arr[2]
            },
            selectCity(){
                let arr = this.districtParams.split('|')
                this.form.city=arr[0]
                this.getCity(arr[0],arr[1])
                this.cityname=arr[2]
            },
            selectDistrict(){
                let arr = this.area.split('|')
                this.form.area=arr[0]
                this.districtname=arr[2]
            },
            cancelEdit(){
                this.isShowAddressEdit=false
            },
            deleteAddress(id,index){
                let formdata=new FormData()
                let jwt=sessionStorage.getItem("JWT")
                formdata.append("Id",id)
                formdata.append("jwt",jwt)
                service.deleteAddress(formdata).then((res)=>{
                    if(res.data.code===200){
                        this.address.splice(index,1)
                        this.$refs.alert.show("删除成功")
                    }
                })
            },
            defaultAddress(id,index){
                let formdata=new FormData()
                let jwt=sessionStorage.getItem("JWT")
                let user=JSON.parse(sessionStorage.getItem("USER"))
                formdata.append("Id",id)
                formdata.append("jwt",jwt)
                formdata.append('uid',user.Id)
                service.setDefaultAddress(formdata).then((res)=>{
                    if(res.data.code===200){
                        this.$refs.alert.show("修改成功")
                        this.address.forEach((item) => {
                            item.type=2
                        });
                        this.address[index].type=1
                        window.console.log(this.address)
                    }else{
                        this.$refs.alert.show("修改失败",true)
                    }
                })
            }
        },
        created(){
            this.getProvince()
        }
    }
</script>

<style scoped>
    .mine-address{
        box-sizing: border-box;
        min-height: 534px;
        padding:20px;
        background-color: #fff;
    }
    .mine-address h4{
        margin-bottom:10px;
        border-bottom:1px solid #ccc;
        font-size: 18px;
        line-height: 65px;
    }
    .mine-address li{
        height: 64px;
        padding:28px 15px;
        border:1px solid #ccc;
        border-radius: 10px;
        font-size: 20px;
        justify-content: center;
        align-items: center;
    }
    .mine-address li+li{
        margin-top:20px;
    }
    .mine-address li i{
        width: 30px;
        height: 30px;
        margin-right:40px;
        background-image: url(../assets/images/地址选择.png);
    }
    .mine-address li .txt-bottom .default{
        padding:0 5px;
        font-size: 16px;
        font-weight: 100;
    }
    .mine-address li .txt{
        width: 600px;
    }
    .mine-address li .txt>p{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .mine-address li .txt-bottom{
        margin-top:10px;
        justify-content: space-between;
        align-items: center;
    }
    .mine-address li .address-btn>button{
        height: 32px;
        padding:0 10px;
        background-color: #f6b243;
        border-radius: 5px;
        font-size: 14px;
        color:#fff;
    }
    .mine-address li .address-btn>button+button{
        margin-left:10px;
    }
    button.add-adress{
        display: block;
        margin: 20px auto;
    }
    button.add-adress:hover{
        color:#f6b243
    }
    /* 编辑地址 */
    .address-edit{
        position: fixed;
        top:0;
        left:0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.6);
        z-index: 999;
    }
    .address-edit .edit-content{
        position: absolute;
        overflow: hidden;
        top:50%;
        left:0;
        right:0;
        width: 500px;
        height: 500px;
        margin:0 auto;
        background-color: #fff;
        border-radius: 10px;
        text-align: center;
        transform: translateY(-50%)
    }
    .edit-top{
        text-align: right
    }
    .edit-top i{
        padding: 15px;
        font-size: 24px;
        cursor: pointer;
    }
    .edit-content form{
        width: 454px;
        margin:0 auto;
    }
    .edit-content form>div+div{
        margin-top:20px;
    }
    .edit-content form select {
        width: 278px;
        height: 40px;
        border:1px solid #979797;
        border-radius: 5px;
    }
    .edit-content form input:not([type='checkbox']){
        width: 278px;
        height: 40px;
        border:1px solid #979797;
        border-radius: 5px;
        text-indent: 10px;
    }
    .edit-content form label{
        display: inline-block;
        width: 80px;
        margin-right:20px;
        text-align: right;
    }
    .edit-content form button{
        display: block;
        width: 335px;
        height: 40px;
        margin:30px auto 0;
        background-color: #f6b243;
        border-radius: 5px;
        color:#fff;
    }
</style>