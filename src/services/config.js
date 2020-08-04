export const getConfig = str => {
  return window.location.pathname.replace('ng/', '') + str
}
