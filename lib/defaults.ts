import utils from './utils';
// 定义默认content-type 决定文件接收方将以什么形式、什么编码读取这个文件
const DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};
// 创建适配器
function getDefaultAdapter() {
  let adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // adapter = require('./adapters/xhr');
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // adapter = require('./adapters/http');
  }
  return adapter;
}
// 默认配置
const defaults = {
  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  },
  adapter: getDefaultAdapter(), // 适配是node端还是的浏览器端
  transformRequest: [
    function transformRequest(data, headers) {
      return data;
    }
  ],

  transformResponse: [
    function transformResponse(data) {
      return data;
    }
  ],
  /**
   * 请求超时时间
   * 如果为0表示不设置超时时间
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  }
};
// 向headers里放入所有方法
utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});
utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

export default defaults;
