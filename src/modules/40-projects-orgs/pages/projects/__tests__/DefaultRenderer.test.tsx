import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import DefaultRenderer from '@projects-orgs/components/ModuleRenderer/DefaultRenderer'

const project = {
  accountIdentifier: 'testAcc',
  orgIdentifier: 'testOrg',
  identifier: 'test',
  name: 'test',
  color: '#e6b800',
  modules: [],
  description: 'test',
  tags: ['tag1', 'tag2'],
  owners: ['testAcc']
}

describe('Default Renderer test', () => {
  test('initializes ok ', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId" pathParams={{ accountId: 'testAcc' }}>
        <DefaultRenderer data={project} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
