import utils from '../utils';
export default function mergeConfig(config1, config2 = {}) {
  const config = {};
  // 获取合并完的配置
  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      // 两个都是对象
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      // 来源是对象，目标不是对象
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      // 来源是数组，浅拷贝
      return source.slice();
    }
    return source;
  }
  function mergeDeepProperties() {}
  function valueFromConfig2() {}
  // 合并用户传入的config
  function defaultToConfig2(prop) {
    // 如果第二个参数有值，直接合并
    if (!utils.isUndefined(config2[prop])) {
      return getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      // 第二个没有值 用默认配置
      return getMergedValue(undefined, config1[prop]);
    }
  }
  function mergeDirectKeys() {}

  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys
  };
  // 创建需要合并的配置数组
  const configKeys = Object.keys(config1).concat(Object.keys(config2));
  // 每一个需要配置的key
  utils.forEach(configKeys, function computeConfigValue(prop) {
    const merge = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge(prop);
    (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
  });
  return config;
}
