import React from 'react'
import { render, waitFor, fireEvent, getByText, queryByText } from '@testing-library/react'
import { noop } from 'lodash-es'
import { TestWrapper } from 'modules/common/utils/testUtils'
import GitSyncRepoTab, { RepoList } from '../GitSyncRepoTab'

import gitSyncListResponse from './mockData/gitSyncRepoListMock.json'
import connectorListResponse from './mockData/gitConnectorListMock.json'

jest.mock('services/cd-ng', () => ({
  useListGitSync: jest.fn(() => []),
  useGetConnectorList: jest.fn(() => []),
  usePostGitSync: jest.fn(() => []),
  usePutGitSync: jest.fn(() => [])
}))

describe('Git Sync - repo tab', () => {
  test('rendering landing view', async () => {
    const { getAllByText, container } = render(
      <TestWrapper path="/account/:accountId/git-sync/repos" pathParams={{ accountId: 'dummy' }}>
        <GitSyncRepoTab
          gitSyncMockData={gitSyncListResponse as any}
          gitConnectorsMockData={connectorListResponse as any}
        />
      </TestWrapper>
    )
    await waitFor(() => getAllByText('GIT SERVER'))
    expect(container).toMatchSnapshot()
    const addBtnRow = getAllByText('+ Add Repository')
    expect(addBtnRow.length).toEqual(1)
    fireEvent.click(addBtnRow[0]!)
    // After clicking add repository, form with Save option should come and add option should be hidden
    await waitFor(() => getByText(document.body, 'Save'))
    expect(queryByText(document.body, '+ Add Repository')).toBeNull()
    expect(container).toMatchSnapshot()
  })

  test('render Git Sync repo List ', async () => {
    const { container } = render(
      <RepoList
        repoList={gitSyncListResponse}
        serverList={connectorListResponse.data.content as any}
        persistGitSyncConnector={noop}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
