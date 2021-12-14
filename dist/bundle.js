(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.axios = factory());
})(this, (function () { 'use strict';

  function bind(fn, thisArg) {
    return function wrap() {
      var args = new Array(arguments.length);
      for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i];
      }
      return fn.apply(thisArg, args);
    };
  }

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

  /**
   * 创建axios实例
   *
   * @param {Object} defaultConfig 需要创建实例的默认配置
   * @return {Axios} 返回一个新的axios实例
   */
  function createInstance(defaultConfig) {
    var context = new Axios(defaultConfig);
    const instance = bind(Axios.prototype.request, context);
    // instance.create = function create(instanceConfig) {
    //   return createInstance(mergeConfig(defaultConfig, instanceConfig));
    // };
    return instance;
  }
  const axios = createInstance({});

  return axios;

}));
