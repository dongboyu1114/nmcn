<template>
	<view class="layout">
	</view>
</template>

<script setup>
	import {
		sendAuthCodeToBackend,
		getAllDataFromNami
	} from '@/api/modules/user'
	import {
		store
	} from '@/store'
	import {
		isWeixinH5,
		isApplet,
		isApp
	} from '@/utils/util'
	import {
		getAppletCode,
		getWxCode
	} from '@/utils/wxUtil'
	import {
		tokenAvailable
	} from '@/utils/userUtil'
	import {
		//onLaunch,
		onLoad
	} from '@dcloudio/uni-app'
	onLoad((options) => {
		// code.value = options?.code || ''
		// console.log(options)
		// alert(code)
		loginCheckNow()
	})
	// 微信登录处理
	const loginCheckNow = async () => {
		if (isWeixinH5()) {
			const urlParams = new URLSearchParams(window.location.search)
			const code = urlParams.get('code')
			if (!tokenAvailable()) {
				console.log('登陆检查');
				if (!code) {
					console.log('111不通过')
					getWxCode(window.location.href)
					return
				} else {
					// console.log('TOKEN NODATE AND CODE IS EXI')
					console.log('有code')
					getData(code)
					return
				}

			} else {
				uni.redirectTo({
					url: '/pages/gift/index'
				});
			}
		} else if (isApplet()) {
			if (tokenAvailable()) {

				uni.redirectTo({
					url: '/pages/gift/index'
				});
			} else {
				try {
					const code = await getAppletCode(); // 获取小程序code
					getData(code); // 将小程序code传递给getData函数
				} catch (error) {
					console.error('获取小程序code失败:', error);
				}
			}
		} else if (isApp()) {
			console.log('登陆检查aaa');
		} else {
			console.error('不在微信环境下');
			// 在不在微信环境下的处理逻辑
		}
	};


	// 向后台传递 code
	const getData = async (code) => {
		const param = {
			authAccount: code,
			authType: 'wxMp',
			authPassword: '11111'
		}
		console.log('登陆检查BBB');
		const result = await sendAuthCodeToBackend(param)
		if (result.code == 200) {
			store.commit('SET_TOKEN', result.data.accessToken) // 存储到本地缓存
			if (result.data.loginState == 100) {
				console.log('进入提交节目界面');
				uni.setStorageSync('isLogin', true) // 设置登录状态
				const newUrl = '/pages/register/index'; // 新的页面路径
				uni.redirectTo({ // 使用 uni.redirectTo 来替换页面
					url: '/pages/register/index'
				})
			} else {
				console.log('进入登录界面');
				uni.navigateTo({ // 使用 uni.navigateTo 进入登录页面
					url: '/pages/register/index'
				})
			}
		} else {
			uni.showToast({
				title: result.message,
				icon: 'none'
			})
		}
	}
</script>