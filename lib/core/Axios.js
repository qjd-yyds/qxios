class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {}; // 拦截器
  }
  request(config) {
    if (typeof config === 'string') {
      config = arguments[1] || {};
      config.url = arguments[0];
    } else {
      config = config || {};
    }

    // // 设置默认方法
    // if (config.method) {
    //   config.method = config.method.toLowerCase();
    // } else if (this.defaults.method) {
    //   config.method = this.defaults.method.toLowerCase();
    // } else {
    //   config.method = 'get';
    // }
    let promise;
    return promise;
  }
}

export default Axios;
