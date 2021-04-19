import { getLoginPageURL } from '../SessionUtils'

describe('Session Utils', () => {
  test('getLoginPageUrl', () => {
    expect(getLoginPageURL()).toBe('/#/login?returnUrl=http%3A%2F%2Flocalhost%2F')
    expect(getLoginPageURL(false)).toBe('/#/login')
  })
})
