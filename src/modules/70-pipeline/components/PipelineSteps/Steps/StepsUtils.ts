import { isEmpty, isObjectLike, isPlainObject } from 'lodash-es'

export const removeEmptyKeys = (object: { [key: string]: any }): { [key: string]: any } => {
  Object.keys(object).forEach(key => {
    if ((isObjectLike(object[key]) && isEmpty(object[key])) || !object[key]) {
      delete object[key]
      return
    }

    if (isPlainObject(object[key])) {
      removeEmptyKeys(object[key])
    }
  })

  return object
}
