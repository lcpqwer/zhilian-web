<template>
    <div class="project">
        <HomeTitleComponent msg='开放项目'></HomeTitleComponent>
        <div class="center-box">
            <p>有合作意愿的机构，请注册提交合作意向，我们会与您预约商务洽谈，正式签约后您将尽享我们的权利和服务</p>
            <p>合作热线：<span>021-65685071</span></p>
            <div class="process">
                <h4>简单3步，轻松搞定合作流程：</h4>
                <ul class="clearfix">
                    <li class="f-l">注册及提交</li>
                    <li class="f-l"><i class="icon"></i></li>
                    <li class="f-l">意向商务洽谈</li>
                    <li class="f-l"><i class="icon"></i></li>
                    <li class="f-l">合同及签约</li>
                </ul>
            </div>
        </div>

    </div>
</template>

<script>
    import HomeTitleComponent from './home-title.vue'
    export default {
        name:'project',
        components:{
            HomeTitleComponent
        }
    }
</script>

<style scoped>
    .project{
        background-color: #e7e4e3;
    }
    .project .center-box>p{
        font-size: 12px;
    }
    .center-box>p>span{
        color:#f6b243;
    }
    .process{
        margin-top:30px;
    }
    .process h4{
        padding:20px 0;
        color:#f6b243;
        font-size: 20px;
        font-weight: normal;
    }
    .process ul li+li{
        margin-left:20px;
    }
    .process ul li:nth-child(2n+1){
        width: 280px;
        height: 142px;
        background-color: #fff;
        border-radius: 10px;
        font-size: 30px;
        text-align: center;
        line-height: 142px;
    }
    .process ul li:nth-child(2n)>i{
        width: 80px;
        height: 76px;
        margin-top:33px;
        background-image: url(../assets/images/下级箭头.png);
    }
</style>