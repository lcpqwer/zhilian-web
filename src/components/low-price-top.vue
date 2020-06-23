<template>
    <div class="low-price-top">
        <div class="list-top">
            <div class="search d-f">
                <div>
                    <label for="">分类</label>
                    <select name="category" id="category">
                        <option value="1">现货</option>
                        <option value="2">期货</option>
                    </select>
                </div>
                <div>
                    <label for="">型号</label>
                    <input type="text">
                </div>
                <div>
                    <label for="">生产商</label>
                    <input type="text">
                </div>
                <button class="btn-search">搜索</button>
                <slot></slot>
            </div>
            <div class="chk d-f">
                <ul class="d-f">
                    <li class="on">综合</li>
                    <li>数量</li>
                    <li>价格</li>
                </ul>
                <div class="price d-f">
                    <input type="text" placeholder="最低价">
                    <span>~</span>
                    <input type="text" placeholder="最高价">
                </div>
                <button>确定</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:'low-price-top'
}
</script>

<style scoped>
    /* 筛选头部 */
	.low-price-top{
		padding:0 40px;
		background-color: #fff;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
		font-size: 14px;
	}
	.low-price-top>div{
		padding:10px 0;
		font-size: 14px;
	}
	.low-price-top>div+div{
		border-top: 1px dashed #ccc;
	}
	.low-price-top>div>span{
		display: inline-block;
		width: 85px;
		padding-top:13px;
	}
	.low-price-top>div .right{
		flex: 1;
	}
	.low-price-top>div li{
		padding:0 15px;
		line-height: 40px;
		cursor: pointer;
	}
	.low-price-top>div li:hover,
	.low-price-top>div li.on{
		color:#f6b243;
	}
	.low-price-top>div ul{
		flex-wrap: wrap;
	}

    .low-price-top  .list-top .search{
        height: 75px;
        justify-content: space-around;
        border-bottom:3px solid #f6b243;
    }
    .search input{
        width: 150px;
        height: 32px;
        margin-left:10px;
        background-color: #f8f6f4;
        border:none;
        text-indent: 10px;
    }
    .search>button,
	.chk>button{
        width: 72px;
        height: 32px;
        background-color: #f6b243;
        border-radius: 5px;
        color:#fff;
    }
    .chk{
        background-color: #f8f6f4;
        align-items: center;
    }
    .chk>ul li{
        padding:16px 20px;
        cursor: pointer;
    }
    .chk>ul li.on{
        background-color: #fff;
    }
    .chk .price{
        align-items: center;
    }
    .chk .price input{
        width: 80px;
        height: 32px;
        background-color: #fff;
        border-radius: 5px;
		text-indent: 10px;
    }
	input::-webkit-input-placeholder {
        color: #ccc;
	}
	input::-moz-input-placeholder {
		color: #ccc;
	}
	input::-ms-input-placeholder {
		color: #ccc;
	}
</style>