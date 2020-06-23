const ROOT_URL='https://login.asap-get.com/lianzhi/'
// 注册
const REGISTER_BY_PHONE_URL=ROOT_URL+'index/register'
const PHONE_CODE_URL=ROOT_URL+'register/code'
// 图形二维码
const IMG_CODE_URL=ROOT_URL+'index/Login/get_img_code'
// 地址
const PROVINCE_URL=ROOT_URL+'Index/address'
const CITY_URL=ROOT_URL+'index/getRegion'
// 登录
const LOGIN_BY_PHONE_URL=ROOT_URL+'phone/login'
//重置密码
const USER_TEST_URL=ROOT_URL+'reset/phone'
const RESET_CODE_URL=ROOT_URL+'reset/code'
const VERIFY_CODE_URL=ROOT_URL+'reset/verification'
const RESET_PASSWORD_URL=ROOT_URL+'reset/pwd'
// 个人中心
const MINE_INVENTORY_SHOW_URL=ROOT_URL+'my/stock_show'
const MINE_BATCH_UPLOAD_URL=ROOT_URL+'my/stock_excel'
const MINE_BATCH_DELETE_URL=ROOT_URL+'my/stock_delete'
const MINE_UPLOAD_SINGLE_URL=ROOT_URL+'my/stock_add'
const MINE_DOWNLOAD_MODEL_URL=ROOT_URL+'my/stock_export'
const MINE_DELETE_ALL_INVENTORY_URL=ROOT_URL+'my/stock_delete'
// 个人中心-上传/下载支付
const MINE_PAY_URL=ROOT_URL+'Alipay/doalipay'
// 确认支付
const MINE_CONFIRM_PAY_URL=ROOT_URL+'Alipay/verification'
// 个人中心-个人信息
const MINE_DETAIL_URL=ROOT_URL+'My/show'
const MINE_ADD_ADDRESS_URL=ROOT_URL+'My/address_add'
const MINE_DELETE_ADDRESS_URL=ROOT_URL+'My/address_delete'
const MINE_SET_DEFAULT_ADDRESS_URL=ROOT_URL+'My/address_default'
const MINE_UPLOAD_IMG_URL=ROOT_URL+'my/img'
const MINE_UPDATE_INFORMATION_URL=ROOT_URL+'My/upd'
const MINE_UPDATE_PASSWORD_URL=ROOT_URL+'my/upd_pwd'
// 更换绑定手机号
const MINE_UPDATE_PHONE_SEND_CODE_URL=ROOT_URL+'my/reset_code'
const MINE_UPDATE_PHONE_VERIFICATION_URL=ROOT_URL+'my/reset_verification'
const MINE_UPDATE_PHONE_BINDING_CODE_URL=ROOT_URL+'my/binding_code'
const MINE_UPDATE_PHONE_BINDING_VERIFICATION_URL=ROOT_URL+'my/binding_verification'
// 求购
const BUY_SHOW_LIST_URL=ROOT_URL+'Wanttobuy/show'
const BUY_ADD_BUY_RUL=ROOT_URL+'Wanttobuy/add'
const BUY_READ_URL=ROOT_URL+'Wanttobuy/read'
const BUY_CHAT_ALERT_URL=ROOT_URL+'Wanttobuy/add_button'
// 低价抛售区
const LOW_PRICE_INVENTORY_URL=ROOT_URL+'Stock/member_show'
const LOW_PRICE_STORE_LIST_URL=ROOT_URL+'Stock/stock_show'
// 购物车
const LOW_PRICE_ADD_SHOPPINGCAR_URL=ROOT_URL+'stock/shopping_cart_add'
const LOW_PRICE_SHOPPINGCAR_LIST_URL=ROOT_URL+'stock/shopping_cart_show'
const LOW_PRICE_SHOPPINGCAR_CHANGE_NUM_URL=ROOT_URL+'stock/shopping_cart_upd'
const LOW_PRICE_SHOPPINGCAR_DELETE_URL=ROOT_URL+'stock/shopping_cart_del'
// 头像与昵称
const USER_INFO_URL = ROOT_URL+'index/Wanttobuy/phone'
// 聊天评价
const CHAR_GRADE_URL=ROOT_URL+'Wanttobuy/communicate'
// 订单
const ORDER_LIST_URL=ROOT_URL+'Orderlist/show'
const ORDER_LOGISTICS_URL=ROOT_URL+'Orderlist/courier'
const ORDER_CONFIRM_URL=ROOT_URL+'Orderlist/courier_add'
const ORDER_REMIND_URL=ROOT_URL+'Orderlist/courier_remind'
// 封神榜
const RANK_LIST_URL=ROOT_URL+'Member/deify'
// 微信登录获取jwt
const LOGIN_WX_GET_JWT_URL=ROOT_URL+'index/user'
// 开放项目
const PROJECT_SUBMIT_URL=ROOT_URL+'index/Member/feedback'
//底部练习方式
const FOOTER_CONTACT_INFORMATION=ROOT_URL+'admin/Setting/show'

const BUY_ORDER_INFORMATION_URL=ROOT_URL+'index/Wanttobuy/payshow'
const UPLOAD_BATCH_SEARCH_URL=ROOT_URL+'index/Excelword/query'
const DOWNLOAD_BATCH_RESULT_URL=ROOT_URL+'index/Excelword/stock_export'
const GREADE_USER_URL=ROOT_URL+'index/Wanttobuy/user_show'
const UPLOAD_BATCH_BUY_URL=ROOT_URL+'index/Wanttobuy/query'

const PAY_CONFIRM_URL=ROOT_URL+'index/Wtbalipay/verification'
const HELP_CENTER_LIST_URL=ROOT_URL+'admin/footer/show'

const HOME_BRAND_LIST_URL = ROOT_URL+'admin/Header/show'

export default{
    getRegisterByPhoneUrl(){
        return REGISTER_BY_PHONE_URL
    },
    getPhoneCodeUrl(){
        return PHONE_CODE_URL
    },
    getProvinceUrl(){
        return PROVINCE_URL
    },
    getCityUrl(){
        return CITY_URL
    },
    getImageCodeUrl(){
        return IMG_CODE_URL
    },
    // 登录
    getUserLoginUrl(){
        return LOGIN_BY_PHONE_URL
    },
    //重置密码
    getUserTestUrl(){
        return USER_TEST_URL
    },
    getResetCodeUrl(){
        return RESET_CODE_URL
    },
    getVerifyCodeUrl(){
        return VERIFY_CODE_URL
    },
    getResetPasswordUrl(){
        return RESET_PASSWORD_URL
    },
    // 个人中心
    getMineInventoryShowUrl(){
        return MINE_INVENTORY_SHOW_URL
    },
    getMineBatchUploadUrl(){
        return MINE_BATCH_UPLOAD_URL
    },
    getMineBatchDeleteUrl(){
        return MINE_BATCH_DELETE_URL
    },
    getSingleUploadUrl(){
        return MINE_UPLOAD_SINGLE_URL
    },
    getDeleteAllInventoryUrl(){
        return MINE_DELETE_ALL_INVENTORY_URL
    },
    getPayUrl(){
        return MINE_PAY_URL
    },
    getConfirmPayUrl(){
        return MINE_CONFIRM_PAY_URL
    },
    getMineDownloadModelUrl(){
        return MINE_DOWNLOAD_MODEL_URL
    },
    getMineDetailUrl(){
        return MINE_DETAIL_URL
    },
    getAddAddressUrl(){
        return MINE_ADD_ADDRESS_URL
    },
    getDeleteAddressUrl(){
        return MINE_DELETE_ADDRESS_URL
    },
    getSetDefaultAddressUrl(){
        return MINE_SET_DEFAULT_ADDRESS_URL
    },
    getUploadImgUrl(){
        return MINE_UPLOAD_IMG_URL
    },
    getBuyShowListUrl(){
        return BUY_SHOW_LIST_URL
    },
    getAddBuyUrl(){
        return BUY_ADD_BUY_RUL
    },
    getReadUrl(){
        return BUY_READ_URL
    },
    getLowPriceInventoryUrl(){
        return LOW_PRICE_INVENTORY_URL
    },
    getLowPriceStoreListUrl(){
        return LOW_PRICE_STORE_LIST_URL
    },
    getAddShoppingCarUrl(){
        return LOW_PRICE_ADD_SHOPPINGCAR_URL
    },
    getShoppingCarListUrl(){
        return LOW_PRICE_SHOPPINGCAR_LIST_URL
    },
    getUserInfoUrl(){
        return USER_INFO_URL
    },
    getShoppingCarChangeNumberUrl(){
        return LOW_PRICE_SHOPPINGCAR_CHANGE_NUM_URL
    },
    getShoppingCarDeleteUrl(){
        return LOW_PRICE_SHOPPINGCAR_DELETE_URL
    },
    getOrderListUrl(){
        return ORDER_LIST_URL
    },
    getChatAlertUrl(){
        return BUY_CHAT_ALERT_URL
    },
    getOrderLogisticsUrl(){
        return ORDER_LOGISTICS_URL
    },
    getConfirmOrderUrl(){
        return ORDER_CONFIRM_URL
    },
    getRankListUrl(){
        return RANK_LIST_URL
    },
    getChatGradeUrl(){
        return CHAR_GRADE_URL
    },
    getLoginWxJwtUrl(){
        return LOGIN_WX_GET_JWT_URL
    },
    getProjectSubmitUrl(){
        return PROJECT_SUBMIT_URL
    },
    getUpdataMineInformationUrl(){
        return MINE_UPDATE_INFORMATION_URL
    },
    getUpdatePasswordUrl(){
        return MINE_UPDATE_PASSWORD_URL
    },
    // 更换绑定手机
    getUpdatePhoneSendCodeUrl(){
        return MINE_UPDATE_PHONE_SEND_CODE_URL
    },
    getUpdatePhoneVerificationUrl(){
        return MINE_UPDATE_PHONE_VERIFICATION_URL
    },
    getUpdatePhoneBindingCodeUrl(){
        return MINE_UPDATE_PHONE_BINDING_CODE_URL
    },
    getUpdatePhoneBindingVerificationUrl(){
        return MINE_UPDATE_PHONE_BINDING_VERIFICATION_URL
    },
    getRemindUrl(){
        return ORDER_REMIND_URL
    },
    getContactInformationUrl(){
        return FOOTER_CONTACT_INFORMATION
    },
    getBuyOrderInformation(){
        return BUY_ORDER_INFORMATION_URL
    },
    getUploadBatchSearchUrl(){
        return UPLOAD_BATCH_SEARCH_URL
    },
    getdownloadBatchResultUrl(){
        return DOWNLOAD_BATCH_RESULT_URL
    },
    //获取评价列表
    getGradeUserUrl(){
        return GREADE_USER_URL
    },
    getUploadBatchBuyUrl(){
        return UPLOAD_BATCH_BUY_URL
    },

    getPayConfirmUrl(){
        return PAY_CONFIRM_URL
    },
    getHelpCenterListUrl(){
        return HELP_CENTER_LIST_URL
    },
    getBrandListUrl(){
        return HOME_BRAND_LIST_URL
    }
}