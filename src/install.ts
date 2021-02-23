
//@ts-nocheck
import mixins from './mixins'
import utilObj from './util'
import ApiService from './service/api-service'
const install = (app: any, options: any) => {
  Object.entries(utilObj).forEach(([key, value]) => {
    app.config.globalProperties[key] = value
  })
  if (!window.$vogter) {
    window.$vogter = {}
  }
  window.$vogter.$apiService = new ApiService()
  utilObj.$loadConfig('/api.json').then(res => {
    window.$vogter.$service_config = res
  })
  app.mixin(new mixins(app))
}

export default install