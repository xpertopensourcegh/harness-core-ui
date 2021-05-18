import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { defaultAppStoreValues } from '@common/utils/DefaultAppStoreData'
import type { Module } from '@common/interfaces/RouteInterfaces'

import StartTrialModalContent from '../StartTrialModalContent'

describe('StartTrialModalContent', () => {
  describe('Rendering', () => {
    test('that the content renders', () => {
      const props = {
        handleStartTrial: jest.fn(),
        module: 'ce' as Module
      }

      const { container, getByText } = render(
        <TestWrapper
          path="/account/:accountId"
          pathParams={{ accountId: 'testAcc' }}
          defaultAppStoreValues={defaultAppStoreValues}
        >
          <StartTrialModalContent {...props} />
        </TestWrapper>
      )
      expect(getByText('common.purpose.ce.description')).toBeDefined()
      expect(container).toMatchSnapshot()
    })

    test('test that the warning container renders', async () => {
      const props = {
        handleStartTrial: jest.fn(),
        module: 'ce' as Module
      }

      const { container, getByText } = render(
        <TestWrapper
          path="/account/:accountId"
          pathParams={{ accountId: 'testAcc' }}
          defaultAppStoreValues={defaultAppStoreValues}
        >
          <StartTrialModalContent {...props} />
        </TestWrapper>
      )
      expect(getByText('common.purpose.ce.description')).toBeDefined()

      fireEvent.click(getByText('common.ce.visibility'))

      await waitFor(() => expect(getByText('common.ce.visibilityWarning')).toBeDefined())
      expect(container).toMatchSnapshot()
    })

    test('test that clicking the button will start a trial', async () => {
      const startTrialMock = jest.fn()

      const props = {
        handleStartTrial: startTrialMock,
        module: 'ce' as Module
      }

      const { getByText } = render(
        <TestWrapper
          path="/account/:accountId"
          pathParams={{ accountId: 'testAcc' }}
          defaultAppStoreValues={defaultAppStoreValues}
        >
          <StartTrialModalContent {...props} />
        </TestWrapper>
      )
      expect(getByText('common.purpose.ce.description')).toBeDefined()
      expect(getByText('common.startTrial')).toBeDefined()

      fireEvent.click(getByText('common.startTrial'))

      await waitFor(() => expect(startTrialMock).toHaveBeenCalled())
    })

    test('test that adding a source query param updates the button text', async () => {
      const startTrialMock = jest.fn()

      const props = {
        handleStartTrial: startTrialMock,
        module: 'ce' as Module
      }

      const { container } = render(
        <TestWrapper
          path="/account/:accountId"
          queryParams={{ source: 'signup' }}
          pathParams={{ accountId: 'testAcc' }}
          defaultAppStoreValues={defaultAppStoreValues}
        >
          <StartTrialModalContent {...props} />
        </TestWrapper>
      )

      expect(container).toMatchSnapshot()
    })
  })
})
