import isAbsoluteURL from "lib/helper/isAbsoluteURL";
import combineURLs from "lib/helper/combineURLs";
/**
 * @description: 返回最终需要的地址
 * @param {string} baseURL 配置中的baseurl
 * @param {string} requestedURL 用户传入的url
 * @return {string} requestedURL 最终处理后的地址
 */
export default function buildFullPath(baseURL: string, requestedURL: string) {
  // 如果是绝对路径，直接替换之前的baseUrl
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    //  不是绝对路径，组合两个地址
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}
