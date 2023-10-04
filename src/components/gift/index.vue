<template>
	<view class="warp">
		<!-- 顶部信息 -->
		<view class="tx">
			<view class="score">
				<span>当前积分：</span>
				<view>{{ data.score }}</view>
			</view>
			<view class="address">
				<span>收货地址：</span>
				<view>{{ data.address }}</view>
			</view>
		</view>

		<!-- 商品 -->
		<view class="info">
			<view class="info-li top">
				<view class="good-list">
					<view class="good-li">
						<image mode="aspectFill" class="good-li-image"
							src="https://img.alicdn.com/bao/uploaded/i3/2206479404251/O1CN01wiZ0tZ1hH0XF3a7nk-2206479404251.jpg_310x310.jpg">
						</image>
					</view>
					<view class="good-li">
						<image mode="aspectFill" class="good-li-image"
							src="https://img.alicdn.com/bao/uploaded/i4/2113524478/O1CN014L4wlp1iwyRguCCo8_!!0-item_pic.jpg_310x310.jpg">
						</image>
					</view>
				</view>
			</view>

			<view class="info-li bottom">
				<view class="good-list">
					<view class="good-li">
						<image mode="aspectFill" class="good-li-image"
							src="https://img.alicdn.com/bao/uploaded/i2/2200606797002/O1CN01AhfJS521ay7AP0Ifs_!!0-item_pic.jpg_310x310.jpg">
						</image>
					</view>
					<view class="good-li">
						<image mode="aspectFill" class="good-li-image"
							src="https://img.alicdn.com/bao/uploaded/i4/2123446495/O1CN01YEFlQV1xqlIsuhn4v_!!0-item_pic.jpg_310x310.jpg">
						</image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted,
		inject
	} from 'vue'
	import {
		getAllDataFromNami
	} from '@/api/modules/user'
	const userInfo = inject('userInfo', ref({}))
	const data = ref([]);
	onMounted(async () => {
		const result = await getAllDataFromNami();
		data.value = result.data;
	});
</script>

<style lang="scss" scoped>
	.warp {
		background: url('https://i.postimg.cc/3NHJX4kv/bg.jpg');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: center center;
		height: 100vh;
		display: flex;
		flex-direction: column;
		// align-items: center;
		// justify-content: center;
	}

	/* 顶部信息样式 */
	.tx {
		text-align: center;
		z-index: 2;
		color: #fff;
		position: relative;
		/* 添加相对定位 */
		top: 35.5%;
	}

	/* 商品信息样式 */
	.info {
		display: flex;
		justify-content: space-between;
		width: 100%;
		flex-direction: column;
		align-items: center;
		top: 47%;
		/* 调整商品与顶部的间距 */
		margin-bottom: 5%;
		/* 调整商品与底部的间距 */
		margin-left: 5%;
		/* 向左移动10像素 */
		position: relative;
		/* 添加相对定位 */
	}

	/* 商品列表样式 */
	.good-list {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
	}

	/* 商品图片样式 */
	.good-li-image {
		width: 150rpx;
		height: 150rpx;
		border-radius: 10px;
		object-fit: cover;
		margin-right: 40rpx;
		margin-bottom: 20rpx;
		/* 图片之间的水平间距 */
		border: 10px solid #fff;
	}

	/* 其他样式 */
	.score span,
	.address span {
		display: inline-block;
		color: rgba(253, 241, 223, 0.8);
	}

	.score view,
	.address view {
		display: inline-block;
		color: rgba(253, 241, 223, 0.8);
	}

	.score {
		font-size: 40rpx;
		color: rgba(253, 241, 223, 0.8);
	}

	.score span {}

	.score view {
		color: #ffc705;
		font-weight: 800;
	}

	.address {
		font-size: 20rpx;
		white-space: nowrap;
		color: rgba(253, 241, 223, 0.8);
	}
</style>