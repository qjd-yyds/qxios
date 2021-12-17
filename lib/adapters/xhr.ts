import buildURL from "../helper/buildURL";
import buildFullPath from "lib/core/buildFullPath";
export default function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    const request = new XMLHttpRequest();
    var fullPath = buildFullPath(config.baseURL, config.url);
    console.log(fullPath, "==>最终的请求地址");
    request.open(
      config.method.toUpperCase(),
      buildURL(fullPath, config.params, config.paramsSerializer),
      true,
    );
    request.timeout = config.timeout; // 设置过期时间
    let requestData = config.requestData;
    if (!requestData) {
      requestData = null;
    }
    request.send(requestData);
  });
}
