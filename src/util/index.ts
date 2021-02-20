import * as dataMatch from './data-match'
import { $string2function } from './string2function'
import { $loadConfig } from './load-config'
import DataCheck from './data-check'
const util = {
  ...dataMatch,
  $loadConfig,
  $string2function,
  $dtaCheck: DataCheck
}
export default util