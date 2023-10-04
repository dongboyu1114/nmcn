<script setup lang="ts">
	import { onLaunch, onShow, onHide, onLoad } from '@dcloudio/uni-app'
	// import { getPages } from './utils/routerUtil'
	onLaunch(() => {
		// getPages()
		uni.navigateTo({ // 使用 uni.navigateTo 进入登录页面
			url: '/pages/index/index'
		})
	})
</script>
<style lang="scss">
	@import 'vk-uview-ui/index.scss';
</style>