import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		allMessage: {}
	},
	mutations:{
		addOne(state,message){
			state.allMessage.push(message)
		},
		changeAll(state, allMessage){
			state.allMessage = allMessage
		}
	}
})
export default store