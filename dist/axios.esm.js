function bind(fn, thisArg) {
    return function wrap() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
            args[i] = arguments[i];
        }
        return fn.apply(thisArg, args);
    };
}

function mergeConfig(config1, config2 = {}) {
    const config = {};
    // function getMergedValue() {}
    // function mergeDeepProperties() {}
    function valueFromConfig2() { }
    function defaultToConfig2() { }
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
    console.log(mergeMap, config);
    return config2;
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
        let promise;
        return promise;
    }
}

const toString = Object.prototype.toString;
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
var utils = { forEach, merge, isPlainObject, isArray };

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
utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
    defaults.headers[method] = {};
});
utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
    defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

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

export { axios as default };
//# sourceMappingURL=axios.esm.js.map
