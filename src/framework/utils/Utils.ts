export function buildLoginUrlFrom401Response(message?: string): string {
  const { href } = window.location
  const prefix = message ? `/#/login?message=${encodeURIComponent(message)}&returnUrl=` : '/#/login?returnUrl='

  return href.includes(prefix) ? href : prefix + encodeURIComponent(href)
}
