import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import Step2Script from '../Step2Script/Step2Script'

jest.mock('services/portal', () => ({
  useGenerateDockerDelegateYAML: jest.fn().mockImplementation(() => {
    return {
      mutate: jest.fn().mockImplementation(() => '')
    }
  })
}))

describe('Create Docker Step2Script', () => {
  test('render data', () => {
    const { container } = render(
      <TestWrapper>
        <Step2Script />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
