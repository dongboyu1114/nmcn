import {useStore} from '@/store'
import {AppMutationTypes} from '@/store/modules/app/mutation-types'
import { log } from 'console'

const store = useStore()

export const getPages = () => {
    const content = import('@/pages.json')
    content.then(res => {
        let pageTmp = {}
        for (let i = 0; i < res.pages.length; i++) {
            // @ts-ignore
            pageTmp[res.pages[i].name] = res.pages[i].path
        }
        useStore().commit(AppMutationTypes.INIT_PAGES, pageTmp)
    })
}

/**
 * 保留当前页面，跳转到应用内的某个页面
 * @param data
 */
export const push = (data: any) => {
    const name = data?.name
    const type = data?.type // 跳转形式 closeCurrent:关闭当前页面，跳转到应用内的某个页面。 closeAll:关闭所有页面，打开到应用内的某个页面。
    let url = ''
    if (name) {
        url = getUrl(data)
    } else {
        url = data?.url
    }
    const tabStatus = false // 是否走自带的导航 true:是的 false:不走  改版去掉自定义的导航了
    const tabbarArr = ['home', 'mine', 'member', 'storeWelfareIndex','storeWelfareOne','storeWelfareDingdan','my','storeNearbyHear']
    if (tabStatus && tabbarArr.indexOf(name) > -1) {
        uni.switchTab({
            url: url,
            success: function(e) {
                uni.pageScrollTo({ scrollTop: 0, duration: 0 })
            }
        })
    } else {
        if (type === 'closeCurrent') {
            uni.redirectTo({
                url: url,
                success: function(e) {
                    uni.pageScrollTo({ scrollTop: 0, duration: 0 })
                }
            })
        } else if (type === 'closeAll') {
            uni.reLaunch({
                url: url,
                success: function(e) {
                    uni.pageScrollTo({ scrollTop: 0, duration: 0 })
                }
            })
        } else {
            uni.navigateTo({
                url: url,
                success: function(e) {
                    uni.pageScrollTo({ scrollTop: 0, duration: 0 })
                }
            })
        }
    }
}

/**
 * 跳转外链地址
 */
export const jump = (data: any) => {
    const url = data?.url || ''
    if (!url) {
        return
    }
    let toUrl = '';
    if (url.substr(0, 5) === 'http:' || url.substr(0, 6) === 'https:'){ // 外链地址
        toUrl = '/pages/jump/webview?url=' + encodeURIComponent(url)
    } else { // 内链地址
        toUrl = url
    }
    if (!toUrl) {
        return
    }
    push({url: toUrl})
    // uni.navigateTo({
    //     url: toUrl
    // })
}

/**
 * 关闭当前页面，跳转到应用内的某个页面
 * @param data
 */
export const replace = (data: any) => {
    const name = data?.name
    const url = getUrl(data)
    console.log(url)
    // if (name === 'home' || name === 'user') {
    //     uni.switchTab({
    //         url: url
    //     })
    // } else {
        uni.redirectTo({
            url: url
        })
    // }
}

/**
 * 返回历史页面
 */
export const goBack = (delta: number, par?) => {
    par = par || {}
    const routeName = par.routeName || '' // 路由名称，如果没有返回的级别页面，且此参数有值，则跳转到这个路由下
    const routeType = par.routeType !== undefined ? par.routeType : 'closeCurrent'
    const pages = getCurrentPages()
    if (pages.length <= delta) {
        // 说明第一次打开页面或刷新页面了
        if (routeName) {
            push({name: routeName, type: routeType})
        } else {
            history.back(-delta)
        }
    } else {
        uni.navigateBack({
            delta: delta
        })
    }
}

/**
 * 拼接URL
 * @param data
 */
const getUrl = (data: any) => {
    const name = data?.name
    const param = data?.data
    // @ts-ignore
    let url = '/' + store.state.app.pages[name]
    console.log('url'+url);  
    console.log('url'+param);  
    if (param) {
        let index = 0
        for (const key in param) {
            if (index === 0) {
                url = url + '?'
            }
            index++
            if (index > 0) {
                url = url + '&'
            }
            url = url + key + '=' + param[key]
        }
    }
    return url
}

/**
 * 获取path，不带参数的
 * @param data
 */
export const getPathPages = (name: String, par?) => {
    par = par || {}
    const hasXg = par.hasXg || false // 前面是否有斜杠 true:有 false:没有
    let url = store.state.app.pages[name]
    if (hasXg) {
        url = '/' + url
    }
    return url
}

// 检测页面用的路由
const checkWebRouteConfig = {
    'userInfo': 'pages/user/info', // 个人信息页面
}
/**
 * 检测上面某个页面是不是指定的页面
 * @param {number} historyNum 历史页面 0:当前页面 1:上个页面 2:上上个页面
 * @param {string} mark 那个页面的标识
 * @param {object} par 对象参数
 *                  checkType:检测方式 webName-页面的webName变量（默认） route:路由方式
 */
export const checkHistoryWeb = (historyNum: number, mark: string, par?) => {
    par = par || {}
    const ret = {
        status: 'fail', // success-成功 fail-失败
        statusMark: '', // 状态标识
        msg: '',
        vm: {}, // $vm数据
        webData: {}
    }
    const checkType = par.checkType || 'webName'
    const pages = getCurrentPages()
    const preNum = pages.length - historyNum - 1 // 要查的历史数据
    if (preNum < 0) {
        ret.statusMark = 'none'
        ret.msg = '不存在这个页面'
        return ret
    }
    if (checkType == 'route') {
        // 路由形式
        if (!checkWebRouteConfig[mark]) {
            ret.statusMark = 'noRoute'
            ret.msg = '还没配置该路由'
            return ret
        }
        if (pages[preNum]?.$vm?.route !== checkWebRouteConfig[mark]) {
            ret.statusMark = 'not'
            ret.msg = 'route-这个页面不是所需页面-' + pages[preNum]?.$vm?.route
            return ret
        } else {
            ret.vm = pages[preNum]?.$vm
            ret.webData = pages[preNum]?.$vm?._?.exposed || {}
        }
    } else {
        // 页面形式
        const webNameNow = pages[preNum]?.$vm?._?.exposed?.webName
        if (webNameNow !== mark) {
            ret.statusMark = 'not'
            ret.msg = 'webName-这个页面不是所需页面-' + webNameNow
            return ret
        } else {
            ret.vm = pages[preNum]?.$vm
            ret.webData = pages[preNum]?.$vm?._?.exposed || {}
        }
    }
    ret.status = 'success'
    return ret
}

/**
 * 返回某个页面
 */
export const backWeb = (num) => {
    uni.navigateBack({
        delta: num
    })
}
