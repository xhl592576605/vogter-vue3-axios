//@ts-nocheck
import ApiService from './service/api-service'
import ComponentsApiService from './service/components-api-service'
let __$app__ = null
export default class mixins {
  constructor($app) {
    __$app__ = $app
  }
  data() {
    return {
      $apiService: null
    }
  }
  computed = {
    $apiServiceOpts() {
      return {
        overrideMethod: {
        }
      }
    }
  }
  created() {
    this.$apiService = new ApiService(this.$apiServiceOpts)
    if (this.$props.enableCompApiService) {
      this.$data.$componentsApiService = new ComponentsApiService(this.$apiService, this, __$app__)
    }
  }
  mounted() {
    if (this.$props.enableCompApiService) {
      this.$nextTick(() => {
        this.$data.$componentsApiService && ComponentsApiService.$initComponentsApiService(this.$data.$componentsApiService)
      })
    }
  }
  beforeDestory() {
    this.$apiService.$cancelFetchApi()
    this.$apiService.$disposeAxios()
  }
}