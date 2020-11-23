import React from 'react'

import { render, queryByText, fireEvent, act } from '@testing-library/react'
import type { Project } from 'services/cd-ng'
import { TestWrapper } from '@common/utils/testUtils'
import i18n from '@projects-orgs/pages/projects/ProjectsPage.i18n'
import PurposeList from '../PurposeList'

const project: Project = {
  accountIdentifier: 'testAcc',
  orgIdentifier: 'testOrg',
  identifier: 'test',
  name: 'test',
  color: '#e6b800',
  modules: [],
  description: 'test',
  tags: { tag1: '', tag2: 'tag3' }
}

const addModule = jest.fn()
jest.mock('services/cd-ng', () => ({
  usePutProject: jest.fn().mockImplementation(() => ({ mutate: addModule }))
}))

describe('PurposeList test', () => {
  test('initializes ok ', async () => {
    const { container, getAllByText } = render(
      <TestWrapper path="/account/:accountId" pathParams={{ accountId: 'testAcc' }}>
        <PurposeList data={project} />
      </TestWrapper>
    )
    expect(queryByText(container, i18n.newProjectWizard.purposeList.name)).toBeDefined()
    expect(container).toMatchSnapshot()
    await act(async () => {
      const enablecd = getAllByText('Enable')[0]
      fireEvent.click(enablecd)
    })
    expect(addModule).toBeCalled()
    addModule.mockReset()
    await act(async () => {
      const enablecv = getAllByText('Enable')[0]
      fireEvent.click(enablecv)
    })
    expect(addModule).toBeCalled()
    addModule.mockReset()
    await act(async () => {
      const enableci = getAllByText('Enable')[0]
      fireEvent.click(enableci)
    })
    expect(addModule).toBeCalled()
    addModule.mockReset()
    await act(async () => {
      const enablece = getAllByText('Enable')[0]
      fireEvent.click(enablece)
    })
    expect(addModule).toBeCalled()
    addModule.mockReset()
    await act(async () => {
      const enablecf = getAllByText('Enable')[0]
      fireEvent.click(enablecf)
    })
    expect(addModule).toBeCalled()
    expect(container).toMatchSnapshot()
  })
})
