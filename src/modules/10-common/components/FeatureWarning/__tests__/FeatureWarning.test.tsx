import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { FeatureWarning, FeatureWarningWithTooltip } from '@common/components/FeatureWarning/FeatureWarning'
import routes from '@common/RouteDefinitions'
import { accountPathProps } from '@common/utils/routeUtils'
import { FeatureIdentifier } from 'framework/featureStore/FeatureIdentifier'

describe('FeatureWarning', () => {
  test('FeatureWarning', () => {
    const { container } = render(
      <TestWrapper path={routes.toRoleDetails({ ...accountPathProps })} pathParams={{ accountId: 'dummy' }}>
        <FeatureWarning featureName={FeatureIdentifier.BUILDS} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
  test('FeatureWarningWithTooltip', () => {
    const { container } = render(
      <TestWrapper path={routes.toRoleDetails({ ...accountPathProps })} pathParams={{ accountId: 'dummy' }}>
        <FeatureWarningWithTooltip featureName={FeatureIdentifier.CUSTOM_RESOURCE_GROUPS} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
