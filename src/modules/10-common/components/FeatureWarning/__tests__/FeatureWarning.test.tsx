import React from 'react'
import { render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import {
  FeatureWarning,
  FeatureWarningWithTooltip,
  FeatureWarningTooltip
} from '@common/components/FeatureWarning/FeatureWarning'
import routes from '@common/RouteDefinitions'
import { accountPathProps } from '@common/utils/routeUtils'
import { FeatureIdentifier } from 'framework/featureStore/FeatureIdentifier'

describe('FeatureWarning', () => {
  test('FeatureWarning', () => {
    const { container } = render(
      <TestWrapper path={routes.toRoleDetails({ ...accountPathProps })} pathParams={{ accountId: 'dummy' }}>
        <FeatureWarning featureName={FeatureIdentifier.MULTIPLE_ORGANIZATIONS} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
  test('FeatureWarningWithTooltip', () => {
    const { container } = render(
      <TestWrapper path={routes.toRoleDetails({ ...accountPathProps })} pathParams={{ accountId: 'dummy' }}>
        <FeatureWarningWithTooltip featureName={FeatureIdentifier.MULTIPLE_PROJECTS} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test('FeatureWarningTooltip', () => {
    const { container } = render(
      <TestWrapper path={routes.toRoleDetails({ ...accountPathProps })} pathParams={{ accountId: 'dummy' }}>
        <FeatureWarningTooltip featureName={FeatureIdentifier.MULTIPLE_PROJECTS} module="cd" />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
})
