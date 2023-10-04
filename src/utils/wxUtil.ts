/**
 * 微信授权获取code
 */
export const getWxCode = (backUrl) => {
	if (!backUrl) {
		// alert('请传入回调地址或当前对象')
		console.log('返回true');
		return true
	} else if (!backUrl) {
		console.log('没有backurl');
		backUrl = document.location.href
	}
	// let jump = params.jump || true // 是否直接跳转 true:是 false:否，返回地址
	// let appid = 'wx544de22ce774da9a'//品多省
	let appid = 'wx544de22ce774da9a'//品多省
	backUrl = encodeURIComponent(backUrl)
	let url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + backUrl + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
	window.location.href = url

}
/**
 * 微信小程序授权获取 code
 */
export const getAppletCode = () => {
	return new Promise((resolve, reject) => {
		wx.login({
			success: (res) => {
				if (res.code) {
					// uni.showToast({
					// 	title: res.code,
					// 	icon: 'none'
					// })
					console.log('获取成功', res.code);
					resolve(res.code); // 将 code 传递给 Promise 的 resolve 函数
				} else {
					reject(new Error('登录失败！' + res.errMsg));
				}
			},
			fail: (error) => {
				reject(error);
			}
		});
	});
};