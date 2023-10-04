<template>
	<view class="subForm">

		<u-form :model="form" ref="form1">
			<u-form-item required label="姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名" prop="nickName" label-width="160rpx">
				<u-input v-model.trim="form.nickName" placeholder="请输入姓名" />
			</u-form-item>
			<u-form-item required label="手&nbsp;机&nbsp;号" prop="mobile" label-width="160rpx">
				<u-input v-model.trim="form.mobile" placeholder="请输入手机号" />
			</u-form-item>
			<u-form-item required label="收货地址" prop="address" label-width="160rpx">
				<u-input v-model.trim="form.address" placeholder="请输入收货地址" />
			</u-form-item>
			<u-form-item required label="生&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日" prop="birthday" label-width="160rpx">
				<u-picker v-model="birthdayShow" mode="time" @confirm="getBirthday"></u-picker>
				<u-input v-model.trim="form.birthday" type="select" @click="birthdayShow = true" placeholder="请选择生日" />
			</u-form-item>
			<u-form-item required label="楼&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;盘" prop="loupan" label-width="160rpx">
				<u-select v-model="loupanShow" mode="single-column" :list="loupanList" @confirm="getLoupan"></u-select>
				<u-input v-model.trim="form.loupan" type="select" placeholder="请选择楼盘" @click="loupanShow = true" />
			</u-form-item>
		</u-form>
		<u-button @click="submit" type="error" shape="circle">提交</u-button>
	</view>
</template>

<script>
	import {
		ref
	} from 'vue';
	import {
		sendDataToBackend
	} from '@/api/modules/user';
	export default {
		data() {
			return {
				form: {
					nickName: '',
					mobile: '',
					address: '',
					birthday: '',
					loupan: ''
				},
				loupanList: [{
						key: 1,
						label: '万科森林公园',
						value: '万科森林公园',
						score: 3000
					},
					{
						key: 2,
						label: '万科璞悦湾',
						value: '万科璞悦湾',
						score: 3000
					},
					{
						key: 3,
						label: '金地峯范',
						value: '金地峯范',
						score: 3000
					},
					{
						key: 4,
						label: '嘉圣达印湘山',
						value: '嘉圣达印湘山',
						score: 3000
					},
					{
						key: 5,
						label: '其他楼盘',
						value: '其他楼盘',
						score: 3000
					}
				],
				rules: {
					nickName: [{
						required: true,
						message: '姓名不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur']
					}],
					mobile: [{
						required: true,
						message: '手机号码无效',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
						validator: this.validateMobile,
					}],
					birthday: [{
						required: true,
						message: '请选择生日',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur']
					}],
					address: [{
						required: true,
						message: '收货地址不能为空',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur']
					}],
					loupan: [{
						required: true,
						message: '请选择楼盘',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur']
					}],
				},
				params: {
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false,
					second: false
				},
				birthdayShow: false,
				loupanShow: false,
			};
		},

		methods: {
			async submit() {
				// 创建一个Promise包装的validate方法
				const validatePromise = () => {
					return new Promise((resolve) => {
						this.$refs.form1.validate((valid) => {
							resolve(valid);
						});
					});
				};

				const isValid = await validatePromise(); // 等待验证结果

				if (isValid) {
					try {
						const selectedLabel = this.form.loupan;

						// 在loupanList中查找所选楼盘的key和score
						const selectedLoupan = this.loupanList.find((item) => item.label === selectedLabel);

						const dataToSend = {
							nickName: this.form.nickName,
							mobile: this.form.mobile,
							address: this.form.address,
							birthday: this.form.birthday,
							loupan: selectedLoupan.key,
							score: selectedLoupan.score,
						};

						const response = await sendDataToBackend(dataToSend);
						if (response.code == 200) {
							// 数据成功发送到后端
							uni.redirectTo({ // 使用 uni.redirectTo 来替换页面
								url: '/pages/gift/index'
							})
						} else {
							uni.showToast({
								title: response.message
							})
						}
					} catch (e) {
						console.error('发生异常：', e);
						// 处理异常情况
					}
				} else {
					console.log('验证失败');
					// 处理表单验证失败的逻辑
				}
			},
			getBirthday(event) {
				// 使用解构赋值从event对象中获取所选日期的数据
				const {
					year,
					month,
					day,
				} = event;
				// 将所选日期的数据存储在form对象的birthday属性中
				this.form.birthday = `${year}年${month}月${day}日`;
			},
			getLoupan(event) {

				const selectedLabel = event[0].label;
				// 将选择的label数据存储在selectedLabel属性中

				this.form.loupan = selectedLabel;
			},
			// 手机号验证方法
			validateMobile(rule, value, callback) {
				// 使用正则表达式检查手机号是否为11位数字
				const mobileRegex = /^[0-9]{11}$/;
				if (!mobileRegex.test(value)) {
					callback(new Error('手机号无效'));
				} else {
					callback();
				}
			},
		},
		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.form1.setRules(this.rules)
		}
	};
</script>
<style scoped>
	/* #ifdef H5 */
	uni-page-head {
		display: none;
	}

	/* #endif */
	.subForm {
		border: 80rpx solid #ffffff;
		border-top: 2rpx solid #fff;
	}
</style>