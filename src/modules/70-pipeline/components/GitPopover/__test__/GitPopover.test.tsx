import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import GitPopover, { GitPopoverProps } from '../GitPopover'

const getProps = (): GitPopoverProps => ({
  data: {
    repoIdentifier: 'some repo',
    branch: 'master'
  }
})

describe('GitPopover', () => {
  test('matches snapshot', () => {
    const props = getProps()
    const { container } = render(
      <TestWrapper>
        <GitPopover {...props} />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
  })
})
