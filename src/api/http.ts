import axios from 'axios'
import { isWeixinH5, isApp, isApplet } from '@/utils/util'
import { getFullURL } from '@/utils/http'
import { useStore } from '@/store/index'
import { AUTH_SOURCE, TOKENNAME, SHOP_NO_FROM } from '@/config/app'
const getHeaders = (header : any) => {
	const store = useStore()
	const token = store.state.app.token
	// const userAgentSt = userAgent()
	if (token && token !== 'null') header[TOKENNAME] = token
	// if (userAgent && userAgent.length > 0) header[USER_AGENT] = userAgentSt
	let authSource = 'MINI' // 默认为 H5

	switch (true) {
		case isWeixinH5():
			authSource = 'MP' // 微信公众号
			break
		case isApp():
			authSource = 'MINI' // APP
			break
		case isApplet():
			authSource = 'MINI' // 微信小程序
			break
		// 可以根据需要添加其他条件
		default:
			authSource = 'MINI'
			break
	}

	header[AUTH_SOURCE] = authSource
	header[SHOP_NO_FROM] = 22090070
	return header
}

const instance = axios.create({
	// Web 侧可以通过 vite.config.js 中的 proxy 配置，指定代理
	// 小程序APP里需写完整路径，如 https://service-rbji0bev-1256505457.cd.apigw.tencentcs.com/release
	// 可使用条件编译,详见 https://uniapp.dcloud.io/tutorial/platform.html#preprocessor
	// #ifdef H5
	baseURL: import.meta.env.VITE_APP_AXIOS_BASE_URL,
	// #endif
	// #ifndef H5
	// @ts-ignore
	baseURL: 'https://api.kunkunyun.cn/api.v1/front',
	// #endif
	adapter(config) {
		const { url, method, data, params, headers, baseURL, paramsSerializer } =
			config
		return new Promise((resolve, reject) => {
			uni.request({
				method: method!.toUpperCase() as any,
				url: getFullURL(baseURL || '', url!, params, paramsSerializer),
				header: getHeaders(headers),
				data,
				dataType: 'json',
				responseType: config.responseType,
				success: (res : any) => {
					resolve(res)
				},
				fail: (err : any) => {
					reject(err)
				}
			})
		})
	}
})

/**
 * 请求拦截
 */
instance.interceptors.request.use((config) => {
	const { method, params } = config
	// 附带鉴权的token
	const headers : any = {
		token: uni.getStorageSync('token')
	}
	// 不缓存get请求
	if (method === 'get') {
		headers['Cache-Control'] = 'no-cache'
	}
	// delete请求参数放入body中
	if (method === 'delete') {
		headers['Content-type'] = 'application/json;'
		Object.assign(config, {
			data: params,
			params: {}
		})
	}

	return {
		...config,
		headers
	}
})

/**
 * 响应拦截
 */
instance.interceptors.response.use((v) => {
	if (v.data?.code === 401) {
		uni.removeStorageSync('token')
		// alert('即将跳转登录页。。。', '登录过期')
		// setTimeout(redirectHome, 1500)
		return v.data
	}

	// @ts-ignore
	if ((v.status || v.statusCode) === 200) {
		return v.data
	}
	// alert(v.statusText, '网络错误')
	return Promise.reject(v)
})

export default instance