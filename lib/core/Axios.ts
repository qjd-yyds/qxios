import mergeConfig from './mergeConfig';
class Axios {
  defaults: any;
  interceptors: any;
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {}; // 拦截器
  }
  request(config) {
    // 通过传入的配置判断
    if (typeof config === 'string') {
      // 如果传入的是字符串，第二个参数是配置
      config = arguments[1] || {};
      config.url = arguments[0];
    } else {
      config = config || {};
    }
    // 合并配置
    config = mergeConfig(this.defaults, config);
    // // 设置默认方法
    if (config.method) {
      config.method = config.method.toLowerCase();
    } else if (this.defaults.method) {
      config.method = this.defaults.method.toLowerCase();
    } else {
      config.method = 'get';
    }
    let promise;
    return promise;
  }
}

export default Axios;
