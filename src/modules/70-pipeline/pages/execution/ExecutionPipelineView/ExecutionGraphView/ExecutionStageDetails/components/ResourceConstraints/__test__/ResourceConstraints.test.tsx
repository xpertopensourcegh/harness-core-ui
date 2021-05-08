import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import ResourceConstraintTooltip, { ResourceConstraintTooltipProps } from '../ResourceConstraints'

const getProps = (): ResourceConstraintTooltipProps => ({
  loading: false,
  data: {
    executionList: [
      {
        pipelineIdentifier: 'Some Identifier',
        planExecutionId: 'Some Plan Execution Id',
        state: 'ACTIVE'
      }
    ],
    executionId: 'Some Execution Id'
  }
})

describe('ResourceConstraintTooltip', () => {
  test('matches snapshot', () => {
    const props = getProps()
    const { container } = render(
      <TestWrapper>
        <ResourceConstraintTooltip {...props} />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
  })
})
