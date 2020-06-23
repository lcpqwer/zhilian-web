import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const PageHomeComponent=()=>import('./components/page-home.vue')
const PageBuyComponent=()=>import('./components/page-buy.vue')
const PageLowPriceComponent=()=>import('./components/page-low-price.vue')
const PageRankComponent=()=>import('./components/page-rank.vue')
const PageProjectComponent=()=>import('./components/page-project.vue')
const PageMainComponent=()=>import('./components/page-main.vue')
const PageLoginComponent=()=>import('./components/page-login.vue')
const PageForgetPasswordComponent=()=>import('./components/page-forget-password.vue')
const PageRegisterComponent=()=>import('./components/page-register.vue')
const PageMineComponent=()=>import('./components/page-mine.vue')
const MineInventoryComponent=()=>import('./components/mine-inventory.vue')
const MineHomeComponent=()=>import('./components/mine-home.vue')
const MineDetailComponent=()=>import('./components/mine-detail.vue')
const MineUpdatePasswordComponent=()=>import('./components/page-update-password.vue')
const MineUpdatePhoneComponent=()=>import('./components/page-update-phone.vue')
const LowPriceHomeComponent=()=>import('./components/low-price-home.vue')
const LowPriceStoreComponent=()=>import('./components/low-price-store.vue')
const LowPriceInventoryComponent=()=>import('./components/low-price-inventory.vue')
const LowPriceOrderComponent=()=>import('./components/low-price-order.vue')
const LowPriceShoppingComponent=()=>import('./components/low-price-shoppingcar.vue')
const LowPriceOrderDetailComponent=()=>import('./components/low-price-order-detail.vue')
const LowPriceOrderAffirmComponent=()=>import('./components/low-price-order-affirm.vue')
const PageHelpCenterComponent=()=>import('./components/page-help-center.vue')
const BuyHomeComponent=()=>import('./components/buy-home.vue')
const BuyInformationComponent=()=>import('./components/buy-information.vue')
const NotFoundComponent=()=>import('./components/not-found.vue')

const routes=[
	{path:'',redirect:'/main'},
	{path:'/main',component:PageMainComponent,children:[
		{path:'',redirect:'/main/home'},
		{path:'/main/home',name:'home',component:PageHomeComponent},
		{path:'/main/buy',component:PageBuyComponent,children:[
			{path:'',redirect:'buy-home'},
			{path:'/main/buy/buy-home',name:'buy-home',component:BuyHomeComponent},
			{path:'/main/buy/buy-information',name:'buy-information',component:BuyInformationComponent}
		],meta:{isLogin:true}},
		{path:'/main/low-price',component:PageLowPriceComponent,children:[
			{path:'',redirect:'low-price-home'},
			{path:'/main/low-price/low-price-home',name:'low-price-home',component:LowPriceHomeComponent},
			{path:'/main/low-price/low-price-store',name:'low-price-store',component:LowPriceStoreComponent},
			{path:'/main/low-price/low-price-shoppingcar',name:'low-price-shoppingcar',component:LowPriceShoppingComponent,meta:{isLogin:true}},
			{path:'/main/low-price/low-price-order',name:'low-price-order',component:LowPriceOrderComponent,meta:{isLogin:true}},
			{path:'/main/low-price/low-price-inventory',name:'low-price-inventory',component:LowPriceInventoryComponent},
			{path:'/main/low-price/low-price-order-detail',name:'low-price-order-detail',component:LowPriceOrderDetailComponent,meta:{isLogin:true}},
			{path:'/main/low-price/low-price-order-affirm',name:'low-price-order-affirm',component:LowPriceOrderAffirmComponent,meta:{isOrder:true}},
		],meta:{isLogin:true}},
		{path:'/main/rank',name:'rank',component:PageRankComponent},
		{path:'/main/project',name:'project',component:PageProjectComponent},
		{path:'/main/mine',component:PageMineComponent,children:[
			{path:'',redirect:'mine-home'},
			{path:'/main/mine/mine-home',name:'mine-home',component:MineHomeComponent},
			{path:'/main/mine/inventory',name:'inventory',component:MineInventoryComponent},
			{path:'/main/mine/mine-detail',name:'mine-detail',component:MineDetailComponent},
		],meta:{isLogin:true}},
	]},
	{path:'/login',name:'login',component:PageLoginComponent},
	{path:'/register',name:'register',component:PageRegisterComponent},
	{path:'/forget',name:'forget',component:PageForgetPasswordComponent},
	{path:'/update-password',name:'update-password',component:MineUpdatePasswordComponent,meta:{isLogin:true}},
	{path:'/update-phone',name:'update-phone',component:MineUpdatePhoneComponent,meta:{isLogin:true}},
	{path:'/help-center',name:'help-center',component:PageHelpCenterComponent},
	{path: '*', component: NotFoundComponent},
]
const router=new VueRouter({
	routes
})
// 路由守卫
router.beforeEach((to,from,next)=>{
	if(to.matched.some(res=>res.meta.isLogin)){//判断是否需要登录
		if (sessionStorage.getItem('JWT')) {
			next();
		}else{
			next({
				path:"/login"
			});
		}
	}else{
		next()
	}

	if(to.matched.some(res=>res.meta.isOrder)){//判断是否提交订单
		if (sessionStorage.getItem('ORDERS')) {
			next();
		}else{
			next({
				path:"/main/low-price/low-price-shoppingcar"
			});
		}
	}else{
		next()
	}
});
export default router