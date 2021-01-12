import type { YamlSanityConfig } from '@common/interfaces/YAMLBuilderProps'

/**
 * @description Give a json, removes the following at all nested levels:
empty strings
empty objects(with no keys)
empty arrays
 * @param obj 
 */
const sanitize = (obj: Record<string, any>, sanityConfig?: YamlSanityConfig): Record<string, any> => {
  const { removeEmptyString, removeEmptyArray, removeEmptyObject } = sanityConfig || {
    removeEmptyString: true,
    removeEmptyArray: true,
    removeEmptyObject: true
  }
  for (const key in obj) {
    if ((removeEmptyString && obj[key] === '') || obj[key] === null) {
      delete obj[key]
    } else if (removeEmptyObject && Object.prototype.toString.call(obj[key]) === '[object Object]') {
      if (Object.keys(obj[key]).length === 0) {
        delete obj[key]
      } else {
        sanitize(obj[key], sanityConfig)
      }
    } else if (removeEmptyArray && Array.isArray(obj[key])) {
      if (obj[key].length == 0) {
        delete obj[key]
      } else {
        for (const _key in obj[key]) {
          sanitize(obj[key][_key], sanityConfig)
        }
        obj[key] = obj[key].filter((value: any) => Object.keys(value).length !== 0)
        if (removeEmptyArray && obj[key].length == 0) {
          delete obj[key]
        }
      }
    }
  }
  return obj
}

export { sanitize }
