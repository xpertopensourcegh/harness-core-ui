import React from 'react'
import { noop } from 'lodash-es'
import { render } from '@testing-library/react'
import { BuildCard, BuildCardProps } from '../BuildCard'

const getProps = (): BuildCardProps => ({
  id: 1,
  startTime: 1,
  endTime: 1,
  status: 'SUCCESS',
  triggerType: 'trigger',
  event: 'branch',
  pipelineId: 'a',
  pipelineName: 'b',
  authorId: 'c',
  avatar: 'd',
  branchName: 'e',
  branchLink: 'f',
  commits: [
    {
      id: 'commitId',
      link: 'link',
      message: 'message',
      ownerName: 'ownerName',
      ownerId: 'ownerId',
      ownerEmail: 'ownerEmail',
      timeStamp: 1606585312000
    }
  ],
  PRId: 1,
  PRLink: '1',
  PRTitle: '2',
  PRBody: '3',
  PRSourceBranch: '4',
  PRTargetBranch: '5',
  PRState: 'open',
  pipeline: null as any,
  onClick: noop
})

describe('BuildCard snapshot test', () => {
  test('should render "build" type properly', async () => {
    const { container } = render(<BuildCard {...getProps()} event={'branch'} />)
    expect(container).toMatchSnapshot()
  })
  test('should render "pull_request" type properly', async () => {
    const { container } = render(<BuildCard {...getProps()} event={'pull_request'} />)
    expect(container).toMatchSnapshot()
  })
})
