import React from 'react'
import { render, waitFor } from '@testing-library/react'

import { TestWrapper } from '@common/utils/testUtils'
import GitSyncPage from '../GitSyncPage'

describe('GitSync Page', () => {
  test('render GitSync container', async () => {
    const { container, getAllByText } = render(
      <TestWrapper path="/account/:accountId/git-sync" pathParams={{ accountId: 'dummy' }}>
        <GitSyncPage />
      </TestWrapper>
    )
    await waitFor(() => getAllByText('Entities'))
    expect(container).toMatchSnapshot()
  })
})
