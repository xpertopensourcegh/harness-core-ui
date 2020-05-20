import { atom } from 'recoil'

export const sessionToken = atom({
  key: 'sessionToken',
  default: undefined
})
