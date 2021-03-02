import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import { TestWrapper } from '@common/utils/testUtils'
import CreateGitConnector from '../CreateGitConnector'
import mockData from './mock.json'

jest.mock('services/cd-ng', () => ({
  validateTheIdentifierIsUniquePromise: jest.fn(() =>
    Promise.resolve({
      status: 'SUCCESS',
      data: true,
      metaData: null,
      correlationId: '1a8e39e2-a0bc-4491-bc7d-0513562b991c'
    })
  )
}))

describe('CreateGitConnector tests', () => {
  test(`renders with isForOverrideSets true without crashing`, () => {
    const { container } = render(
      <TestWrapper>
        <CreateGitConnector
          accountId={'dummyAccountid'}
          projectIdentifier={'projectIdentifier'}
          orgIdentifier={'orgIdentifier'}
          onSuccess={(): void => undefined}
          isForOverrideSets={true}
          isForPredefinedSets={false}
          identifierName={'identifierName'}
          stage={mockData.stages[0]}
          pipeline={mockData as any}
          hideLightModal={(): void => undefined}
          updatePipeline={(): Promise<void> => undefined as any}
        />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
  test(`renders with isForOverrideSets true without crashing`, () => {
    const { container } = render(
      <TestWrapper>
        <CreateGitConnector
          accountId={'dummyAccountid'}
          projectIdentifier={'projectIdentifier'}
          orgIdentifier={'orgIdentifier'}
          onSuccess={(): void => undefined}
          isForOverrideSets={false}
          isForPredefinedSets={false}
          identifierName={'identifierName'}
          stage={mockData.stages[0]}
          pipeline={mockData as any}
          hideLightModal={(): void => undefined}
          updatePipeline={(): Promise<void> => undefined as any}
        />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test(`updates form  without crashing`, async () => {
    const { container } = render(
      <TestWrapper>
        <CreateGitConnector
          accountId={'dummyAccountid'}
          projectIdentifier={'projectIdentifier'}
          orgIdentifier={'orgIdentifier'}
          onSuccess={(): void => undefined}
          isForOverrideSets={false}
          isForPredefinedSets={false}
          identifierName={'identifierName'}
          stage={mockData.stages[0]}
          pipeline={mockData as any}
          hideLightModal={(): void => undefined}
          updatePipeline={(): Promise<void> => undefined as any}
        />
      </TestWrapper>
    )
    const inputName = container.querySelector("input[name='name'")
    expect(inputName).toBeTruthy()
    expect(container).toMatchSnapshot('step 1')
    await act(async () => {
      fireEvent.click(document.querySelector("button[type='submit']")!)
    })
    await act(async () => {
      fireEvent.change(inputName!, {
        target: { value: 'dummy name' }
      })
      const submitButton = document.querySelector("button[type='submit']") as Element
      fireEvent.click(submitButton)
    })
    await waitFor(() => {
      return document.querySelector("label[for='connectionType']")
    })
    expect(container).toMatchSnapshot('step 2')
  })
})
