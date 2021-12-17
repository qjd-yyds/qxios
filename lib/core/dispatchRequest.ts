import utils from "lib/utils";
import defaults from "lib/defaults";
import transformData from "./transformData";
/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }

  if (config.signal && config.signal.aborted) {
    console.log("取消成功");
    // throw new Cancel("canceled");
  }
}
export default function dispatchRequest(config) {
  // throwIfCancellationRequested(config);
  // 确保headers存在
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(config, config.data, config.headers, config.transformRequest);

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers,
  );
  // 删除config里headers里的方法
  utils.forEach(
    ["delete", "get", "head", "post", "put", "patch", "common"],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    },
  );
  const adapter = config.adapter || defaults.adapter;
  return adapter(config).then(
    function onAdapterResolution(response) {
      // throwIfCancellationRequested(config);
      // 转换返回值
      response.data = transformData.call(
        config,
        response.data,
        response.headers,
        config.transformResponse, // 执行transformResponse 转换方法
      );
      return response;
    },
    function onAdapterRejection(reason) {
      return Promise.reject(reason);
    },
  );
  // console.log("adapter", adapter);
}
