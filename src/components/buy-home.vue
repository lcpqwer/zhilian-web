<template>
	<div id="buy-home">
		<div v-if="myUploadChart" class="chart-warpper">
			<iframe ref="chatIframe" :src="`${url}/RongIM/HTML/myupload-chat.html?orderInfo=${myUploadItem}&jwt=${jwt}&user=${user}`"
			frameborder="0" @load="loaded"></iframe>
		</div>
		<div class="center-box clearfix">
			<div class="buy-left f-l">
				<h3>急购专区</h3>
				<ul class="buy-nav">
					<li :class="{'on':state===0}" class=" d-f" @click="changeState(0)"><p>全部求购</p><p class="nav-introduce">所有人的发布</p></li>
					<li :class="{'on':state===1}" class="active d-f" @click="changeState(1)"><p>商机提示</p><p class="nav-introduce">匹配我发布的</p><span v-if="isShowBusiness"></span></li>
					<li :class="{'on':state===2}" class="active d-f" @click="changeState(2)"><p>我的商机</p><p class="nav-introduce">我支付过的发布</p><span v-if="pay_chat_number>0">{{pay_chat_number}}</span></li>
					<li :class="{'on':state===3}" class="active d-f" @click="changeState(3)"><p>我的询价/实单</p><p class="nav-introduce">我发布的求购</p><span v-if="user_chat_number>0">{{user_chat_number}}</span></li>
				</ul>
				<button @click="release(0)">发布询价</button>
				<button @click="release(1)">发布实单</button>
			</div>
			<div class="buy-right f-r">
				<div class="r-top d-f">
					<div class="search">
						<input type="text" placeholder="搜索型号" name="search" v-model="keywords">
						<button @click="search()">搜索</button>
					</div>
				</div>
				<div class="r-list">
					<!-- 全部列表 -->
					<table class="list-table all-list" v-if="state===0">
						<thead>
							<tr>
								<th>求购时间</th>
								<th>型号</th>
								<th>数量</th>
								<th>目标未税单价</th>
								<th>求购/实单</th>
							</tr>
						</thead>
						<tbody>
							<tr @click="toPay(item)" v-for="item of list" :key="item.Id">
								<td>{{item.time}}</td>
								<td>{{item.model}}</td>
								<td>{{item.number}}件</td>
								<td>{{item.untaxedprice}}</td>
								<td><button :class="{'on':item.type==='1'}">{{item.type|listType}}</button></td>
							</tr>
						</tbody>
					</table>
					<!-- 商机匹配 -->
					<table class="list-table match" v-if="state===1">
						<thead>
							<tr>
								<th>求购时间</th>
								<th>型号</th>
								<th>数量</th>
								<th>目标未税单价</th>
								<th>求购/实单</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="item of business" :key="item.Id" @click="toPay(item)">
								<td>{{item.time}}</td>
								<td>{{item.model}}</td>
								<td>{{item.number}}件</td>
								<td>{{item.untaxedprice}}</td>
								<td><button :class="{'on':item.type==='1'}">{{item.type|listType}}</button></td>
							</tr>
						</tbody>
					</table>
					<!-- 我的报价 -->
					<table class="list-table myprice" v-if="state===2">
						<thead>
							<tr>
								<th>求购时间</th>
								<th>型号</th>
								<th>数量</th>
								<th>目标未税单价</th>
								<th>求购/实单</th>
								<th>剩余时间</th>
								<th><button>已读/未读</button></th>
								<th>操作</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(item,index) of list" :key="item.Id" @click="showSellerChat($event,item,index)">
								<td>{{item.time}}</td>
								<td>{{item.model}}</td>
								<td>{{item.number}}件</td>
								<td>{{item.untaxedprice}}</td>
								<td class="on"><button :class="{'on':item.type==='1'}">{{item.type|listType}}</button><span v-if="item.chat_number">{{item.chat_number}}</span></td>
								<td>{{item.time|timeRemaining}}</td>
								<td><button class="read" @click="read($event,item.Id,2,index)" :disabled="item.chat_number<=0">已读</button></td>
								<td><button @click="showGrade($event,item.Id,index)" :disabled="item.evaluate==1">评价</button></td>
							</tr>
						</tbody>
					</table>
					<!-- 我的发布 -->
					<ul class="list-table myissue" v-if="state===3">
						<li class="up">
							<span>求购时间</span>
							<span>型号</span>
							<span>数量</span>
							<span>目标未税单价</span>
							<span>求购/实单</span>
							<span>已读/未读</span>
							<span>操作</span>
						</li>
						<li v-for="(item,index) of list" :key="item.Id"  class="iframe-li">
							<iframe class="iframe-myissue" :id="item.userid" :src="url+'/RongIM/HTML/myUpload.html?item='+JSON.stringify(item)+'&index='+index+'&closeUserid='+closeUserid"
							frameborder="0" @load="loaded"></iframe>
						</li>
					</ul>
					<p class="empty" v-if="(!list.length)&&(!isShowLoading)&&state!==1">暂无数据</p>
					<p class="empty" v-if="(!business.length)&&(!isShowLoading)&&state===1">暂无数据</p>
					<button class="more" @click="loadAllBuyList" v-if="(business.length)&&(!isShowLoading)&&state===1">点击加载更多商机</button>
					<p class="empty" v-if="isShowLoading">加载中...</p>
					<!-- 分页 -->
					<div class="page d-f">
						<AppPageComponent :count="count" :page="page" @eventpage="changePage"></AppPageComponent>
					</div>
				</div>
				<div class="grade-user-alert" v-if="isShowGradeUser">
					<div class="grade-alert-content">
						<select name="grade-user" id="grade-user" v-model="gradeUser">
							<option value="-1">请选择用户</option>
							<option v-for="(item,index) of gradeUserList" :key="index" :value="item.Id">{{item.username}}</option>
						</select>
						<div class="grade-btn-box">
							<button @click="selectGradeUser">确认</button>
							<button @click="isShowGradeUser=false">取消</button>
						</div>
					</div>
				</div>
				<BuyAlertComponent ref="alert" @addbuyevent="addBuy"></BuyAlertComponent>
				<BuyChatComponent ref="chat" :userInfo='chatItem' v-if="chatItem" :headImg="headImg" :userName="userName"></BuyChatComponent>
				<BuySellerChatComponent ref="sellerChat" v-if="sellerItem" :userInfo="sellerItem" :headImg="headImg" :userName="userName" :messageList="messageList"></BuySellerChatComponent>
				<AppAlertComponent ref="appalert"></AppAlertComponent>
				<BuyCharGradeComponent ref="grade" @grade="grade"></BuyCharGradeComponent>
				<BuyPayConfirmComponent ref="payconfirm"></BuyPayConfirmComponent>
			</div>
		</div>
	</div>
</template>

<script>
	const BuyAlertComponent=()=>import('./buy-alert.vue')
	const BuyChatComponent=()=>import('./buy-chat.vue')
	const BuySellerChatComponent=()=>import('./buy-seller-chat.vue')

	import service from '../services/service.js'
	import AppPageComponent from './app-page.vue'
	import AppAlertComponent from './app-alert.vue'
	import BuyCharGradeComponent from './buy-chat-grade.vue'
	import BuyPayConfirmComponent from './buy-pay-confirm.vue'

	var RongIMLib = require('../RongIMLib-2.5.3.min');
	var Protobuf = require('../protobuf-2.3.7.min');
	var RongIMClient = RongIMLib.RongIMClient
	RongIMClient.init('k51hidwqkvekb', null, {
		protobuf: Protobuf
	});
	export default{
		name:'buy-home',
		components:{
			BuyAlertComponent,
			BuyChatComponent,
			BuySellerChatComponent,
			AppPageComponent,
			AppAlertComponent,
			BuyCharGradeComponent,
			BuyPayConfirmComponent
		},
		watch:{iframeData: 'changeiframe'},
		data(){
			return {
				url:'https://login.asap-get.com',
				state:0,
				index:1,
				list:[],
				pay_chat_number:0,
				user_chat_number:0,
				count:0,
				page:0,
				keywords:'',
				isShowLoading:false,
                isShowGradeUser:false,
				ordid:'',
                params:{},
			//	我的报价聊天item
				sellerItem: null,
			//	我的发布聊天item
				chatItem: null,
			//	用户头像昵称
				headImg: '',
				userName: '',
				// 评价用户列表
				gradeUserList:[],
				gradeUser:-1,//一对多评价选择的用户
				nowGradeIndex:'',
				nowGradeOrderId:'',
				// iframe
				iframeData: null,
				// chart
				upList: [],
				myUploadChart: false,
				myUploadItem: null,
				closeUserid: '',
				jwt: sessionStorage.getItem('JWT'),
				user: sessionStorage.getItem('USER'),
				token: sessionStorage.getItem('TOKEN'),
				allMessage: {},
				messageList: [],
				sellerIndex: null,
				business:[],
				isShowBusiness:false,
			}
		},
		methods:{
			loaded() {
				let that = this;
				window.addEventListener("message", function(e) {
					that.iframeData = e.data
				});
			},
			changeiframe() {
				window.console.log('Iframe值变化，执行changeiframe')
				window.console.log(this.iframeData)
				let type = this.iframeData.type;
				let that = this
				switch (type) {
					case 1:
						that.myUploadItem = JSON.stringify(that.iframeData.item)
						that.myUploadChart = true
						break;
					case 'close':
						window.console.log(that.iframeData.id)
						that.closeUserid = that.iframeData.id
						window.console.log('关闭')
						that.myUploadChart = false
						that.myUploadItem = null
						that.state = null
						that.state = 3
						that.loadAllBuyList()
						break
					case 'addNum':
						that.user_chat_number += that.iframeData.num
						break
					case 'eval':
						that.getGradeUserList(that.iframeData.item.Id)
						break
					default:
						break;
				}
			},
			release(state){
				if(sessionStorage.getItem("USER")){
					this.$refs.alert.show(state);
				}else{
					this.$router.push({path:'/login'})
				}
			},
			getUserHeadName(){
				let formData = new FormData
				formData.append('phone', JSON.parse(sessionStorage.getItem('USER')).phone)
				formData.append('jwt', sessionStorage.getItem('JWT'))
				service.getUserInfo(formData).then((res)=>{
					if (res.status === 200){
						this.headImg = res.data.img;
						this.userName = res.data.name
					}
				})
			},
			showChat(e,item){
				this.chatItem = item

				let formdata = new FormData()
				formdata.append("jwt", sessionStorage.getItem("JWT"))
				formdata.append("Id", item.Id)
				formdata.append("uid", JSON.parse(sessionStorage.getItem("USER")).Id)
				formdata.append("type", item.type)
				service.getChatAlert(formdata).then((res) => {
					window.console.log(res)
				})
			},
			hideChat(){
				this.chatItem = null;
				window.console.log('12121')
			},
			showSellerChat(e,sellItem,index){
				let that = this
				e.stopPropagation()
				that.sellerIndex = index
				that.clearUnread(sellItem.userid)
				// this.getUserHeadName()
				// this.$refs.sellerChat.show();
				this.sellerItem = sellItem
				window.console.log(sellItem)
				if (!this.allMessage[this.sellerItem.userid]) {
					window.console.log('44444')
					this.messageList = []
					this.getMessage(this.sellerItem.userid)
				} else {
					window.console.log('333333')
					window.console.log(that.$refs)
					this.messageList = this.allMessage[this.sellerItem.userid]
					setTimeout(function() {
						that.$refs.sellerChat.scroll()
					}, 100)

				}
			},
			hideSellerChat(){
				this.sellerItem=null
			},
			toPay(item){
				if(sessionStorage.getItem("USER")){
					let jwt=sessionStorage.getItem("JWT")
					let user=JSON.parse(sessionStorage.getItem("USER"))
					this.$refs.payconfirm.show(1)
					window.open(`http://login.asap-get.com/lianzhi/index/Wtbalipay/wanttobuy?Id=${item.Id}&&uid=${user.Id}&&jwt=${jwt}`)
				}else{
					this.$router.push({path:'/login'})
				}
			},
			loadAllBuyList(){
				this.isShowLoading=true
				let formdata=new FormData()
				if(this.state!==1){
					formdata.append('page',this.index)
				}
				let jwt = sessionStorage.getItem("JWT")
				let user=JSON.parse(sessionStorage.getItem("USER"))
				formdata.append('jwt',jwt)
				formdata.append('uid',user.Id)
				if(this.state!==1){
					this.business=[]
				}
				if(this.state===1){
					formdata.append('wanttobuy',1)
					if(this.business.length){
						this.business.forEach((item,index)=>{
							formdata.append(`Id[${index}]`,item.Id)
						})
					}
				}
				if(this.state===2){
					formdata.append('pay',1)
				}
				if(this.state===3){
					formdata.append('uidtype',1)
				}
				formdata.append('model',this.keywords)
				this.list = []
				this.upList = []
				this.pay_chat_number = 0
				this.user_chat_number = 0
				service.showBuyList(formdata)
					.then((res)=>{
						window.console.log(res,this.state)
						if(res.data.code===200){
							this.isShowLoading=false
							
							this.count=res.data.count
							this.page=Math.ceil(this.count/15)
							if(this.state===1){
								if(!res.data.data.length){
									this.$refs.appalert.show("没有更多商机了")
									return
								}
								res.data.data.forEach(item=>{
									this.business.push(item)
								})
							}else{
								this.list=res.data.data
							}
						}else if(res.data.code===400){
							this.isShowLoading=false
						}
					})
					.catch(()=>{
						this.isShowLoading=false
					})
			},
			changePage(index){
				this.index=index
				this.loadAllBuyList()
			},
			search(){
				if(this.keywords){
					this.loadAllBuyList()
				}else{
					this.$refs.appalert.show("请输入型号",true)
				}
			},
			changeState(state){
				if(this.state!==state){
					this.list=[]
					this.state=state
					this.keywords=''
					this.count=0
					this.page=0
					this.loadAllBuyList()
				}
			},
			addBuy(params){
				let formdata = new FormData()
				let user = JSON.parse(sessionStorage.getItem("USER"))
				let jwt = sessionStorage.getItem("JWT")
				formdata.append('uid',user.Id)
				formdata.append('jwt',jwt)
				formdata.append('model',params.model)
				formdata.append('untaxedprice',params.untaxedprice)
				formdata.append('number',params.number)
				formdata.append('type',params.state===0?2:1)	
				service.addBuy(formdata).then((res)=>{
					if(res.data.code===200){
						this.$refs.appalert.show("发布成功")
						this.loadAllBuyList()
						if(this.state!==1){
							this.count+=1
							this.page=Math.ceil(this.count/15)
						}
					}
				})
			},
			read(e, item, index) {
				e.stopPropagation()
				let that = this
				that.sellerIndex = index
				that.clearUnread(item.userid)
			},
			clearUnread(userId) {
				let that = this
				var conversationType = RongIMLib.ConversationType.PRIVATE;
				var targetId = userId;
				RongIMClient.getInstance().clearUnreadCount(conversationType, targetId, {
					onSuccess: function() {
						window.console.log('清除指定会话(' + userId + ')未读消息数成功');
						that.pay_chat_number -= that.list[that.sellerIndex].chat_number
						that.list[that.sellerIndex].chat_number = 0
					},
					onError: function(error) {
						window.console.log('清除指定会话未读消息数失败', error);
					}
				});

			},
			showGrade(e,id,index){
				e.stopPropagation()
				this.nowGradeOrderId=id
				this.nowGradeIndex=index
				// this.gradeUser
				this.$refs.grade.show()
			},
			grade(index){
				window.console.log(index)
				let type=index>0?1:2
				let formdata = new FormData()
				formdata.append("jwt",sessionStorage.getItem("JWT"))
				formdata.append("type",type)
				formdata.append("number",index)
				formdata.append('Id',this.nowGradeOrderId)
				if(this.state===2){
					formdata.append("state",1)
					formdata.append("uid",JSON.parse(sessionStorage.getItem("USER")).Id)
				}
				if(this.state===3){
					formdata.append("state",2)
					formdata.append("uid",this.gradeUser)
				}
				
				service.charGrade(formdata).then((res)=>{
					if(res.data.code===200){
						this.$refs.appalert.show("评价成功")
						window.console.log(this.nowGradeIndex)
						this.$refs.grade.cancel()
						this.sellerItem=null
						if(this.list[this.nowGradeIndex]){
							this.list[this.nowGradeIndex].evaluate=1
						}
					}
				})
			},
			getGradeUserList(id){
				let formdata=new FormData()
				window.console.log(this.gradeUser)
				this.nowGradeOrderId=id
				formdata.append('Id',id)
				formdata.append('jwt',sessionStorage.getItem("JWT"))
				service.getGradeUser(formdata).then(res=>{
					this.gradeUserList=res.data.data
					this.isShowGradeUser=true
				})
			},
			selectGradeUser(){
				if(this.gradeUser!=-1){
					this.$refs.grade.show()
					this.isShowGradeUser=false
				}else{
					this.$refs.appalert.show("请选择用户",true)
				}
			},
			// ======== 融云client ========
			// 监听融云连接
			listenClient() {
				RongIMClient.setConnectionStatusListener({
					onChanged: function(status) {
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
				let that = this
				RongIMClient.setOnReceiveMessageListener({
					// 接收到的消息
					onReceived: function(message) {
						var messageContent = message.content;
						window.console.log('message', message)
						// 判断消息类型
						window.console.log('12212112')
						if (that.state == 2) {
							switch (message.messageType) {
								case RongIMClient.MessageType.TextMessage: // 文字消息
									window.console.log('文字内容', messageContent.content);
									// if (message.senderUserId === that.sellerItem.userid){

									// }else {

									// }
									window.console.log(that.sellerItem, message.senderUserId)
									if (that.allMessage[message.senderUserId]) {
										let dic = {
											time: that.getTime(message.sentTime),
											content: messageContent.content,
											userType: 2
										}
										that.allMessage[message.senderUserId].push(dic)
									}

									if (that.sellerItem !== null && that.sellerItem.userid === message.senderUserId) {
										// window.console.log('添加')
										that.clearUnread(that.sellerItem.userid)
										that.$refs.sellerChat.scroll()
										// let dic = {
										// 	time: that.getTime(message.sentTime),
										// 	content: messageContent.content,
										// 	userType: 2
										// }
										// that.messageList.push(dic)
									}
									for (var i = 0; i < that.list.length; i++) {
										if (message.senderUserId === that.list[i].userid) {
											that.list[i].chat_number += 1
											that.pay_chat_number += 1
											return
										}
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

					}
				});
			},
			// 连接融云
			client() {
				let that = this
				RongIMClient.connect(that.token, {
					onSuccess: function(userId) {
						window.console.log('连接成功, 用户 id 为', userId);
					},
					onTokenIncorrect: function() {
						window.console.log('连接失败, 失败原因: token 无效');
					},
					onError: function(errorCode) {
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
			// 获取报价总未读数
			getOfferUnread() {
				let that = this
				RongIMClient.getInstance().getTotalUnreadCount({
					onSuccess: function(count) {
						window.console.log('获取所有会话未读消息数成功', count);
						that.pay_chat_number = count
					},
					onError: function(error) {
						window.console.log('获取所有会话未读消息数失败', error);
					}
				});
			},
			// 获取报价单个未读数
			getOneUnread() {
				let that = this
				// window.console.log('list', list)
				for (var i = 0; i < that.list.length; i++) {
					(function(index) {
						let item = that.list[index]
						var conversationType = RongIMLib.ConversationType.PRIVATE;
						var targetId = item.userid;
						RongIMLib.RongIMClient.getInstance().getUnreadCount(conversationType, targetId, {
							onSuccess: function(count) {
								window.console.log('获取指定会话未读消息数成功', count);
								that.list[index].chat_number = count
								window.console.log(that.list)
							},
							onError: function(error) {
								window.console.log('获取指定会话未读消息数失败', error);
							}
						});
					})(i)

				}
			},
			// 格式化时间
			getTime(time) {
				// window.console.log(time)
				let date = new Date(time);
				let now = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				let year1 = now.getFullYear();
				let month1 = now.getMonth() + 1;
				let day1 = now.getDate();
				let hour = date.getHours();
				let minute = date.getMinutes();
				// window.console.log(hour + ':' + minute)
				let str1;
				if (hour < 6) {
					str1 = '凌晨'
				} else if (hour < 12) {
					str1 = '上午 '
				} else if (hour < 17) {
					str1 = '下午'
				} else {
					str1 = '晚上'
				}
				if (hour > 12) {
					hour -= 12
				}
				// window.console.log(hour + ':' + minute)
				if (year === year1 && month === month1 && day === day1) {
					// window.console.log('2   ',hour + ':' + minute)
					if (hour < 10) {
						hour = '0' + hour
					}
					// window.console.log('2   ',hour + ':' + minute)
					if (minute < 10) {
						minute = '0' + minute
					}
					// window.console.log(str1 + ' ' + hour + ':' + minute)
					return str1 + ' ' + hour + ':' + minute
				} else {
					if (month < 10) {
						month = '0' + month
					}
					if (day < 10) {
						day = '0' + month
					}
					if (hour < 10) {
						hour = '0' + month
					}
					if (minute < 10) {
						minute = '0' + minute
					}
					window.console.log(year + '年' + month + '月' + day + '日 ' + str1 + ' ' + hour + ':' + minute)
					return year + '年' + month + '月' + day + '日 ' + str1 + ' ' + hour + ':' + minute
				}
			},
			// 获取报价聊天记录
			getMessage(userId) {
				var conversationType = RongIMLib.ConversationType.PRIVATE;
				var targetId = userId;
				var timestrap = null; // 默认传 null, 若从头开始获取历史消息, 请赋值为 0
				var count = 20;
				let that = this
				RongIMLib.RongIMClient.getInstance().getHistoryMessages(conversationType, targetId, timestrap, count, {
					onSuccess: function(list, hasMsg) {
						/* 
						list: 获取的历史消息列表
						hasMsg: 是否还有历史消息可以获取
						*/
						window.console.log('获取历史消息成功', list);
						let ls = []
						for (var i = 0; i < list.length; i++) {
							(function(index) {
								let item = list[index]
								let dic = {
									time: that.getTime(item.sentTime),
									content: item.content.content,
									userType: item.messageDirection
								}
								ls.push(dic)
							})(i)
						}
						if (that.allMessage[userId]){
							that.allMessage[userId] = ls.concat(that.allMessage[userId])
						}else {
							that.allMessage[userId] = ls
						}
						that.$store.commit('changeAll', that.allMessage)
						that.messageList = ls
						that.$refs.sellerChat.scroll()
						window.console.log(that.$refs)
						// window.console.log(that.allMessage)
						window.console.log('hasmag', hasMsg)
					},
					onError: function(error) {
						// 请排查：单群聊消息云存储是否开通
						window.console.log('获取历史消息失败', error);
					}
				});
			},
			//发送信息
			setMessage(str) {
				let that = this;
				var msg = new RongIMLib.TextMessage({
					content: str,
					extra: '附加信息'
				});
				var conversationType = RongIMLib.ConversationType.PRIVATE;
				var targetId = that.sellerItem.userid; // 目标 Id
				window.console.log(targetId)
				RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
					onSuccess: function(message) {
						// message 为发送的消息对象并且包含服务器返回的消息唯一 id 和发送消息时间戳
						window.console.log('发送文本消息成功', message);
						let dic = {
							time: that.getTime(new Date().getTime()),
							content: str,
							userType: 1
						};
						that.messageList.push(dic)
						that.$refs.sellerChat.scroll()
						that.clearUnread(that.sellerItem.userid)
						// that.$refs.box.scrollTop = that.$refs.box.scrollHeight
					},
					onError: function(errorCode) {
						window.console.log('发送文本消息失败', errorCode);
					}
				});
			},
		},
		filters:{
			listType(value){
				return value==='1'?"查看实单":"查看询价"
			},
			time(value){
				return value.substring(0,10)
			},
			timeRemaining(value){
				let date1=(new Date(value)).getTime()
				let date2=date1+10*1000*86400-(new Date()).getTime()

				let days = date2 / 1000 / 60 / 60 / 24;
				let daysRound = Math.floor(days);
				let hours = date2 / 1000 / 60 / 60 - (24 * daysRound);
				let hoursRound = Math.floor(hours);
				let minutes = date2 / 1000 / 60 - (24 * 60 * daysRound) - (60 * hoursRound);
				let minutesRound = Math.floor(minutes)
				return daysRound + '天'+hoursRound + '时'+minutesRound + '分'
			}
		},
		created(){
			window.console.log(this)
			this.allMessage = this.$store.state.allMessage
			this.loadAllBuyList(1);
			if(this.list.length){
				this.isShowBusiness=true
			}
			this.loadAllBuyList();
			this.getUserHeadName()
			this.listenClient()
			this.listenMessage()
			window.console.log('12121212')
			window.console.log(RongIMClient.getInstance().getCurrentConnectionStatus())
			// if (RongIMClient.getInstance().getCurrentConnectionStatus() == 0){
			// 	RongIMClient.getInstance().disconnect();
			// 	RongIMClient.getInstance().logout();
			// 	let _this = this
			// 	setTimeout(() => {
			// 		_this.client()
			// 	}, 500)
				
			// }else {
				this.client()
			// }
			window.console.log(this.allMessage)
			
			if (this.$route.query.data){
				this.sellerIndex = 0
				this.state = 2
				this.loadAllBuyList()
				this.sellerItem = this.$route.query.data
				this.getMessage(this.sellerItem.userid)
			}
		},
		destroyed(){
			RongIMClient.getInstance().disconnect();
			// RongIMClient.getInstance().logout();
		}
	}
</script>

<style scoped>
	.up span {
		width: calc(100%/7) !important;
	}
	.chart-warpper {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background-color: #000;
		z-index: 1000;
	}
	
	iframe {
		width: 100%;
		height: 100%;
		cursor: pointer;
	}
	.iframe-myissue{
		height: auto;
	}
	
	.iframe-li {
		height: 113px;
	}
	#buy-home{
		padding-top:248px;
		background-color: #e7e4e3;
	}
	.center-box{
		padding-bottom:40px;
		background-color: #fff;
		border-radius: 5px;
	}
	/* 左侧导航 */
	.buy-left{
		width: 250px;
	}
	.buy-left>h3{
		margin-bottom:10px;
		border-bottom:1px solid #f6b243;
		font-size: 20px;
		color:#f6b243;
		line-height: 90px;
		text-align: center;
	}
	.buy-left .buy-nav li{
		position: relative;
		flex-direction: column;
		height: 68px;
		font-size: 20px;
		font-weight: 200;
		text-align: center;
		cursor: pointer;
		justify-content: space-around
	}
	.buy-left .buy-nav li.on{
		background-color: #fdf0d9;
	}
	.buy-left .buy-nav li.active span{
		display: block;
		position: absolute;
		right:80px;
		top:20px;
		width: 15px;
		height: 15px;
		background-color: red;
		border-radius: 50%;
		font-size: 12px;
		color:#fff;
		line-height: 15px;
		text-align: center;
	}
	.buy-left .buy-nav li.on::before{
		content:"";
		display: block;
		position: absolute;
		top:0;
		left:0;
		width: 10px;
		height: 100%;
		background-color: #f6b243;
	}
	.buy-left>button{
		display: block;
		width: 216px;
		height: 100px;
		margin:30px auto 0;
		border-radius: 5px;
		font-size: 20px;
		color:#fff;
	}
	.buy-left>button:nth-child(3){
		background-color: #f6b243;
	}
	.buy-left>button:nth-child(4){
		background-color: #f17f3a;
	}
	/* 右半边列表 */
	.buy-right{
		width: 870px;
	}
	.buy-right .r-top{
		height: 95px;
		margin-bottom:35px;
		border-bottom:1px solid #8b8b8d;
		align-items: center;
	}
	.r-top .search input{
		width: 200px;
		height: 30px;
		margin-right:10px;
		background-color: #f8f6f4;
		border-radius: 5px;
		font-size: 12px;
		text-indent: 10px;
	}
	.r-top .search button{
		width: 60px;
		height: 30px;
		background-color: #f6b243;
		border-radius: 5px;
		color:#fff;
	}
	
	/* 列表 */
	table th{
		padding-bottom:10px;
		font-weight: normal;
	}
	table tr{
		cursor: pointer;
	}
	table:not([class="list-table myissue"]) tbody tr:hover{
		background-color: #fdf0d9;
	}
	.r-list>table,
	.r-list>ul{
		width: 100%;
		margin-bottom:30px;
		border-collapse: collapse;
		text-align: center;
	}
	.r-list>table td{
		height: 90px;
		border-bottom:1px solid #8b8b8d;
	}
	.r-list>table td>button:not([class='read']){
		width: 80px;
		height: 30px;
		color:#fff;
		background-color: #f6b243;
		border-radius: 5px;
	}
	/* 我的发布 */
	tbody td{
		width: 110px;
	}
	.myissue li span{
		display: inline-block;
		width: 120px;
		line-height: 92px;
		text-align: center;
	}
	.myissue li:nth-child(1) span{
		line-height: 0;
	}
	.myissue li{
		cursor: pointer;
	}
	.myissue li p.num{
		height: 30px;
		padding-right:50px;
		text-align: right;
	}
	.myissue li:nth-child(2n+3){
		background-color: #fff4e3;
	}
	.myissue li .txt>button,
	.myprice button.read{
		width: 120px;
		background-color: transparent;
		color:#f17f3a
	}
	.myissue li>button{
		width: 120px;
	}
	.myissue li span>button{
		width: 80px;
		height: 30px;
		color:#fff;
		background-color: #f6b243;
		border-radius: 5px;
	}
	#buy-home button:disabled{
		color:#ccc;
		cursor: no-drop
	}
	
	p.empty,
	button.more{
        margin:20px 0;
		text-align: center;
	}
	button.more{
		display: block;
		margin: 0 auto;
		cursor: pointer;
	}
	div.page{
		margin-right:30px;
		flex-direction: row-reverse
	}
	/* 评价列表 */
    .grade-user-alert{
        position: fixed;
        top:0;
        left:0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.6);
        z-index: 999;
    }
    .grade-user-alert .grade-alert-content{
        position: absolute;
        overflow: hidden;
        top:50%;
        left:0;
        right:0;
        width: 300px;
        height: 200px;
        margin:0 auto;
        background-color: #fff;
        border-radius: 10px;
        text-align: center;
        transform: translateY(-50%)
    }
	.grade-alert-content select{
		width: 80%;
		height: 42px;
		margin:30px;
		border-radius: 5px;
	}
	.grade-alert-content .grade-btn-box{
		text-align: center
	}
	.grade-alert-content button{
		width: 40%;
		height: 42px;
		background-color: #fff;
		border:1px solid #ccc;
		border-radius: 5px;
		font-size: 20px;
	}
	.grade-alert-content button:nth-child(1){
		margin-right:10px;
		background-color: #f6b243;
		border:none;
		color:#fff;
	}

	td.on,
	span.on{
		position: relative;
	}
	td.on span,
	span.on span{
		position: absolute;
		display:block;
		top:26px;
		right:37px;
		width: 14px;
		height: 14px;
		background-color: red;
		border-radius: 50%;
		font-size: 12px;
		color:#fff;
		line-height: 14px;
		text-align: center;
	}
	#buy-home button.on{
		background-color: #f17f3a;
	}
	.type-color{
		color:#f17f3a;
	}
	p.nav-introduce{
		font-size: 12px;
		color:#888
	}
</style>
