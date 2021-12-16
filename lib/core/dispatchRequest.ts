import utils from "lib/utils";
import defaults from "lib/defaults";
import transformData from "./transformData";
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
  console.log("adapter", adapter);
}
