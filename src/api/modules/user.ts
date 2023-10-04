import http from '../http'

// 返回code
export function sendAuthCodeToBackend(data : any) {
	// console.log('bbbbb')
	return http.post('auth/authorization', data)
}
// 向后端发送数据的函数
export function sendDataToBackend(data : any) {
	return http.post('nami/create', data)
}
// 发起GET请求的函数
export function getAllDataFromNami() {
	return http.get('nami/index'); // 发起GET请求
}
export default {
	sendAuthCodeToBackend,
	sendDataToBackend,
	getAllDataFromNami

}