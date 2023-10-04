export interface AppState {
    token: string,
    pages: object,
    isLogin: boolean,
}

export const state: AppState = {
    token: uni.getStorageSync('tokenKey-1') || '',
    isLogin: uni.getStorageSync('isLogin') || false,
    pages: uni.getStorageSync('pages') ? JSON.parse(uni.getStorageSync('pages')) : ''
}
