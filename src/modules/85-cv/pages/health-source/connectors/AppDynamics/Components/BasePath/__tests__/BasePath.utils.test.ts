import { onBasePathChange } from '../BasePath.utils'

describe('Validate utils', () => {
  test('onBasePathChange', () => {
    expect(
      onBasePathChange('manager', 1, {
        basePathDropdown_0: { path: '', value: 'Application Infrastructure Performance' },
        basePathDropdown_1: { path: 'Application Infrastructure Performance', value: '' }
      })
    ).toEqual({
      basePathDropdown_0: {
        path: '',
        value: 'Application Infrastructure Performance'
      },
      basePathDropdown_1: {
        path: 'Application Infrastructure Performance',
        value: 'manager'
      },
      basePathDropdown_2: {
        path: 'Application Infrastructure Performance|manager',
        value: ''
      }
    })
  })
})
