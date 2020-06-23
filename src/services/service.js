import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import url from './http-url.js'
axios.defaults.withCredentials=true;
Vue.use(VueAxios, axios)

export default{
    getPhoneCode(params){
        return Vue.axios.post(url.getPhoneCodeUrl(),params)
    },
    registerByPhone(params){
        return Vue.axios.post(url.getRegisterByPhoneUrl(),params)
    },
    getProvince(){
        return Vue.axios.post(url.getProvinceUrl())
    },
    getCity(params){
        return Vue.axios.post(url.getCityUrl(),params)
    },
    getImageCode(){
        return Vue.axios.get(url.getImageCodeUrl())
    },
    // 登录
    userLogin(params){
        return Vue.axios.post(url.getUserLoginUrl(),params)
    },
    // 重置密码
    userTest(params){
        return Vue.axios.post(url.getUserTestUrl(),params)
    },
    resetCode(params){
        return Vue.axios.post(url.getResetCodeUrl(),params)
    },
    verifyCode(params){
        return Vue.axios.post(url.getVerifyCodeUrl(),params)
    },
    resetPassword(params){
        return Vue.axios.post(url.getResetPasswordUrl(),params)
    },
    // 个人中心
    showMineInventory(params){
        return Vue.axios.post(url.getMineInventoryShowUrl(),params)
    },
    batchDelete(params){
        return Vue.axios.post(url.getMineBatchDeleteUrl(),params)
    },
    batchUpload(params){
        return Vue.axios.post(url.getMineBatchUploadUrl(),params)
    },
    singleUpload(params){
        return Vue.axios.post(url.getSingleUploadUrl(),params)
    },
    deleteAllInventory(params){
        return Vue.axios.post(url.getDeleteAllInventoryUrl(),params)
    },
    uploadPay(params){
        return Vue.axios.post(url.getPayUrl(),params)
    },
    confirmPay(params){
        return Vue.axios.post(url.getConfirmPayUrl(),params)
    },
    downloadModel(params){
        return Vue.axios.post(
            url.getMineDownloadModelUrl(),
            params,
            {responseType:'blob'}// 设置响应数据类型 
        )    
    },
    getMineDetail(params){
        return Vue.axios.post(url.getMineDetailUrl(),params)
    },
    addAddress(params){
        return Vue.axios.post(url.getAddAddressUrl(),params)
    },
    deleteAddress(params){
        return Vue.axios.post(url.getDeleteAddressUrl(),params)
    },
    setDefaultAddress(params){
        return Vue.axios.post(url.getSetDefaultAddressUrl(),params)
    },
    uploadImg(params){
        return Vue.axios.post(url.getUploadImgUrl(),params)
    },
    showBuyList(params){
        return Vue.axios.post(url.getBuyShowListUrl(),params)
    },
    addBuy(params){
        return Vue.axios.post(url.getAddBuyUrl(),params)
    },
    readChat(params){
        return Vue.axios.post(url.getReadUrl(),params)
    },
    getLowPriceInventoryList(params){
        return Vue.axios.post(url.getLowPriceInventoryUrl(),params)
    },
    getLowPriceStoreList(params){
        return Vue.axios.post(url.getLowPriceStoreListUrl(),params)
    },
    getUserInfo(params) {
        return Vue.axios.post(url.getUserInfoUrl(),params)
    },
    getShoppingCarList(params){
        return Vue.axios.post(url.getShoppingCarListUrl(),params)
    },
    addShoppingCar(params){
        return Vue.axios.post(url.getAddShoppingCarUrl(),params)
    },
    changeShoppingCarNum(params){
        return Vue.axios.post(url.getShoppingCarChangeNumberUrl(),params)
    },
    deleteShoppingCar(params){
        return Vue.axios.post(url.getShoppingCarDeleteUrl(),params)
    },
    getOrderList(params){
        return Vue.axios.post(url.getOrderListUrl(),params)
    },
    getChatAlert(params){
        return Vue.axios.post(url.getChatAlertUrl(),params)
    },
    getOrderLogistics(params){
        return Vue.axios.post(url.getOrderLogisticsUrl(),params)
    },
    confirmOrder(params){
        return Vue.axios.post(url.getConfirmOrderUrl(),params)
    },
    remindOrder(params){
        return Vue.axios.post(url.getRemindUrl(),params)
    },
    getRankList(){
        return Vue.axios.get(url.getRankListUrl())
    },
    charGrade(params){
        return Vue.axios.post(url.getChatGradeUrl(),params)
    },
    getWxJwt(params){
        return Vue.axios.post(url.getLoginWxJwtUrl(),params)
    },
    projectSubmit(params){
        return Vue.axios.post(url.getProjectSubmitUrl(),params)
    },
    updataMineInformation(params){
        return Vue.axios.post(url.getUpdataMineInformationUrl(),params)
    },
    updatePassword(params){
        return Vue.axios.post(url.getUpdatePasswordUrl(),params)
    },
    // 重置绑定手机号
    updatePhoneSendCode(params){
        return Vue.axios.post(url.getUpdatePhoneSendCodeUrl(),params)
    },
    updatePhoneVerification(params){
        return Vue.axios.post(url.getUpdatePhoneVerificationUrl(),params)
    },
    updatePhoneBindingCode(params){
        return Vue.axios.post(url.getUpdatePhoneBindingCodeUrl(),params)
    },
    updatePhoneBindingVerification(params){
        return Vue.axios.post(url.getUpdatePhoneBindingVerificationUrl(),params)
    },
    getContactInformation(){
        return Vue.axios.get(url.getContactInformationUrl())
    },
    getBuyOrderInformation(params){
        return Vue.axios.post(url.getBuyOrderInformation(),params)
    },
    uploadBatchSearch(params){
        return Vue.axios.post(url.getUploadBatchSearchUrl(),params)
    },
    downloadBatchResult(params){
        return Vue.axios.post(url.getdownloadBatchResultUrl(),params)
    },
    getGradeUser(params){
        return Vue.axios.post(url.getGradeUserUrl(),params)
    },
    uploadBatchBuy(params){
        return Vue.axios.post(url.getUploadBatchBuyUrl(),params)
    },

    payConfirm(params){
        return Vue.axios.post(url.getPayConfirmUrl(),params)
    },
    getHelpCenterList(){
        return Vue.axios.get(url.getHelpCenterListUrl())
    },
    getBrandList(params){
        return Vue.axios.post(url.getBrandListUrl(),params)
    }
}

