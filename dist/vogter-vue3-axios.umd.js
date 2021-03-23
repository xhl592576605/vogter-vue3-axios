/*!
  * @vogter/vue3-axios v0.0.3
  * (c) 2021 @vogter/vue3-axios axios's extend
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('http'), require('https'), require('url'), require('stream'), require('assert'), require('debug'), require('zlib'), require('lodash')) :
  typeof define === 'function' && define.amd ? define(['http', 'https', 'url', 'stream', 'assert', 'debug', 'zlib', 'lodash'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.VogterVueAxios = factory(global.http, global.https, global.url, global.require$$0$1, global.assert, global.require$$0, global.zlib, global._));
}(this, (function (http, https, url, require$$0$1, assert, require$$0, zlib, _) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e['default'] : e; }

  var http__default = /*#__PURE__*/_interopDefaultLegacy(http);
  var https__default = /*#__PURE__*/_interopDefaultLegacy(https);
  var url__default = /*#__PURE__*/_interopDefaultLegacy(url);
  var require$$0__default$1 = /*#__PURE__*/_interopDefaultLegacy(require$$0$1);
  var assert__default = /*#__PURE__*/_interopDefaultLegacy(assert);
  var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);
  var zlib__default = /*#__PURE__*/_interopDefaultLegacy(zlib);
  var ___default = /*#__PURE__*/_interopDefaultLegacy(_);

  var bind = function bind(fn, thisArg) {
    return function wrap() {
      var args = new Array(arguments.length);
      for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i];
      }
      return fn.apply(thisArg, args);
    };
  };

  /*global toString:true*/

  // utils is a library of generic helper functions non-specific to axios

  var toString = Object.prototype.toString;

  /**
   * Determine if a value is an Array
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an Array, otherwise false
   */
  function isArray(val) {
    return toString.call(val) === '[object Array]';
  }

  /**
   * Determine if a value is undefined
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if the value is undefined, otherwise false
   */
  function isUndefined(val) {
    return typeof val === 'undefined';
  }

  /**
   * Determine if a value is a Buffer
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Buffer, otherwise false
   */
  function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
      && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
  }

  /**
   * Determine if a value is an ArrayBuffer
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an ArrayBuffer, otherwise false
   */
  function isArrayBuffer(val) {
    return toString.call(val) === '[object ArrayBuffer]';
  }

  /**
   * Determine if a value is a FormData
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an FormData, otherwise false
   */
  function isFormData(val) {
    return (typeof FormData !== 'undefined') && (val instanceof FormData);
  }

  /**
   * Determine if a value is a view on an ArrayBuffer
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
   */
  function isArrayBufferView(val) {
    var result;
    if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
      result = ArrayBuffer.isView(val);
    } else {
      result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
    }
    return result;
  }

  /**
   * Determine if a value is a String
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a String, otherwise false
   */
  function isString(val) {
    return typeof val === 'string';
  }

  /**
   * Determine if a value is a Number
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Number, otherwise false
   */
  function isNumber(val) {
    return typeof val === 'number';
  }

  /**
   * Determine if a value is an Object
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is an Object, otherwise false
   */
  function isObject(val) {
    return val !== null && typeof val === 'object';
  }

  /**
   * Determine if a value is a plain Object
   *
   * @param {Object} val The value to test
   * @return {boolean} True if value is a plain Object, otherwise false
   */
  function isPlainObject(val) {
    if (toString.call(val) !== '[object Object]') {
      return false;
    }

    var prototype = Object.getPrototypeOf(val);
    return prototype === null || prototype === Object.prototype;
  }

  /**
   * Determine if a value is a Date
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Date, otherwise false
   */
  function isDate(val) {
    return toString.call(val) === '[object Date]';
  }

  /**
   * Determine if a value is a File
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a File, otherwise false
   */
  function isFile(val) {
    return toString.call(val) === '[object File]';
  }

  /**
   * Determine if a value is a Blob
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Blob, otherwise false
   */
  function isBlob(val) {
    return toString.call(val) === '[object Blob]';
  }

  /**
   * Determine if a value is a Function
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Function, otherwise false
   */
  function isFunction(val) {
    return toString.call(val) === '[object Function]';
  }

  /**
   * Determine if a value is a Stream
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a Stream, otherwise false
   */
  function isStream(val) {
    return isObject(val) && isFunction(val.pipe);
  }

  /**
   * Determine if a value is a URLSearchParams object
   *
   * @param {Object} val The value to test
   * @returns {boolean} True if value is a URLSearchParams object, otherwise false
   */
  function isURLSearchParams(val) {
    return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
  }

  /**
   * Trim excess whitespace off the beginning and end of a string
   *
   * @param {String} str The String to trim
   * @returns {String} The String freed of excess whitespace
   */
  function trim(str) {
    return str.replace(/^\s*/, '').replace(/\s*$/, '');
  }

  /**
   * Determine if we're running in a standard browser environment
   *
   * This allows axios to run in a web worker, and react-native.
   * Both environments support XMLHttpRequest, but not fully standard globals.
   *
   * web workers:
   *  typeof window -> undefined
   *  typeof document -> undefined
   *
   * react-native:
   *  navigator.product -> 'ReactNative'
   * nativescript
   *  navigator.product -> 'NativeScript' or 'NS'
   */
  function isStandardBrowserEnv() {
    if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                             navigator.product === 'NativeScript' ||
                                             navigator.product === 'NS')) {
      return false;
    }
    return (
      typeof window !== 'undefined' &&
      typeof document !== 'undefined'
    );
  }

  /**
   * Iterate over an Array or an Object invoking a function for each item.
   *
   * If `obj` is an Array callback will be called passing
   * the value, index, and complete array for each item.
   *
   * If 'obj' is an Object callback will be called passing
   * the value, key, and complete object for each property.
   *
   * @param {Object|Array} obj The object to iterate
   * @param {Function} fn The callback to invoke for each item
   */
  function forEach(obj, fn) {
    // Don't bother if no value provided
    if (obj === null || typeof obj === 'undefined') {
      return;
    }

    // Force an array if not already something iterable
    if (typeof obj !== 'object') {
      /*eslint no-param-reassign:0*/
      obj = [obj];
    }

    if (isArray(obj)) {
      // Iterate over array values
      for (var i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      // Iterate over object keys
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          fn.call(null, obj[key], key, obj);
        }
      }
    }
  }

  /**
   * Accepts varargs expecting each argument to be an object, then
   * immutably merges the properties of each object and returns result.
   *
   * When multiple objects contain the same key the later object in
   * the arguments list will take precedence.
   *
   * Example:
   *
   * ```js
   * var result = merge({foo: 123}, {foo: 456});
   * console.log(result.foo); // outputs 456
   * ```
   *
   * @param {Object} obj1 Object to merge
   * @returns {Object} Result of all merge properties
   */
  function merge(/* obj1, obj2, obj3, ... */) {
    var result = {};
    function assignValue(val, key) {
      if (isPlainObject(result[key]) && isPlainObject(val)) {
        result[key] = merge(result[key], val);
      } else if (isPlainObject(val)) {
        result[key] = merge({}, val);
      } else if (isArray(val)) {
        result[key] = val.slice();
      } else {
        result[key] = val;
      }
    }

    for (var i = 0, l = arguments.length; i < l; i++) {
      forEach(arguments[i], assignValue);
    }
    return result;
  }

  /**
   * Extends object a by mutably adding to it the properties of object b.
   *
   * @param {Object} a The object to be extended
   * @param {Object} b The object to copy properties from
   * @param {Object} thisArg The object to bind function to
   * @return {Object} The resulting value of object a
   */
  function extend(a, b, thisArg) {
    forEach(b, function assignValue(val, key) {
      if (thisArg && typeof val === 'function') {
        a[key] = bind(val, thisArg);
      } else {
        a[key] = val;
      }
    });
    return a;
  }

  /**
   * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
   *
   * @param {string} content with BOM
   * @return {string} content value without BOM
   */
  function stripBOM(content) {
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.slice(1);
    }
    return content;
  }

  var utils = {
    isArray: isArray,
    isArrayBuffer: isArrayBuffer,
    isBuffer: isBuffer,
    isFormData: isFormData,
    isArrayBufferView: isArrayBufferView,
    isString: isString,
    isNumber: isNumber,
    isObject: isObject,
    isPlainObject: isPlainObject,
    isUndefined: isUndefined,
    isDate: isDate,
    isFile: isFile,
    isBlob: isBlob,
    isFunction: isFunction,
    isStream: isStream,
    isURLSearchParams: isURLSearchParams,
    isStandardBrowserEnv: isStandardBrowserEnv,
    forEach: forEach,
    merge: merge,
    extend: extend,
    trim: trim,
    stripBOM: stripBOM
  };

  function encode(val) {
    return encodeURIComponent(val).
      replace(/%3A/gi, ':').
      replace(/%24/g, '$').
      replace(/%2C/gi, ',').
      replace(/%20/g, '+').
      replace(/%5B/gi, '[').
      replace(/%5D/gi, ']');
  }

  /**
   * Build a URL by appending params to the end
   *
   * @param {string} url The base of the url (e.g., http://www.google.com)
   * @param {object} [params] The params to be appended
   * @returns {string} The formatted url
   */
  var buildURL = function buildURL(url, params, paramsSerializer) {
    /*eslint no-param-reassign:0*/
    if (!params) {
      return url;
    }

    var serializedParams;
    if (paramsSerializer) {
      serializedParams = paramsSerializer(params);
    } else if (utils.isURLSearchParams(params)) {
      serializedParams = params.toString();
    } else {
      var parts = [];

      utils.forEach(params, function serialize(val, key) {
        if (val === null || typeof val === 'undefined') {
          return;
        }

        if (utils.isArray(val)) {
          key = key + '[]';
        } else {
          val = [val];
        }

        utils.forEach(val, function parseValue(v) {
          if (utils.isDate(v)) {
            v = v.toISOString();
          } else if (utils.isObject(v)) {
            v = JSON.stringify(v);
          }
          parts.push(encode(key) + '=' + encode(v));
        });
      });

      serializedParams = parts.join('&');
    }

    if (serializedParams) {
      var hashmarkIndex = url.indexOf('#');
      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }

      url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
    }

    return url;
  };

  function InterceptorManager() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  InterceptorManager.prototype.use = function use(fulfilled, rejected) {
    this.handlers.push({
      fulfilled: fulfilled,
      rejected: rejected
    });
    return this.handlers.length - 1;
  };

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   */
  InterceptorManager.prototype.eject = function eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  };

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   */
  InterceptorManager.prototype.forEach = function forEach(fn) {
    utils.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  };

  var InterceptorManager_1 = InterceptorManager;

  /**
   * Transform the data for a request or a response
   *
   * @param {Object|String} data The data to be transformed
   * @param {Array} headers The headers for the request or response
   * @param {Array|Function} fns A single function or Array of functions
   * @returns {*} The resulting transformed data
   */
  var transformData = function transformData(data, headers, fns) {
    /*eslint no-param-reassign:0*/
    utils.forEach(fns, function transform(fn) {
      data = fn(data, headers);
    });

    return data;
  };

  var isCancel = function isCancel(value) {
    return !!(value && value.__CANCEL__);
  };

  var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
    utils.forEach(headers, function processHeader(value, name) {
      if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
        headers[normalizedName] = value;
        delete headers[name];
      }
    });
  };

  /**
   * Update an Error with the specified config, error code, and response.
   *
   * @param {Error} error The error to update.
   * @param {Object} config The config.
   * @param {string} [code] The error code (for example, 'ECONNABORTED').
   * @param {Object} [request] The request.
   * @param {Object} [response] The response.
   * @returns {Error} The error.
   */
  var enhanceError = function enhanceError(error, config, code, request, response) {
    error.config = config;
    if (code) {
      error.code = code;
    }

    error.request = request;
    error.response = response;
    error.isAxiosError = true;

    error.toJSON = function toJSON() {
      return {
        // Standard
        message: this.message,
        name: this.name,
        // Microsoft
        description: this.description,
        number: this.number,
        // Mozilla
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        // Axios
        config: this.config,
        code: this.code
      };
    };
    return error;
  };

  /**
   * Create an Error with the specified message, config, error code, request and response.
   *
   * @param {string} message The error message.
   * @param {Object} config The config.
   * @param {string} [code] The error code (for example, 'ECONNABORTED').
   * @param {Object} [request] The request.
   * @param {Object} [response] The response.
   * @returns {Error} The created error.
   */
  var createError = function createError(message, config, code, request, response) {
    var error = new Error(message);
    return enhanceError(error, config, code, request, response);
  };

  /**
   * Resolve or reject a Promise based on response status.
   *
   * @param {Function} resolve A function that resolves the promise.
   * @param {Function} reject A function that rejects the promise.
   * @param {object} response The response.
   */
  var settle = function settle(resolve, reject, response) {
    var validateStatus = response.config.validateStatus;
    if (!response.status || !validateStatus || validateStatus(response.status)) {
      resolve(response);
    } else {
      reject(createError(
        'Request failed with status code ' + response.status,
        response.config,
        null,
        response.request,
        response
      ));
    }
  };

  var cookies = (
    utils.isStandardBrowserEnv() ?

    // Standard browser envs support document.cookie
      (function standardBrowserEnv() {
        return {
          write: function write(name, value, expires, path, domain, secure) {
            var cookie = [];
            cookie.push(name + '=' + encodeURIComponent(value));

            if (utils.isNumber(expires)) {
              cookie.push('expires=' + new Date(expires).toGMTString());
            }

            if (utils.isString(path)) {
              cookie.push('path=' + path);
            }

            if (utils.isString(domain)) {
              cookie.push('domain=' + domain);
            }

            if (secure === true) {
              cookie.push('secure');
            }

            document.cookie = cookie.join('; ');
          },

          read: function read(name) {
            var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
            return (match ? decodeURIComponent(match[3]) : null);
          },

          remove: function remove(name) {
            this.write(name, '', Date.now() - 86400000);
          }
        };
      })() :

    // Non standard browser env (web workers, react-native) lack needed support.
      (function nonStandardBrowserEnv() {
        return {
          write: function write() {},
          read: function read() { return null; },
          remove: function remove() {}
        };
      })()
  );

  /**
   * Determines whether the specified URL is absolute
   *
   * @param {string} url The URL to test
   * @returns {boolean} True if the specified URL is absolute, otherwise false
   */
  var isAbsoluteURL = function isAbsoluteURL(url) {
    // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
    // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
    // by any combination of letters, digits, plus, period, or hyphen.
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
  };

  /**
   * Creates a new URL by combining the specified URLs
   *
   * @param {string} baseURL The base URL
   * @param {string} relativeURL The relative URL
   * @returns {string} The combined URL
   */
  var combineURLs = function combineURLs(baseURL, relativeURL) {
    return relativeURL
      ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
      : baseURL;
  };

  /**
   * Creates a new URL by combining the baseURL with the requestedURL,
   * only when the requestedURL is not already an absolute URL.
   * If the requestURL is absolute, this function returns the requestedURL untouched.
   *
   * @param {string} baseURL The base URL
   * @param {string} requestedURL Absolute or relative URL to combine
   * @returns {string} The combined full path
   */
  var buildFullPath = function buildFullPath(baseURL, requestedURL) {
    if (baseURL && !isAbsoluteURL(requestedURL)) {
      return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
  };

  // Headers whose duplicates are ignored by node
  // c.f. https://nodejs.org/api/http.html#http_message_headers
  var ignoreDuplicateOf = [
    'age', 'authorization', 'content-length', 'content-type', 'etag',
    'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
    'last-modified', 'location', 'max-forwards', 'proxy-authorization',
    'referer', 'retry-after', 'user-agent'
  ];

  /**
   * Parse headers into an object
   *
   * ```
   * Date: Wed, 27 Aug 2014 08:58:49 GMT
   * Content-Type: application/json
   * Connection: keep-alive
   * Transfer-Encoding: chunked
   * ```
   *
   * @param {String} headers Headers needing to be parsed
   * @returns {Object} Headers parsed into an object
   */
  var parseHeaders = function parseHeaders(headers) {
    var parsed = {};
    var key;
    var val;
    var i;

    if (!headers) { return parsed; }

    utils.forEach(headers.split('\n'), function parser(line) {
      i = line.indexOf(':');
      key = utils.trim(line.substr(0, i)).toLowerCase();
      val = utils.trim(line.substr(i + 1));

      if (key) {
        if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
          return;
        }
        if (key === 'set-cookie') {
          parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
        } else {
          parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
        }
      }
    });

    return parsed;
  };

  var isURLSameOrigin = (
    utils.isStandardBrowserEnv() ?

    // Standard browser envs have full support of the APIs needed to test
    // whether the request URL is of the same origin as current location.
      (function standardBrowserEnv() {
        var msie = /(msie|trident)/i.test(navigator.userAgent);
        var urlParsingNode = document.createElement('a');
        var originURL;

        /**
      * Parse a URL to discover it's components
      *
      * @param {String} url The URL to be parsed
      * @returns {Object}
      */
        function resolveURL(url) {
          var href = url;

          if (msie) {
          // IE needs attribute set twice to normalize properties
            urlParsingNode.setAttribute('href', href);
            href = urlParsingNode.href;
          }

          urlParsingNode.setAttribute('href', href);

          // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
          return {
            href: urlParsingNode.href,
            protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
            host: urlParsingNode.host,
            search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
            hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
            hostname: urlParsingNode.hostname,
            port: urlParsingNode.port,
            pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
              urlParsingNode.pathname :
              '/' + urlParsingNode.pathname
          };
        }

        originURL = resolveURL(window.location.href);

        /**
      * Determine if a URL shares the same origin as the current location
      *
      * @param {String} requestURL The URL to test
      * @returns {boolean} True if URL shares the same origin, otherwise false
      */
        return function isURLSameOrigin(requestURL) {
          var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
          return (parsed.protocol === originURL.protocol &&
              parsed.host === originURL.host);
        };
      })() :

    // Non standard browser envs (web workers, react-native) lack needed support.
      (function nonStandardBrowserEnv() {
        return function isURLSameOrigin() {
          return true;
        };
      })()
  );

  var xhr = function xhrAdapter(config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      var requestData = config.data;
      var requestHeaders = config.headers;

      if (utils.isFormData(requestData)) {
        delete requestHeaders['Content-Type']; // Let the browser set it
      }

      var request = new XMLHttpRequest();

      // HTTP basic authentication
      if (config.auth) {
        var username = config.auth.username || '';
        var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
        requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
      }

      var fullPath = buildFullPath(config.baseURL, config.url);
      request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

      // Set the request timeout in MS
      request.timeout = config.timeout;

      // Listen for ready state
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }

        // Prepare the response
        var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
        var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
        var response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config: config,
          request: request
        };

        settle(resolve, reject, response);

        // Clean up request
        request = null;
      };

      // Handle browser request cancellation (as opposed to a manual cancellation)
      request.onabort = function handleAbort() {
        if (!request) {
          return;
        }

        reject(createError('Request aborted', config, 'ECONNABORTED', request));

        // Clean up request
        request = null;
      };

      // Handle low level network errors
      request.onerror = function handleError() {
        // Real errors are hidden from us by the browser
        // onerror should only fire if it's a network error
        reject(createError('Network Error', config, null, request));

        // Clean up request
        request = null;
      };

      // Handle timeout
      request.ontimeout = function handleTimeout() {
        var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
        if (config.timeoutErrorMessage) {
          timeoutErrorMessage = config.timeoutErrorMessage;
        }
        reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
          request));

        // Clean up request
        request = null;
      };

      // Add xsrf header
      // This is only done if running in a standard browser environment.
      // Specifically not if we're in a web worker, or react-native.
      if (utils.isStandardBrowserEnv()) {
        // Add xsrf header
        var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
          cookies.read(config.xsrfCookieName) :
          undefined;

        if (xsrfValue) {
          requestHeaders[config.xsrfHeaderName] = xsrfValue;
        }
      }

      // Add headers to the request
      if ('setRequestHeader' in request) {
        utils.forEach(requestHeaders, function setRequestHeader(val, key) {
          if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
            // Remove Content-Type if data is undefined
            delete requestHeaders[key];
          } else {
            // Otherwise add header to the request
            request.setRequestHeader(key, val);
          }
        });
      }

      // Add withCredentials to request if needed
      if (!utils.isUndefined(config.withCredentials)) {
        request.withCredentials = !!config.withCredentials;
      }

      // Add responseType to request if needed
      if (config.responseType) {
        try {
          request.responseType = config.responseType;
        } catch (e) {
          // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
          // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
          if (config.responseType !== 'json') {
            throw e;
          }
        }
      }

      // Handle progress if needed
      if (typeof config.onDownloadProgress === 'function') {
        request.addEventListener('progress', config.onDownloadProgress);
      }

      // Not all browsers support upload events
      if (typeof config.onUploadProgress === 'function' && request.upload) {
        request.upload.addEventListener('progress', config.onUploadProgress);
      }

      if (config.cancelToken) {
        // Handle cancellation
        config.cancelToken.promise.then(function onCanceled(cancel) {
          if (!request) {
            return;
          }

          request.abort();
          reject(cancel);
          // Clean up request
          request = null;
        });
      }

      if (!requestData) {
        requestData = null;
      }

      // Send the request
      request.send(requestData);
    });
  };

  var debug;

  var debug_1 = function () {
    if (!debug) {
      try {
        /* eslint global-require: off */
        debug = require$$0__default("follow-redirects");
      }
      catch (error) {
        debug = function () { /* */ };
      }
    }
    debug.apply(null, arguments);
  };

  var URL = url__default.URL;


  var Writable = require$$0__default$1.Writable;



  // Create handlers that pass events from native requests
  var eventHandlers = Object.create(null);
  ["abort", "aborted", "connect", "error", "socket", "timeout"].forEach(function (event) {
    eventHandlers[event] = function (arg1, arg2, arg3) {
      this._redirectable.emit(event, arg1, arg2, arg3);
    };
  });

  // Error types with codes
  var RedirectionError = createErrorType(
    "ERR_FR_REDIRECTION_FAILURE",
    ""
  );
  var TooManyRedirectsError = createErrorType(
    "ERR_FR_TOO_MANY_REDIRECTS",
    "Maximum number of redirects exceeded"
  );
  var MaxBodyLengthExceededError = createErrorType(
    "ERR_FR_MAX_BODY_LENGTH_EXCEEDED",
    "Request body larger than maxBodyLength limit"
  );
  var WriteAfterEndError = createErrorType(
    "ERR_STREAM_WRITE_AFTER_END",
    "write after end"
  );

  // An HTTP(S) request that can be redirected
  function RedirectableRequest(options, responseCallback) {
    // Initialize the request
    Writable.call(this);
    this._sanitizeOptions(options);
    this._options = options;
    this._ended = false;
    this._ending = false;
    this._redirectCount = 0;
    this._redirects = [];
    this._requestBodyLength = 0;
    this._requestBodyBuffers = [];

    // Attach a callback if passed
    if (responseCallback) {
      this.on("response", responseCallback);
    }

    // React to responses of native requests
    var self = this;
    this._onNativeResponse = function (response) {
      self._processResponse(response);
    };

    // Perform the first request
    this._performRequest();
  }
  RedirectableRequest.prototype = Object.create(Writable.prototype);

  RedirectableRequest.prototype.abort = function () {
    // Abort the internal request
    this._currentRequest.removeAllListeners();
    this._currentRequest.on("error", noop);
    this._currentRequest.abort();

    // Abort this request
    this.emit("abort");
    this.removeAllListeners();
  };

  // Writes buffered data to the current native request
  RedirectableRequest.prototype.write = function (data, encoding, callback) {
    // Writing is not allowed if end has been called
    if (this._ending) {
      throw new WriteAfterEndError();
    }

    // Validate input and shift parameters if necessary
    if (!(typeof data === "string" || typeof data === "object" && ("length" in data))) {
      throw new TypeError("data should be a string, Buffer or Uint8Array");
    }
    if (typeof encoding === "function") {
      callback = encoding;
      encoding = null;
    }

    // Ignore empty buffers, since writing them doesn't invoke the callback
    // https://github.com/nodejs/node/issues/22066
    if (data.length === 0) {
      if (callback) {
        callback();
      }
      return;
    }
    // Only write when we don't exceed the maximum body length
    if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
      this._requestBodyLength += data.length;
      this._requestBodyBuffers.push({ data: data, encoding: encoding });
      this._currentRequest.write(data, encoding, callback);
    }
    // Error when we exceed the maximum body length
    else {
      this.emit("error", new MaxBodyLengthExceededError());
      this.abort();
    }
  };

  // Ends the current native request
  RedirectableRequest.prototype.end = function (data, encoding, callback) {
    // Shift parameters if necessary
    if (typeof data === "function") {
      callback = data;
      data = encoding = null;
    }
    else if (typeof encoding === "function") {
      callback = encoding;
      encoding = null;
    }

    // Write data if needed and end
    if (!data) {
      this._ended = this._ending = true;
      this._currentRequest.end(null, null, callback);
    }
    else {
      var self = this;
      var currentRequest = this._currentRequest;
      this.write(data, encoding, function () {
        self._ended = true;
        currentRequest.end(null, null, callback);
      });
      this._ending = true;
    }
  };

  // Sets a header value on the current native request
  RedirectableRequest.prototype.setHeader = function (name, value) {
    this._options.headers[name] = value;
    this._currentRequest.setHeader(name, value);
  };

  // Clears a header value on the current native request
  RedirectableRequest.prototype.removeHeader = function (name) {
    delete this._options.headers[name];
    this._currentRequest.removeHeader(name);
  };

  // Global timeout for all underlying requests
  RedirectableRequest.prototype.setTimeout = function (msecs, callback) {
    var self = this;
    if (callback) {
      this.on("timeout", callback);
    }

    // Sets up a timer to trigger a timeout event
    function startTimer() {
      if (self._timeout) {
        clearTimeout(self._timeout);
      }
      self._timeout = setTimeout(function () {
        self.emit("timeout");
        clearTimer();
      }, msecs);
    }

    // Prevent a timeout from triggering
    function clearTimer() {
      clearTimeout(this._timeout);
      if (callback) {
        self.removeListener("timeout", callback);
      }
      if (!this.socket) {
        self._currentRequest.removeListener("socket", startTimer);
      }
    }

    // Start the timer when the socket is opened
    if (this.socket) {
      startTimer();
    }
    else {
      this._currentRequest.once("socket", startTimer);
    }

    this.once("response", clearTimer);
    this.once("error", clearTimer);

    return this;
  };

  // Proxy all other public ClientRequest methods
  [
    "flushHeaders", "getHeader",
    "setNoDelay", "setSocketKeepAlive",
  ].forEach(function (method) {
    RedirectableRequest.prototype[method] = function (a, b) {
      return this._currentRequest[method](a, b);
    };
  });

  // Proxy all public ClientRequest properties
  ["aborted", "connection", "socket"].forEach(function (property) {
    Object.defineProperty(RedirectableRequest.prototype, property, {
      get: function () { return this._currentRequest[property]; },
    });
  });

  RedirectableRequest.prototype._sanitizeOptions = function (options) {
    // Ensure headers are always present
    if (!options.headers) {
      options.headers = {};
    }

    // Since http.request treats host as an alias of hostname,
    // but the url module interprets host as hostname plus port,
    // eliminate the host property to avoid confusion.
    if (options.host) {
      // Use hostname if set, because it has precedence
      if (!options.hostname) {
        options.hostname = options.host;
      }
      delete options.host;
    }

    // Complete the URL object when necessary
    if (!options.pathname && options.path) {
      var searchPos = options.path.indexOf("?");
      if (searchPos < 0) {
        options.pathname = options.path;
      }
      else {
        options.pathname = options.path.substring(0, searchPos);
        options.search = options.path.substring(searchPos);
      }
    }
  };


  // Executes the next native request (initial or redirect)
  RedirectableRequest.prototype._performRequest = function () {
    // Load the native protocol
    var protocol = this._options.protocol;
    var nativeProtocol = this._options.nativeProtocols[protocol];
    if (!nativeProtocol) {
      this.emit("error", new TypeError("Unsupported protocol " + protocol));
      return;
    }

    // If specified, use the agent corresponding to the protocol
    // (HTTP and HTTPS use different types of agents)
    if (this._options.agents) {
      var scheme = protocol.substr(0, protocol.length - 1);
      this._options.agent = this._options.agents[scheme];
    }

    // Create the native request
    var request = this._currentRequest =
          nativeProtocol.request(this._options, this._onNativeResponse);
    this._currentUrl = url__default.format(this._options);

    // Set up event handlers
    request._redirectable = this;
    for (var event in eventHandlers) {
      /* istanbul ignore else */
      if (event) {
        request.on(event, eventHandlers[event]);
      }
    }

    // End a redirected request
    // (The first request must be ended explicitly with RedirectableRequest#end)
    if (this._isRedirect) {
      // Write the request entity and end.
      var i = 0;
      var self = this;
      var buffers = this._requestBodyBuffers;
      (function writeNext(error) {
        // Only write if this request has not been redirected yet
        /* istanbul ignore else */
        if (request === self._currentRequest) {
          // Report any write errors
          /* istanbul ignore if */
          if (error) {
            self.emit("error", error);
          }
          // Write the next buffer if there are still left
          else if (i < buffers.length) {
            var buffer = buffers[i++];
            /* istanbul ignore else */
            if (!request.finished) {
              request.write(buffer.data, buffer.encoding, writeNext);
            }
          }
          // End the request if `end` has been called on us
          else if (self._ended) {
            request.end();
          }
        }
      }());
    }
  };

  // Processes a response from the current native request
  RedirectableRequest.prototype._processResponse = function (response) {
    // Store the redirected response
    var statusCode = response.statusCode;
    if (this._options.trackRedirects) {
      this._redirects.push({
        url: this._currentUrl,
        headers: response.headers,
        statusCode: statusCode,
      });
    }

    // RFC7231§6.4: The 3xx (Redirection) class of status code indicates
    // that further action needs to be taken by the user agent in order to
    // fulfill the request. If a Location header field is provided,
    // the user agent MAY automatically redirect its request to the URI
    // referenced by the Location field value,
    // even if the specific status code is not understood.
    var location = response.headers.location;
    if (location && this._options.followRedirects !== false &&
        statusCode >= 300 && statusCode < 400) {
      // Abort the current request
      this._currentRequest.removeAllListeners();
      this._currentRequest.on("error", noop);
      this._currentRequest.abort();
      // Discard the remainder of the response to avoid waiting for data
      response.destroy();

      // RFC7231§6.4: A client SHOULD detect and intervene
      // in cyclical redirections (i.e., "infinite" redirection loops).
      if (++this._redirectCount > this._options.maxRedirects) {
        this.emit("error", new TooManyRedirectsError());
        return;
      }

      // RFC7231§6.4: Automatic redirection needs to done with
      // care for methods not known to be safe, […]
      // RFC7231§6.4.2–3: For historical reasons, a user agent MAY change
      // the request method from POST to GET for the subsequent request.
      if ((statusCode === 301 || statusCode === 302) && this._options.method === "POST" ||
          // RFC7231§6.4.4: The 303 (See Other) status code indicates that
          // the server is redirecting the user agent to a different resource […]
          // A user agent can perform a retrieval request targeting that URI
          // (a GET or HEAD request if using HTTP) […]
          (statusCode === 303) && !/^(?:GET|HEAD)$/.test(this._options.method)) {
        this._options.method = "GET";
        // Drop a possible entity and headers related to it
        this._requestBodyBuffers = [];
        removeMatchingHeaders(/^content-/i, this._options.headers);
      }

      // Drop the Host header, as the redirect might lead to a different host
      var previousHostName = removeMatchingHeaders(/^host$/i, this._options.headers) ||
        url__default.parse(this._currentUrl).hostname;

      // Create the redirected request
      var redirectUrl = url__default.resolve(this._currentUrl, location);
      debug_1("redirecting to", redirectUrl);
      this._isRedirect = true;
      var redirectUrlParts = url__default.parse(redirectUrl);
      Object.assign(this._options, redirectUrlParts);

      // Drop the Authorization header if redirecting to another host
      if (redirectUrlParts.hostname !== previousHostName) {
        removeMatchingHeaders(/^authorization$/i, this._options.headers);
      }

      // Evaluate the beforeRedirect callback
      if (typeof this._options.beforeRedirect === "function") {
        var responseDetails = { headers: response.headers };
        try {
          this._options.beforeRedirect.call(null, this._options, responseDetails);
        }
        catch (err) {
          this.emit("error", err);
          return;
        }
        this._sanitizeOptions(this._options);
      }

      // Perform the redirected request
      try {
        this._performRequest();
      }
      catch (cause) {
        var error = new RedirectionError("Redirected request failed: " + cause.message);
        error.cause = cause;
        this.emit("error", error);
      }
    }
    else {
      // The response is not a redirect; return it as-is
      response.responseUrl = this._currentUrl;
      response.redirects = this._redirects;
      this.emit("response", response);

      // Clean up
      this._requestBodyBuffers = [];
    }
  };

  // Wraps the key/value object of protocols with redirect functionality
  function wrap(protocols) {
    // Default settings
    var exports = {
      maxRedirects: 21,
      maxBodyLength: 10 * 1024 * 1024,
    };

    // Wrap each protocol
    var nativeProtocols = {};
    Object.keys(protocols).forEach(function (scheme) {
      var protocol = scheme + ":";
      var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
      var wrappedProtocol = exports[scheme] = Object.create(nativeProtocol);

      // Executes a request, following redirects
      function request(input, options, callback) {
        // Parse parameters
        if (typeof input === "string") {
          var urlStr = input;
          try {
            input = urlToOptions(new URL(urlStr));
          }
          catch (err) {
            /* istanbul ignore next */
            input = url__default.parse(urlStr);
          }
        }
        else if (URL && (input instanceof URL)) {
          input = urlToOptions(input);
        }
        else {
          callback = options;
          options = input;
          input = { protocol: protocol };
        }
        if (typeof options === "function") {
          callback = options;
          options = null;
        }

        // Set defaults
        options = Object.assign({
          maxRedirects: exports.maxRedirects,
          maxBodyLength: exports.maxBodyLength,
        }, input, options);
        options.nativeProtocols = nativeProtocols;

        assert__default.equal(options.protocol, protocol, "protocol mismatch");
        debug_1("options", options);
        return new RedirectableRequest(options, callback);
      }

      // Executes a GET request, following redirects
      function get(input, options, callback) {
        var wrappedRequest = wrappedProtocol.request(input, options, callback);
        wrappedRequest.end();
        return wrappedRequest;
      }

      // Expose the properties on the wrapped protocol
      Object.defineProperties(wrappedProtocol, {
        request: { value: request, configurable: true, enumerable: true, writable: true },
        get: { value: get, configurable: true, enumerable: true, writable: true },
      });
    });
    return exports;
  }

  /* istanbul ignore next */
  function noop() { /* empty */ }

  // from https://github.com/nodejs/node/blob/master/lib/internal/url.js
  function urlToOptions(urlObject) {
    var options = {
      protocol: urlObject.protocol,
      hostname: urlObject.hostname.startsWith("[") ?
        /* istanbul ignore next */
        urlObject.hostname.slice(1, -1) :
        urlObject.hostname,
      hash: urlObject.hash,
      search: urlObject.search,
      pathname: urlObject.pathname,
      path: urlObject.pathname + urlObject.search,
      href: urlObject.href,
    };
    if (urlObject.port !== "") {
      options.port = Number(urlObject.port);
    }
    return options;
  }

  function removeMatchingHeaders(regex, headers) {
    var lastValue;
    for (var header in headers) {
      if (regex.test(header)) {
        lastValue = headers[header];
        delete headers[header];
      }
    }
    return lastValue;
  }

  function createErrorType(code, defaultMessage) {
    function CustomError(message) {
      Error.captureStackTrace(this, this.constructor);
      this.message = message || defaultMessage;
    }
    CustomError.prototype = new Error();
    CustomError.prototype.constructor = CustomError;
    CustomError.prototype.name = "Error [" + code + "]";
    CustomError.prototype.code = code;
    return CustomError;
  }

  // Exports
  var followRedirects = wrap({ http: http__default, https: https__default });
  var wrap_1 = wrap;
  followRedirects.wrap = wrap_1;

  var _from = "axios@^0.21.1";
  var _id = "axios@0.21.1";
  var _inBundle = false;
  var _integrity = "sha512-dKQiRHxGD9PPRIUNIWvZhPTPpl1rf/OxTYKsqKUDjBwYylTvV7SjSHJb9ratfyzM6wCdLCOYLzs73qpg5c4iGA==";
  var _location = "/axios";
  var _phantomChildren = {
  };
  var _requested = {
  	type: "range",
  	registry: true,
  	raw: "axios@^0.21.1",
  	name: "axios",
  	escapedName: "axios",
  	rawSpec: "^0.21.1",
  	saveSpec: null,
  	fetchSpec: "^0.21.1"
  };
  var _requiredBy = [
  	"/"
  ];
  var _resolved = "https://registry.npmjs.org/axios/-/axios-0.21.1.tgz";
  var _shasum = "22563481962f4d6bde9a76d516ef0e5d3c09b2b8";
  var _spec = "axios@^0.21.1";
  var _where = "E:\\HANS\\SourceCode\\vogter-vue\\vogter-vue3-axios";
  var author = {
  	name: "Matt Zabriskie"
  };
  var browser = {
  	"./lib/adapters/http.js": "./lib/adapters/xhr.js"
  };
  var bugs = {
  	url: "https://github.com/axios/axios/issues"
  };
  var bundleDependencies = false;
  var bundlesize = [
  	{
  		path: "./dist/axios.min.js",
  		threshold: "5kB"
  	}
  ];
  var dependencies = {
  	"follow-redirects": "^1.10.0"
  };
  var deprecated = false;
  var description = "Promise based HTTP client for the browser and node.js";
  var devDependencies = {
  	bundlesize: "^0.17.0",
  	coveralls: "^3.0.0",
  	"es6-promise": "^4.2.4",
  	grunt: "^1.0.2",
  	"grunt-banner": "^0.6.0",
  	"grunt-cli": "^1.2.0",
  	"grunt-contrib-clean": "^1.1.0",
  	"grunt-contrib-watch": "^1.0.0",
  	"grunt-eslint": "^20.1.0",
  	"grunt-karma": "^2.0.0",
  	"grunt-mocha-test": "^0.13.3",
  	"grunt-ts": "^6.0.0-beta.19",
  	"grunt-webpack": "^1.0.18",
  	"istanbul-instrumenter-loader": "^1.0.0",
  	"jasmine-core": "^2.4.1",
  	karma: "^1.3.0",
  	"karma-chrome-launcher": "^2.2.0",
  	"karma-coverage": "^1.1.1",
  	"karma-firefox-launcher": "^1.1.0",
  	"karma-jasmine": "^1.1.1",
  	"karma-jasmine-ajax": "^0.1.13",
  	"karma-opera-launcher": "^1.0.0",
  	"karma-safari-launcher": "^1.0.0",
  	"karma-sauce-launcher": "^1.2.0",
  	"karma-sinon": "^1.0.5",
  	"karma-sourcemap-loader": "^0.3.7",
  	"karma-webpack": "^1.7.0",
  	"load-grunt-tasks": "^3.5.2",
  	minimist: "^1.2.0",
  	mocha: "^5.2.0",
  	sinon: "^4.5.0",
  	typescript: "^2.8.1",
  	"url-search-params": "^0.10.0",
  	webpack: "^1.13.1",
  	"webpack-dev-server": "^1.14.1"
  };
  var homepage = "https://github.com/axios/axios";
  var jsdelivr = "dist/axios.min.js";
  var keywords = [
  	"xhr",
  	"http",
  	"ajax",
  	"promise",
  	"node"
  ];
  var license = "MIT";
  var main = "index.js";
  var name = "axios";
  var repository = {
  	type: "git",
  	url: "git+https://github.com/axios/axios.git"
  };
  var scripts = {
  	build: "NODE_ENV=production grunt build",
  	coveralls: "cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js",
  	examples: "node ./examples/server.js",
  	fix: "eslint --fix lib/**/*.js",
  	postversion: "git push && git push --tags",
  	preversion: "npm test",
  	start: "node ./sandbox/server.js",
  	test: "grunt test && bundlesize",
  	version: "npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json"
  };
  var typings = "./index.d.ts";
  var unpkg = "dist/axios.min.js";
  var version = "0.21.1";
  var pkg = {
  	_from: _from,
  	_id: _id,
  	_inBundle: _inBundle,
  	_integrity: _integrity,
  	_location: _location,
  	_phantomChildren: _phantomChildren,
  	_requested: _requested,
  	_requiredBy: _requiredBy,
  	_resolved: _resolved,
  	_shasum: _shasum,
  	_spec: _spec,
  	_where: _where,
  	author: author,
  	browser: browser,
  	bugs: bugs,
  	bundleDependencies: bundleDependencies,
  	bundlesize: bundlesize,
  	dependencies: dependencies,
  	deprecated: deprecated,
  	description: description,
  	devDependencies: devDependencies,
  	homepage: homepage,
  	jsdelivr: jsdelivr,
  	keywords: keywords,
  	license: license,
  	main: main,
  	name: name,
  	repository: repository,
  	scripts: scripts,
  	typings: typings,
  	unpkg: unpkg,
  	version: version
  };

  var httpFollow = followRedirects.http;
  var httpsFollow = followRedirects.https;






  var isHttps = /https:?/;

  /**
   *
   * @param {http.ClientRequestArgs} options
   * @param {AxiosProxyConfig} proxy
   * @param {string} location
   */
  function setProxy(options, proxy, location) {
    options.hostname = proxy.host;
    options.host = proxy.host;
    options.port = proxy.port;
    options.path = location;

    // Basic proxy authorization
    if (proxy.auth) {
      var base64 = Buffer.from(proxy.auth.username + ':' + proxy.auth.password, 'utf8').toString('base64');
      options.headers['Proxy-Authorization'] = 'Basic ' + base64;
    }

    // If a proxy is used, any redirects must also pass through the proxy
    options.beforeRedirect = function beforeRedirect(redirection) {
      redirection.headers.host = redirection.host;
      setProxy(redirection, proxy, redirection.href);
    };
  }

  /*eslint consistent-return:0*/
  var http_1 = function httpAdapter(config) {
    return new Promise(function dispatchHttpRequest(resolvePromise, rejectPromise) {
      var resolve = function resolve(value) {
        resolvePromise(value);
      };
      var reject = function reject(value) {
        rejectPromise(value);
      };
      var data = config.data;
      var headers = config.headers;

      // Set User-Agent (required by some servers)
      // Only set header if it hasn't been set in config
      // See https://github.com/axios/axios/issues/69
      if (!headers['User-Agent'] && !headers['user-agent']) {
        headers['User-Agent'] = 'axios/' + pkg.version;
      }

      if (data && !utils.isStream(data)) {
        if (Buffer.isBuffer(data)) ; else if (utils.isArrayBuffer(data)) {
          data = Buffer.from(new Uint8Array(data));
        } else if (utils.isString(data)) {
          data = Buffer.from(data, 'utf-8');
        } else {
          return reject(createError(
            'Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream',
            config
          ));
        }

        // Add Content-Length header if data exists
        headers['Content-Length'] = data.length;
      }

      // HTTP basic authentication
      var auth = undefined;
      if (config.auth) {
        var username = config.auth.username || '';
        var password = config.auth.password || '';
        auth = username + ':' + password;
      }

      // Parse url
      var fullPath = buildFullPath(config.baseURL, config.url);
      var parsed = url__default.parse(fullPath);
      var protocol = parsed.protocol || 'http:';

      if (!auth && parsed.auth) {
        var urlAuth = parsed.auth.split(':');
        var urlUsername = urlAuth[0] || '';
        var urlPassword = urlAuth[1] || '';
        auth = urlUsername + ':' + urlPassword;
      }

      if (auth) {
        delete headers.Authorization;
      }

      var isHttpsRequest = isHttps.test(protocol);
      var agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;

      var options = {
        path: buildURL(parsed.path, config.params, config.paramsSerializer).replace(/^\?/, ''),
        method: config.method.toUpperCase(),
        headers: headers,
        agent: agent,
        agents: { http: config.httpAgent, https: config.httpsAgent },
        auth: auth
      };

      if (config.socketPath) {
        options.socketPath = config.socketPath;
      } else {
        options.hostname = parsed.hostname;
        options.port = parsed.port;
      }

      var proxy = config.proxy;
      if (!proxy && proxy !== false) {
        var proxyEnv = protocol.slice(0, -1) + '_proxy';
        var proxyUrl = process.env[proxyEnv] || process.env[proxyEnv.toUpperCase()];
        if (proxyUrl) {
          var parsedProxyUrl = url__default.parse(proxyUrl);
          var noProxyEnv = process.env.no_proxy || process.env.NO_PROXY;
          var shouldProxy = true;

          if (noProxyEnv) {
            var noProxy = noProxyEnv.split(',').map(function trim(s) {
              return s.trim();
            });

            shouldProxy = !noProxy.some(function proxyMatch(proxyElement) {
              if (!proxyElement) {
                return false;
              }
              if (proxyElement === '*') {
                return true;
              }
              if (proxyElement[0] === '.' &&
                  parsed.hostname.substr(parsed.hostname.length - proxyElement.length) === proxyElement) {
                return true;
              }

              return parsed.hostname === proxyElement;
            });
          }

          if (shouldProxy) {
            proxy = {
              host: parsedProxyUrl.hostname,
              port: parsedProxyUrl.port,
              protocol: parsedProxyUrl.protocol
            };

            if (parsedProxyUrl.auth) {
              var proxyUrlAuth = parsedProxyUrl.auth.split(':');
              proxy.auth = {
                username: proxyUrlAuth[0],
                password: proxyUrlAuth[1]
              };
            }
          }
        }
      }

      if (proxy) {
        options.headers.host = parsed.hostname + (parsed.port ? ':' + parsed.port : '');
        setProxy(options, proxy, protocol + '//' + parsed.hostname + (parsed.port ? ':' + parsed.port : '') + options.path);
      }

      var transport;
      var isHttpsProxy = isHttpsRequest && (proxy ? isHttps.test(proxy.protocol) : true);
      if (config.transport) {
        transport = config.transport;
      } else if (config.maxRedirects === 0) {
        transport = isHttpsProxy ? https__default : http__default;
      } else {
        if (config.maxRedirects) {
          options.maxRedirects = config.maxRedirects;
        }
        transport = isHttpsProxy ? httpsFollow : httpFollow;
      }

      if (config.maxBodyLength > -1) {
        options.maxBodyLength = config.maxBodyLength;
      }

      // Create the request
      var req = transport.request(options, function handleResponse(res) {
        if (req.aborted) return;

        // uncompress the response body transparently if required
        var stream = res;

        // return the last request in case of redirects
        var lastRequest = res.req || req;


        // if no content, is HEAD request or decompress disabled we should not decompress
        if (res.statusCode !== 204 && lastRequest.method !== 'HEAD' && config.decompress !== false) {
          switch (res.headers['content-encoding']) {
          /*eslint default-case:0*/
          case 'gzip':
          case 'compress':
          case 'deflate':
          // add the unzipper to the body stream processing pipeline
            stream = stream.pipe(zlib__default.createUnzip());

            // remove the content-encoding in order to not confuse downstream operations
            delete res.headers['content-encoding'];
            break;
          }
        }

        var response = {
          status: res.statusCode,
          statusText: res.statusMessage,
          headers: res.headers,
          config: config,
          request: lastRequest
        };

        if (config.responseType === 'stream') {
          response.data = stream;
          settle(resolve, reject, response);
        } else {
          var responseBuffer = [];
          stream.on('data', function handleStreamData(chunk) {
            responseBuffer.push(chunk);

            // make sure the content length is not over the maxContentLength if specified
            if (config.maxContentLength > -1 && Buffer.concat(responseBuffer).length > config.maxContentLength) {
              stream.destroy();
              reject(createError('maxContentLength size of ' + config.maxContentLength + ' exceeded',
                config, null, lastRequest));
            }
          });

          stream.on('error', function handleStreamError(err) {
            if (req.aborted) return;
            reject(enhanceError(err, config, null, lastRequest));
          });

          stream.on('end', function handleStreamEnd() {
            var responseData = Buffer.concat(responseBuffer);
            if (config.responseType !== 'arraybuffer') {
              responseData = responseData.toString(config.responseEncoding);
              if (!config.responseEncoding || config.responseEncoding === 'utf8') {
                responseData = utils.stripBOM(responseData);
              }
            }

            response.data = responseData;
            settle(resolve, reject, response);
          });
        }
      });

      // Handle errors
      req.on('error', function handleRequestError(err) {
        if (req.aborted && err.code !== 'ERR_FR_TOO_MANY_REDIRECTS') return;
        reject(enhanceError(err, config, null, req));
      });

      // Handle request timeout
      if (config.timeout) {
        // Sometime, the response will be very slow, and does not respond, the connect event will be block by event loop system.
        // And timer callback will be fired, and abort() will be invoked before connection, then get "socket hang up" and code ECONNRESET.
        // At this time, if we have a large number of request, nodejs will hang up some socket on background. and the number will up and up.
        // And then these socket which be hang up will devoring CPU little by little.
        // ClientRequest.setTimeout will be fired on the specify milliseconds, and can make sure that abort() will be fired after connect.
        req.setTimeout(config.timeout, function handleRequestTimeout() {
          req.abort();
          reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED', req));
        });
      }

      if (config.cancelToken) {
        // Handle cancellation
        config.cancelToken.promise.then(function onCanceled(cancel) {
          if (req.aborted) return;

          req.abort();
          reject(cancel);
        });
      }

      // Send the request
      if (utils.isStream(data)) {
        data.on('error', function handleStreamError(err) {
          reject(enhanceError(err, config, null, req));
        }).pipe(req);
      } else {
        req.end(data);
      }
    });
  };

  var DEFAULT_CONTENT_TYPE = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  function setContentTypeIfUnset(headers, value) {
    if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
      headers['Content-Type'] = value;
    }
  }

  function getDefaultAdapter() {
    var adapter;
    if (typeof XMLHttpRequest !== 'undefined') {
      // For browsers use XHR adapter
      adapter = xhr;
    } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
      // For node use HTTP adapter
      adapter = http_1;
    }
    return adapter;
  }

  var defaults = {
    adapter: getDefaultAdapter(),

    transformRequest: [function transformRequest(data, headers) {
      normalizeHeaderName(headers, 'Accept');
      normalizeHeaderName(headers, 'Content-Type');
      if (utils.isFormData(data) ||
        utils.isArrayBuffer(data) ||
        utils.isBuffer(data) ||
        utils.isStream(data) ||
        utils.isFile(data) ||
        utils.isBlob(data)
      ) {
        return data;
      }
      if (utils.isArrayBufferView(data)) {
        return data.buffer;
      }
      if (utils.isURLSearchParams(data)) {
        setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
        return data.toString();
      }
      if (utils.isObject(data)) {
        setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
        return JSON.stringify(data);
      }
      return data;
    }],

    transformResponse: [function transformResponse(data) {
      /*eslint no-param-reassign:0*/
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) { /* Ignore */ }
      }
      return data;
    }],

    /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     */
    timeout: 0,

    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',

    maxContentLength: -1,
    maxBodyLength: -1,

    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    }
  };

  defaults.headers = {
    common: {
      'Accept': 'application/json, text/plain, */*'
    }
  };

  utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
    defaults.headers[method] = {};
  });

  utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
  });

  var defaults_1 = defaults;

  /**
   * Throws a `Cancel` if cancellation has been requested.
   */
  function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }
  }

  /**
   * Dispatch a request to the server using the configured adapter.
   *
   * @param {object} config The config that is to be used for the request
   * @returns {Promise} The Promise to be fulfilled
   */
  var dispatchRequest = function dispatchRequest(config) {
    throwIfCancellationRequested(config);

    // Ensure headers exist
    config.headers = config.headers || {};

    // Transform request data
    config.data = transformData(
      config.data,
      config.headers,
      config.transformRequest
    );

    // Flatten headers
    config.headers = utils.merge(
      config.headers.common || {},
      config.headers[config.method] || {},
      config.headers
    );

    utils.forEach(
      ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
      function cleanHeaderConfig(method) {
        delete config.headers[method];
      }
    );

    var adapter = config.adapter || defaults_1.adapter;

    return adapter(config).then(function onAdapterResolution(response) {
      throwIfCancellationRequested(config);

      // Transform response data
      response.data = transformData(
        response.data,
        response.headers,
        config.transformResponse
      );

      return response;
    }, function onAdapterRejection(reason) {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config);

        // Transform response data
        if (reason && reason.response) {
          reason.response.data = transformData(
            reason.response.data,
            reason.response.headers,
            config.transformResponse
          );
        }
      }

      return Promise.reject(reason);
    });
  };

  /**
   * Config-specific merge-function which creates a new config-object
   * by merging two configuration objects together.
   *
   * @param {Object} config1
   * @param {Object} config2
   * @returns {Object} New object resulting from merging config2 to config1
   */
  var mergeConfig = function mergeConfig(config1, config2) {
    // eslint-disable-next-line no-param-reassign
    config2 = config2 || {};
    var config = {};

    var valueFromConfig2Keys = ['url', 'method', 'data'];
    var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
    var defaultToConfig2Keys = [
      'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
      'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
      'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
      'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
      'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
    ];
    var directMergeKeys = ['validateStatus'];

    function getMergedValue(target, source) {
      if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
        return utils.merge(target, source);
      } else if (utils.isPlainObject(source)) {
        return utils.merge({}, source);
      } else if (utils.isArray(source)) {
        return source.slice();
      }
      return source;
    }

    function mergeDeepProperties(prop) {
      if (!utils.isUndefined(config2[prop])) {
        config[prop] = getMergedValue(config1[prop], config2[prop]);
      } else if (!utils.isUndefined(config1[prop])) {
        config[prop] = getMergedValue(undefined, config1[prop]);
      }
    }

    utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
      if (!utils.isUndefined(config2[prop])) {
        config[prop] = getMergedValue(undefined, config2[prop]);
      }
    });

    utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

    utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
      if (!utils.isUndefined(config2[prop])) {
        config[prop] = getMergedValue(undefined, config2[prop]);
      } else if (!utils.isUndefined(config1[prop])) {
        config[prop] = getMergedValue(undefined, config1[prop]);
      }
    });

    utils.forEach(directMergeKeys, function merge(prop) {
      if (prop in config2) {
        config[prop] = getMergedValue(config1[prop], config2[prop]);
      } else if (prop in config1) {
        config[prop] = getMergedValue(undefined, config1[prop]);
      }
    });

    var axiosKeys = valueFromConfig2Keys
      .concat(mergeDeepPropertiesKeys)
      .concat(defaultToConfig2Keys)
      .concat(directMergeKeys);

    var otherKeys = Object
      .keys(config1)
      .concat(Object.keys(config2))
      .filter(function filterAxiosKeys(key) {
        return axiosKeys.indexOf(key) === -1;
      });

    utils.forEach(otherKeys, mergeDeepProperties);

    return config;
  };

  /**
   * Create a new instance of Axios
   *
   * @param {Object} instanceConfig The default config for the instance
   */
  function Axios(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager_1(),
      response: new InterceptorManager_1()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {Object} config The config specific for this request (merged with this.defaults)
   */
  Axios.prototype.request = function request(config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof config === 'string') {
      config = arguments[1] || {};
      config.url = arguments[0];
    } else {
      config = config || {};
    }

    config = mergeConfig(this.defaults, config);

    // Set config.method
    if (config.method) {
      config.method = config.method.toLowerCase();
    } else if (this.defaults.method) {
      config.method = this.defaults.method.toLowerCase();
    } else {
      config.method = 'get';
    }

    // Hook up interceptors middleware
    var chain = [dispatchRequest, undefined];
    var promise = Promise.resolve(config);

    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      chain.unshift(interceptor.fulfilled, interceptor.rejected);
    });

    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      chain.push(interceptor.fulfilled, interceptor.rejected);
    });

    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  };

  Axios.prototype.getUri = function getUri(config) {
    config = mergeConfig(this.defaults, config);
    return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
  };

  // Provide aliases for supported request methods
  utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
    /*eslint func-names:0*/
    Axios.prototype[method] = function(url, config) {
      return this.request(mergeConfig(config || {}, {
        method: method,
        url: url,
        data: (config || {}).data
      }));
    };
  });

  utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    /*eslint func-names:0*/
    Axios.prototype[method] = function(url, data, config) {
      return this.request(mergeConfig(config || {}, {
        method: method,
        url: url,
        data: data
      }));
    };
  });

  var Axios_1 = Axios;

  /**
   * A `Cancel` is an object that is thrown when an operation is canceled.
   *
   * @class
   * @param {string=} message The message.
   */
  function Cancel(message) {
    this.message = message;
  }

  Cancel.prototype.toString = function toString() {
    return 'Cancel' + (this.message ? ': ' + this.message : '');
  };

  Cancel.prototype.__CANCEL__ = true;

  var Cancel_1 = Cancel;

  /**
   * A `CancelToken` is an object that can be used to request cancellation of an operation.
   *
   * @class
   * @param {Function} executor The executor function.
   */
  function CancelToken$1(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }

    var resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });

    var token = this;
    executor(function cancel(message) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }

      token.reason = new Cancel_1(message);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `Cancel` if cancellation has been requested.
   */
  CancelToken$1.prototype.throwIfRequested = function throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  };

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  CancelToken$1.source = function source() {
    var cancel;
    var token = new CancelToken$1(function executor(c) {
      cancel = c;
    });
    return {
      token: token,
      cancel: cancel
    };
  };

  var CancelToken_1 = CancelToken$1;

  /**
   * Syntactic sugar for invoking a function and expanding an array for arguments.
   *
   * Common use case would be to use `Function.prototype.apply`.
   *
   *  ```js
   *  function f(x, y, z) {}
   *  var args = [1, 2, 3];
   *  f.apply(null, args);
   *  ```
   *
   * With `spread` this example can be re-written.
   *
   *  ```js
   *  spread(function(x, y, z) {})([1, 2, 3]);
   *  ```
   *
   * @param {Function} callback
   * @returns {Function}
   */
  var spread = function spread(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  };

  /**
   * Determines whether the payload is an error thrown by Axios
   *
   * @param {*} payload The value to test
   * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
   */
  var isAxiosError = function isAxiosError(payload) {
    return (typeof payload === 'object') && (payload.isAxiosError === true);
  };

  /**
   * Create an instance of Axios
   *
   * @param {Object} defaultConfig The default config for the instance
   * @return {Axios} A new instance of Axios
   */
  function createInstance(defaultConfig) {
    var context = new Axios_1(defaultConfig);
    var instance = bind(Axios_1.prototype.request, context);

    // Copy axios.prototype to instance
    utils.extend(instance, Axios_1.prototype, context);

    // Copy context to instance
    utils.extend(instance, context);

    return instance;
  }

  // Create the default instance to be exported
  var axios$1 = createInstance(defaults_1);

  // Expose Axios class to allow class inheritance
  axios$1.Axios = Axios_1;

  // Factory for creating new instances
  axios$1.create = function create(instanceConfig) {
    return createInstance(mergeConfig(axios$1.defaults, instanceConfig));
  };

  // Expose Cancel & CancelToken
  axios$1.Cancel = Cancel_1;
  axios$1.CancelToken = CancelToken_1;
  axios$1.isCancel = isCancel;

  // Expose all/spread
  axios$1.all = function all(promises) {
    return Promise.all(promises);
  };
  axios$1.spread = spread;

  // Expose isAxiosError
  axios$1.isAxiosError = isAxiosError;

  var axios_1 = axios$1;

  // Allow use of default import syntax in TypeScript
  var _default = axios$1;
  axios_1.default = _default;

  var axios = axios_1;

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
              axios
                  .get(key, {
                  baseURL: ''
              })
                  .then((res) => {
                  const config = res.data;
                  resolve((cacheConfigs[key] = config));
              });
          }
          else if (REG_API.test(key)) {
              axios.get(key).then((res) => {
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

  const CancelToken = axios.CancelToken;
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
              axiosObj = axios.create(opt);
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
          const { apiDebug } = window.$vogter || {};
          // 判断是否启用debug模式
          if (apiDebug) {
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
          const { apiDebug } = window.$vogter || {};
          // 判断是否启用debug模式
          if (apiDebug) {
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
      util.$loadConfig(options.apiPath || '/api.json').then(res => {
          window.$vogter.$service_config = res;
      });
      app.mixin(new mixins(app));
  };

  const VogterVueAxios = {
      install
  };

  return VogterVueAxios;

})));
