import React from 'react'
import { set } from 'lodash-es'
import { render } from '@testing-library/react'
import type { CIBuildCommit } from 'services/ci'
import { BuildPageContext, BuildPageContextInterface } from '@ci/pages/build/context/BuildPageContext'
import BuildCommits from '../BuildCommits'

const getContextValue = (): BuildPageContextInterface => {
  const commits: CIBuildCommit[] = [
    {
      id: '1',
      link: 'http://...',
      message: 'message...',
      ownerName: 'user',
      ownerId: 'userid',
      ownerEmail: 'test@harness.com',
      timeStamp: 1606585312000
    }
  ]
  const buildData = {}
  set(buildData, 'response.data.branch.commits', commits)
  return { buildData: buildData } as BuildPageContextInterface
}

jest.mock('@ci/services/CIUtils', () => ({
  getTimeAgo: () => '1 day ago',
  getShortCommitId: () => 'abc'
}))

describe('BuildCommits snapshot test', () => {
  test('should render properly', async () => {
    const { container } = render(
      <BuildPageContext.Provider value={getContextValue()}>
        <BuildCommits />
      </BuildPageContext.Provider>
    )
    expect(container).toMatchSnapshot()
  })
})
