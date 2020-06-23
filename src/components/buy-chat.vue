<template>
    <div id="chat">
        <div class="chat-box clearfix">
            <div class="chat-left f-l">
                <div class="l-top">
                    <div class="introduce">
                        <div class="i-t d-f">
                            <div class="t-l">
                                <p>型号：<span>{{userInfo.model}}</span></p>
                                <p>数量：<span>{{parseInt(userInfo.number)}}</span></p>
                            </div>
                            <div class="t-r">
                                <span>实单</span>
                                <span class="num"></span>
                            </div>
                        </div>
                        <div class="i-b d-f">
                            <span class="time">{{userInfo.time}}</span>
                            <span class="personnum">已有{{sessionList.length}}人和您沟通过</span>
                        </div>
                    </div>
                    <div class="search"></div>
                </div>
                <div class="l-bottom">
                    <ul class="msg-list">
                        <li class="d-f on" v-for="(item, index) in sessionList" :key="index">
                            <div class="pic">
                                <img :src="`http://${item.img}`" alt="">
                            </div>
                            <div class="txt d-f">
                                <div class="nickname d-f">
                                    <span>{{item.name}}</span>
                                    <span class="time">{{item.time}}</span>
                                </div>
                                <div class="t-msg d-f">
                                    <span>{{item.content}}</span>
                                    <span v-show="item.num>0" class="msg-num">{{item.num}}</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="chat-right f-r">
                <div class="r-top d-f">
                    <div class="user d-f">
                        <div class="pic">
                            <img :src="`http://${session.img}`" alt="">
                        </div>
                        <span>{{session.name}}</span>
                    </div>
                    <button @click="cancel()"><i class="icon iconfont">&#xe667;</i></button>
                </div>
                <div class="r-con d-f">
                    <div class="msg-box" ref="box">
                        <ul>
                            <li :class="[item.userType === 2? 'other': 'mine', 'd-f']" v-for="(item,index) in messageList" :key="index">
                                <div class="msg d-f">
                                    <div class="pic">
                                        <img v-show="item.userType === 1" :src="`http://${headImg}`" alt="">
                                        <img v-show="item.userType === 2" :src="`http://${session.img}`" alt="">
                                    </div>
                                    <div class="m-r">
                                        <div class="r-t d-f">
                                            <span v-show="item.userType === 2">{{session.name}}</span>
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
                        <textarea name="chat-txt" id="chat-txt" v-model="message"></textarea>
                        <button @click="setMessage">发送</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import service from "../services/service";

    var RongIMLib = require('../RongIMLib-2.5.3.min');
    var Protobuf = require('../protobuf-2.3.7.min');
    var RongIMClient = RongIMLib.RongIMClient
    RongIMClient.init('25wehl3u205bw', null, {
        protobuf: Protobuf
    })
    export default {
        name: 'chat',
        props: {
            userInfo: Object,
            headImg: String,
            userName: String
        },
        data() {
            return {
                token: sessionStorage.getItem('TOKEN'),
                isShow: false,
                //消息列表
                messageList: [],
            //    会话列表
                sessionList: [],
            //    当前会话
                session: Object,
            //    当前会话索引
                sessionIndex: 0,
            //    消息
                message: ''
            }
        },
        created(){
            // let time = this.userInfo.time;
            // let ls = time.split('-');
            // window.console.log(ls)
            // let ls1 = ls[2].split(' ')
            // this.userInfo.time = ls[0]+'年'+ls[1]+'月'+ls1[0]+'日 '+ls1[1]
            // window.console.log(ls);

            this.listenClient();
            this.listenMessage();
            this.client();
            window.console.log(sessionStorage.getItem('USER'))
        },
        methods: {
            show() {
                this.isShow = true;
            },
            cancel() {
                // this.isShow = false;
                this.$parent.hideChat()
            },
            // 监听融云连接
            listenClient() {
                RongIMClient.setConnectionStatusListener({
                    onChanged: function (status) {
                        // status 标识当前连接状态
                        switch (status) {
                            case RongIMLib.ConnectionStatus.CONNECTED:
                                window.console.log('链接成功');
                                break;
                            case RongIMLib.ConnectionStatus.CONNECTING:
                                window.console.log('正在链接');
                                break;
                            case RongIMLib.ConnectionStatus.DISCONNECTED:
                                window.console.log('断开连接');
                                break;
                            case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                                window.console.log('其他设备登录, 本端被踢');
                                break;
                            case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
                                window.console.log('域名不正确, 请至开发者后台查看安全域名配置');
                                break;
                            case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                                window.console.log('网络不可用, 此时可调用 reconnect 进行重连');
                                break;
                            default:
                                window.console.log('链接状态为', status);
                                break;
                        }
                    }
                });
            },
            // 监听消息
            listenMessage() {
                let that =this;
                RongIMClient.setOnReceiveMessageListener({
                    // 接收到的消息
                    onReceived: function (message) {
                        var messageContent = message.content;
                        // 判断消息类型
                        switch (message.messageType) {
                            case RongIMClient.MessageType.TextMessage: // 文字消息
                                window.console.log('文字内容', messageContent.content);
                                if (message.senderUserId === that.session.userId){
                                    let dic = {
                                        time: that.getTime(new Date().getTime()),
                                        content: messageContent.content,
                                        userType: 2
                                    };
                                    that.messageList.push(dic)
                                    setTimeout(function () {
                                        that.$refs.box.scrollTop = that.$refs.box.scrollHeight;
                                    }, 10)
                                }
                                break;
                            case RongIMClient.MessageType.ImageMessage: // 图片消息
                                window.console.log('图片缩略图 base64', messageContent.content);
                                window.console.log('原图 url', messageContent.imageUri);
                                break;
                            case RongIMClient.MessageType.HQVoiceMessage: // 音频消息
                                window.console.log('音频 type ', messageContent.type); // 编解码类型，默认为 aac 音频
                                window.console.log('音频 url', messageContent.remoteUrl); // 播放：<audio src={remoteUrl} />
                                window.console.log('音频 时长', messageContent.duration);
                                break;
                            case RongIMClient.MessageType.RichContentMessage: // 富文本(图文)消息
                                window.console.log('文本内容', messageContent.content);
                                window.console.log('图片 base64', messageContent.imageUri);
                                window.console.log('原图 url', messageContent.url);
                                break;
                            case RongIMClient.MessageType.UnknownMessage: // 未知消息
                                window.console.log('未知消息, 请检查消息自定义格式是否正确', message);
                                break;
                            default:
                                window.console.log('收到消息', message);
                                break;
                        }
                    }
                });
            },
            // 连接融云
            client() {
                // window.console.log(RongIMClient.getInstance().getCurrentConnectionStatus())
                // RongIMClient.getInstance().logout();
                let that = this;
                if (RongIMClient.getInstance().getCurrentConnectionStatus() === 0){
                    // window.console.log('用户id',RongIMClient.getInstance().getCurrentUserId());
                    // window.console.log('用户id session',that.userInfo.userid);
                    //
                    // if (RongIMClient.getInstance().getCurrentUserId() === that.userInfo.userid){
                    //     // that.getMessage();
                    //     that.getSessionList()
                    // }else {
                        RongIMClient.getInstance().logout();
                    // }
                }
                RongIMClient.connect(that.userInfo.token, {
                    onSuccess: function (userId) {
                        window.console.log('连接成功, 用户 id 为', userId);
                        // 连接已成功, 此时可通过 getConversationList 获取会话列表并展示
                        // that.getMessage();
                        that.getSessionList()
                    },
                    onTokenIncorrect: function () {
                        window.console.log('连接失败, 失败原因: token 无效');
                    },
                    onError: function (errorCode) {
                        var info = '';
                        switch (errorCode) {
                            case RongIMLib.ErrorCode.TIMEOUT:
                                info = '链接超时';
                                break;
                            case RongIMLib.ConnectionState.UNACCEPTABLE_PAROTOCOL_VERSION:
                                info = '不可接受的协议版本';
                                break;
                            case RongIMLib.ConnectionState.IDENTIFIER_REJECTED:
                                info = 'appkey 不正确';
                                break;
                            case RongIMLib.ConnectionState.SERVER_UNAVAILABLE:
                                info = '服务器不可用';
                                break;
                            default:
                                info = errorCode;
                                break;
                        }
                        window.console.log('连接失败, 失败原因: ', info);
                    }
                });
            },
            // 获取会话列表
            getSessionList(){
                let that = this
                var conversationTypes = [ RongIMLib.ConversationType.PRIVATE ];
                var count = 150;
                RongIMClient.getInstance().getConversationList({
                    onSuccess: function(list) {
                        window.console.log('获取会话列表成功', list);
                        for (let i = 0; i < list.length; i++) {
                            let item = list[i];
                            window.console.log(item);
                            var conversationType = RongIMLib.ConversationType.PRIVATE;
                            var targetId = item.targetId;
                            RongIMLib.RongIMClient.getInstance().getUnreadCount(conversationType, targetId, {
                                onSuccess: function(count) {
                                    window.console.log('获取指定会话未读消息数成功', count);
                                    let formdata=new FormData();
                                    formdata.append('phone',item.targetId);
                                    formdata.append('jwt', sessionStorage.getItem('JWT'));
                                    service.getUserInfo(formdata).then((res)=>{
                                        window.console.log(res);
                                        if (res.status === 200){
                                            let dic = {
                                                name: res.data.name,
                                                img: res.data.img,
                                                content: item.latestMessage.content.content,
                                                num: count,
                                                time: that.getTime(item.latestMessage.sentTime),
                                                userId: item.targetId
                                            };
                                            if (i === 0){
                                                that.session = dic;
                                                that.getMessage();

                                            }
                                            that.sessionList.push(dic)
                                            that.clearUnreadNum()
                                        }
                                    })
                                },
                                onError: function(error) {
                                    window.console.log('获取指定会话未读消息数失败', error);
                                }
                            });
                        }
                    },
                    onError: function(error) {
                        window.console.log('获取会话列表失败', error);
                    }
                }, conversationTypes, count);
            },
            // 判断时间
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
            //    获取历史信息
            getMessage() {
                let that = this;
                var conversationType = RongIMLib.ConversationType.PRIVATE;
                var targetId = that.session.userId;
                window.console.log('targetId',targetId)
                var timestrap = null; // 默认传 null, 若从头开始获取历史消息, 请赋值为 0
                var count = 20;
                RongIMLib.RongIMClient.getInstance().getHistoryMessages(conversationType, targetId, timestrap, count, {
                    onSuccess: function (list) {
                        /*
                            list: 获取的历史消息列表
                            hasMsg: 是否还有历史消息可以获取
                          */
                        window.console.log('获取历史消息成功', list);
                        for (let i = 0; i < list.length; i++) {
                            let item = list[i];
                            // window.console.log('信息',item);
                            // window.console.log(that.getTime(item.sentTime));
                            let dic = {
                                time: that.getTime(item.sentTime),
                                content: item.content.content,
                                userType: item.messageDirection
                            };

                            window.console.log(dic);
                            that.messageList.push(dic)
                        }
                        setTimeout(function () {
                            that.$refs.box.scrollTop = that.$refs.box.scrollHeight;
                        }, 10)

                    },
                    onError: function (error) {
                        // 请排查：单群聊消息云存储是否开通
                        window.console.log('获取历史消息失败', error);
                    }
                });
            },
            //    发送信息
            setMessage(){
                let that = this;
                that.clearUnreadNum()
                var msg = new RongIMLib.TextMessage({ content: that.message, extra: '附加信息' });
                var conversationType = RongIMLib.ConversationType.PRIVATE;
                var targetId = that.session.userId;  // 目标 Id
                window.console.log(targetId)
                RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
                    onSuccess: function (message) {

                        // message 为发送的消息对象并且包含服务器返回的消息唯一 id 和发送消息时间戳
                        window.console.log('发送文本消息成功', message);
                        let dic = {
                            time: that.getTime(new Date().getTime()),
                            content: that.message,
                            userType: 1
                        };
                        that.messageList.push(dic)
                        that.message = '';
                        setTimeout(function () {
                            that.$refs.box.scrollTop = that.$refs.box.scrollHeight;
                        }, 10)
                    },
                    onError: function (errorCode) {
                        window.console.log('发送文本消息失败', errorCode);
                    }
                });
            },
            //    清除未读数
            clearUnreadNum(){
                let that = this;
                that.sessionList[that.sessionIndex].num = 0
                var conversationType = RongIMLib.ConversationType.PRIVATE;
                var targetId = that.session.userId;
                RongIMClient.getInstance().clearUnreadCount(conversationType, targetId, {
                    onSuccess: function() {

                        window.console.log('清除指定会话未读消息数成功');
                    },
                    onError: function(error) {
                        window.console.log('清除指定会话未读消息数失败', error);
                    }
                });
            }
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
        width: 1096px;
        margin: 0 auto;
        border-radius: 10px;
        transform: translateY(-50%);
    }

    #chat .chat-box .chat-left {
        width: 410px;
    }

    #chat .chat-box .chat-right {
        width: 686px;
        height: 664px;
    }

    .l-top {
        padding: 10px 20px;
        background-color: #f6b243;
    }

    .l-top .introduce {
        height: 80px;
        padding: 10px;
        background-color: #fff;
        border-radius: 10px;
    }

    .introduce .i-t {
        margin-bottom: 24px;
        justify-content: space-between;
        align-items: center;
    }

    .introduce .i-t p {
        color: #4c4c4c;
    }

    .introduce .i-t p > span {
        color: #3f3f3f;
    }

    .introduce .i-t .t-r {
        margin-right: 40px;
    }

    .introduce .i-t .t-r span:not([class='num']) {
        font-size: 18px;
        color: #f17f3a;
    }

    .introduce .i-b {
        justify-content: space-between;
    }

    .introduce .i-b span {
        font-size: 12px;
    }

    .introduce .i-b .time {
        color: #b2b2b2;
    }

    .introduce .i-b .personnum {
        color: #7e7e7e;
    }

    .l-bottom {
        overflow: auto;
        height: 524px;
        padding: 10px 0;
        background-color: #fff;
    }

    .l-bottom li {
        height: 58px;
        padding: 0 20px;
        font-size: 12px;
        align-items: center;
        cursor: pointer;
    }

    .l-bottom li.on {
        background-color: #fff7ea;
    }

    .l-bottom li .pic,
    .chat-right .r-top .pic {
        overflow: hidden;
        width: 45px;
        height: 45px;
        margin-right: 10px;
        border-radius: 50%;
        background-color: #ccc;
    }

    .l-bottom li .txt {
        width: 290px;
        height: 58px;
        border-bottom: 1px solid #7f7f7f;
        flex-direction: column;
        justify-content: center;
    }

    .nickname,
    .t-msg {
        justify-content: space-between;
    }

    .t-msg {
        margin-top: 10px;
    }

    .t-msg .msg-num {
        display: inline-block;
        width: 15px;
        height: 15px;
        background-color: red;
        border-radius: 50%;
        font-size: 12px;
        color: #fff;
        line-height: 15px;
        text-align: center;
    }

    /* 右侧聊天框 */
    .chat-right .r-top {
        padding: 20px;
        background-color: #f6b243;
        justify-content: space-between;
    }

    .chat-right .r-top span {
        font-size: 20px;
        color: #fff;
    }

    .chat-right .r-top button {
        font-size: 20px;
        color: #fff;
        background-color: transparent;
    }

    .user {
        align-items: center;
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