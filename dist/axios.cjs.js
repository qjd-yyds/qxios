'use strict';

function bind(fn, thisArg) {
    return function wrap() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
            args[i] = arguments[i];
        }
        return fn.apply(thisArg, args);
    };
}

const toString = Object.prototype.toString;
function isUndefined(val) {
    return typeof val === "undefined";
}
/**
 * 确定一个值是不是对象
 *
 * @param {Object} val 需要判断的数据
 * @return {boolean} 是否为对象
 */
function isPlainObject(val) {
    if (toString.call(val) !== "[object Object]") {
        return false;
    }
    const prototype = Object.getPrototypeOf(val);
    return prototype === null || prototype === Object.prototype;
}
/**
 * 判断是不是数组
 *
 * @param {Object} val 需要判断的数据
 * @returns {boolean} 返回是否为数组
 */
function isArray(val) {
    return toString.call(val) === "[object Array]";
}
/**
 * @param {Object|Array} obj 需要迭代的数组或者对象
 * @param {Function} fn 每一个循环后的回调
 */
function forEach(obj, fn) {
    // 如果obj没有传入值
    if (obj === null || typeof obj === "undefined") {
        return;
    }
    // 如果obj不是一个对象，转成数组
    if (typeof obj !== "object") {
        obj = [obj];
    }
    if (isArray(obj)) {
        for (var i = 0, l = obj.length; i < l; i++) {
            fn.call(null, obj[i], i, obj);
        }
    }
    else {
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                fn.call(null, obj[key], key, obj);
            }
        }
    }
}
/**
 * @param {Object} obj1 需要合并的对象参数
 * @returns {Object} 合并完的对象
 */
function merge(...arg) {
    const result = {};
    function assignValue(val, key) {
        if (isPlainObject(result[key]) && isPlainObject(val)) {
            result[key] = merge(result[key], val);
        }
        else if (isPlainObject(val)) {
            result[key] = merge({}, val);
        }
        else if (isArray(val)) {
            result[key] = val.slice();
        }
        else {
            result[key] = val;
        }
    }
    for (var i = 0, l = arg.length; i < l; i++) {
        forEach(arg[i], assignValue);
    }
    return result;
}
/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
    return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "");
}
var utils = { forEach, merge, isPlainObject, isArray, isUndefined, trim };

function mergeConfig(config1, config2 = {}) {
    const config = {};
    // 获取合并完的配置
    function getMergedValue(target, source) {
        if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
            // 两个都是对象
            return utils.merge(target, source);
        }
        else if (utils.isPlainObject(source)) {
            // 来源是对象，目标不是对象
            return utils.merge({}, source);
        }
        else if (utils.isArray(source)) {
            // 来源是数组，浅拷贝
            return source.slice();
        }
        return source;
    }
    function mergeDeepProperties() { }
    function valueFromConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
            return getMergedValue(undefined, config2[prop]);
        }
    }
    // 合并用户传入的config
    function defaultToConfig2(prop) {
        // 如果第二个参数有值，直接合并
        if (!utils.isUndefined(config2[prop])) {
            return getMergedValue(undefined, config2[prop]);
        }
        else if (!utils.isUndefined(config1[prop])) {
            // 第二个没有值 用默认配置
            return getMergedValue(undefined, config1[prop]);
        }
    }
    function mergeDirectKeys(prop) {
        if (prop in config2) {
            return getMergedValue(config1[prop], config2[prop]);
        }
        else if (prop in config1) {
            return getMergedValue(undefined, config1[prop]);
        }
    }
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
        validateStatus: mergeDirectKeys,
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

function buildURL(url, params, paramsSerializer) {
    if (!params) {
        return url;
    }
    return url;
}

function isAbsoluteURL(url) {
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
}

/**
 * @description: 组合两者地址，如果第二个参数为空 ，返回第一个
 * @param {string} baseURL
 * @param {string} relativeURL
 * @return {string} 组合后的地址
 */
function combineURLs(baseURL, relativeURL) {
    return relativeURL
        ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "")
        : baseURL;
}

/**
 * @description: 返回最终需要的地址
 * @param {string} baseURL 配置中的baseurl
 * @param {string} requestedURL 用户传入的url
 * @return {string} requestedURL 最终处理后的地址
 */
function buildFullPath(baseURL, requestedURL) {
    // 如果是绝对路径，直接替换之前的baseUrl
    if (baseURL && !isAbsoluteURL(requestedURL)) {
        //  不是绝对路径，组合两个地址
        return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
}

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateOf = [
    'age', 'authorization', 'content-length', 'content-type', 'etag',
    'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
    'last-modified', 'location', 'max-forwards', 'proxy-authorization',
    'referer', 'retry-after', 'user-agent'
];
/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
function parseHeaders(headers) {
    var parsed = {};
    var key;
    var val;
    var i;
    if (!headers) {
        return parsed;
    }
    utils.forEach(headers.split('\n'), function parser(line) {
        i = line.indexOf(':');
        key = utils.trim(line.substr(0, i)).toLowerCase();
        val = utils.trim(line.substr(i + 1));
        if (key) {
            if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
                return;
            }
            if (key === 'set-cookie') {
                parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
            }
            else {
                parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
            }
        }
    });
    return parsed;
}

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
function settle(resolve, reject, response) {
    var validateStatus = response.config.validateStatus;
    if (!response.status || !validateStatus || validateStatus(response.status)) {
        resolve(response);
    }
    else {
        reject(new Error("Request failed with status code " + response.status));
    }
}

function xhrAdapter(config) {
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
        request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);
        request.timeout = config.timeout; // 设置过期时间
        let requestData = config.requestData;
        function onloadend() {
            if (!request) {
                return;
            }
            // Prepare the response
            const responseHeaders = "getAllResponseHeaders" in request ? parseHeaders(request.getAllResponseHeaders()) : null;
            const responseData = !responseType || responseType === "text" || responseType === "json"
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
            settle(function _resolve(value) {
                resolve(value);
                done();
            }, function _reject(err) {
                reject(err);
                done();
            }, response);
            // Clean up request
            request = null;
        }
        if ("onloadend" in request) {
            // Use onloadend if available
            request.onloadend = onloadend;
        }
        else {
            // Listen for ready state to emulate onloadend
            request.onreadystatechange = function handleLoad() {
                if (!request || request.readyState !== 4) {
                    return;
                }
                // The request errored out and we didn't get a response, this will be
                // handled by onerror instead
                // With one exception: request that using file: protocol, most browsers
                // will return status as 0 even though it's a successful request
                if (request.status === 0 &&
                    !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
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
                }
                else {
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
                request = null;
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

// 定义默认content-type 决定文件接收方将以什么形式、什么编码读取这个文件
const DEFAULT_CONTENT_TYPE = {
    "Content-Type": "application/x-www-form-urlencoded",
};
// 创建适配器
function getDefaultAdapter() {
    let adapter;
    if (typeof XMLHttpRequest !== "undefined") {
        adapter = xhrAdapter;
    }
    else if (typeof process !== "undefined" &&
        Object.prototype.toString.call(process) === "[object process]") ;
    return adapter;
}
// 默认配置
const defaults = {
    transitional: {
        silentJSONParsing: true,
        forcedJSONParsing: true,
        clarifyTimeoutError: false,
    },
    adapter: getDefaultAdapter(),
    transformRequest: [
        function transformRequest(data, headers) {
            return data;
        },
    ],
    transformResponse: [
        function transformResponse(data) {
            return data;
        },
    ],
    /**
     * 请求超时时间
     * 如果为0表示不设置超时时间
     */
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
    },
    headers: {
        common: {
            Accept: "application/json, text/plain, */*",
        },
    },
};
// 向headers里放入所有方法
utils.forEach(["delete", "get", "head"], function forEachMethodNoData(method) {
    defaults.headers[method] = {};
});
utils.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
    defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
function transformData(data, headers, fns) {
    const context = this || defaults;
    utils.forEach(fns, function transform(fn) {
        data = fn.call(context, data, headers);
    });
    return data;
}

function dispatchRequest(config) {
    // throwIfCancellationRequested(config);
    // 确保headers存在
    config.headers = config.headers || {};
    // Transform request data
    config.data = transformData.call(config, config.data, config.headers, config.transformRequest);
    // Flatten headers
    config.headers = utils.merge(config.headers.common || {}, config.headers[config.method] || {}, config.headers);
    // 删除config里headers里的方法
    utils.forEach(["delete", "get", "head", "post", "put", "patch", "common"], function cleanHeaderConfig(method) {
        delete config.headers[method];
    });
    const adapter = config.adapter || defaults.adapter;
    return adapter(config).then(function onAdapterResolution(response) {
        // throwIfCancellationRequested(config);
        // 转换返回值
        response.data = transformData.call(config, response.data, response.headers, config.transformResponse);
        return response;
    }, function onAdapterRejection(reason) {
        return Promise.reject(reason);
    });
    // console.log("adapter", adapter);
}

class Axios {
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
        }
        else {
            config = config || {};
        }
        // 合并配置
        config = mergeConfig(this.defaults, config);
        // // 设置默认方法
        if (config.method) {
            config.method = config.method.toLowerCase();
        }
        else if (this.defaults.method) {
            config.method = this.defaults.method.toLowerCase();
        }
        else {
            config.method = 'get';
        }
        // 处理拦截器
        let promise;
        let newConfig = config;
        try {
            promise = dispatchRequest(newConfig);
        }
        catch (error) {
            return Promise.reject(error);
        }
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
    const context = new Axios(defaultConfig);
    const instance = bind(Axios.prototype.request, context);
    // instance.create = function create(instanceConfig) {
    //   return createInstance(mergeConfig(defaultConfig, instanceConfig));
    // };
    return instance;
}
const axios = createInstance(defaults);

module.exports = axios;
//# sourceMappingURL=axios.cjs.js.map
