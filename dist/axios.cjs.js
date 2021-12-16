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
    return typeof val === 'undefined';
}
/**
 * 确定一个值是不是对象
 *
 * @param {Object} val 需要判断的数据
 * @return {boolean} 是否为对象
 */
function isPlainObject(val) {
    if (toString.call(val) !== '[object Object]') {
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
    return toString.call(val) === '[object Array]';
}
/**
 * @param {Object|Array} obj 需要迭代的数组或者对象
 * @param {Function} fn 每一个循环后的回调
 */
function forEach(obj, fn) {
    // 如果obj没有传入值
    if (obj === null || typeof obj === 'undefined') {
        return;
    }
    // 如果obj不是一个对象，转成数组
    if (typeof obj !== 'object') {
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
var utils = { forEach, merge, isPlainObject, isArray, isUndefined };

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
    function valueFromConfig2() { }
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
    function mergeDirectKeys() { }
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

// 定义默认content-type 决定文件接收方将以什么形式、什么编码读取这个文件
const DEFAULT_CONTENT_TYPE = {
    'Content-Type': 'application/x-www-form-urlencoded'
};
// 创建适配器
function getDefaultAdapter() {
    let adapter;
    if (typeof XMLHttpRequest !== 'undefined') ;
    else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') ;
    return adapter;
}
// 默认配置
const defaults = {
    transitional: {
        silentJSONParsing: true,
        forcedJSONParsing: true,
        clarifyTimeoutError: false
    },
    adapter: getDefaultAdapter(),
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

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
function transformData(data, headers, fns) {
    const context = defaults;
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
    console.log("adapter", adapter);
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
