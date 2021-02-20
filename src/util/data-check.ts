export default class DataCheck {
  // 是否是Object对象
  static $isObject(obj: any) {
    return Object.prototype.toString.call(obj) === '[object Object]'
  }
  // 是否是Array对象
  static $isArray(obj: any) {
    return Array.isArray(obj)
  }
  // 是否是字符串
  static $isString(str: any) {
    const typeStr = str instanceof String || (typeof str).toLowerCase()
    return typeStr === 'string'
  }
  // 是否是函数
  static $isFunction(fun: any) {
    return typeof fun === 'function'
  }

  /**
   * 检查特殊字符
   * @param {*} str
   */
  static $checkSpecialKey(str: string) {
    if (str) {
      // var specialKey = "[`~!#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘'"
      const specialKey = '~!@#$%^&*+{}|"<>?'
      for (var i = 0;i < str.length;i++) {
        if (specialKey.indexOf(str.substr(i, 1)) !== -1) {
          return false
        }
      }
      return true
    } else {
      return true
    }
  }
}