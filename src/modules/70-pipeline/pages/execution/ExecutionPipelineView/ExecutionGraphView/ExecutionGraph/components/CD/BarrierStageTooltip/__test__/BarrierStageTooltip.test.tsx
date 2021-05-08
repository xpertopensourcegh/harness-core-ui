import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import BarrierStageTooltip, { BarrierStageTooltipProps } from '../BarrierStageTooltip'

const getProps = (): BarrierStageTooltipProps => ({
  loading: false,
  data: [
    {
      name: 'Barrier name',
      identifier: 'Barrier identifier'
    }
  ],
  stageName: 'StageName'
})

describe('BarrierStageTooltip', () => {
  test('matches snapshot', () => {
    const props = getProps()
    const { container } = render(
      <TestWrapper>
        <BarrierStageTooltip {...props} />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
  })
})
