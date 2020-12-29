import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { CommitsList } from '../CommitsList'
import type { CIBuildCommit } from '../../ExecutionDetails/Types/types'

const getCommits = (numberOfCommits = 5): CIBuildCommit[] => {
  return [...Array(numberOfCommits).keys()].map((_, idx: number) => getCommit(idx))
}

const getCommit = (idx: number): CIBuildCommit => ({
  id: idx + '123456789',
  link: 'link-' + idx,
  message: 'Commit message ' + idx,
  ownerName: 'Owner name ' + idx,
  ownerId: 'owner-id-' + idx,
  ownerEmail: idx + '@a.a',
  timeStamp: 123456789
})

describe('Commit list snapshot tests', () => {
  test('renders commits properly', () => {
    const { container, rerender } = render(
      <TestWrapper>
        <CommitsList commits={getCommits(2)} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()

    rerender(
      <TestWrapper>
        <CommitsList commits={getCommits(5)} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()

    rerender(
      <TestWrapper>
        <CommitsList commits={getCommits(7)} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
