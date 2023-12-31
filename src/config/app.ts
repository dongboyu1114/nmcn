export const APP_NAME = import.meta.env.VITE_APP_NAME

export const IMAGE_URL = import.meta.env.VITE_BASE_STATIC_URL //'https://mini-1304817606.file.myqcloud.com' // 静态资源的cos地址

export const CUS_THEMES = {mainColor: '#035CAC'} //自定义样式全局变量

export const HTTP_REQUEST_URL = import.meta.env.VITE_APP_AXIOS_BASE_URL //'http://172.16.218.117:3300'

export const HEADER = {
    'content-type': 'application/json',
}

export const HEADERPARAMS = {
    'content-type': 'application/x-www-form-urlencoded',
}

export const TOKENNAME = 'token'

export const USER_AGENT = 'userAgent'

export const REFERER = 'referer'

export const AUTH_SOURCE = 'authSource'

export const SHOP_NO_FROM = 'shopNoFrom'
