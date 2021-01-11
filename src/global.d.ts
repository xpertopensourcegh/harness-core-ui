/* eslint-disable @typescript-eslint/no-explicit-any */
declare const __DEV__: boolean
declare module '*.png' {
  const value: string
  export default value
}
declare module '*.jpg' {
  const value: string
  export default value
}
declare module '*.svg' {
  const value: string
  export default value
}

declare module '*.jpg' {
  const value: string
  export default value
}

declare module '*.yaml' {
  const value: Record<string, any>
  export default value
}

declare module '*.yml' {
  const value: Record<string, any>
  export default value
}

declare interface Window {
  apiUrl: string
}

declare module 'event-source-polyfill'
