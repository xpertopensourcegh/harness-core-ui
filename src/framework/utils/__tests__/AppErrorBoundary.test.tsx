import React from 'react'

import { render } from '@testing-library/react'
import AppErrorBoundary from '../AppErrorBoundary/AppErrorBoundary'
import i18n from '../AppErrorBoundary/AppErrorBoundary.i18n.json'

describe('AppErrorBoundary tests', () => {
  test(`shows the fallback when there's an error`, () => {
    const Throws = (): JSX.Element => {
      throw new Error('Error happened!')
    }

    const { getByText, unmount } = render(
      <AppErrorBoundary>
        <Throws />
      </AppErrorBoundary>
    )
    expect(getByText(i18n.title)).toBeDefined()
    unmount()
  })

  test('logging to bugsnag when its enabled', () => {
    const Throws = (): JSX.Element => {
      throw new Error('Error happened!')
    }
    let notifiedCalled = false
    const bugSnagClient = {
      notify: (_e: any) => {
        notifiedCalled = true
      }
    }
    window['bugsnagClient'] = bugSnagClient
    const { unmount } = render(
      <AppErrorBoundary>
        <Throws />
      </AppErrorBoundary>
    )
    expect(notifiedCalled).toBeTruthy()
    unmount()
  })
})
