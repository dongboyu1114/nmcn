<template>
	<view class="login">
		<view class="content-wrapper">
			<view class="title">
				<h1>纳米采暖</h1>
			</view>
			<view class="login-form">
				<view class="login-form-items">
					<view class="login-form-items-title">手机号</view>
					<input type="text" class="login-input" placeholder="手机号" />
				</view>

				<view class="login-form-items">
					<view class="login-form-items-title">登录密码</view>
					<input :type="pwd_show?'text':'password'" class="login-input" placeholder="请输入登录密码" />
					<image class="password_img" @click="change_pwd" style="width: 50px; height: 30px;"
						:src="pwd_show? '/static/show_pswd.png':'/static/no_pswd.png'"></image>
				</view>

				<view class="login-form-items">
					<view class="login-form-items-title">验证码</view>
					<input type="text" class="login-input" placeholder="请输入验证码" />
					<view class="captcha-wrapper">
						<image class="img_code" src="/static/code.png"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="submit-wrapper">
			<button style="background-color: aqua;" type="primary" class="login-btn" @click="handleClick">登录</button>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
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
	//点击事件
	let pwd_show = ref(false)
	const change_pwd = () => {
		pwd_show.value = !pwd_show.value;
	};
	const handleClick = () => {
		uni.redirectTo({
			url: '/pages/register/index'
		});
	};
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
			handleClick()
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

<style lang="scss">
	page {
		background: #F4F5F6;
	}

	.img_code {
		width: 60px;
		height: 30px;
	}

	.login {
		.content-wrapper {
			width: 100%;

			.title {
				margin-top: 35rpx;
				width: 100%;
				margin-bottom: 10px;

				h1 {
					border: 0px;
					width: 60%;
					margin: 0 auto;
					text-align: center;
					border-bottom: 1px solid #E3E3E3;
					height: 50px;
					line-height: 50px;
					font-size: 17px;
					overflow: hidden;
					font-weight: 400;
				}
			}

			.login-form {
				margin: 20px 10px 20px 15px;
				background: #FFFFFF;

				.login-form-items {
					padding: 15px 10px;
					border-bottom: 1px solid #F3F4F5;
					position: relative;
					display: -webkit-flex;
					display: flex;

					.login-form-items-title {
						width: 30%;
						line-height: 22px;
						height: 22px;
						flex-shrink: 0;
					}

					.login-input {
						width: 100%
					}

				}
			}
		}

		.submit-wrapper {
			padding: 10px;
			padding-top: 10px;
			background-color: 11ffff;
		}

	}
</style>