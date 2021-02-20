import axios from 'axios'
import { $string2function } from './string2function'
/**
 * 加载配置
 * @param {*} key 
 */
const cacheConfigs = {}
export function $loadConfig(key: string) {
  const promise = new Promise((resolve) => {
    const REG_JS = /(\.js)$/
    const REG_JSON = /(\.json)$/
    const REG_API = /^(api|\/api)/ // 不太好
    if (cacheConfigs[key]) {
      resolve(cacheConfigs[key])
    } else if (typeof key === 'function') {
      // @ts-ignore
      resolve(key())
    } else if (REG_JSON.test(key)) {
      axios
        .get(key, {
          baseURL: ''
        })
        .then((res: any) => {
          const config = res.data
          resolve((cacheConfigs[key] = config))
        })
    } else if (REG_API.test(key)) {
      axios.get(key).then((res: any) => {
        const config = res.data.data
        resolve((cacheConfigs[key] = config))
      })
    } else if (REG_JS.test(key)) {
      // @ts-ignore
      window.require([key], (config) => {
        resolve(config)
      })
    } else if (Object.prototype.toString.call(key) === '[object Object]') {
      // Object对象判断
      resolve(key)
    } else {
      // string函数字符串
      resolve($string2function('', key)())
    }
  })
  return promise
}