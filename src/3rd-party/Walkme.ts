export function injectWalkme(): void {
  // eslint-disable-next-line no-prototype-builtins
  if (/(app|uat).harness.io/.test(location.hostname) && !window.hasOwnProperty('WalkMeAPI')) {
    const script = document.createElement('script')

    script.type = 'text/javascript'
    script.async = true
    script.defer = true
    script.src =
      'https://cdn.walkme.com/users/107c110fc7a74abb8aa60c41c3c491a7/walkme_107c110fc7a74abb8aa60c41c3c491a7_https.js'

    document.querySelector('head')?.appendChild(script)
  }
}
