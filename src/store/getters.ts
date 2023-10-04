import {RootState} from '@/store'

export default {
    token: (state: RootState) => uni.getStorageSync('tokenKey-1') || '',
    pages: (state: RootState) => state.app.pages,
    isLogin: (state: RootState) => state.app.isLogin,
}
