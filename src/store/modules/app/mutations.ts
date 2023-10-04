import {MutationTree} from 'vuex'
import {AppState} from './state'
import {AppMutationTypes} from './mutation-types'

export type Mutations<S = AppState> = {
    [AppMutationTypes.SET_TOKEN](state: S, token: string): void
    [AppMutationTypes.IS_LOGIN](state: S, isLogin: boolean): void
    [AppMutationTypes.INIT_PAGES](state: S, pages: {}): void
}
export const mutations: MutationTree<AppState> & Mutations = {
    [AppMutationTypes.SET_TOKEN](state: AppState, token: string) {
        state.token = token
        // localStorage.setItem('token', token)
        uni.setStorage({
            key: 'tokenKey-1',
            data: token
        })
        uni.setStorage({
            key: 'tokenTime',
            data: (new Date()).getTime()
        })
    },
    [AppMutationTypes.IS_LOGIN](state: AppState, isLogin: boolean) {
        state.isLogin = isLogin
        uni.setStorage({
            key: 'isLogin',
            data: isLogin
        })
    },
    [AppMutationTypes.INIT_PAGES](state: AppState, pages: {}) {
        state.pages = pages
        // localStorage.setItem('pages', JSON.stringify(pages))
        uni.setStorage({
            key: 'pages',
            data: JSON.stringify(pages)
        })
    }
}
