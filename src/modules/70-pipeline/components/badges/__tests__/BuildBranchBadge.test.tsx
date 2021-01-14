import React from 'react'
import { render } from '@testing-library/react'
import BuildBranchBadge from '../BuildBranchBadge/BuildBranchBadge'

describe('<BuildBranchBadge /> tests', () => {
  test('snapshot test', () => {
    const { container, rerender } = render(<BuildBranchBadge branchName="branchName1" commitId="commitId1" />)
    expect(container).toMatchSnapshot()

    rerender(<BuildBranchBadge branchName="branchName1" />)
    expect(container).toMatchSnapshot()
  })
})
