import _ from 'lodash'
import * as  DataMatch from '../util/data-match'
import DataCheck from '../util/data-check'
import ApiService from "./api-service"

export default class ComponentsApiService {
  static __apiService__: ApiService
  static __app__: any
  static __$app__: any
  static __demo_props__: any


  /**
   * get app props must values
   */
  static $getAppPropsMustValue(key: string) {
    if (!Reflect.has(ComponentsApiService.__app__.$props, key)) {
      console.error(`[@vogter/vue3-axios] use ComponentsApiService's components must  has [${key}] props `)
    }
    return Reflect.get(ComponentsApiService.__app__.$props, key)
  }
  /**
   * get app props values
   */
  static $getAppPropsValue(key: string) {
    return Reflect.get(ComponentsApiService.__app__.$props, key)
  }

  /**
   * init components api service
   * @param instance 
   */
  static $initComponentsApiService(instance: ComponentsApiService) {
    instance.$setApiParams && instance.$setApiParams()
    instance.$setUiParams && instance.$setUiParams()
  }

  constructor(apiService: ApiService, app: any, $app: any) {
    ComponentsApiService.__apiService__ = apiService
    ComponentsApiService.__app__ = app
    ComponentsApiService.__$app__ = $app
    this.$initApp()
  }

  /**
   * init app
   */
  $initApp(): ComponentsApiService {
    return this.$initAppProps()
      .$initAppData()
      .$initAppWatch()
      .$initAppComputed()
  }

  /**
   * init app props
   * The [props] can't be modified. Record what [props] are needed and what the structure looks like
   */
  $initAppProps(): ComponentsApiService {
    const _props = {
      props: {
        // 接口数据源，来源于组件配置表
        // 结构： [{
        //  apiMethod:'对应api.json文件中的name，优先级低于apiUrl，二者必须配置一个',
        //  apiUrl: 'api路由，优先级低于apiMethod，二者必须配置一个',
        //  respMatch: ['data']
        //  axiosOptions: {}, // axios的配置信息，可选参数
        //
        //  queryParams: '接口静态query参数，可选参数'
        //  queryParamsMatch: { // 接口query参数匹配配置，可选参数
        //    接口参数名称: '{}/@@占位的属性值，支持链式字符串'
        //    beginTime: '{apiFilter.bgeinTime}' // 或者@apiFilter。beginTime@，上下文[batchInfo(当前分批请求信息，来源与batches配置)/apiFilter(即this.apiFilter)/this/]
        //  },
        //  bodyParams: '接口静态body参数，可选参数',
        //  bodyParamsMatch: { // 接口body参数匹配配置，可选参数
        //    接口参数名称: '{}/@@占位的属性值，支持链式字符串'
        //    beginTime: '{apiFilter.bgeinTime}' // 或者@apiFilter。beginTime@，上下文[batchInfo(当前分批请求信息，来源与batches配置)/apiFilter(即this.apiFilter)/this/]
        //  },
        //  subApis: [{ // 子接口，主接口中的参数都有，并增加以下参数配置，可选参数
        //    queryParamsRelations: { // 主接口返回数据作为子接口query参数的关系映射，key：接口参数名称，value: 父级接口返回数据的属性名称
        //      id: 'stcd'
        //    },
        //    bodyParamsRelations: { // 主接口返回数据作为子接口body参数的关系映射，key：接口参数名称，value: 父级接口返回数据的属性名称
        //      id: 'stcd'
        //    },
        //    mergeRelations: [{ // 子接口数据合并到主接口的合并规则，即合并关系映射，key：子级接口返回数据的属性名称，value: 父级接口返回数据的属性名称
        //      id: 'stcd'
        //    }]
        //  }]
        // }]
        api: {
          type: [Object, Array]
        },
        filter: {
          type: Object
        },
        // 数据格式化规则配置
        formatRules: {
          type: Array
        },
        // api接口数据缓存的key，默认值：default
        cacheApiKey: {
          type: String,
          default: () => 'default'
        },
        // 是否挂起api
        // 默认false，不挂起
        // 某些场景需要挂起api，等到某个操作后才要请求接口
        // 如作为页签组件时，当搜索条件变动，只有页签激活的时候才请求接口;
        // 搜索条件未加载完成需要挂起api
        apiSuspend: {
          type: Boolean,
          default: () => false
        }
      }
    }
    ComponentsApiService.__demo_props__ = _props
    // ComponentsApiService.__$app__.mixin(_props)
    return this
  }

  /**
   * init appdata
   */
  $initAppData(): ComponentsApiService {
    const data = {
      apiDataStore: {
        ready: false,
        apiReadyCount: 0,
        fetchDatas: []
      },
      apiDataList: null,
      // 是否第一次请求api
      isApiFirstFetched: true,
      // 内部内置条件
      myFilter: {},
      apiParams: {},
      uiParams: {}
    }
    Object.assign(ComponentsApiService.__app__.$data, { ...data })
    return this
  }

  /**
   * init app watch
   */
  $initAppWatch(): ComponentsApiService {
    const app = ComponentsApiService.__app__

    // watch out  filter
    app.$watch(() => _.cloneDeep(app.filter), (newVal: any, oldVal: any) => {
      this.$setApiParams()
      this.$setUiParams()
    }, { deep: true, immediate: false })

    // watch my filter
    app.$watch(() => _.cloneDeep(app.myFilter), (newVal: any, oldVal: any) => {
      this.$setApiParams()
      this.$setUiParams()
    }, { deep: true, immediate: false })

    // watch apiParms and fetchApiData
    app.$watch(() => _.cloneDeep(app.apiParams), (newVal: any, oldVal: any) => {
      if (_.isEqual(newVal, oldVal)) {
        return
      }
      let { isApiFirstFetched, apiSuspend } = app
      if (isApiFirstFetched) {
        isApiFirstFetched = false
        // first fetch api
        this.$fetchApiData(newVal, apiSuspend)
      } else {
        // other fetch api
        this.$fetchApiData(newVal)
      }
    }, { deep: true, immediate: false })

    // watch uiParams and filter ApiData
    app.$watch(() => _.cloneDeep(app.uiParams), (newVal: any, oldVal: any) => {
      if (_.isEqual(newVal, oldVal)) {
        return
      }
      if (app.apiSuspend) {
        return
      }
      // use app '$clearData' to clear data
      if (DataCheck.$isFunction(app.$clearData)) {
        app.$clearData()
      }
      const apiDataStore = app.apiDataStore || {}
      const fetchDatas = apiDataStore.fetchDatas || []
      fetchDatas.forEach((data: any) => {
        data.rendered = false
        this.$filterFetchDataByUi(data, newVal)
      });

    }, { deep: true, immediate: false })

    // watch api  ApiData
    app.$watch(() => _.cloneDeep(app.api), (newVal: any, oldVal: any) => {
      if (_.isEqual(newVal, oldVal)) {
        return
      }
      this.$fetchApiData(app.apiParams)
    }, { deep: true, immediate: false })
    return this
  }

  /**
   * init app computed
   * The [computed] can't be modified. Record what [computed] are needed and what the structure looks like
   */
  $initAppComputed(): ComponentsApiService {
    return this
  }

  /**
   * fetch api data and deal data
   * @param filter 
   * @param apiSuspend is not api fetch 
   */
  $fetchApiData(filter: object | null, apiSuspend = false) {
    if (apiSuspend) {
      return
    }
    const app = ComponentsApiService.__app__
    // if app has $fetchApiData function use this $fetchApiData to fetch apidata
    if (DataCheck.$isFunction(app.$fetchApiData)) {
      app.$fetchApiData(filter, apiSuspend)
      return
    }
    const api = ComponentsApiService.$getAppPropsValue('api')
    if (!api || api.length == 0) {
      console.warn(`[@vogter/vue3-axios] please in components set api props`)
      return
    }
    // use app '$clearData' to clear data
    if (DataCheck.$isFunction(app.$clearData)) {
      app.$clearData()
    }
    const apiDataStore = app.apiDataStore
    apiDataStore.fetchDatas = []
    apiDataStore.ready = false
    apiDataStore.apiReadyCount = 0
    this.$onFetchData(api, filter)
  }

  /**
   * start fetch data
   * @param api 
   * @param filter 
   */
  async $onFetchData(apis: any, filter: any) {
    if (!apis || apis.length === 0) {
      return
    }
    if (DataCheck.$isObject(apis)) {
      apis = [apis]
    }
    const len = apis.length
    for (let i = 0;i < len;i++) {
      const api = apis[i]
      if (!api.apiMethod && !api.apiUrl) {
        return
      }
      await this.$oneFetchData(api, i, filter)
    }
  }

  /**
   * one fetchData
   * @param api 
   * @param index 
   * @param filter 
   */
  async $oneFetchData(api: any, apiIndex: number, filter: any) {
    const app = ComponentsApiService.__app__
    const apiService = ComponentsApiService.__apiService__
    const { apiMethod, apiUrl, subApis, respMatch } = api
    let apiOpt = this.$getApiOptions(api, filter)
    // if app has 'beforeFetch' function can  intercept api fetch
    const newApiOpt = DataCheck.$isFunction(app.$beforeFetch) && await app.$beforeFetch(apiOpt, api, filter)
    apiOpt = newApiOpt || apiOpt
    let resp = {}
    if (apiMethod && apiMethod.length > 0) {
      resp = await apiService.$fetchData(apiMethod, apiOpt, {}).catch((error: any) => {
        // if app has 'fetchApiError' function can  intercept api fetch
        DataCheck.$isFunction(app.$fetchApiError) && app.$fetchApiError({ api, apiMethod, apiOpt, error })
      })
    } else if (apiUrl && apiUrl.length > 0) {
      resp = await apiService.$fetchDataByUrl(apiUrl, apiOpt, {}).catch((error: any) => {
        // if app has 'fetchApiError' function can  intercept api fetch
        DataCheck.$isFunction(app.$fetchApiError) && app.$fetchApiError({ api, apiUrl, apiOpt, error })
      })
    }
    let data = this.$handleFetchApiData(resp, respMatch)
    const dataLen = data.length
    const $everyFetchedHook = (fetchData: any) => {
      const fetchDatas = app.apiDataStore.fetchDatas
      fetchDatas.push(fetchData)
      DataCheck.$isFunction(app.$everyFetched) ? app.$everyFetched(fetchData) : this.$everyFetched(fetchData)
    }
    // 请求子接口数据，合并数据
    if (dataLen > 0 && subApis && subApis.length > 0) {
      const len = subApis.length
      for (let idx = 0;idx < len;idx++) {
        const api = subApis[idx]
        data = await this.$fetchSubApi(data, api, filter)
        if (idx + 1 === len) {
          $everyFetchedHook({
            data,
            rendered: false,
            apiIndex,
          })
        }
      }
    } else {
      $everyFetchedHook({
        data,
        rendered: false,
        apiIndex,
      })
    }
    this.$fetchFinished(apiIndex)
  }

  /**
   *  fetch sun api
   * @param mainApiData 
   * @param subApi 
   * @param filter 
   */
  async $fetchSubApi(mainApiData: [], subApi: any, filter: any) {
    const app = ComponentsApiService.__app__
    const apiService = ComponentsApiService.__apiService__
    const apiOpt = this.$getSubApiOptions(
      mainApiData,
      subApi,
      filter
    )
    const { apiMethod, apiUrl, respMatch } = subApi
    let resp = {}
    if (apiMethod && apiMethod.length > 0) {
      resp = await apiService.$fetchData(apiMethod, apiOpt, {}).catch((error: any) => {
        DataCheck.$isFunction(app.$fetchSubApiError) && app.$fetchSubApiError({ subApi, apiMethod, apiOpt, error })
      })
    } else if (apiUrl && apiUrl.length > 0) {
      resp = await apiService.$fetchDataByUrl(apiUrl, apiOpt, {}).catch((error: any) => {
        DataCheck.$isFunction(app.$fetchSubApiError) && app.$fetchSubApiError({ subApi, apiUrl, apiOpt, error })
      })
    }
    let data = this.$handleFetchApiData(resp, respMatch)
    data = await this.$mergeData(mainApiData, data, subApi)
    return data
  }

  /**
   * get api data
   */
  $getAllApiData() {
    const app = ComponentsApiService.__app__
    const apiData = app.apiDataStore || {}
    const fetchDatas = apiData.fetchDatas || []
    const resultData: any[] = []
    fetchDatas.forEach((d: any) => {
      const { data } = d || {}
      if (data) {
        if (DataCheck.$isArray(data)) {
          // 数组，合并
          resultData.push(...data)
        } else {
          // 对象，追加
          resultData.push(data)
        }
      }
    })
    return resultData
  }
  /**
   * every fetch data hook
   * @param fetchData 
   */
  $everyFetched(fetchData: any) {
    const app = ComponentsApiService.__app__
    this.$filterFetchDataByUi(fetchData, app.uiParams)
  }

  /**
   * fetch  finish hook
   * @param apiIndex 
   */
  $fetchFinished(apiIndex: number) {
    const app = ComponentsApiService.__app__
    const api = ComponentsApiService.$getAppPropsMustValue('api')
    const apiDataStore = app.apiDataStore
    if (DataCheck.$isObject(api)) {
      apiDataStore.apiReadyCount = 1
      apiDataStore.ready = true
    } else if (DataCheck.$isArray(api)) {
      if (apiDataStore) {
        let count = apiDataStore.apiReadyCount || 0
        count++
        apiDataStore.apiReadyCount = count
        apiDataStore.ready = api.length === count
      }
    }
    if (apiDataStore.ready) {
      // if app has $renderFetchData function to redner fetchdata
      DataCheck.$isFunction(app.$renderFetchData) && app.$renderFetchData(apiDataStore)
      const apiDataList = this.$getAllApiData()
      Object.assign(ComponentsApiService.__app__.$data, { apiDataList })
    }
  }

  /**
   * filter data 
   * @param fetchData 
   * @param uiParams 
   */
  $filterFetchDataByUi(fetchData: any = {}, uiParams: any) {
    const app = ComponentsApiService.__app__
    const formatRules = ComponentsApiService.$getAppPropsValue('formatRules')
    const { data } = fetchData
    fetchData.renderData = this.$filterData(
      data || [],
      uiParams,
      formatRules,
      null
    )
    if (DataCheck.$isFunction(app.$renderData)) {
      // use components '$renderData' to renderData
      app.$renderData(fetchData)
    }
  }

  /**
   * set api params
   */
  $setApiParams() {
    let params = {}
    const app = ComponentsApiService.__app__
    params = _.merge(params, {
      isvogterAxios: true
    })
    const { filter, myFilter } = app
    _.merge(params, filter, myFilter)
    app.$data.apiParams = Object.assign(app.$data.apiParams, params || {})
    return params
  }

  /**
   * set ui params
   */
  $setUiParams() {
    const params = {}
    const app = ComponentsApiService.__app__
    const match = ComponentsApiService.$getAppPropsValue('uiFilterMatch')
    if (match) {
      let filter = {}
      for (const apiProp in match) {
        const prop = match[apiProp]
        if (prop && filter[prop] !== null && filter[prop] !== undefined) {
          params[apiProp] = filter[prop]
        }
      }
      filter = app.filter || {}
      for (const apiProp in match) {
        const prop = match[apiProp]
        if (prop && filter[prop] !== null && filter[prop] !== undefined) {
          params[apiProp] = filter[prop]
        }
      }
      filter = app.myFilter || {}
      for (const apiProp in match) {
        const prop = match[apiProp]
        if (prop && filter[prop] !== null && filter[prop] !== undefined) {
          params[apiProp] = filter[prop]
        }
      }
    }
    if (Object.keys(params).length > 0) {
      app.$data.uiParams = Object.assign(app.$data.uiParams, params || {})
    }
    return params
  }

  /**
   * get api options
   * @param api 
   * @param filter 
   */
  $getApiOptions(api: any, filter: any) {
    const app = ComponentsApiService.__app__
    let {
      axiosOptions,
      queryParams,
      queryParamsMatch,
      bodyParams,
      bodyParamsMatch
    } = api
    // 全局参数匹配
    let matchedQueryParams = {}
    let matchedBodyParams = {}
    if (queryParamsMatch) {
      // 全局参数
      matchedQueryParams = DataMatch.$matchData4Object(queryParamsMatch, [
        filter || {},
        app
      ])
      queryParams = Object.assign({}, queryParams, matchedQueryParams)
    } else {
      queryParams = Object.assign({}, queryParams, filter)
    }
    if (bodyParamsMatch) {
      if (bodyParamsMatch instanceof String || (typeof bodyParamsMatch).toLowerCase()) {
        // 如果是字符串，则匹配到的数据直接赋值给axios的data参数
        matchedBodyParams = DataMatch.$matchData4String(bodyParamsMatch, [
          filter || {},
          app
        ])
        bodyParams = matchedBodyParams
      } else {
        // 全局参数
        matchedBodyParams = DataMatch.$matchData4Object(bodyParamsMatch, [
          filter || {},
          app
        ])
        bodyParams = Object.assign({}, bodyParams, matchedBodyParams)
      }
    } else if (bodyParams) {
      bodyParams = Object.assign({}, bodyParams, filter)
    }
    // 如果bodyParams、bodyParamsMatch都没有配置，则不输出data参数
    axiosOptions = _.merge(
      {},
      axiosOptions,
      bodyParams
        ? {
          params: queryParams,
          data: bodyParams
        }
        : {
          params: queryParams
        }
    )
    return axiosOptions
  }

  /**
   * get sub api options
   * use fetch api data to match filter to match
   * @param mainApiData 
   * @param subApi 
   * @param filter 
   */
  $getSubApiOptions(mainApiData: any, subApi: any, filter: any) {
    const apiOptions = this.$getApiOptions(subApi, filter)
    const { queryParamsRela, bodyParamsRela } = subApi
    let { params, data } = apiOptions
    if (!params) {
      params = apiOptions.params = {}
    }
    for (const paramsProp in queryParamsRela) {
      const mainProp = queryParamsRela[paramsProp]
      const mainPropValue: any[] = []
      mainApiData.forEach((d: any) => {
        const propValue = d[mainProp]
        if (propValue !== null && propValue !== undefined) {
          mainPropValue.push(propValue)
        }
      })
      if (mainPropValue.length > 0) {
        params[mainProp] = mainPropValue.join(',')
      }
    }
    if (!data) {
      data = apiOptions.data = {}
    }
    for (const paramsProp in bodyParamsRela) {
      const mainProp = bodyParamsRela[paramsProp]
      const mainPropValue: any[] = []
      mainApiData.forEach((d: any) => {
        const propValue = d[mainProp]
        if (propValue !== null && propValue !== undefined) {
          mainPropValue.push(propValue)
        }
      })
      if (mainPropValue.length > 0) {
        data[mainProp] = mainPropValue.join(',')
      }
    }
    return apiOptions
  }

  /**
   * filter data by formatRules
   * @param data 
   * @param filter 
   * @param formatters 
   * @param defaultFomatters 
   */
  $filterData(data: [], filter: object, formatters: [], defaultFomatters: any) {
    let res = data || []
    // filter = filter || {}
    // 先对条件做层过滤,如果条件为null 或为undefined 直接过滤掉
    const newFilter = {}
    for (const key in filter) {
      if (
        filter[key] !== null &&
        filter[key] !== undefined &&
        filter[key] !== ''
      ) {
        newFilter[key] = filter[key]
      }
    }
    formatters = formatters || []
    const filterArr = Object.entries(newFilter)
    const matchData = (subKey: any, subValue: any): any => {
      let matched = true
      // 值为数组
      if (Array.isArray(subValue)) {
        for (let i = 0, len = subValue.length;i <= len;i++) {
          matched = matchData(i, subValue[i])
          if (matched) {
            break
          }
        }
        // 值为对象
      } else if (DataCheck.$isObject(subValue)) {
        for (const k in subValue) {
          matched = matchData(k, subValue[k])
          if (matched) {
            break
          }
        }
      } else {
        // 判断属性值在条件中
        if (filter[subKey] !== null && filter[subKey] !== undefined) {
          let subMatch = false
          filterArr.forEach(([filterKey, filterValue]): any => {
            if (DataCheck.$isArray(filterValue)) {
              // 数组为或的关系
              (filterValue as []).forEach((v: any) => {
                subMatch =
                  subMatch ||
                  v.indexOf(subValue) > -1 ||
                  subValue.indexOf(v) > -1
              })
              matched = subMatch
            } else {
              // 与的关系
              if (typeof subValue === 'string') {
                matched =
                  matched &&
                  (subValue.indexOf((filterValue as string)) > -1 ||
                    (filterValue as string).indexOf(subValue) > -1)
              } else if (typeof subValue === 'number') {
                subValue = subValue.toString()
                matched =
                  matched &&
                  (subValue.indexOf((filterValue as string)) > -1 ||
                    (filterValue as string).indexOf(subValue) > -1)
              } else {
                matched = matched && filterValue === subValue
              }
            }
          })
        } else {
          matched = false
        }
      }
      return matched
    }
    if (filterArr.length > 0 || formatters.length > 0) {
      res = []
      for (let i = 0, len = data.length - 1;i <= len;i++) {
        // 数据格式化处理 暂时不实现
        formatters.forEach((fmt) => {
          //this.$doFormat(data[i], fmt, defaultFomatters)
        })
        let flag = true
        if (filterArr.length) {
          flag = matchData(i, data[i])
        }
        flag && res.push(data[i])
      }
    }
    return res
  }

  /**
   * merage apidata subapiData
   * @param data 
   * @param subData 
   * @param api 
   */
  async $mergeData(data: [], subData: [], api: any) {
    const app = ComponentsApiService.__app__
    data = data || []
    subData = subData || []
    api = api || {}
    const relations = api.mergeRelations
    // 合并目标属性，用于指定主接口的某个属性数据和子接口进行合并
    const mergeTargetKey = api.mergeTargetKey || ''
    const mergeRules = DataCheck.$isObject(relations)
      ? [relations]
      : relations || []
    if (data.length === 0 || subData.length === 0) {
      return data
    }
    // if app  $beforeMerge is function can inspect megrge
    let mergedData = DataCheck.$isFunction(app.$beforeMerge) ? await app.$beforeMerge(data, subData, mergeRules, api) : undefined
    if (mergedData !== false) {
      mergedData = mergedData || data || []
      mergeRules.forEach((rule: any) => {
        if (rule) {
          const ruleEntries = Object.entries(rule)
          // 将要合并的数组转为对象
          let subDataObj = {}
          if (api.mergeKey) {
            // 把处理好的数据挂载在指定的节点中
            subData.forEach((subD) => {
              const keys = Object.keys(rule)
              const attrbute: any[] = []
              keys.forEach((key) => {
                attrbute.push(subD[key])
              })
              const strAttrBute = attrbute.join('_')
              subDataObj[strAttrBute] = subDataObj[strAttrBute] || {}
              subDataObj[strAttrBute][api.mergeKey] =
                subDataObj[strAttrBute][api.mergeKey] || []
              subDataObj[strAttrBute][api.mergeKey].push(subD)
            })
          } else {
            subDataObj = _.keyBy(subData, (d) => {
              const keys: any[] = []
              ruleEntries.forEach(([key, value]) => {
                d[key] && keys.push(d[key])
              })
              return keys.join('_')
            })
          }
          // 合并数据
          let tempData = mergedData
          if (mergeTargetKey && mergeTargetKey.length > 0) {
            if (DataCheck.$isArray(mergedData)) {
              tempData = mergedData[0][mergeTargetKey]
            } else {
              tempData = mergedData[mergeTargetKey]
            }
          }
          tempData.forEach((d: any) => {
            const keys: any[] = []
            ruleEntries.forEach(([key, value]: any) => {
              d[value] && keys.push(d[value])
            })
            const source = subDataObj[keys.join('_')]
            DataCheck.$isFunction(app.$afterMerge) && app.$beforeEveryMerge(d, source, rule) !== false
            source && _.merge(d, source)
            DataCheck.$isFunction(app.$afterEveryMerge) && app.$afterEveryMerge(d, source, rule)
          })
        }
      })
      const newData = DataCheck.$isFunction(app.$afterMerge) && await app.$afterMerge(
        mergedData,
        subData,
        mergeRules,
        data
      )
      if (newData) {
        mergedData = newData
      }
    }
    return mergedData
  }

  /**
   * handle fetch api data
   * @param resp 
   * @param respMatch 
   */
  $handleFetchApiData(resp: any, respMatch = '@data.data@') {
    let data = DataMatch.$matchData4String(respMatch, resp || {})
    if (!DataCheck.$isArray(data)) {
      data = [data]
    }
    return data
  }

  /**
   * render data demo
   * @param fetchData 
   */
  static $renderDataDemo(fetchData: any) {
    const { rendered = false, renderData = [] } = fetchData
    if (rendered !== true && renderData && renderData.length > 0) {
      // 进行数据渲染
      fetchData.rendered = true
    }
  }

  /**
   * render fisinsh fetch data demo
   * @param apiFetchData 
   */
  static $renderFetchDataDemo(apiFetchData: any) {
    //apiReadyCount = 0, ready = false, 
    const { fetchDatas = [] } = apiFetchData
    fetchDatas.forEach((fetchData: any) => {
      const { rendered = false, renderData = [] } = fetchData
      if (rendered !== true && renderData && renderData.length > 0) {
        // 进行数据渲染
        fetchData.rendered = true
      }
    })
  }
}