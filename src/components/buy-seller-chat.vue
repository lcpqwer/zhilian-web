<template>
    <div id="chat">
        <div class="chat-box">
            <div class="chat-right">
                <div class="r-top d-f">
                    <h4>{{userInfo.model}}</h4>
                    <button @click="cancel()"><i class="icon iconfont">&#xe667;</i></button>
                </div>
                <div class="r-con d-f">
                    <div class="msg-box" ref="box">
                        <ul>
                            <li :class="[item.userType === 2? 'other': 'mine', 'd-f']" v-for="(item,index) in messageList" :key="index">
                                <div class="msg d-f">
                                    <div class="pic">
                                        <img v-show="item.userType === 1" :src="headImg" alt="">
                                        <img v-show="item.userType === 2" :src="userInfo.img" alt="">
                                    </div>
                                    <div class="m-r">
                                        <div class="r-t d-f">
                                            <span v-show="item.userType === 2">{{userInfo.username}}</span>
                                            <span v-show="item.userType === 1">{{userName}}</span>
                                            <span class="time">{{item.time}}</span>
                                        </div>
                                        <p>{{item.content}}</p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="msg-input">
                        <textarea name="chat-txt" id="chat-txt" v-model="message" @keydown="enterDown($event)"></textarea>
                        <button @click="setMessage">发送</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'seller-chat',
        props: {
            userInfo: Object,
            headImg: String,
            userName: String,
			messageList: Array
        },
        data() {
            return {
                token: sessionStorage.getItem('TOKEN'),
                isShow: false,
                message: '',
            }
        },
        methods: {
			scroll(){
				let that = this
				setTimeout(function(){
					that.$refs.box.scrollTop = that.$refs.box.scrollHeight;
				},100)
			},
            show() {
                this.isShow = true;
            },
            cancel() {
                this.$parent.hideSellerChat();
            },
            getTime(time){
                let date = new Date(time);
                let now = new Date();
                let year = date.getFullYear();
                let month = date.getMonth()+1;
                let day = date.getDate();
                let year1 = now.getFullYear();
                let month1 = now.getMonth()+1;
                let day1 = now.getDate();
                let hour = date.getHours();
                let minute = date.getMinutes();
                let str1;
                if (hour<6){str1 = '凌晨'
                }else if (hour<12){str1 = '上午 '
                }else if (hour<17){str1 = '下午'
                }else {str1 = '晚上'}
                if (hour>12){hour -= 12}
                if (year === year1 && month === month1 && day === day1){
                    if (hour<10){hour = '0'+month}
                    if (minute<10){minute = '0'+month}
                    return str1+' '+hour+':'+minute
                }else {
                    if (month<10){month = '0'+month}
                    if (day<10){day = '0'+month}
                    if (hour<10){hour = '0'+month}
                    if (minute<10){minute = '0'+month}
                    return year+'年'+month+'月'+day+'日 '+str1+' '+hour+':'+minute
                }
            },
			//发送信息
            enterDown(e){
                e.stopPropagation()
                if (e.code === 'Enter'){
                this.setMessage()
                }
            },
            input(e){
                e.stopPropagation()
            },
            isNull( str ){
                if (str == "") return true;
                var regu = /^(<[^><]+>|\s|&nbsp)+$/;
                var re = new RegExp(regu);
                return re.test(str);
            },
            setMessage(){
                if (!this.isNull(this.message)){
                this.$parent.setMessage(this.message)
                this.message = ''
                }else {
                this.message = null
                this.message = ''
                }
            },
        },

    }
</script>

<style scoped>
    #chat {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .6);
        z-index: 999;
    }

    #chat .chat-box {
        position: absolute;
        overflow: hidden;
        top: 50%;
        left: 0;
        right: 0;
        width: 686px;
        margin: 0 auto;
        border-radius: 10px;
        transform: translateY(-50%);
    }

    #chat .chat-box .chat-right {
        width: 686px;
        height: 664px;
    }

    /* 右侧聊天框 */
    .chat-right .r-top {
        padding: 20px;
        background-color: #f6b243;
        justify-content: space-between;
    }

    .chat-right .r-top h4 {
        font-size: 20px;
        color: #fff;
        line-height: 45px;
    }

    .chat-right .r-top button {
        font-size: 20px;
        color: #fff;
        background-color: transparent;
    }

    .r-con {
        height: 579px;
        flex-direction: column;
    }

    .r-con .msg-box {
        overflow: auto;
        width: 646px;
        flex: 1;
        padding: 0 20px;
        background-color: #f8f6f4;
        /*height: 459px;*/
    }

    .r-con .msg-input {
        position: relative;
        height: 120px;
        padding: 20px;
        background-color: #fff;
    }

    .r-con .msg-input textarea {
        width: 550px;
        height: 120px;
        background-color: #fff;
        border: none;
        outline: none;
        resize: none;
    }

    .r-con .msg-input > button {
        position: absolute;
        bottom: 30px;
        right: 30px;
        width: 114px;
        height: 50px;
        background-color: #f17f3a;
        border-radius: 10px;
        color: #fff;
    }

    /* 聊天框里的内容 */
    .msg-box > ul > li {
        margin: 20px 0;
    }

    .msg-box > ul > li .pic {
        overflow: hidden;
        width: 54px;
        height: 54px;
        margin-right: 10px;
        background-color: #ccc;
        border-radius: 50%;
    }

    .msg-box > ul > li .m-r p {
        position: relative;
        max-width: 316px;
        padding: 10px 20px;
        border-radius: 10px;
        line-height: 30px;
    }

    .msg-box > ul > li.other .m-r p {
        background-color: #f6b243;
    }

    .msg-box > ul > li.mine .m-r p {
        background-color: #fff;
    }

    .msg-box > ul > li .m-r p::before {
        content: '';
        display: block;
        position: absolute;
        top: 10px;
        width: 0;
        height: 0;
    }

    .msg-box > ul > li.other .m-r p::before {
        left: -8px;
        border-top: 4px solid #f6b243;
        border-right: 4px solid #f6b243;
        border-left: 4px solid #f8f6f4;
        border-bottom: 4px solid #f8f6f4;
    }

    .msg-box > ul > li.mine .m-r p::before {
        right: -8px;
        border-top: 4px solid #fff;
        border-left: 4px solid #fff;
        border-right: 4px solid #f8f6f4;
        border-bottom: 4px solid #f8f6f4;
    }

    .msg-box .r-t .time {
        padding: 0 10px;
    }

    .msg-box > ul > li.mine .msg {
        flex-direction: row-reverse;
    }

    .msg-box > ul > li.mine .pic {
        margin-right: 0;
        margin-left: 10px;
    }

    .msg-box > ul > li.mine {
        justify-content: flex-end;
    }

    .msg-box > ul > li.mine .r-t {
        flex-direction: row-reverse;
        justify-content: flex-start;
    }
</style>
