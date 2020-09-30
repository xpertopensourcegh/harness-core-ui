import React from 'react'

import { render } from '@testing-library/react'
import type { Organization } from 'services/cd-ng'
import { TestWrapper } from 'modules/common/utils/testUtils'
import { StepAboutOrganization } from 'modules/common/modals/OrganizationModal/NewView/StepAboutOrganization'

const organization: Organization = {
  accountIdentifier: 'testAcc',
  identifier: 'testOrg',
  name: 'test',
  color: '#e6b800',
  description: 'test',
  tags: ['tag1', 'tag2']
}

describe('About Organization test', () => {
  test('create Organization ', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId" pathParams={{ accountId: 'testAcc' }}>
        <StepAboutOrganization data={undefined} edit={false} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  }),
    test('edit Organization ', async () => {
      const { container } = render(
        <TestWrapper path="/account/:accountId" pathParams={{ accountId: 'testAcc' }}>
          <StepAboutOrganization data={organization} edit={true} />
        </TestWrapper>
      )
      expect(container).toMatchSnapshot()
    })
})
