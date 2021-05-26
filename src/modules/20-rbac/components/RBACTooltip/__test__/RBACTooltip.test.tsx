import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import RBACTooltip from '@rbac/components/RBACTooltip/RBACTooltip'
import routes from '@common/RouteDefinitions'
import { accountPathProps } from '@common/utils/routeUtils'
import { ResourceType } from '@rbac/interfaces/ResourceType'
import { PermissionIdentifier } from '@rbac/interfaces/PermissionIdentifier'

describe('RBACTooltip', () => {
  test('RBACTooltip component', () => {
    const { container } = render(
      <TestWrapper path={routes.toRoleDetails({ ...accountPathProps })} pathParams={{ accountId: 'dummy' }}>
        <RBACTooltip permission={PermissionIdentifier.CREATE_PROJECT} resourceType={ResourceType.PROJECT} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
