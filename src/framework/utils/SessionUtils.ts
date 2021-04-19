export const getLoginPageURL = (addReturnUrl = true): string => {
  const returnUrl = encodeURIComponent(window.location.href)
  // pick current path, but remove `/ng/`
  const basePath = `${window.location.pathname.replace(/\/ng\//, '/')}#/login`
  return addReturnUrl ? `${basePath}?returnUrl=${returnUrl}` : basePath
}
