import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import CreateK8sDelegate from '../CreateK8sDelegate'

describe('Create K8s Delegate', () => {
  test('render data', () => {
    const { container } = render(
      <TestWrapper>
        <CreateK8sDelegate />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
