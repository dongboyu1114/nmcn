// store/index.ts
import { createStore } from 'vuex'

export default createStore({
	state: {
		loggedIn: false, // 用户登录状态
		token: '', // 用户登录凭证
	},
	mutations: {
		SET_LOGIN(state, loggedIn) {
			state.loggedIn = loggedIn
		},
		SET_TOKEN(state, token) {
			state.token = token
		},
	},
	actions: {
		// 可以在这里定义登录和登出的操作
		login({ commit }, token) {
			commit('SET_LOGIN', true)
			commit('SET_TOKEN', token)
		},
		logout({ commit }) {
			commit('SET_LOGIN', false)
			commit('SET_TOKEN', '')
		},
	},
	getters: {
		// 可以在这里定义获取登录状态和token的getter
		isLoggedIn: (state) => state.loggedIn,
		getToken: (state) => state.token,
	},
})