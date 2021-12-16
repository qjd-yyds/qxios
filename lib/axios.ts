import bind from './helper/bind';
import Axios from './core/Axios';
import defaults from './defaults';
/**
 * 创建axios实例
 *
 * @param {Object} defaultConfig 需要创建实例的默认配置
 * @return {Axios} 返回一个新的axios实例
 */
function createInstance(defaultConfig) {
  const context = new Axios(defaultConfig);
  const instance = bind(Axios.prototype.request, context);
  // instance.create = function create(instanceConfig) {
  //   return createInstance(mergeConfig(defaultConfig, instanceConfig));
  // };
  return instance;
}
const axios = createInstance(defaults);
export default axios;
