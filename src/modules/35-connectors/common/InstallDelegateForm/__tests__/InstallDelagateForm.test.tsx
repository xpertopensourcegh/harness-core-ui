import React from 'react'
import { render } from '@testing-library/react'
import InstallDelegateForm from '../InstallDelegateForm'

const delegateProfileData = {
  resource: {
    response: [
      {
        accountId: 'mock-account-id',
        approvalRequired: false,
        createdAt: 1589895150466,
        createdBy: null,
        description: 'The primary profile for the account',
        lastUpdatedAt: 1589895150466,
        lastUpdatedBy: null,
        name: 'Primary',
        primary: true,
        scopingRules: null,
        selectors: null,
        startupScript: null,
        uuid: 'uuid'
      }
    ]
  }
}

describe('Install Delegate Form', () => {
  test('render successfully', () => {
    const { container, getByText } = render(
      <InstallDelegateForm
        accountId="mock-account-id"
        mockData={{
          data: delegateProfileData,
          loading: false
        }}
      />
    )
    expect(getByText('Give a name to your delegate')).toBeDefined()
    expect(getByText('Select a delegate profile if it defined')).toBeDefined()
    expect(container).toMatchSnapshot()
  })
})
