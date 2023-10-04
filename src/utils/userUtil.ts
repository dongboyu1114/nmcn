import { useStore } from '@/store'
import { AppMutationTypes } from '@/store/modules/app/mutation-types'
import { isWeixinH5 } from '@/utils/util'

const store = useStore()

/**
 * 判断用户是否已经登录
 */
export const isLogin = () => {
	// return true
	return store.state.app.isLogin
}

export const logout = (token : any) => {
	store.commit(AppMutationTypes.SET_TOKEN, token)
	store.commit(AppMutationTypes.IS_LOGIN, false)
}

/**
 * 未登录跳转到登录页
 */
export const jumpLogin = () => {
	if (isWeixinH5()) {
		uni.navigateTo({ // 使用 uni.navigateTo 进入登录页面
			url: '/pages/index/index'
		})
	} else {
		uni.navigateTo({ // 使用 uni.navigateTo 进入登录页面
			url: '/pages/index/index'
		})
	}
}

/**
 * 未登录跳转到登录页
 */
export const tokenAvailable = () => {
	// console.log((new Date()).getTime())
	// console.log((uni.getStorageSync('tokenTime') ? parseInt(uni.getStorageSync('tokenTime')) : 0))
	// console.log(20 * 24 * 60 * 60 * 1000)
	return store.state.app.token && ((new Date()).getTime() - (uni.getStorageSync('tokenTime') ? parseInt(uni.getStorageSync('tokenTime')) : 0) < 20 * 24 * 60 * 60 * 1000)
	// return store.state.app.token
}