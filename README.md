## @guardian/vue3-axios (守卫者[接口框架])

### 框架特点

1. 与vue3匹配，采用vue3的插件开发，使用插件，即可拥有一套接口请求机制
2. **ComponentsApiService**机制，仅需配置api信息，定义渲染函数，无需中间的请求步骤，请求好的数据，直接传递渲染函数，开发者自由在渲染函数进行数据的处理等
3. 扩展vue实例多个方法，让你开发更为简单

### 版本变化

- 0.0.1 初始化

### ComponentsApiService
> 在vue组件开发通用的业务可能是：调用一个或多个接口，获取到的数据再渲染到页面（template）上，这样的业务开发流程可能是在生命周期去调用请求函数，然后在回调(then)中去给响应时data赋值,这样子会使业务，请求，错误处理全部耦合在一起，比较难维护，就在这种情况ComponentsApiService诞生了
``` js
  mounted(){
    this.fetchData({
      api:'',
      params:{
        a:this.a
      },
      body:{
        b:this.b
      }
    }).then((result) => {
      let data=result.data
      this.data=data
    }).catch((err) => {
      this.$message(err)
    });
  }
```
ComponentsApiService,使用props中api配置，配置请求的接口，以及匹配的请求参数，由框架帮你请求，当然你也可以重写整个请求机制，请求完，框架会调用组件内部的渲染方法，若是请求错误，调用组件内部错误处理的函数，每个组件的请求机制独立，若是组件注销，自动取消请求，这样子，开发人员在对应的函数中处理对应的业务，无需将一个业务糅合在一起,具体说明看文章中的[使用说明](#使用说明)

``` js
export default defineComponent({
    name: 'HelloWorld',
    props: {
        msg: String,
        enableCompApiService: {
            type: Boolean,
            default: true,
        },
        api: {
            type: Array,
            default: () => {
                return [
                    {
                        apiMethod: 'system.login',
                        respMatch: '@data@',
                        queryParamsMatch: {
                            a: '{a.c}',
                            c: '{msg}',
                        }
                    }
                ]
            },
        },
    },
    data() {
        return {
            a: {
                c: 1123,
            },
        }
    },
    methods: {
        $renderData(fetchData: { rendered: boolean; renderData?: [] }) {
            const { rendered = false, renderData = [] } = fetchData
            if (rendered !== true && renderData && renderData.length > 0) {
                // 进行数据渲染
                fetchData.rendered = true
                console.log(renderData)
            }
        },
        $fetchApiError({ api, apiMethod, apiOpt, error }){
          // 错误处理
        }
    },
})
```
### 使用说明

- 使用示例
``` js
// in main.js(.ts)
import GuardianVueAxios from '@guardian/vue-axios'
createApp(App).use(GuardianVueAxios).mount('#app')
```

- api.json
> 需要在public目录底下创建"api.json"文件  

``` json
{
  "system": {
    "login": {
      "remark": "remark",
      "author": "author",
      "method": "get",
      "url": "/api/v1/login",
      "params": {}
    }
  }
}
```

| 属性 | 说明 |必填|
| --- | --- | --- |
| remark | 接口备注 | y |
| author | 接口作者 | y |
| method | 接口方法（get，post，put，delete）| y |
| url | api地址，若是完整地址需要设置“baseURL”为空字符串 | y |
| baseURL | baseURL | |
| certificate | certificate为true，头部才会加token | |
| params |  静态url参数 |


- 实例方法 

> 组件内部实例this调用

| 名称  | 描述 | 参数 | 例子 |
| --- | --- | --- | --- |
| $loadConfig | 异步加载配置 | key:apiUrl,json、jsurl 函数字符串 | `this.$loadConfg('/api.json')`|
| $string2function | 函数字符串转换成函数 | args(可选)：入参，body：字符串 |`this.$string2function('return "111"')` |
| $matchData4String | 进行字符串匹配，转换成字符串| str:匹配的字符串，data：替换匹配的对象或者数组 | `this.$matchData4String('{a}',{a:'111'})=>'111'` `this.$matchData4String('@a@',{a:'111'})=>{a:'111'}` |
| $matchData4Object | 进行对象匹配，转换成字符串 |obj:匹配的对象，data：替换匹配的对象或者数组 | `this.$matchData4Object('b:{a:"{a}"}',{a:'111'})=>{b:{a:'111'}}` |
| $matchData4Array | 进行数组的匹配 | arr:匹配的数组， data：替换匹配的对象或者数组 | 如上 |
|  $dtaCheck | 类型检查 ，提供字符串，对象，数组等类型检查|

- props
> 插件混入的props，获取一些功能需要设置的props

| 名称  | 类型 | 描述 | 触发重新请求|
| --- | --- | --- | --- |
| enableCompApiService | Bollean | 是否启用enableCompApiService机制 |
| api | Object或Array | CompApiServic启用有效 ，api接口配置（[具体说明](#api接口配置说明)） | y |
| filter | Object | CompApiServic启用有效 ，api请求过滤条件 |  y |
| apiSuspend | Bollean |CompApiServic启用有效，机制会立马请求接口，若是初次不想要请求，可设置true |

- data 
> 插件混入的data，api请求会存入这些data 或者这些data会重新触发请求

| 名称  | 类型 | 描述 |触发重新请求|
| --- | --- | --- | --- |
| apiDataStore | |CompApiServic启用有效,api数据仓储| |
| apiDataList| | CompApiServic启用有效, api所有数据集合 | |
| myFilter | | CompApiServic启用有效, 内部过滤条件 | y | 
| apiParams | | CompApiServic启用有效, api请求参数 | y |
| uiParams | | CompApiServic启用有效,前端过滤参数 | |
| $apiService| | 框架接口请求实例 | |
| $componentsApiService | | 框架的CompApiServic机制实例 | |

- methods
> 接口实例，CompApiServic机制实例的方法
    
   1. $apiService
      - $cancelFetchApi（取消请求接口）
        参数:      
          - apiKey:即是api.json 的key值，如"system.login"

      - $fetchData(请求接口)
        参数:      
          - apiChainKey:即是api.json 的key值，如"system.login"
          - apiOpt: 接口参数，原生的axios的请求参数

      - $fetchDataByUrl（根据url请求接口）
        参数:      
          - url:即url
          - apiOpt: 接口参数，原生的axios的请求参数
  2. $componentsApiService
      - $fetchApiData(根据props中的api请求接口)
        参数:      
          - filter:接口请求参数,参与api的请求参数匹配
          - apiSuspend : 是否挂起 挂起不请求数据

- hook 
> CompApiServic机制下的钩子函数，需自行定义在组件内部的methods
  1. $renderData 
      描述：每次接口请求，过滤完的数据，传递到这个钩子函数上
      参数：
        - fetchData: 请求完的数据 { rendered = false, renderData = []}
        ``` js
        $renderDataDemo(fetchData: any) {
          const { rendered = false, renderData = [] } = fetchData
          if (rendered !== true && renderData && renderData.length > 0) {
            // 进行数据渲染
            fetchData.rendered = true
          }
      }
        ```
  2. $renderFetchData
    描述： 所有接口请求完，会所有的接口数据会传递到这个钩子函数上
    参数： 
      - apiDataStore: 即data中的apiDataStore的值

- api接口配置说明
> api 可以是一个对象也可以是一个数组

``` js
 [{
     apiMethod:'对应api.json文件中的name，优先级低于apiUrl，二者必须配置一个',
     apiUrl: 'api路由，优先级低于apiMethod，二者必须配置一个',
     respMatch: '@data@'// 返回值的匹配
     axiosOptions: {}, // axios的配置信息，可选参数     
     queryParams: '接口静态query参数，可选参数'
     queryParamsMatch: { // 接口query参数匹配配置，可选参数
        //接口参数名称: '{}/@@占位的属性值，支持链式字符串'
        beginTime: '{bgeinTime}' // 或者@beginTime@ ,bgeinTime(即this.bgeinTime)/this/]
      },
      bodyParams: '接口静态body参数，可选参数',
      bodyParamsMatch: { // 接口body参数匹配配置，可选参数
        // 接口参数名称: '{}/@@占位的属性值，支持链式字符串'
        beginTime: '{bgeinTime}' // 或者@bgeinTime@,bgeinTime(即this.bgeinTime)/this/]
      },
      subApis: [{ // 子接口，主接口中的参数都有，并增加以下参数配置，可选参数
        queryParamsRelations: { // 主接口返回数据作为子接口query参数的关系映射，key：接口参数名称，value: 父级接口返回数据的属性名称
          id: 'id'
        },
        bodyParamsRelations: { // 主接口返回数据作为子接口body参数的关系映射，key：接口参数名称，value: 父级接口返回数据的属性名称
          id: 'id'
        },
        mergeRelations: [{ // 子接口数据合并到主接口的合并规则，即合并关系映射，key：子级接口返回数据的属性名称，value: 父级接口返回数据的属性名称
          id: 'id'
        }]
      }]
   }]
```

### 备注
  - ComponentsApiService返回的数据均以数组形式







