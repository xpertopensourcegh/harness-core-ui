import { fireEvent, render, RenderResult, screen, waitFor } from '@testing-library/react'
import React from 'react'
import * as usePlanEnforcementMock from '@cf/hooks/usePlanEnforcement'
import * as rbacHooksMock from '@rbac/hooks/usePermission'
import { TestWrapper } from '@common/utils/testUtils'
import mockFeature from '@cf/utils/testData/data/mockFeature'
import * as useFeaturesMock from '@common/hooks/useFeatures'

import FlagToggleSwitch, { FlagToggleSwitchProps } from '../FlagToggleSwitch'

const renderComponent = (props: Partial<FlagToggleSwitchProps> = {}): RenderResult => {
  return render(
    <TestWrapper
      path="/account/:accountId/cf/orgs/:orgIdentifier/projects/:projectIdentifier/feature-flags"
      pathParams={{ accountId: 'dummy', orgIdentifier: 'dummy', projectIdentifier: 'dummy' }}
    >
      <FlagToggleSwitch
        feature={mockFeature}
        environmentIdentifier="test"
        currentEnvironmentState="on"
        currentState="on"
        handleToggle={jest.fn()}
        {...props}
      />
    </TestWrapper>
  )
}

describe('FlagToggleSwitch', () => {
  beforeEach(() => {
    jest.spyOn(rbacHooksMock, 'usePermission').mockReturnValue([true])
    jest.spyOn(usePlanEnforcementMock, 'default').mockReturnValue({ isPlanEnforcementEnabled: false })
  })

  test('it should render toggle text correctly when ON', async () => {
    jest.spyOn(useFeaturesMock, 'useGetFirstDisabledFeature').mockReturnValue({ featureEnabled: true })
    renderComponent({
      currentState: 'on',
      currentEnvironmentState: 'on'
    })

    expect(screen.getByTestId('flag-status-switch')).toBeChecked()
    expect(screen.getByText('cf.featureFlags.flagOn')).toBeInTheDocument()
  })

  test('it should render toggle text correctly when OFF', async () => {
    jest.spyOn(useFeaturesMock, 'useGetFirstDisabledFeature').mockReturnValue({ featureEnabled: true })

    renderComponent({
      currentState: 'off',
      currentEnvironmentState: 'off'
    })

    expect(screen.getByTestId('flag-status-switch')).not.toBeChecked()
    expect(screen.getByText('cf.featureFlags.flagOff')).toBeInTheDocument()
  })

  test('it should render toggle text correctly when current flag state is OFF and environment state is ON', async () => {
    jest.spyOn(useFeaturesMock, 'useGetFirstDisabledFeature').mockReturnValue({ featureEnabled: true })

    renderComponent({
      currentState: 'off',
      currentEnvironmentState: 'on'
    })

    expect(screen.getByTestId('flag-status-switch')).not.toBeChecked()
    expect(screen.getByText('cf.featureFlags.flagWillTurnOff')).toBeInTheDocument()
  })

  test('it should render toggle text correctly when current flag state is ON and environment state is OFF', async () => {
    jest.spyOn(useFeaturesMock, 'useGetFirstDisabledFeature').mockReturnValue({ featureEnabled: true })

    renderComponent({
      currentState: 'on',
      currentEnvironmentState: 'off'
    })

    expect(screen.getByTestId('flag-status-switch')).toBeChecked()
    expect(screen.getByText('cf.featureFlags.flagWillTurnOn')).toBeInTheDocument()
  })

  test('it should render tooltip and disable button when plan enforcement limits reached', async () => {
    jest.spyOn(usePlanEnforcementMock, 'default').mockReturnValue({ isPlanEnforcementEnabled: true })
    jest.spyOn(useFeaturesMock, 'useFeature').mockReturnValue({ enabled: false })

    renderComponent({
      currentState: 'on',
      currentEnvironmentState: 'off'
    })

    fireEvent.mouseOver(screen.getByTestId('flag-status-switch') as HTMLButtonElement)

    await waitFor(() => {
      expect(screen.getByText('common.feature.upgradeRequired.pleaseUpgrade')).toBeInTheDocument()
      expect(screen.getByTestId('flag-status-switch')).toBeDisabled()
    })
  })

  test('it should hide tooltip and render button when plan enforcement disabled and feature disabled', async () => {
    jest.spyOn(usePlanEnforcementMock, 'default').mockReturnValue({ isPlanEnforcementEnabled: false })
    jest.spyOn(useFeaturesMock, 'useFeature').mockReturnValue({ enabled: false })

    renderComponent({
      currentState: 'on',
      currentEnvironmentState: 'off'
    })

    fireEvent.mouseOver(screen.getByTestId('flag-status-switch') as HTMLButtonElement)

    await waitFor(() => expect(screen.queryByText('common.feature.upgradeRequired.pleaseUpgrade')).toBeFalsy())
    await waitFor(() => expect(screen.getByTestId('flag-status-switch')).not.toBeDisabled())
  })
})
