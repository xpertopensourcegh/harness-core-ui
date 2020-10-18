import React from 'react'

import { render, queryByText, fireEvent } from '@testing-library/react'
import type { Project, ResponseProject } from 'services/cd-ng'
import { TestWrapper, UseMutateMockData } from 'modules/common/utils/testUtils'
import PurposeList from '../PurposeList'
import i18n from '../../../../pages/ProjectsPage/ProjectsPage.i18n'

const project: Project = {
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

const mockData: UseMutateMockData<ResponseProject> = {
  mutate: async () => {
    return {
      status: 'SUCCESS',
      data: {
        accountIdentifier: 'testAcc',
        orgIdentifier: 'testOrg',
        identifier: 'test',
        name: 'test',
        color: '#e6b800',
        modules: ['CD'],
        description: 'test',
        tags: ['tag1', 'tag2'],
        owners: ['testAcc'],
        lastModifiedAt: 1602660684194
      },
      metaData: undefined,
      correlationId: '375d39b4-3552-42a2-a4e3-e6b9b7e51d44'
    }
  },
  loading: false
}

describe('PurposeList test', () => {
  test('initializes ok ', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId" pathParams={{ accountId: 'testAcc' }}>
        <PurposeList data={project} mock={mockData} />
      </TestWrapper>
    )
    expect(queryByText(container, i18n.newProjectWizard.purposeList.name)).toBeDefined()
    expect(container).toMatchSnapshot()
    fireEvent.click(container.querySelector('button[type="button"]')!)
    expect(queryByText(container, i18n.newProjectWizard.purposeList.startcd)).toBeDefined()
  }),
    test('Start CV initializes ok ', async () => {
      const { container } = render(
        <TestWrapper path="/account/:accountId" pathParams={{ accountId: 'testAcc' }}>
          <PurposeList data={project} mock={mockData} />
        </TestWrapper>
      )
      expect(queryByText(container, i18n.newProjectWizard.purposeList.name)).toBeDefined()
      const cv = container.getElementsByClassName('bp3-card')[1]
      fireEvent.click(cv)
      expect(container).toMatchSnapshot()
      fireEvent.click(container.querySelector('button[type="button"]')!)
      expect(queryByText(container, i18n.newProjectWizard.purposeList.startcv)).toBeDefined()
    })

  test('Start CI initializes ok ', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId" pathParams={{ accountId: 'testAcc' }}>
        <PurposeList data={project} mock={mockData} />
      </TestWrapper>
    )
    expect(queryByText(container, i18n.newProjectWizard.purposeList.name)).toBeDefined()
    const ci = container.getElementsByClassName('bp3-card')[2]
    fireEvent.click(ci)
    expect(container).toMatchSnapshot()
    fireEvent.click(container.querySelector('button[type="button"]')!)
    expect(queryByText(container, i18n.newProjectWizard.purposeList.startci)).toBeDefined()
  }),
    test('Start CE initializes ok ', async () => {
      const { container } = render(
        <TestWrapper path="/account/:accountId" pathParams={{ accountId: 'testAcc' }}>
          <PurposeList data={project} mock={mockData} />
        </TestWrapper>
      )
      expect(queryByText(container, i18n.newProjectWizard.purposeList.name)).toBeDefined()
      const ce = container.getElementsByClassName('bp3-card')[3]
      fireEvent.click(ce)
      expect(container).toMatchSnapshot()
      fireEvent.click(container.querySelector('button[type="button"]')!)
      expect(queryByText(container, i18n.newProjectWizard.purposeList.startce)).toBeDefined()
    }),
    test('Start CF initializes ok ', async () => {
      const { container } = render(
        <TestWrapper path="/account/:accountId" pathParams={{ accountId: 'testAcc' }}>
          <PurposeList data={project} mock={mockData} />
        </TestWrapper>
      )
      expect(queryByText(container, i18n.newProjectWizard.purposeList.name)).toBeDefined()
      const cf = container.getElementsByClassName('bp3-card')[4]
      fireEvent.click(cf)
      expect(container).toMatchSnapshot()
      fireEvent.click(container.querySelector('button[type="button"]')!)
      expect(queryByText(container, i18n.newProjectWizard.purposeList.startcf)).toBeDefined()
    })
})
