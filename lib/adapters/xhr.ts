import buildURL from "../helper/buildURL";
import buildFullPath from "lib/core/buildFullPath";
import utils from "lib/utils";
import parseHeaders from "lib/helper/parseHeaders";
import settle from "lib/core/settle";
export default function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    let request = new XMLHttpRequest();
    const requestHeaders = config.headers;
    const responseType = config.responseType;
    let onCanceled;
    let fullPath = buildFullPath(config.baseURL, config.url);
    function done() {
      if (config.cancelToken) {
        config.cancelToken.unsubscribe(onCanceled);
      }

      if (config.signal) {
        config.signal.removeEventListener("abort", onCanceled);
      }
    }
    request.open(
      config.method.toUpperCase(),
      buildURL(fullPath, config.params, config.paramsSerializer),
      true,
    );
    request.timeout = config.timeout; // 设置过期时间
    let requestData = config.requestData;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      const responseHeaders =
        "getAllResponseHeaders" in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      const responseData =
        !responseType || responseType === "text" || responseType === "json"
          ? request.responseText
          : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request,
      };
      console.log(response);
      settle(
        function _resolve(value) {
          resolve(value);
          done();
        },
        function _reject(err) {
          reject(err);
          done();
        },
        response,
      );

      // Clean up request
      request = null as any;
    }

    if ("onloadend" in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (
          request.status === 0 &&
          !(request.responseURL && request.responseURL.indexOf("file:") === 0)
        ) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }
    // 设置请求头
    if ("setRequestHeader" in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === "undefined" && key.toLowerCase() === "content-type") {
          // 如果请求的数据为undefined 删除content-type
          delete requestHeaders[key];
        } else {
          // 如果有 使用request的setRequestHeader 方法添加请求头
          request.setRequestHeader(key, val);
        }
      });
    }
    // 如果请求中设置了cookie相关
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }
    // 添加响应类型
    // if (responseType && responseType !== "json") {
    //   request.responseType = config.responseType;
    // }
    if (config.cancelToken || config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = function (cancel) {
        if (!request) {
          return;
        }
        // reject(!cancel || (cancel && cancel.type) ? new Cancel("canceled") : cancel);
        request.abort();
        request = null as any;
      };

      config.cancelToken && config.cancelToken.subscribe(onCanceled);
      if (config.signal) {
        config.signal.aborted ? onCanceled() : config.signal.addEventListener("abort", onCanceled);
      }
    }
    if (!requestData) {
      requestData = null;
    }
    request.send(requestData);
  });
}
