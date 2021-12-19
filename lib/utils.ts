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
  } else {
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
function merge(...arg: any[]) {
  const result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
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
export default { forEach, merge, isPlainObject, isArray, isUndefined, trim };
