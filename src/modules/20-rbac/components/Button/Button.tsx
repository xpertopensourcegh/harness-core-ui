import React, { ReactElement, useMemo } from 'react'
import { pick } from 'lodash-es'
import { Button as CoreButton, ButtonProps as CoreButtonProps } from '@wings-software/uicore'
import { PopoverInteractionKind, Classes } from '@blueprintjs/core'
import RBACTooltip from '@rbac/components/RBACTooltip/RBACTooltip'
import { usePermission, PermissionsRequest } from '@rbac/hooks/usePermission'
import { useFeatures } from '@common/hooks/useFeatures'
import type { PermissionIdentifier } from '@rbac/interfaces/PermissionIdentifier'
import type { FeatureIdentifier } from 'framework/featureStore/FeatureIdentifier'
import type { FeaturesProps } from 'framework/featureStore/featureStoreUtil'
import { FeatureWarningTooltip } from '@common/components/FeatureWarning/FeatureWarningWithTooltip'

export interface ButtonProps extends CoreButtonProps {
  permission?: Omit<PermissionsRequest, 'permissions'> & { permission: PermissionIdentifier }
  featuresProps?: FeaturesProps
}

export interface BtnProps {
  disabled: boolean
  tooltip?: ReactElement
  darkTheme?: boolean
}

const RbacButton: React.FC<ButtonProps> = ({
  permission: permissionRequest,
  featuresProps,
  tooltipProps,
  ...restProps
}) => {
  const { features } = useFeatures({
    featuresRequest: featuresProps?.featuresRequest
  })
  const [canDoAction] = usePermission(
    {
      ...pick(permissionRequest, ['resourceScope', 'resource', 'options']),
      permissions: [permissionRequest?.permission || '']
    } as PermissionsRequest,
    [permissionRequest]
  )

  const keys = useMemo(() => {
    return [...features.keys()]
  }, [features])

  const firstDisabledFeatureIndex: number = useMemo(() => {
    const values = [...features.values()]
    return values.findIndex(feature => !feature.enabled)
  }, [features])

  const featureEnabled = firstDisabledFeatureIndex === -1
  const disabledFeatureName = useMemo(() => {
    return !featureEnabled ? keys[firstDisabledFeatureIndex] : undefined
  }, [featureEnabled, keys, firstDisabledFeatureIndex])

  function getBtnProps(): BtnProps {
    // if permission check override the priorirty
    if (featuresProps?.isPermissionPrioritized && permissionRequest && !canDoAction) {
      return {
        disabled: true,
        tooltip: (
          <RBACTooltip
            permission={permissionRequest.permission}
            resourceType={permissionRequest.resource.resourceType}
            resourceScope={permissionRequest.resourceScope}
          />
        )
      }
    }

    // feature check by default take priority
    if (featuresProps?.featuresRequest && disabledFeatureName) {
      return {
        disabled: true,
        darkTheme: false,
        tooltip: <FeatureWarningTooltip featureName={disabledFeatureName as FeatureIdentifier} />
      }
    }

    // permission check
    if (permissionRequest && !canDoAction) {
      return {
        disabled: true,
        tooltip: (
          <RBACTooltip
            permission={permissionRequest.permission}
            resourceType={permissionRequest.resource.resourceType}
            resourceScope={permissionRequest.resourceScope}
          />
        )
      }
    }

    return {
      disabled: false
    }
  }

  if (!featuresProps?.featuresRequest && !permissionRequest) {
    return <CoreButton {...restProps} tooltipProps={tooltipProps} />
  }

  const btnProps = getBtnProps()
  const { disabled, tooltip, darkTheme } = btnProps

  return (
    <CoreButton
      {...restProps}
      disabled={restProps.disabled || disabled}
      tooltip={disabled ? tooltip : restProps.tooltip ? restProps.tooltip : undefined}
      tooltipProps={
        disabled
          ? {
              hoverCloseDelay: 50,
              className: darkTheme ? Classes.DARK : undefined,
              interactionKind: featureEnabled ? PopoverInteractionKind.HOVER_TARGET_ONLY : PopoverInteractionKind.HOVER
            }
          : tooltipProps
      }
    />
  )
}

export default RbacButton
