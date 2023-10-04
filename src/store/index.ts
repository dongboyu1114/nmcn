import { createStore } from 'vuex'
import { store as app, AppState, AppStore } from '@/store/modules/app'
import getters from './getters'

export interface RootState {
	app : AppState
}

export type Store = AppStore<Pick<RootState, 'app'>>

export const store = createStore<RootState>({
	modules: {
		app,
	},
	getters,
})
// store/user.js
const state = {
	hasFilledInfo: false // 初始状态
}

// 其他 Vuex 模块的定义...

export default {
	state,
	// 其他模块...
}

export function useStore() : Store {
	return store as Store
}