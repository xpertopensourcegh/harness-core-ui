import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import type { CIBuildResponseDTO } from '../../Types/types'
import BuildInfo from '../BuildInfo'

const getCiBuildResponse = (type: 'branch' | 'pullRequest'): CIBuildResponseDTO => {
  return {
    event: type,
    branch: {
      name: 'master',
      link: 'link',
      state: 'state',
      commits: [
        {
          id: '123456789',
          link: 'link',
          message: 'Message ...',
          ownerName: 'Owner',
          ownerId: 'ownerid',
          ownerEmail: 'ownerEmail',
          timeStamp: 123456789
        }
      ]
    },
    pullRequest: {
      id: '5',
      title: 'Title',
      link: 'link',
      body: 'body',
      state: 'OPEN',
      sourceRepo: 'source-repo',
      sourceBranch: 'source-branch',
      targetBranch: 'target-branch',
      commits: [
        {
          id: '123456789',
          link: 'link',
          message: 'Message ...',
          ownerName: 'Owner',
          ownerId: 'ownerid',
          ownerEmail: 'ownerEmail',
          timeStamp: 123456789
        }
      ]
    }
  } as CIBuildResponseDTO
}

describe('BuildInfo snapshot tests', () => {
  test('renders "builds" properly', () => {
    const { container, rerender } = render(
      <TestWrapper>
        <BuildInfo buildData={getCiBuildResponse('branch')} showCommits={true} toggleCommits={jest.fn()} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()

    rerender(
      <TestWrapper>
        <BuildInfo buildData={getCiBuildResponse('branch')} showCommits={false} toggleCommits={jest.fn()} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test('renders "pullRequest" properly', () => {
    const { container, rerender } = render(
      <TestWrapper>
        <BuildInfo buildData={getCiBuildResponse('pullRequest')} showCommits={true} toggleCommits={jest.fn()} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()

    rerender(
      <TestWrapper>
        <BuildInfo buildData={getCiBuildResponse('pullRequest')} showCommits={false} toggleCommits={jest.fn()} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
