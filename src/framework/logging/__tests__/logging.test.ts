import { loggerFor } from '../logging'
import { ModuleName } from '../../exports'

describe('logging tests', () => {
  test('log test', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation()
    const logger = loggerFor(ModuleName.COMMON)
    expect(logger).toBeDefined()
    logger.error('error reported')
    expect(spy).toBeCalled()
    spy.mockRestore()
  })
})
