import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import { TestWrapper } from 'modules/common/utils/testUtils'
import { defaultAppStoreValues, project } from './DefaultAppStoreData'
import ContextMenu from '../views/Menu/ContextMenu'

const reloadProjects = jest.fn()
const editProject = jest.fn()
const collaborators = jest.fn()
const setMenuOpen = jest.fn()
const openDialog = jest.fn()

describe('Context Menu test', () => {
  test('invite collaborators ', async () => {
    const { container, getByText } = render(
      <TestWrapper
        path="/account/:accountId"
        pathParams={{ accountId: 'testAcc' }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <ContextMenu
          project={project}
          reloadProjects={reloadProjects}
          editProject={editProject}
          collaborators={collaborators}
          setMenuOpen={setMenuOpen}
          openDialog={openDialog}
        />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
    fireEvent.click(getByText('Invite Collaborators'))
    expect(collaborators).toHaveBeenCalled()
    fireEvent.click(getByText('Delete'))
    expect(openDialog).toHaveBeenCalled()
    fireEvent.click(getByText('Go to Continuous Verification'))
    expect(container).toMatchSnapshot()
  }),
    test('invite collaborators ', async () => {
      const { container, getByText } = render(
        <TestWrapper
          path="/account/:accountId"
          pathParams={{ accountId: 'testAcc' }}
          defaultAppStoreValues={defaultAppStoreValues}
        >
          <ContextMenu
            project={project}
            reloadProjects={reloadProjects}
            editProject={editProject}
            collaborators={collaborators}
            setMenuOpen={setMenuOpen}
            openDialog={openDialog}
          />
        </TestWrapper>
      )
      expect(container).toMatchSnapshot()
      fireEvent.click(getByText('Edit'))
      expect(editProject).toHaveBeenCalled()
      fireEvent.click(getByText('Go to Continuous Deployement'))
      expect(container).toMatchSnapshot()
    })
})
