import React from 'react'

import { render } from '@testing-library/react'
import type {
  Project,
  ResponseOptionalListRoleDTO,
  ResponsePageInviteDTO,
  ResponsePageUserSearchDTO
} from 'services/cd-ng'
import { TestWrapper, UseGetMockData } from 'modules/common/utils/testUtils'
import { rolesMockData } from './RolesMockData'
import { userMockData } from './UserMockData'
import Collaborators from '../Collaborators'
import { invitesMockData } from './InvitesMockData'

const project: Project = {
  accountIdentifier: 'testAcc',
  orgIdentifier: 'testOrg',
  identifier: 'test',
  name: 'test',
  color: '#e6b800',
  modules: ['CD'],
  description: 'test',
  tags: ['tag1', 'tag2'],
  owners: ['testAcc']
}

describe('Collaborators test', () => {
  test('Render Collaborators ', async () => {
    const { container } = render(
      <TestWrapper path="/account/:accountId" pathParams={{ accountId: 'testAcc' }}>
        <Collaborators
          data={project}
          userMockData={userMockData as UseGetMockData<ResponsePageUserSearchDTO>}
          rolesMockData={rolesMockData as UseGetMockData<ResponseOptionalListRoleDTO>}
          invitesMockData={invitesMockData as UseGetMockData<ResponsePageInviteDTO>}
        />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
