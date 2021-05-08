import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import CDInfo, { CDInfoProps } from '../CDInfo'

const getProps = (): CDInfoProps => ({
  data: null,
  barrier: {
    barrierInfoLoading: false,
    barrierData: null
  }
})

describe('CDInfo', () => {
  test('matches snapshot when no data', () => {
    const props = getProps()
    const { container } = render(
      <TestWrapper>
        <CDInfo {...props} />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
  })
})
