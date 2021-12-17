export default function isAbsoluteURL(url: string) {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
}
