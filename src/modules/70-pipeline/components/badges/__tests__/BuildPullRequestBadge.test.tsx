import React from 'react'
import { render } from '@testing-library/react'
import BuildPullRequestBadge from '../BuildPullRequestBadge/BuildPullRequestBadge'

describe('<BuildPullRequestBadge /> tests', () => {
  test('snapshot test', () => {
    const { container, rerender } = render(
      <BuildPullRequestBadge sourceRepo="sourceRepo1" sourceBranch="sourceBranch" targetBranch="targetBranch" />
    )
    expect(container).toMatchSnapshot()

    rerender(<BuildPullRequestBadge sourceBranch="sourceBranch" targetBranch="targetBranch" />)
    expect(container).toMatchSnapshot()
  })
})
