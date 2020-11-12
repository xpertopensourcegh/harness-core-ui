import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import type { Project } from 'services/cd-ng'
import { ModuleName } from 'framework/exports'
import { createMockData } from '@projects-orgs/pages/projects/__tests__/ProjectPageMock'
import ModuleEnableCard from '../ModuleEnableCard'

const data: Project = {
  accountIdentifier: 'testAcc',
  orgIdentifier: 'testOrg',
  identifier: 'test',
  name: 'test',
  color: '#e6b800',
  modules: [],
  description: 'test',
  tags: ['tag1', 'tag2'],
  owners: ['testAcc'],
  lastModifiedAt: 1599715118275
}
const addModule = jest.fn()
jest.mock('services/cd-ng', () => ({
  usePutProject: jest.fn().mockImplementation(args => {
    addModule(args)
    return createMockData
  })
}))

const moduleList: ModuleName[] = [ModuleName.CD, ModuleName.CV, ModuleName.CE, ModuleName.CF, ModuleName.CI]

describe('Project Details', () => {
  test('render', async () => {
    moduleList.map(value => {
      addModule.mockReset()
      const { container } = render(
        <TestWrapper
          path="/account/:accountId/org/:orgIdentifier/project/:projectIdentifier"
          pathParams={{ accountId: 'testAcc', orgIdentifier: 'Cisco_Meraki', projectIdentifier: 'Portal' }}
        >
          <ModuleEnableCard data={data} module={value} />
        </TestWrapper>
      )
      expect(container).toMatchSnapshot()
      const card = container.getElementsByClassName('bp3-card')[0]
      fireEvent.click(card)
      expect(addModule).toBeCalled()
    })
  })
})
