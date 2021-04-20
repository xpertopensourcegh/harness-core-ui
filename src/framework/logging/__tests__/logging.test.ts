import { ModuleName } from 'framework/types/ModuleName'
import { loggerFor } from '../logging'

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
