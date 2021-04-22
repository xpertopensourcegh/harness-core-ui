import React from 'react'
import { render, fireEvent, findByText, waitFor, act, RenderResult } from '@testing-library/react'
import { GitSyncTestWrapper } from '@common/utils/gitSyncTestUtils'
import { fillAtForm, InputTypes } from '@common/utils/JestFormHelper'
import GitSyncRepoTab from '../GitSyncRepoTab'

const createGitSynRepo = jest.fn()
const updateGitSynRepo = jest.fn()

jest.mock('services/cd-ng', () => ({
  usePostGitSync: jest.fn().mockImplementation(() => ({ mutate: createGitSynRepo })),
  usePutGitSync: jest.fn().mockImplementation(() => ({ mutate: updateGitSynRepo })),
  useGetConnector: jest.fn().mockImplementation(() => Promise.resolve([]))
}))

const getMenuIcon = (row: Element) => {
  const columns = row.querySelectorAll('[role="cell"]')
  const lastColumn = columns[columns.length - 1]
  return lastColumn.querySelector('[data-icon="Options"]')
}

describe('Git Sync - repo tab', () => {
  const setup = (): RenderResult =>
    render(
      <GitSyncTestWrapper
        path="/account/:accountId/ci/orgs/:orgIdentifier/projects/:projectIdentifier/admin/git-sync/repos"
        pathParams={{ accountId: 'dummy', orgIdentifier: 'default', projectIdentifier: 'dummyProject' }}
      >
        <GitSyncRepoTab />
      </GitSyncTestWrapper>
    )
  afterEach(() => {
    updateGitSynRepo.mockReset()
  })

  test('rendering landing list view', async () => {
    const { container, getByText } = setup()

    await waitFor(() => {
      expect(getByText('wings-software/triggerNgDemo')).toBeTruthy()
    })

    expect(container).toMatchSnapshot()
  })

  test('test for opening add repo modal in list view', async () => {
    const { container } = setup()
    const addRepoBtn = document.getElementById('newRepoBtn')
    expect(addRepoBtn).toBeTruthy()
    act(() => {
      fireEvent.click(addRepoBtn!)
    })
    const addRepoModal = document.getElementsByClassName('bp3-dialog')[0]
    await waitFor(() => findByText(addRepoModal as HTMLElement, 'selectGitProvider'))
    expect(container).toMatchSnapshot()
  })

  test('test for adding new root folder', async () => {
    const { container, getByText, getAllByText } = setup()
    const addFolderBtn = getAllByText('gitsync.addFolder')
    expect(addFolderBtn.length).toEqual(2) // in mock data we have 2 repo now
    await act(async () => {
      fireEvent.click(addFolderBtn[0])
    })

    // Valiadation for rootfolder name
    act(() => {
      fireEvent.click(getByText('save'))
    })

    expect(updateGitSynRepo).toHaveBeenCalledTimes(0)

    act(() => {
      fillAtForm([
        {
          container,
          fieldId: 'rootFolder',
          type: InputTypes.TEXTFIELD,
          value: 'rootfolder/.harmess/'
        },
        {
          container,
          fieldId: 'isDefault',
          type: InputTypes.CHECKBOX,
          value: 'true'
        }
      ])

      expect(container).toMatchSnapshot()
    })

    await act(async () => {
      fireEvent.click(getByText('save'))
    })
    expect(updateGitSynRepo).toHaveBeenCalledTimes(1)
    expect(updateGitSynRepo).toHaveBeenCalledWith({
      branch: 'master',
      gitConnectorRef: 'gitSyncTest',
      gitConnectorType: 'Github',
      gitSyncFolderConfigDTOs: [
        {
          isDefault: false,
          rootFolder: 'src1/.harness/'
        },
        {
          isDefault: false,
          rootFolder: 'src2/.harness/'
        },
        {
          isDefault: true,
          rootFolder: 'rootfolder/.harmess/'
        }
      ],
      identifier: '606312ffef03c30721080b85',
      name: 'gitSyncRepoTest',
      orgIdentifier: 'default',
      projectIdentifier: 'dummyProject',
      repo: 'https://github.com/wings-software/triggerNgDemo'
    })
  })

  test('test for making a rootfolder default from leftmenu', async () => {
    updateGitSynRepo.mock
    const { container } = setup()
    const menuIcon = getMenuIcon(container.querySelectorAll('div[role="row"]')[1])
    act(() => {
      fireEvent.click(menuIcon!)
    })
    expect(container).toMatchSnapshot()
    const makeDefaultButton = document.querySelector('[data-test="markDefaultBtn"]')
    act(() => {
      fireEvent.click(makeDefaultButton!)
      expect(updateGitSynRepo).toHaveBeenCalledTimes(1)
    })
  })
})
