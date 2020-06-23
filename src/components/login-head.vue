<template>
    <div class="login-head">
        <div class="center-box d-f">
            <div class="left-box d-f">
                <div class="hb-logo">
                    <router-link :to="{name:'home'}">
                        <img src="../assets/images/logo-白底.png" alt="联置科技">
                    </router-link>
                </div>
                <h3>{{title}}</h3>
            </div>
            <router-link :to="{name:path}">{{msg}}</router-link>
        </div>
    </div>
</template>

<script>
export default {
    name:'login-head',
    props:{
        title:{
            default:'会员登录',
            type:String
        },
        msg:{
            default:'还没有账号？去注册',
            type:String
        }
    },
    data(){
        return {
            path:'register'
        }
    },
    created(){
        if(this.title!=='会员登录'){
            this.path='login'
        }
    }
}
</script>

<style scoped>
    .login-head{
        background-color: #fff;
    }
    .center-box,.left-box{
        height: 123px;
        justify-content: space-between;
        align-items: center;
    }
    .center-box h3{
        margin-left:10px;
        font-size: 18px;
        font-weight: normal;
    }
    .center-box a{
        color:#f6b243;
    }
    /* logo */
    .hb-logo {
		width: 284px;
	}

	.hb-logo a {
		display: block;
		width: 100%;
	}
    
	@media screen and (max-width: 768px){
		.login-head{
			display: none !important
		}
	}
</style>