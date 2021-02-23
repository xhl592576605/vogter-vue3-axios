/*!
  * @vogter/vue3-axios v0.0.2
  * (c) 2021 @vogter/vue-axios axios's extend
  * @license MIT
  */
var VogterVueAxios = (function (axios, _) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e['default'] : e; }

  var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);
  var ___default = /*#__PURE__*/_interopDefaultLegacy(_);

  function $string2function(args, body) {
      if (arguments.length === 1) {
          body = args;
          args = undefined;
      }
      if (!body) {
          return () => { };
      }
      if (!body.includes('return')) {
          // 去除前后空格、换行
          body = body.replace(/^\s*/g, '');
          body = 'return ' + body;
      }
      try {
          // eslint-disable-next-line
          return args ? new Function(...args, body) : new Function(body);
      }
      catch (e) {
          // 这里需要把异常抛出来吗
          console.warn('函数解析失败', `'${body}'`);
          throw new Error(`函数解析失败:${body}'`);
      }
  }

  /**
   * 加载配置
   * @param {*} key
   */
  const cacheConfigs = {};
  function $loadConfig(key) {
      const promise = new Promise((resolve) => {
          const REG_JS = /(\.js)$/;
          const REG_JSON = /(\.json)$/;
          const REG_API = /^(api|\/api)/; // 不太好
          if (cacheConfigs[key]) {
              resolve(cacheConfigs[key]);
          }
          else if (typeof key === 'function') {
              // @ts-ignore
              resolve(key());
          }
          else if (REG_JSON.test(key)) {
              axios__default
                  .get(key, {
                  baseURL: ''
              })
                  .then((res) => {
                  const config = res.data;
                  resolve((cacheConfigs[key] = config));
              });
          }
          else if (REG_API.test(key)) {
              axios__default.get(key).then((res) => {
                  const config = res.data.data;
                  resolve((cacheConfigs[key] = config));
              });
          }
          else if (REG_JS.test(key)) {
              // @ts-ignore
              window.require([key], (config) => {
                  resolve(config);
              });
          }
          else if (Object.prototype.toString.call(key) === '[object Object]') {
              // Object对象判断
              resolve(key);
          }
          else {
              // string函数字符串
              resolve($string2function('', key)());
          }
      });
      return promise;
  }

  class DataCheck {
      // 是否是Object对象
      static $isObject(obj) {
          return Object.prototype.toString.call(obj) === '[object Object]';
      }
      // 是否是Array对象
      static $isArray(obj) {
          return Array.isArray(obj);
      }
      // 是否是字符串
      static $isString(str) {
          const typeStr = str instanceof String || (typeof str).toLowerCase();
          return typeStr === 'string';
      }
      // 是否是函数
      static $isFunction(fun) {
          return typeof fun === 'function';
      }
      /**
       * 检查特殊字符
       * @param {*} str
       */
      static $checkSpecialKey(str) {
          if (str) {
              // var specialKey = "[`~!#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'"
              const specialKey = '~!@#$%^&*+{}|"<>?';
              for (var i = 0; i < str.length; i++) {
                  if (specialKey.indexOf(str.substr(i, 1)) !== -1) {
                      return false;
                  }
              }
              return true;
          }
          else {
              return true;
          }
      }
  }

  function createCommonjsModule(fn, basedir, module) {
  	return module = {
  		path: basedir,
  		exports: {},
  		require: function (path, base) {
  			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
  		}
  	}, fn(module, module.exports), module.exports;
  }

  function commonjsRequire () {
  	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
  }

  var js_cookie = createCommonjsModule(function (module, exports) {
  (function (factory) {
  	var registeredInModuleLoader;
  	{
  		module.exports = factory();
  		registeredInModuleLoader = true;
  	}
  	if (!registeredInModuleLoader) {
  		var OldCookies = window.Cookies;
  		var api = window.Cookies = factory();
  		api.noConflict = function () {
  			window.Cookies = OldCookies;
  			return api;
  		};
  	}
  }(function () {
  	function extend () {
  		var i = 0;
  		var result = {};
  		for (; i < arguments.length; i++) {
  			var attributes = arguments[ i ];
  			for (var key in attributes) {
  				result[key] = attributes[key];
  			}
  		}
  		return result;
  	}

  	function decode (s) {
  		return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
  	}

  	function init (converter) {
  		function api() {}

  		function set (key, value, attributes) {
  			if (typeof document === 'undefined') {
  				return;
  			}

  			attributes = extend({
  				path: '/'
  			}, api.defaults, attributes);

  			if (typeof attributes.expires === 'number') {
  				attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
  			}

  			// We're using "expires" because "max-age" is not supported by IE
  			attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

  			try {
  				var result = JSON.stringify(value);
  				if (/^[\{\[]/.test(result)) {
  					value = result;
  				}
  			} catch (e) {}

  			value = converter.write ?
  				converter.write(value, key) :
  				encodeURIComponent(String(value))
  					.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

  			key = encodeURIComponent(String(key))
  				.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
  				.replace(/[\(\)]/g, escape);

  			var stringifiedAttributes = '';
  			for (var attributeName in attributes) {
  				if (!attributes[attributeName]) {
  					continue;
  				}
  				stringifiedAttributes += '; ' + attributeName;
  				if (attributes[attributeName] === true) {
  					continue;
  				}

  				// Considers RFC 6265 section 5.2:
  				// ...
  				// 3.  If the remaining unparsed-attributes contains a %x3B (";")
  				//     character:
  				// Consume the characters of the unparsed-attributes up to,
  				// not including, the first %x3B (";") character.
  				// ...
  				stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
  			}

  			return (document.cookie = key + '=' + value + stringifiedAttributes);
  		}

  		function get (key, json) {
  			if (typeof document === 'undefined') {
  				return;
  			}

  			var jar = {};
  			// To prevent the for loop in the first place assign an empty array
  			// in case there are no cookies at all.
  			var cookies = document.cookie ? document.cookie.split('; ') : [];
  			var i = 0;

  			for (; i < cookies.length; i++) {
  				var parts = cookies[i].split('=');
  				var cookie = parts.slice(1).join('=');

  				if (!json && cookie.charAt(0) === '"') {
  					cookie = cookie.slice(1, -1);
  				}

  				try {
  					var name = decode(parts[0]);
  					cookie = (converter.read || converter)(cookie, name) ||
  						decode(cookie);

  					if (json) {
  						try {
  							cookie = JSON.parse(cookie);
  						} catch (e) {}
  					}

  					jar[name] = cookie;

  					if (key === name) {
  						break;
  					}
  				} catch (e) {}
  			}

  			return key ? jar[key] : jar;
  		}

  		api.set = set;
  		api.get = function (key) {
  			return get(key, false /* read as raw */);
  		};
  		api.getJSON = function (key) {
  			return get(key, true /* read as json */);
  		};
  		api.remove = function (key, attributes) {
  			set(key, '', extend(attributes, {
  				expires: -1
  			}));
  		};

  		api.defaults = {};

  		api.withConverter = init;

  		return api;
  	}

  	return init(function () {});
  }));
  });

  const CancelToken = axios__default.CancelToken;
  class ApiService {
      constructor(options = {}) {
          // 后端接口的私有配置
          this._serviceKeys = null;
          // 用户登录的票据信息
          this._token = null;
          // 模块私有的api配置，
          this._myServiceConfig = {};
          // axios 实例对象，每个组件可以拥有自己的实例对象
          this.axiosObj = null;
          // axios的cancelToken集合
          this.apiCancelToken = {};
          this._serviceKeys = options.serviceKeys || null;
          this._token = options.token || null;
          this._tokenKey = options.tokenKey || '__token__';
          this._myServiceConfig = options._myServiceConfig || {};
          if (options.overrideMethod && DataCheck.$isObject(options.overrideMethod)) {
              Object.entries(options.overrideMethod).forEach(([key, value]) => {
                  if (this[key] &&
                      typeof this[key] === 'function' &&
                      typeof value === 'function') {
                      ApiService.prototype[key] = value;
                  }
              });
          }
          this.$loadServicesConfig();
      }
      /**
      * 根据serviceConfig动态获取api接口的私有配置
      */
      async $loadServicesConfig() {
          let serviceKeys = this._serviceKeys || [];
          const _myServiceConfig = this._myServiceConfig;
          let len = serviceKeys.length;
          let key = null;
          let promise = null;
          let resp = null;
          for (let i = 0; i < len; i++) {
              key = serviceKeys[i];
              promise = $loadConfig(key);
              resp = await promise;
              Object.assign(_myServiceConfig, resp);
          }
      }
      /**
        * 获取服务api配置
        */
      $getServiceConfig(chainKey, serviceConfigs = [], idx = 0) {
          if (idx >= serviceConfigs.length) {
              return null;
          }
          const keys = chainKey.split('.');
          let config = null;
          keys.forEach((key) => {
              if (!config) {
                  config = serviceConfigs[idx][key];
              }
              else {
                  config = config[key];
              }
          });
          if (!config) {
              const nextIdx = idx + 1;
              config = this.$getServiceConfig(chainKey, serviceConfigs, nextIdx);
          }
          return config;
      }
      /**
       * 获取axios服务对象
       */
      $getService(global = {}) {
          let axiosObj = this.axiosObj;
          if (!axiosObj) {
              // @ts-ignore
              const opt = window.$service_global || {};
              Object.assign(opt, global);
              axiosObj = axios__default.create(opt);
              // 配置发送请求前的拦截器 可以设置token信息
              axiosObj.interceptors.request.use((config) => {
                  this.$setRequestHeaders(config);
                  return config;
              }, (error) => {
                  console.warn('[@vogter/vue3-axios] 发起接口请求出现异常！');
                  console.warn(error);
                  return Promise.reject(error);
              });
              // 配置响应拦截器
              axiosObj.interceptors.response.use((resp) => {
                  // loading结束
                  // 这里面写所需要的代码
                  return Promise.resolve(resp);
              }, (error) => {
                  this.$axiosRespErrorHook(error);
                  return Promise.resolve(error);
              });
              this.axiosObj = axiosObj;
          }
          return axiosObj;
      }
      /**
          * 设置请求头
          * @param {*} config 接口信息
          */
      $setRequestHeaders(config) {
          if (config.certificate) {
              const cookie = this._token || js_cookie.get(this._tokenKey);
              Object.entries({
                  Author: config.author,
                  Authorization: cookie,
                  // 特殊处理：当delete|put方法时，用这个告诉服务端重写请求类型，传输层面的类型统一替换为POSt
                  // 场景：部分服务器无法直接支持delete|put时
                  'X-Http-Method-Override': config._method,
                  'Cache-Control': 'no-cache',
                  'Cache-control': 'no-store',
                  Pragma: 'no-cache',
                  Expires: 1 // 有效值
              }).forEach(([key, val]) => {
                  if (val) {
                      config.headers[key] = val;
                  }
              });
          }
          else {
              config.headers['X-Http-Method-Override'] = config._method;
              config.headers['Author'] = config.author;
          }
          return config;
      }
      /**
       * 取消接口请求
       */
      $cancelFetchApi(apiKey) {
          const cancelToken = this.apiCancelToken || {};
          let cancelFunc = {};
          if ((apiKey instanceof String || (typeof apiKey).toLowerCase()) === 'string'
              && Object.prototype.toString.call(cancelToken[apiKey]) === '[object Object]') {
              cancelFunc[apiKey] = cancelToken[apiKey];
          }
          else {
              cancelFunc = cancelToken;
          }
          for (var funcKey in cancelFunc) {
              if (Object.prototype.toString.call(cancelToken[apiKey]) === '[object Object]') {
                  cancelFunc[funcKey].abort();
              }
              cancelToken[funcKey] = null;
          }
      }
      /**
       * 注销Axios实例对象
       */
      $disposeAxios() {
          if (this.axiosObj) {
              this.axiosObj = null;
          }
      }
      /**
        * 接口请求错误响应钩子
        * @param {*} resp 接口返回结果
      */
      $axiosRespErrorHook({ config, response } = {}) {
      }
      /**
       * 创建取消接口请求的cancel token的实例对象
       */
      $newCancelToken(apiKey) {
          const that = this;
          const cToken = new CancelToken((cFunc) => {
              if (!that.apiCancelToken) {
                  that.apiCancelToken = {};
              }
              that.apiCancelToken[apiKey] = cFunc;
          });
          return cToken;
      }
      /**
       *   $fetchData
       * @param apiChainKey
       * @param apiOpt
       * @param globalOpt
       */
      $fetchData(apiChainKey, apiOpt, globalOpt) {
          const service = this.$getService(globalOpt);
          const options = this.$getServiceConfig(apiChainKey, [
              this._myServiceConfig || {},
              // @ts-ignore
              window.$vogter.$service_config || {}
          ], 0);
          if (!options) {
              console.warn(`[@vogter/vue3-axios] api.json配置例子：\n
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
        }`);
              throw new Error(`【${apiChainKey}】接口未配置，请前往服务器根目录下的api配置文件(/api.json)中进行配置！`);
          }
          const opt = Object.assign({
              params: {},
              cancelToken: this.$newCancelToken(apiChainKey)
          }, options, apiOpt);
          //@ts-ignore
          const { debug } = window.$vogter || {};
          // 判断是否启用debug模式
          if (debug) {
              opt.params.debug = true;
          }
          const promise = service(opt);
          return promise;
      }
      $fetchDataByUrl(url, apiOpt, globalOpt) {
          if (!url || !url.length) {
              throw new Error('【url】参数未配置！');
          }
          const service = this.$getService(globalOpt);
          const options = {
              url
          };
          const opt = Object.assign({
              params: {},
              cancelToken: this.$newCancelToken(url)
          }, options, apiOpt);
          //@ts-ignore
          const { debug } = window.$vogter || {};
          // 判断是否启用debug模式
          if (debug) {
              opt.params.debug = true;
          }
          const promise = service(opt);
          return promise;
      }
  }

  /**
   * 匹配Array中的{}/@@占位的属性值，支持链式字符串
   * 如： 当前用户{user.userName}，当前用户@user.userName@
   * 如： 所在地区{user.area.areaName}，所在地区@user.area.areaName@
   * 返回Array
   */
  function $matchData4Array(arr, data) {
      arr = arr || [];
      const matched = [];
      arr.forEach((a) => {
          if (Array.isArray(a)) {
              matched.push($matchData4Array(a, data));
          }
          else if (DataCheck.$isObject(a)) {
              matched.push($matchData4Object(a, data));
          }
          else {
              matched.push($matchData4String(a, data));
          }
      });
      return matched;
  }
  /**
    * 匹配Object中value的{}/@@占位的属性值，支持链式字符串
    * 如： 当前用户{user.userName}，当前用户@user.userName@
    * 如： 所在地区{user.area.areaName}，所在地区@user.area.areaName@
    * 返回Object
    */
  function $matchData4Object(obj, data) {
      const matched = {};
      Object.entries(obj).forEach(([key, value]) => {
          if (Array.isArray(value)) {
              matched[key] = $matchData4Array(value, data);
          }
          else if (DataCheck.$isObject(value)) {
              matched[key] = $matchData4Object(value, data);
          }
          else {
              matched[key] = $matchData4String(value, data);
          }
      });
      return matched;
  }
  /**
   * 匹配字符串中的{}/@@占位的属性值，支持链式字符串
   * 规则调整：
   * {}方式会使用匹配到的指替换掉原字符串的{}，支持多组占位；
   * @@ 方式直接返回匹配到的值，且不支持多组占位；
   * 如： 当前用户{user.userName}，当前用户@user.userName@
   * 如： 所在地区{user.area.areaName}，所在地区@user.area.areaName@
   * 返回String
   */
  function $matchData4String(str, data) {
      let newStr = str || null;
      if (newStr) {
          // 判断是否是替换原字符串方式
          const isReplace = newStr.indexOf('@') === -1;
          // 获取匹配规则数组
          const mappings = newStr
              .replace(/{/g, '@')
              .replace(/}/g, '@')
              .split('@');
          if (Array.isArray(data)) {
              const matched = [];
              mappings.forEach((m, idx) => {
                  matched.push(false);
                  if (m && m.length > 0) {
                      const props = m.split('.');
                      if (props.length > 0) {
                          data.forEach((d) => {
                              if (!matched[idx]) {
                                  const mappingData = $iterateProps(d, props, 0, isReplace);
                                  if (mappingData !== null) {
                                      matched[idx] = true;
                                      newStr = isReplace
                                          ? newStr.replace(['{', m, '}'].join(''), mappingData)
                                          : mappingData;
                                  }
                              }
                          });
                      }
                  }
              });
              // 未匹配到的设置为空字符串
              matched.forEach((match, idx) => {
                  const m = mappings[idx];
                  if (!match && m && m.length > 0) {
                      newStr = isReplace
                          ? newStr.replace(['{', m, '}'].join(''), '')
                          : null;
                  }
              });
          }
          else {
              mappings.forEach((m) => {
                  if (m && m.length > 0) {
                      const props = m.split('.');
                      if (props.length > 0) {
                          const mappingData = $iterateProps(data, props, 0, isReplace);
                          if (mappingData !== null) {
                              newStr = isReplace
                                  ? newStr.replace(['{', m, '}'].join(''), mappingData)
                                  : mappingData;
                          }
                          else {
                              newStr = isReplace
                                  ? newStr.replace(['{', m, '}'].join(''), '')
                                  : null;
                          }
                      }
                  }
              });
          }
      }
      return newStr;
  }
  /**
   * 迭代属性数组，获取最后一个节点的值
   */
  function $iterateProps(data, props, levelIndex, isReplace = true) {
      let mappingData = null;
      if (data !== null && data !== undefined) {
          if (levelIndex < props.length) {
              const prop = props[levelIndex];
              const idx = prop * 1;
              if (Number.isFinite(idx) && Array.isArray(data) && data[idx]) {
                  mappingData = $iterateProps(data[idx], props, ++levelIndex, isReplace);
                  // } else if (data.hasOwnProperty(prop)) { // 这个判断一直为false
              }
              else if (prop in data) {
                  mappingData = $iterateProps(data[prop], props, ++levelIndex, isReplace);
              }
          }
          else {
              if (isReplace) {
                  mappingData = Array.isArray(data) ? data.join(',') : data;
              }
              else {
                  mappingData = data;
              }
          }
      }
      return mappingData;
  }

  var dataMatch = /*#__PURE__*/Object.freeze({
    __proto__: null,
    $matchData4Array: $matchData4Array,
    $matchData4Object: $matchData4Object,
    $matchData4String: $matchData4String
  });

  class ComponentsApiService {
      constructor(apiService, app, $app) {
          ComponentsApiService.__apiService__ = apiService;
          ComponentsApiService.__app__ = app;
          ComponentsApiService.__$app__ = $app;
          this.$initApp();
      }
      /**
       * get app props must values
       */
      static $getAppPropsMustValue(key) {
          if (!Reflect.has(ComponentsApiService.__app__.$props, key)) {
              console.error(`[@vogter/vue3-axios] use ComponentsApiService's components must  has [${key}] props `);
          }
          return Reflect.get(ComponentsApiService.__app__.$props, key);
      }
      /**
       * get app props values
       */
      static $getAppPropsValue(key) {
          return Reflect.get(ComponentsApiService.__app__.$props, key);
      }
      /**
       * init components api service
       * @param instance
       */
      static $initComponentsApiService(instance) {
          instance.$setApiParams && instance.$setApiParams();
          instance.$setUiParams && instance.$setUiParams();
      }
      /**
       * init app
       */
      $initApp() {
          return this.$initAppProps()
              .$initAppData()
              .$initAppWatch()
              .$initAppComputed();
      }
      /**
       * init app props
       * The [props] can't be modified. Record what [props] are needed and what the structure looks like
       */
      $initAppProps() {
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
          };
          ComponentsApiService.__demo_props__ = _props;
          // ComponentsApiService.__$app__.mixin(_props)
          return this;
      }
      /**
       * init appdata
       */
      $initAppData() {
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
          };
          Object.assign(ComponentsApiService.__app__.$data, { ...data });
          return this;
      }
      /**
       * init app watch
       */
      $initAppWatch() {
          const app = ComponentsApiService.__app__;
          // watch out  filter
          app.$watch(() => ___default.cloneDeep(app.filter), (newVal, oldVal) => {
              this.$setApiParams();
              this.$setUiParams();
          }, { deep: true, immediate: false });
          // watch my filter
          app.$watch(() => ___default.cloneDeep(app.myFilter), (newVal, oldVal) => {
              this.$setApiParams();
              this.$setUiParams();
          }, { deep: true, immediate: false });
          // watch apiParms and fetchApiData
          app.$watch(() => ___default.cloneDeep(app.apiParams), (newVal, oldVal) => {
              if (___default.isEqual(newVal, oldVal)) {
                  return;
              }
              let { isApiFirstFetched, apiSuspend } = app;
              if (isApiFirstFetched) {
                  isApiFirstFetched = false;
                  // first fetch api
                  this.$fetchApiData(newVal, apiSuspend);
              }
              else {
                  // other fetch api
                  this.$fetchApiData(newVal);
              }
          }, { deep: true, immediate: false });
          // watch uiParams and filter ApiData
          app.$watch(() => ___default.cloneDeep(app.uiParams), (newVal, oldVal) => {
              if (___default.isEqual(newVal, oldVal)) {
                  return;
              }
              if (app.apiSuspend) {
                  return;
              }
              // use app '$clearData' to clear data
              if (DataCheck.$isFunction(app.$clearData)) {
                  app.$clearData();
              }
              const apiDataStore = app.apiDataStore || {};
              const fetchDatas = apiDataStore.fetchDatas || [];
              fetchDatas.forEach((data) => {
                  data.rendered = false;
                  this.$filterFetchDataByUi(data, newVal);
              });
          }, { deep: true, immediate: false });
          // watch api  ApiData
          app.$watch(() => ___default.cloneDeep(app.api), (newVal, oldVal) => {
              if (___default.isEqual(newVal, oldVal)) {
                  return;
              }
              this.$fetchApiData(app.apiParams);
          }, { deep: true, immediate: false });
          return this;
      }
      /**
       * init app computed
       * The [computed] can't be modified. Record what [computed] are needed and what the structure looks like
       */
      $initAppComputed() {
          return this;
      }
      /**
       * fetch api data and deal data
       * @param filter
       * @param apiSuspend is not api fetch
       */
      $fetchApiData(filter, apiSuspend = false) {
          if (apiSuspend) {
              return;
          }
          const app = ComponentsApiService.__app__;
          // if app has $fetchApiData function use this $fetchApiData to fetch apidata
          if (DataCheck.$isFunction(app.$fetchApiData)) {
              app.$fetchApiData(filter, apiSuspend);
              return;
          }
          const api = ComponentsApiService.$getAppPropsValue('api');
          if (!api || api.length == 0) {
              console.warn(`[@vogter/vue3-axios] please in components set api props`);
              return;
          }
          // use app '$clearData' to clear data
          if (DataCheck.$isFunction(app.$clearData)) {
              app.$clearData();
          }
          const apiDataStore = app.apiDataStore;
          apiDataStore.fetchDatas = [];
          apiDataStore.ready = false;
          apiDataStore.apiReadyCount = 0;
          this.$onFetchData(api, filter);
      }
      /**
       * start fetch data
       * @param api
       * @param filter
       */
      async $onFetchData(apis, filter) {
          if (!apis || apis.length === 0) {
              return;
          }
          if (DataCheck.$isObject(apis)) {
              apis = [apis];
          }
          const len = apis.length;
          for (let i = 0; i < len; i++) {
              const api = apis[i];
              if (!api.apiMethod && !api.apiUrl) {
                  return;
              }
              await this.$oneFetchData(api, i, filter);
          }
      }
      /**
       * one fetchData
       * @param api
       * @param index
       * @param filter
       */
      async $oneFetchData(api, apiIndex, filter) {
          const app = ComponentsApiService.__app__;
          const apiService = ComponentsApiService.__apiService__;
          const { apiMethod, apiUrl, subApis, respMatch } = api;
          let apiOpt = this.$getApiOptions(api, filter);
          // if app has 'beforeFetch' function can  intercept api fetch
          const newApiOpt = DataCheck.$isFunction(app.$beforeFetch) && await app.$beforeFetch(apiOpt, api, filter);
          apiOpt = newApiOpt || apiOpt;
          let resp = {};
          if (apiMethod && apiMethod.length > 0) {
              resp = await apiService.$fetchData(apiMethod, apiOpt, {}).catch((error) => {
                  // if app has 'fetchApiError' function can  intercept api fetch
                  DataCheck.$isFunction(app.$fetchApiError) && app.$fetchApiError({ api, apiMethod, apiOpt, error });
              });
          }
          else if (apiUrl && apiUrl.length > 0) {
              resp = await apiService.$fetchDataByUrl(apiUrl, apiOpt, {}).catch((error) => {
                  // if app has 'fetchApiError' function can  intercept api fetch
                  DataCheck.$isFunction(app.$fetchApiError) && app.$fetchApiError({ api, apiUrl, apiOpt, error });
              });
          }
          let data = this.$handleFetchApiData(resp, respMatch);
          const dataLen = data.length;
          const $everyFetchedHook = (fetchData) => {
              const fetchDatas = app.apiDataStore.fetchDatas;
              fetchDatas.push(fetchData);
              DataCheck.$isFunction(app.$everyFetched) ? app.$everyFetched(fetchData) : this.$everyFetched(fetchData);
          };
          // 请求子接口数据，合并数据
          if (dataLen > 0 && subApis && subApis.length > 0) {
              const len = subApis.length;
              for (let idx = 0; idx < len; idx++) {
                  const api = subApis[idx];
                  data = await this.$fetchSubApi(data, api, filter);
                  if (idx + 1 === len) {
                      $everyFetchedHook({
                          data,
                          rendered: false,
                          apiIndex,
                      });
                  }
              }
          }
          else {
              $everyFetchedHook({
                  data,
                  rendered: false,
                  apiIndex,
              });
          }
          this.$fetchFinished(apiIndex);
      }
      /**
       *  fetch sun api
       * @param mainApiData
       * @param subApi
       * @param filter
       */
      async $fetchSubApi(mainApiData, subApi, filter) {
          const app = ComponentsApiService.__app__;
          const apiService = ComponentsApiService.__apiService__;
          const apiOpt = this.$getSubApiOptions(mainApiData, subApi, filter);
          const { apiMethod, apiUrl, respMatch } = subApi;
          let resp = {};
          if (apiMethod && apiMethod.length > 0) {
              resp = await apiService.$fetchData(apiMethod, apiOpt, {}).catch((error) => {
                  DataCheck.$isFunction(app.$fetchSubApiError) && app.$fetchSubApiError({ subApi, apiMethod, apiOpt, error });
              });
          }
          else if (apiUrl && apiUrl.length > 0) {
              resp = await apiService.$fetchDataByUrl(apiUrl, apiOpt, {}).catch((error) => {
                  DataCheck.$isFunction(app.$fetchSubApiError) && app.$fetchSubApiError({ subApi, apiUrl, apiOpt, error });
              });
          }
          let data = this.$handleFetchApiData(resp, respMatch);
          data = await this.$mergeData(mainApiData, data, subApi);
          return data;
      }
      /**
       * get api data
       */
      $getAllApiData() {
          const app = ComponentsApiService.__app__;
          const apiData = app.apiDataStore || {};
          const fetchDatas = apiData.fetchDatas || [];
          const resultData = [];
          fetchDatas.forEach((d) => {
              const { data } = d || {};
              if (data) {
                  if (DataCheck.$isArray(data)) {
                      // 数组，合并
                      resultData.push(...data);
                  }
                  else {
                      // 对象，追加
                      resultData.push(data);
                  }
              }
          });
          return resultData;
      }
      /**
       * every fetch data hook
       * @param fetchData
       */
      $everyFetched(fetchData) {
          const app = ComponentsApiService.__app__;
          this.$filterFetchDataByUi(fetchData, app.uiParams);
      }
      /**
       * fetch  finish hook
       * @param apiIndex
       */
      $fetchFinished(apiIndex) {
          const app = ComponentsApiService.__app__;
          const api = ComponentsApiService.$getAppPropsMustValue('api');
          const apiDataStore = app.apiDataStore;
          if (DataCheck.$isObject(api)) {
              apiDataStore.apiReadyCount = 1;
              apiDataStore.ready = true;
          }
          else if (DataCheck.$isArray(api)) {
              if (apiDataStore) {
                  let count = apiDataStore.apiReadyCount || 0;
                  count++;
                  apiDataStore.apiReadyCount = count;
                  apiDataStore.ready = api.length === count;
              }
          }
          if (apiDataStore.ready) {
              // if app has $renderFetchData function to redner fetchdata
              DataCheck.$isFunction(app.$renderFetchData) && app.$renderFetchData(apiDataStore);
              const apiDataList = this.$getAllApiData();
              Object.assign(ComponentsApiService.__app__.$data, { apiDataList });
          }
      }
      /**
       * filter data
       * @param fetchData
       * @param uiParams
       */
      $filterFetchDataByUi(fetchData = {}, uiParams) {
          const app = ComponentsApiService.__app__;
          const formatRules = ComponentsApiService.$getAppPropsValue('formatRules');
          const { data } = fetchData;
          fetchData.renderData = this.$filterData(data || [], uiParams, formatRules, null);
          if (DataCheck.$isFunction(app.$renderData)) {
              // use components '$renderData' to renderData
              app.$renderData(fetchData);
          }
      }
      /**
       * set api params
       */
      $setApiParams() {
          let params = {};
          const app = ComponentsApiService.__app__;
          params = ___default.merge(params, {
              isvogterAxios: true
          });
          const { filter, myFilter } = app;
          ___default.merge(params, filter, myFilter);
          app.$data.apiParams = Object.assign(app.$data.apiParams, params || {});
          return params;
      }
      /**
       * set ui params
       */
      $setUiParams() {
          const params = {};
          const app = ComponentsApiService.__app__;
          const match = ComponentsApiService.$getAppPropsValue('uiFilterMatch');
          if (match) {
              let filter = {};
              for (const apiProp in match) {
                  const prop = match[apiProp];
                  if (prop && filter[prop] !== null && filter[prop] !== undefined) {
                      params[apiProp] = filter[prop];
                  }
              }
              filter = app.filter || {};
              for (const apiProp in match) {
                  const prop = match[apiProp];
                  if (prop && filter[prop] !== null && filter[prop] !== undefined) {
                      params[apiProp] = filter[prop];
                  }
              }
              filter = app.myFilter || {};
              for (const apiProp in match) {
                  const prop = match[apiProp];
                  if (prop && filter[prop] !== null && filter[prop] !== undefined) {
                      params[apiProp] = filter[prop];
                  }
              }
          }
          if (Object.keys(params).length > 0) {
              app.$data.uiParams = Object.assign(app.$data.uiParams, params || {});
          }
          return params;
      }
      /**
       * get api options
       * @param api
       * @param filter
       */
      $getApiOptions(api, filter) {
          const app = ComponentsApiService.__app__;
          let { axiosOptions, queryParams, queryParamsMatch, bodyParams, bodyParamsMatch } = api;
          // 全局参数匹配
          let matchedQueryParams = {};
          let matchedBodyParams = {};
          if (queryParamsMatch) {
              // 全局参数
              matchedQueryParams = $matchData4Object(queryParamsMatch, [
                  filter || {},
                  app
              ]);
              queryParams = Object.assign({}, queryParams, matchedQueryParams);
          }
          else {
              queryParams = Object.assign({}, queryParams, filter);
          }
          if (bodyParamsMatch) {
              if (bodyParamsMatch instanceof String || (typeof bodyParamsMatch).toLowerCase()) {
                  // 如果是字符串，则匹配到的数据直接赋值给axios的data参数
                  matchedBodyParams = $matchData4String(bodyParamsMatch, [
                      filter || {},
                      app
                  ]);
                  bodyParams = matchedBodyParams;
              }
              else {
                  // 全局参数
                  matchedBodyParams = $matchData4Object(bodyParamsMatch, [
                      filter || {},
                      app
                  ]);
                  bodyParams = Object.assign({}, bodyParams, matchedBodyParams);
              }
          }
          else if (bodyParams) {
              bodyParams = Object.assign({}, bodyParams, filter);
          }
          // 如果bodyParams、bodyParamsMatch都没有配置，则不输出data参数
          axiosOptions = ___default.merge({}, axiosOptions, bodyParams
              ? {
                  params: queryParams,
                  data: bodyParams
              }
              : {
                  params: queryParams
              });
          return axiosOptions;
      }
      /**
       * get sub api options
       * use fetch api data to match filter to match
       * @param mainApiData
       * @param subApi
       * @param filter
       */
      $getSubApiOptions(mainApiData, subApi, filter) {
          const apiOptions = this.$getApiOptions(subApi, filter);
          const { queryParamsRela, bodyParamsRela } = subApi;
          let { params, data } = apiOptions;
          if (!params) {
              params = apiOptions.params = {};
          }
          for (const paramsProp in queryParamsRela) {
              const mainProp = queryParamsRela[paramsProp];
              const mainPropValue = [];
              mainApiData.forEach((d) => {
                  const propValue = d[mainProp];
                  if (propValue !== null && propValue !== undefined) {
                      mainPropValue.push(propValue);
                  }
              });
              if (mainPropValue.length > 0) {
                  params[mainProp] = mainPropValue.join(',');
              }
          }
          if (!data) {
              data = apiOptions.data = {};
          }
          for (const paramsProp in bodyParamsRela) {
              const mainProp = bodyParamsRela[paramsProp];
              const mainPropValue = [];
              mainApiData.forEach((d) => {
                  const propValue = d[mainProp];
                  if (propValue !== null && propValue !== undefined) {
                      mainPropValue.push(propValue);
                  }
              });
              if (mainPropValue.length > 0) {
                  data[mainProp] = mainPropValue.join(',');
              }
          }
          return apiOptions;
      }
      /**
       * filter data by formatRules
       * @param data
       * @param filter
       * @param formatters
       * @param defaultFomatters
       */
      $filterData(data, filter, formatters, defaultFomatters) {
          let res = data || [];
          // filter = filter || {}
          // 先对条件做层过滤,如果条件为null 或为undefined 直接过滤掉
          const newFilter = {};
          for (const key in filter) {
              if (filter[key] !== null &&
                  filter[key] !== undefined &&
                  filter[key] !== '') {
                  newFilter[key] = filter[key];
              }
          }
          formatters = formatters || [];
          const filterArr = Object.entries(newFilter);
          const matchData = (subKey, subValue) => {
              let matched = true;
              // 值为数组
              if (Array.isArray(subValue)) {
                  for (let i = 0, len = subValue.length; i <= len; i++) {
                      matched = matchData(i, subValue[i]);
                      if (matched) {
                          break;
                      }
                  }
                  // 值为对象
              }
              else if (DataCheck.$isObject(subValue)) {
                  for (const k in subValue) {
                      matched = matchData(k, subValue[k]);
                      if (matched) {
                          break;
                      }
                  }
              }
              else {
                  // 判断属性值在条件中
                  if (filter[subKey] !== null && filter[subKey] !== undefined) {
                      let subMatch = false;
                      filterArr.forEach(([filterKey, filterValue]) => {
                          if (DataCheck.$isArray(filterValue)) {
                              // 数组为或的关系
                              filterValue.forEach((v) => {
                                  subMatch =
                                      subMatch ||
                                          v.indexOf(subValue) > -1 ||
                                          subValue.indexOf(v) > -1;
                              });
                              matched = subMatch;
                          }
                          else {
                              // 与的关系
                              if (typeof subValue === 'string') {
                                  matched =
                                      matched &&
                                          (subValue.indexOf(filterValue) > -1 ||
                                              filterValue.indexOf(subValue) > -1);
                              }
                              else if (typeof subValue === 'number') {
                                  subValue = subValue.toString();
                                  matched =
                                      matched &&
                                          (subValue.indexOf(filterValue) > -1 ||
                                              filterValue.indexOf(subValue) > -1);
                              }
                              else {
                                  matched = matched && filterValue === subValue;
                              }
                          }
                      });
                  }
                  else {
                      matched = false;
                  }
              }
              return matched;
          };
          if (filterArr.length > 0 || formatters.length > 0) {
              res = [];
              for (let i = 0, len = data.length - 1; i <= len; i++) {
                  // 数据格式化处理 暂时不实现
                  formatters.forEach((fmt) => {
                      //this.$doFormat(data[i], fmt, defaultFomatters)
                  });
                  let flag = true;
                  if (filterArr.length) {
                      flag = matchData(i, data[i]);
                  }
                  flag && res.push(data[i]);
              }
          }
          return res;
      }
      /**
       * merage apidata subapiData
       * @param data
       * @param subData
       * @param api
       */
      async $mergeData(data, subData, api) {
          const app = ComponentsApiService.__app__;
          data = data || [];
          subData = subData || [];
          api = api || {};
          const relations = api.mergeRelations;
          // 合并目标属性，用于指定主接口的某个属性数据和子接口进行合并
          const mergeTargetKey = api.mergeTargetKey || '';
          const mergeRules = DataCheck.$isObject(relations)
              ? [relations]
              : relations || [];
          if (data.length === 0 || subData.length === 0) {
              return data;
          }
          // if app  $beforeMerge is function can inspect megrge
          let mergedData = DataCheck.$isFunction(app.$beforeMerge) ? await app.$beforeMerge(data, subData, mergeRules, api) : undefined;
          if (mergedData !== false) {
              mergedData = mergedData || data || [];
              mergeRules.forEach((rule) => {
                  if (rule) {
                      const ruleEntries = Object.entries(rule);
                      // 将要合并的数组转为对象
                      let subDataObj = {};
                      if (api.mergeKey) {
                          // 把处理好的数据挂载在指定的节点中
                          subData.forEach((subD) => {
                              const keys = Object.keys(rule);
                              const attrbute = [];
                              keys.forEach((key) => {
                                  attrbute.push(subD[key]);
                              });
                              const strAttrBute = attrbute.join('_');
                              subDataObj[strAttrBute] = subDataObj[strAttrBute] || {};
                              subDataObj[strAttrBute][api.mergeKey] =
                                  subDataObj[strAttrBute][api.mergeKey] || [];
                              subDataObj[strAttrBute][api.mergeKey].push(subD);
                          });
                      }
                      else {
                          subDataObj = ___default.keyBy(subData, (d) => {
                              const keys = [];
                              ruleEntries.forEach(([key, value]) => {
                                  d[key] && keys.push(d[key]);
                              });
                              return keys.join('_');
                          });
                      }
                      // 合并数据
                      let tempData = mergedData;
                      if (mergeTargetKey && mergeTargetKey.length > 0) {
                          if (DataCheck.$isArray(mergedData)) {
                              tempData = mergedData[0][mergeTargetKey];
                          }
                          else {
                              tempData = mergedData[mergeTargetKey];
                          }
                      }
                      tempData.forEach((d) => {
                          const keys = [];
                          ruleEntries.forEach(([key, value]) => {
                              d[value] && keys.push(d[value]);
                          });
                          const source = subDataObj[keys.join('_')];
                          DataCheck.$isFunction(app.$afterMerge) && app.$beforeEveryMerge(d, source, rule) !== false;
                          source && ___default.merge(d, source);
                          DataCheck.$isFunction(app.$afterEveryMerge) && app.$afterEveryMerge(d, source, rule);
                      });
                  }
              });
              const newData = DataCheck.$isFunction(app.$afterMerge) && await app.$afterMerge(mergedData, subData, mergeRules, data);
              if (newData) {
                  mergedData = newData;
              }
          }
          return mergedData;
      }
      /**
       * handle fetch api data
       * @param resp
       * @param respMatch
       */
      $handleFetchApiData(resp, respMatch = '@data.data@') {
          let data = $matchData4String(respMatch, resp || {});
          if (!DataCheck.$isArray(data)) {
              data = [data];
          }
          return data;
      }
      /**
       * render data demo
       * @param fetchData
       */
      static $renderDataDemo(fetchData) {
          const { rendered = false, renderData = [] } = fetchData;
          if (rendered !== true && renderData && renderData.length > 0) {
              // 进行数据渲染
              fetchData.rendered = true;
          }
      }
      /**
       * render fisinsh fetch data demo
       * @param apiFetchData
       */
      static $renderFetchDataDemo(apiFetchData) {
          //apiReadyCount = 0, ready = false, 
          const { fetchDatas = [] } = apiFetchData;
          fetchDatas.forEach((fetchData) => {
              const { rendered = false, renderData = [] } = fetchData;
              if (rendered !== true && renderData && renderData.length > 0) {
                  // 进行数据渲染
                  fetchData.rendered = true;
              }
          });
      }
  }

  //@ts-nocheck
  let __$app__ = null;
  class mixins {
      constructor($app) {
          this.computed = {
              $apiServiceOpts() {
                  return {
                      overrideMethod: {}
                  };
              }
          };
          __$app__ = $app;
      }
      data() {
          return {
              $apiService: null
          };
      }
      created() {
          this.$apiService = new ApiService(this.$apiServiceOpts);
          if (this.$props.enableCompApiService) {
              this.$data.$componentsApiService = new ComponentsApiService(this.$apiService, this, __$app__);
          }
      }
      mounted() {
          if (this.$props.enableCompApiService) {
              this.$nextTick(() => {
                  this.$data.$componentsApiService && ComponentsApiService.$initComponentsApiService(this.$data.$componentsApiService);
              });
          }
      }
      beforeDestory() {
          this.$apiService.$cancelFetchApi();
          this.$apiService.$disposeAxios();
      }
  }

  const util = {
      ...dataMatch,
      $loadConfig,
      $string2function,
      $dtaCheck: DataCheck
  };

  //@ts-nocheck
  const install = (app, options) => {
      Object.entries(util).forEach(([key, value]) => {
          app.config.globalProperties[key] = value;
      });
      if (!window.$vogter) {
          window.$vogter = {};
      }
      window.$vogter.$apiService = new ApiService();
      util.$loadConfig('/api.json').then(res => {
          window.$vogter.$service_config = res;
      });
      app.mixin(new mixins(app));
  };

  const VogterVueAxios = {
      install
  };

  return VogterVueAxios;

}(axios, _));
