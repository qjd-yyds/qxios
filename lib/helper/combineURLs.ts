/**
 * @description: 组合两者地址，如果第二个参数为空 ，返回第一个
 * @param {string} baseURL
 * @param {string} relativeURL
 * @return {string} 组合后的地址
 */
export default function combineURLs(baseURL: string, relativeURL?: string) {
  return relativeURL
    ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "")
    : baseURL;
}
