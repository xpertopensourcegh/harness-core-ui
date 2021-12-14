import React from 'react'
import { render, queryAllByText, waitFor } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { GitSyncErrorMessageItem } from '../GitSyncErrorMessageItem'

describe('GitSyncErrorMessageItem', () => {
  test('Fix commit and error reason should be rendered', async () => {
    const errorReason = 'errorReason'
    const { container } = render(
      <TestWrapper
        path="/account/:accountId/cd/orgs/:orgIdentifier/projects/:projectIdentifier/setup/git-sync/errors"
        pathParams={{ accountId: 'dummyAccount', orgIdentifier: 'default', projectIdentifier: 'dummyProject' }}
        defaultAppStoreValues={{
          isGitSyncEnabled: true,
          selectedProject: {
            identifier: 'dummy',
            name: 'dummy',
            modules: ['CD']
          }
        }}
      >
        <GitSyncErrorMessageItem
          fixCommit={'fixCommitId'}
          reason={errorReason}
          title={'src/.harness/filepath.yaml'}
        ></GitSyncErrorMessageItem>
      </TestWrapper>
    )

    const errorReasonElm = queryAllByText(container, errorReason)
    await waitFor(() => expect(errorReasonElm).not.toBeNull())
    expect(errorReasonElm).toHaveLength(1)
    expect(container).toMatchSnapshot()
  })
})
