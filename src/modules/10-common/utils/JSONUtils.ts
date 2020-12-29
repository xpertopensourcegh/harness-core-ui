/**
 * @description Give a json, removes the following at all nested levels:
empty strings
empty objects(with no keys)
empty arrays
 * @param obj 
 */
const sanitize = (obj: Record<string, any>): Record<string, any> => {
  for (const key in obj) {
    if (obj[key] === '' || obj[key] === null) {
      delete obj[key]
    } else if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
      if (Object.keys(obj[key]).length === 0) {
        delete obj[key]
      } else {
        sanitize(obj[key])
      }
    } else if (Array.isArray(obj[key])) {
      if (obj[key].length == 0) {
        delete obj[key]
      } else {
        for (const _key in obj[key]) {
          sanitize(obj[key][_key])
        }
        obj[key] = obj[key].filter((value: any) => Object.keys(value).length !== 0)
        if (obj[key].length == 0) {
          delete obj[key]
        }
      }
    }
  }
  return obj
}

export { sanitize }
