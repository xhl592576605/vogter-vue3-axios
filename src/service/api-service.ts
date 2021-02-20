import axios from 'axios'
import { $loadConfig } from '../util/load-config'
import DataCheck from '../util/data-check'
import Cookies from 'js-cookie'
const CancelToken = axios.CancelToken
export default class ApiService {
  // 后端接口的私有配置
  _serviceKeys: string | Array<string> | null = null

  // 用户登录的票据信息
  _token: string | null = null

  _tokenKey: string

  // 模块私有的api配置，
  _myServiceConfig: any = {}

  // axios 实例对象，每个组件可以拥有自己的实例对象
  axiosObj: any = null

  // axios的cancelToken集合
  apiCancelToken: Object = {}

  constructor(options: any = {}) {
    this._serviceKeys = options.serviceKeys || null
    this._token = options.token || null
    this._tokenKey = options.tokenKey || '__token__'
    this._myServiceConfig = options._myServiceConfig || {}
    if (options.overrideMethod && DataCheck.$isObject(options.overrideMethod)) {
      Object.entries(options.overrideMethod).forEach(([key, value]) => {
        if (this[key] &&
          typeof this[key] === 'function' &&
          typeof value === 'function') {
          ApiService.prototype[key] = value
        }
      })
    }
    this.$loadServicesConfig()
  }

  /**
  * 根据serviceConfig动态获取api接口的私有配置
  */
  async $loadServicesConfig() {
    let serviceKeys = this._serviceKeys || []
    const _myServiceConfig = this._myServiceConfig
    let len = serviceKeys.length
    let key = null
    let promise = null
    let resp = null
    for (let i = 0;i < len;i++) {
      key = serviceKeys[i]
      promise = $loadConfig(key)
      resp = await promise
      Object.assign(_myServiceConfig, resp)
    }
  }

  /**
    * 获取服务api配置
    */
  $getServiceConfig(chainKey: string, serviceConfigs: any[] = [], idx = 0) {
    if (idx >= serviceConfigs.length) {
      return null
    }
    const keys = chainKey.split('.')
    let config: any = null
    keys.forEach((key) => {
      if (!config) {
        config = serviceConfigs[idx][key]
      } else {
        config = config[key]
      }
    })
    if (!config) {
      const nextIdx = idx + 1
      config = this.$getServiceConfig(chainKey, serviceConfigs, nextIdx)
    }
    return config
  }

  /**
   * 获取axios服务对象
   */
  $getService(global = {}) {
    let axiosObj = this.axiosObj
    if (!axiosObj) {
      // @ts-ignore
      const opt = window.$service_global || {}
      Object.assign(opt, global)
      axiosObj = axios.create(opt)
      // 配置发送请求前的拦截器 可以设置token信息
      axiosObj.interceptors.request.use(
        (config: any) => {
          this.$setRequestHeaders(config)
          return config
        },
        (error: any) => {
          console.warn('[@guardian/vue3-axios] 发起接口请求出现异常！')
          console.warn(error)
          return Promise.reject(error)
        }
      )
      // 配置响应拦截器
      axiosObj.interceptors.response.use(
        (resp: any) => {
          // loading结束
          // 这里面写所需要的代码
          return Promise.resolve(resp)
        },
        (error: any) => {
          this.$axiosRespErrorHook(error)
          return Promise.resolve(error)
        }
      )
      this.axiosObj = axiosObj
    }
    return axiosObj
  }

  /**
      * 设置请求头
      * @param {*} config 接口信息
      */
  $setRequestHeaders(config: any) {
    if (config.certificate) {
      const cookie = this._token || Cookies.get(this._tokenKey)
      Object.entries({
        Author: config.author,
        Authorization: cookie,
        // 特殊处理：当delete|put方法时，用这个告诉服务端重写请求类型，传输层面的类型统一替换为POSt
        // 场景：部分服务器无法直接支持delete|put时
        'X-Http-Method-Override': config._method,
        'Cache-Control': 'no-cache',
        'Cache-control': 'no-store',
        Pragma: 'no-cache', // in http 1.0 = Cache-Control
        Expires: 1 // 有效值
      }).forEach(([key, val]) => {
        if (val) {
          config.headers[key] = val
        }
      })
    } else {
      config.headers['X-Http-Method-Override'] = config._method
      config.headers['Author'] = config.author
    }
    return config
  }

  /**
   * 取消接口请求
   */
  $cancelFetchApi(apiKey: string) {
    const cancelToken = this.apiCancelToken || {}
    let cancelFunc = {}
    if (((apiKey as any) instanceof String || (typeof apiKey).toLowerCase()) === 'string'
      && Object.prototype.toString.call(cancelToken[apiKey]) === '[object Object]') {
      cancelFunc[apiKey] = cancelToken[apiKey]
    } else {
      cancelFunc = cancelToken
    }
    for (var funcKey in cancelFunc) {
      if (Object.prototype.toString.call(cancelToken[apiKey]) === '[object Object]') {
        cancelFunc[funcKey].abort()
      }
      cancelToken[funcKey] = null
    }
  }

  /**
   * 注销Axios实例对象
   */
  $disposeAxios() {
    if (this.axiosObj) {
      this.axiosObj = null
    }
  }

  /**
    * 接口请求错误响应钩子
    * @param {*} resp 接口返回结果
  */
  $axiosRespErrorHook({ config, response }: any = {}) {

  }

  /**
   * 创建取消接口请求的cancel token的实例对象
   */
  $newCancelToken(apiKey: string) {
    const that = this
    const cToken = new CancelToken((cFunc) => {
      if (!that.apiCancelToken) {
        that.apiCancelToken = {}
      }
      that.apiCancelToken[apiKey] = cFunc
    })
    return cToken
  }

  /**
   *   $fetchData
   * @param apiChainKey 
   * @param apiOpt 
   * @param globalOpt 
   */
  $fetchData(apiChainKey: string, apiOpt: object, globalOpt: object) {
    const service = this.$getService(globalOpt)
    const options = this.$getServiceConfig(
      apiChainKey,
      [
        this._myServiceConfig || {},
        // @ts-ignore
        window.$guardian.$service_config || {}
      ],
      0
    )
    if (!options) {
      console.warn(`[@guardian/vue3-axios] api.json配置例子：\n
        {
            "system": {
              "system": {
                "remark": "login api",
                "author": "author",
                "method": "get",
                "url": "/api/v1/login",
                "params": {}
              }
            }
        }`)
      throw new Error(
        `【${apiChainKey}】接口未配置，请前往服务器根目录下的api配置文件(/api.json)中进行配置！`
      )
    }
    const opt = Object.assign(
      {
        params: {},
        cancelToken: this.$newCancelToken(apiChainKey)
      },
      options,
      apiOpt
    )
    //@ts-ignore
    const { debug } = window.$guardian || {}
    // 判断是否启用debug模式
    if (debug) {
      opt.params.debug = true
    }
    const promise = service(opt)
    return promise
  }

  $fetchDataByUrl(url: string, apiOpt: object, globalOpt: object) {
    if (!url || !url.length) {
      throw new Error('【url】参数未配置！')
    }
    const service = this.$getService(globalOpt)
    const options = {
      url
    }
    const opt = Object.assign(
      {
        params: {},
        cancelToken: this.$newCancelToken(url)
      },
      options,
      apiOpt
    )
    //@ts-ignore
    const { debug } = window.$guardian || {}
    // 判断是否启用debug模式
    if (debug) {
      (opt.params as any).debug = true
    }
    const promise = service(opt)
    return promise
  }
}