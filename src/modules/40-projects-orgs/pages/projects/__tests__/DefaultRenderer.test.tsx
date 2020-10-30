import React from 'react'
import { fireEvent, render } from '@testing-library/react'
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

const updateProject = jest.fn()

jest.mock('services/cd-ng', () => ({
  usePutProject: jest.fn().mockImplementation(() => ({ mutate: updateProject }))
}))

describe('Default Renderer test', () => {
  test('initializes ok ', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId" pathParams={{ accountId: 'testAcc' }}>
        <DefaultRenderer data={project} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
    const cd = container.getElementsByClassName('bp3-icon')[0]
    const cv = container.getElementsByClassName('bp3-icon')[1]
    fireEvent.click(cd)
    expect(updateProject).toHaveBeenCalled()
    fireEvent.click(cv)
    expect(updateProject).toHaveBeenCalled()
  }),
    test('Preview is ok', async () => {
      const { container } = render(
        <TestWrapper path="/account/:accountId" pathParams={{ accountId: 'testAcc' }}>
          <DefaultRenderer data={project} isPreview={true} />
        </TestWrapper>
      )
      expect(container).toMatchSnapshot()
    })
})
