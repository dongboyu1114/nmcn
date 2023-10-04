/**
 * opt  object | string
 * to_url object | string
 * 例:
 * this.Tips('/pages/test/test'); 跳转不提示
 * this.Tips({title:'提示'},'/pages/test/test'); 提示并跳转
 * this.Tips({title:'提示'},{tab:1,url:'/pages/index/index'}); 提示并跳转值table上
 * tab=1 一定时间后跳转至 table上
 * tab=2 一定时间后跳转至非 table上
 * tab=3 一定时间后返回上页面
 * tab=4 关闭所有页面跳转至非table上
 * tab=5 关闭当前页面跳转至table上
 */
export const Tips = function (opt : { title ?: any; icon ?: any; endtime ?: any; success ?: any }, to_url ?: string | { () : any; tab : number; url : string } | undefined) {
	if (typeof opt == 'string') {
		to_url = opt
		opt = {}
	}
	const title = opt.title || '',
		icon = opt.icon || 'none',
		endtime = opt.endtime || 2000,
		success = opt.success
	if (title)
		uni.showToast({
			title: title,
			icon: icon,
			duration: endtime,
			success,
		})
	if (to_url != undefined) {
		if (typeof to_url == 'object') {
			const tab = to_url.tab || 1,
				url = to_url.url || ''
			switch (tab) {
				case 1:
					// 一定时间后跳转至 table
					setTimeout(function () {
						uni.switchTab({
							url: url,
						})
					}, endtime)
					break
				case 2:
					// 跳转至非table页面
					setTimeout(function () {
						uni.navigateTo({
							url: url,
						})
					}, endtime)
					break
				case 3:
					// 返回上页面
					setTimeout(function () {
						// #ifndef H5
						uni.navigateBack({
							delta: parseInt(url),
						})
						// #endif
						// #ifdef H5
						history.back()
						// #endif
					}, endtime)
					break
				case 4:
					// 关闭当前所有页面跳转至非table页面
					setTimeout(function () {
						uni.reLaunch({
							url: url,
						})
					}, endtime)
					break
				case 5:
					// 关闭当前页面跳转至非table页面
					setTimeout(function () {
						uni.redirectTo({
							url: url,
						})
					}, endtime)
					break
			}
		} else if (typeof to_url == 'function') {
			setTimeout(function () {
				to_url && to_url()
			}, endtime)
		} else {
			// 没有提示时跳转不延迟
			setTimeout(
				function () {
					uni.navigateTo({
						url: to_url,
					})
				},
				title ? endtime : 0
			)
		}
	}
}

/**
 * 判断是否在微信
 */
export const isWeixinH5 = function () {
	// 判断是否在微信中打开
	if (typeof WeixinJSBridge === 'object' && typeof WeixinJSBridge.invoke === 'function') {
		return true
	}
	return false

}

/**
 * 判断是否在微信小程序环境下
 */
export const isApplet = function () {
	if (typeof uni !== 'undefined' && uni.getSystemInfoSync) {
		const systemInfo = uni.getSystemInfoSync()
		return systemInfo.platform === 'mp-weixin'
		// return true
	}
	return false
}

/**
 * 判断是否在App环境下
 */
export const isApp = function () {
	// 如果是在uni-app中运行
	if (typeof uni !== 'undefined' && uni.getSystemInfoSync) {
		const systemInfo = uni.getSystemInfoSync()
		// 根据系统信息的 platform 字段来判断是否在App环境下
		return systemInfo.platform === 'android' || systemInfo.platform === 'ios'
	}
	// 如果不是在uni-app中运行，默认返回false
	return false
}

/**
 * 获取userAgent
 */
export const userAgent = function () {
	return window.navigator.userAgent.toLowerCase()
}

export const getUrlParam = (key : string) => {
	const reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)')
	const r = window.location.search.substr(1).match(reg)
	if (r != null) return unescape(r[2])
	return null
}

/**
 * 打电话
 */
export const telCall = (tel : string) => {
	if (!tel) {
		return
	}
	uni.makePhoneCall({
		phoneNumber: tel
	})
}

/**
 * 对象拷贝赋值，防止指针形式的
 */
export const objCopy = (obj : { getStatus ?: boolean; total ?: number; integral ?: number; returnCash ?: number; allOriginPrice ?: string; allDiscountPrice ?: number; allDiscountPriceIntegerPart ?: number; allDiscountPriceFloatPart ?: string; allPreferentialPrice ?: number; datas ?: {}; already ?: { total : number; list : never[] }; not ?: { total : number; list : never[] } }) => {
	return JSON.parse(JSON.stringify(obj))
}

/**
 * 检测手机号是否可用
 */
export const checkPhone = (val : string) => {
	let reg = /^1[0-9]{10}/
	if (val && reg.test(val)) {
		return true
	} else {
		return false
	}
}

// 检测验证码是否可用
export const checkCode = (val : string | any[]) => {
	if (val && val.length === 6) {
		return true
	} else {
		return false
	}
}

/**
 * 处理价格，还未验证
 */
const priceHandle = (val : string) => {
	// 先清除字符串中的所有非(数字和小数点)的字符。
	val = `${val}`.replace(/[^\d.]/g, '')

	// 处理0开头的问题
	if (val.length > 1) {
		val = val.replace(/^0+/, '')
		val = val.length === 0 ? '0' : val
	}
	if (val.startsWith('.')) {
		val = '0' + val
	}

	// 处理只有两位小数的问题
	const dotIndex = val.indexOf('.')
	if (dotIndex > 0 && dotIndex < val.length - 3) {
		val = val.substring(0, dotIndex + 3)
	}
	return val
}

/**
 * 将小数以小数点分割
 */
export const decimalSplit = (num : string | undefined) => {
	const ret = { int: '', float: '' }
	if (num === '' || num === undefined) {
		return ret
	}
	if (typeof num === 'number') {
		num = num.toString()
	}
	let backData = num.split('.')
	ret.int = backData[0] === undefined ? '' : backData[0]
	ret.float = backData[1] === undefined ? '' : backData[1]
	return ret
}

// 摘取对象某些字段
export const objFieldsOut = (obj : Object, fields : Array<String>, par ?: { fieldTo ?: any; defaultVal ?: any }) => {
	par = par || {}
	const backObj = {}
	const fieldTo = par.fieldTo || '' // obj,获取的fields字段中某个字段对应的obj中的哪个字段，一般两个字段不一样时用；例：{a:a1,c:c1}
	const defaultVal = par.defaultVal || '' // obj,obj中字段没有定义这个字段时，默认给的值。例：{a:'124'}
	if (!obj || !fields || fields.length <= 0) {
		return backObj
	}
	for (let i = 0; i < fields.length; i++) {
		const fieldApoint = fields[i]
		let key = fieldApoint
		if (fieldTo && fieldTo[fieldApoint] !== undefined) {
			key = fieldTo[fieldApoint]
		}
		if (obj[key] === undefined) {
			// 没有这个字段
			if (defaultVal && defaultVal[fieldApoint] !== undefined) {
				backObj[fieldApoint] = defaultVal[fieldApoint]
			}
		} else {
			// 有这个字段
			backObj[fieldApoint] = obj[key]
		}
	}
	return backObj
}