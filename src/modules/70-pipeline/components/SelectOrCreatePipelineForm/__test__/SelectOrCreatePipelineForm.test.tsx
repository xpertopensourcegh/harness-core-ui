import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { defaultAppStoreValues } from '@common/utils/DefaultAppStoreData'

import { SelectOrCreatePipelineForm } from '../SelectOrCreatePipelineForm'

jest.mock('services/pipeline-ng', () => ({
  useGetPipelineList: jest.fn().mockImplementation(() => {
    return {
      cancel: jest.fn(),
      loading: false,
      mutate: jest.fn().mockImplementationOnce(() => {
        return {
          data: {
            content: [
              {
                identifier: 'item 1'
              },
              {
                identifier: 'item 2'
              }
            ]
          }
        }
      })
    }
  })
}))

const openCreatPipeLineModalMock = jest.fn()
describe('SelectOrCreatePipelineForm', () => {
  const props = {
    handleSubmit: jest.fn(),
    openCreatPipeLineModal: openCreatPipeLineModalMock
  }
  describe('Rendering', () => {
    test('should render SelectOrCreatePipelineForm', () => {
      const { container, getByText } = render(
        <TestWrapper
          path="/account/:accountId"
          pathParams={{ accountId: 'testAcc' }}
          defaultAppStoreValues={defaultAppStoreValues}
        >
          <SelectOrCreatePipelineForm {...props} />
        </TestWrapper>
      )
      expect(getByText('Let’s get you started')).toBeDefined()
      expect(getByText('Select an existing Pipeline')).toBeDefined()
      expect(container).toMatchSnapshot()
    })

    test('should validate inputs', async () => {
      const { getByText } = render(
        <TestWrapper
          path="/account/:accountId"
          pathParams={{ accountId: 'testAcc' }}
          defaultAppStoreValues={defaultAppStoreValues}
        >
          <SelectOrCreatePipelineForm {...props} />
        </TestWrapper>
      )
      fireEvent.click(getByText('Continue'))
      await waitFor(() => expect(getByText('Please select a pipeline')).toBeDefined())
    })

    test('should open create pipeline modal when click Create a New Pipeline', async () => {
      const { container, getByText } = render(
        <TestWrapper
          path="/account/:accountId"
          pathParams={{ accountId: 'testAcc' }}
          defaultAppStoreValues={defaultAppStoreValues}
        >
          <SelectOrCreatePipelineForm {...props} />
        </TestWrapper>
      )
      fireEvent.click(getByText('Create a new pipeline'))
      await waitFor(() => expect(openCreatPipeLineModalMock).toBeCalled())
      expect(container).toMatchSnapshot()
    })
  })
})
