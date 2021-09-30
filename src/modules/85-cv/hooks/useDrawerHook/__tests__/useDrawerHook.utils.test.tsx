import type { IDrawerProps } from '@blueprintjs/core'
import { getDefaultDrawerProps, getParsedDrawerOptions } from '../useDrawerHook.utils'

const showWarning = jest.fn()
const createHeader = jest.fn()

describe('Validate Utils', () => {
  test('should validate getDefaultDrawerProps', () => {
    expect(getDefaultDrawerProps({ createHeader, showWarning })).toEqual({
      autoFocus: true,
      canEscapeKeyClose: true,
      canOutsideClickClose: true,
      enforceFocus: false,
      hasBackdrop: true,
      isCloseButtonShown: false,
      isOpen: true,
      onClose: showWarning,
      portalClassName: 'health-source-right-drawer',
      position: 'right',
      size: 'calc(100% - 330px)',
      title: undefined,
      usePortal: true
    })
  })

  test('should validate getParsedDrawerOptions', () => {
    const defaultOptions = getDefaultDrawerProps({ createHeader, showWarning })
    expect(getParsedDrawerOptions(defaultOptions, {} as IDrawerProps)).toEqual(defaultOptions)
    expect(getParsedDrawerOptions(defaultOptions, { size: '400px' } as IDrawerProps)).toEqual({
      ...defaultOptions,
      size: '400px'
    })
  })
})
