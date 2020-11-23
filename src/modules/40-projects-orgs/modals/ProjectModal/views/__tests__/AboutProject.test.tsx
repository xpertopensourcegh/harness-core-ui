import React from 'react'

import { render, queryByText, fireEvent } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import type { Project, ResponseOrganization, ResponsePageOrganization, ResponseProject } from 'services/cd-ng'
import { TestWrapper, UseGetMockData, UseMutateMockData } from '@common/utils/testUtils'
import { clickSubmit, InputTypes, setFieldValue } from '@common/utils/JestFormHelper'
import i18n from '@projects-orgs/pages/projects/ProjectsPage.i18n'
import { orgMockData } from './OrgMockData'
import StepProject from '../StepAboutProject'
import EditProject from '../EditProject'

const project: Project = {
  accountIdentifier: 'testAcc',
  orgIdentifier: 'testOrg',
  identifier: 'test',
  name: 'test',
  color: '#e6b800',
  modules: ['CD'],
  description: 'test',
  tags: { tag1: '', tag2: 'tag3' }
}

const projectMockData: UseGetMockData<ResponseProject> = {
  data: {
    status: 'SUCCESS',
    data: {
      accountIdentifier: 'testAcc',
      orgIdentifier: 'testOrg',
      identifier: 'test',
      name: 'test modified',
      color: '#0063F7',
      modules: ['CD', 'CV'],
      description: 'refetch returns new data',
      tags: {},
      lastModifiedAt: 1602158268618
    },
    metaData: undefined,
    correlationId: '88124a30-e021-4890-8466-c2345e1d42d6'
  }
}

const editOrgMockData: UseGetMockData<ResponseOrganization> = {
  data: {
    status: 'SUCCESS',
    data: {
      accountIdentifier: 'testAcc',
      identifier: 'testOrg',
      name: 'Org Name',
      description: 'Description',
      tags: { tag1: '', tag2: 'tag3' },
      lastModifiedAt: 1602148957762
    },
    metaData: undefined,
    correlationId: '9f77f74d-c4ab-44a2-bfea-b4545c6a4a39'
  }
}

const createMockData: UseMutateMockData<ResponseProject> = {
  mutate: async () => {
    return {
      status: 'SUCCESS',
      data: {
        accountIdentifier: 'kmpySmUISimoRrJL6NL73w',
        orgIdentifier: 'default',
        identifier: 'dummy_name',
        name: 'dummy name',
        color: '#0063F7',
        modules: [],
        description: '',
        tags: {},
        lastModifiedAt: 1602660684194
      },
      metaData: undefined,
      correlationId: '375d39b4-3552-42a2-a4e3-e6b9b7e51d44'
    }
  },
  loading: false
}

const editMockData: UseMutateMockData<ResponseProject> = {
  mutate: async () => {
    return {
      status: 'SUCCESS',
      data: {
        accountIdentifier: 'testAcc',
        orgIdentifier: 'testOrg',
        identifier: 'test',
        name: 'dummy name',
        color: '#e6b800',
        modules: ['CD'],
        description: 'test',
        tags: { tag1: '', tag2: 'tag3' },
        lastModifiedAt: 1602660684194
      },
      metaData: undefined,
      correlationId: '375d39b4-3552-42a2-a4e3-e6b9b7e51d44'
    }
  },
  loading: false
}

describe('About Project test', () => {
  test('create project ', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId" pathParams={{ accountId: 'testAcc' }}>
        <StepProject
          orgMockData={orgMockData as UseGetMockData<ResponsePageOrganization>}
          createMock={createMockData}
        />
      </TestWrapper>
    )
    expect(queryByText(container, i18n.newProjectWizard.aboutProject.name)).toBeDefined()
    expect(container).toMatchSnapshot()

    setFieldValue({ type: InputTypes.TEXTFIELD, container: container, fieldId: 'name', value: 'dummy name' })
    fireEvent.click(container.querySelectorAll('[icon="small-plus"]')[0]!)

    setFieldValue({
      type: InputTypes.TEXTAREA,
      container: container,
      fieldId: 'description',
      value: ' This is new description'
    })
    fireEvent.click(container.querySelectorAll('[icon="small-plus"]')[0]!)
    clickSubmit(container)
    expect(container).toMatchSnapshot()
  }),
    test('edit project ', async () => {
      const { container } = render(
        <TestWrapper path="/account/:accountId" pathParams={{ accountId: 'testAcc' }}>
          <EditProject
            identifier={project.identifier}
            orgIdentifier={project.accountIdentifier}
            editOrgMockData={editOrgMockData}
            projectMockData={projectMockData}
            editMockData={editMockData}
          />
        </TestWrapper>
      )
      expect(queryByText(container, i18n.newProjectWizard.aboutProject.name)).toBeDefined()
      expect(container).toMatchSnapshot()

      await act(async () => {
        fireEvent.change(container.querySelector('input[name="name"]')!, {
          target: { value: 'dummy name' }
        })
      })
      await act(async () => {
        fireEvent.click(container.querySelector('button[type="submit"]')!)
      })
      expect(container).toMatchSnapshot()
    })
})
