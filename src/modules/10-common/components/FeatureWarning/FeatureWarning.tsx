import React, { ReactElement } from 'react'
import { isEmpty } from 'lodash-es'
import cx from 'classnames'
import { useHistory, useParams } from 'react-router-dom'
import { Button, ButtonSize, ButtonVariation, Color, FontVariation, Layout, Text } from '@wings-software/uicore'
import type { PopoverPosition } from '@blueprintjs/core'
import { useStrings } from 'framework/strings'
import { FeatureDescriptor } from 'framework/featureStore/FeatureDescriptor'
import routes from '@common/RouteDefinitions'
import type { AccountPathProps, Module } from '@common/interfaces/RouteInterfaces'
import { useFeatureModule, useFeatureRequiredPlans } from '@common/hooks/useFeatures'
import type { FeatureIdentifier } from 'framework/featureStore/FeatureIdentifier'
import css from './FeatureWarning.module.scss'

interface FeatureWarningTooltipProps {
  featureName: FeatureIdentifier
  module?: Module
}

interface FeatureWarningProps {
  featureName: FeatureIdentifier
  warningMessage?: string
  className?: string
  tooltipProps?: {
    position: PopoverPosition
    [key: string]: string | boolean
  }
}

export interface ExplorePlansBtnProps {
  module?: Module
  size?: ButtonSize
}

interface WarningTextProps {
  tooltip?: ReactElement
  tooltipProps?: {
    position: PopoverPosition
    [key: string]: string | boolean
  }
}

const ExplorePlansBtn = ({ module, size }: ExplorePlansBtnProps): ReactElement => {
  const { getString } = useStrings()
  const history = useHistory()
  const { accountId } = useParams<AccountPathProps>()
  return (
    <Button
      variation={ButtonVariation.SECONDARY}
      size={size || ButtonSize.MEDIUM}
      onClick={() => history.push(routes.toSubscriptions({ accountId, moduleCard: module, tab: 'PLANS' }))}
    >
      {getString('common.explorePlans')}
    </Button>
  )
}

const WarningText = ({ tooltip, tooltipProps }: WarningTextProps): ReactElement => {
  const { getString } = useStrings()
  return (
    <Text
      className={css.warning}
      icon="warning-sign"
      color={Color.ORANGE_800}
      font={{ variation: FontVariation.TINY, weight: 'bold' }}
      iconProps={{ color: Color.ORANGE_800, padding: { right: 'small' }, size: 15 }}
      tooltip={tooltip}
      tooltipProps={tooltipProps}
    >
      {getString('common.feature.upgradeRequired.title').toUpperCase()}
    </Text>
  )
}

export const FeatureWarningTooltip = ({ featureName, module }: FeatureWarningTooltipProps): ReactElement => {
  const { getString } = useStrings()
  const featureDescription = FeatureDescriptor[featureName] ? FeatureDescriptor[featureName] : featureName
  const requiredPlans = useFeatureRequiredPlans(featureName)
  const requiredPlansStr = requiredPlans.join(' or ')
  return (
    <Layout.Vertical padding="medium" className={css.tooltip}>
      <Text font={{ size: 'medium', weight: 'semi-bold' }} color={Color.GREY_800} padding={{ bottom: 'small' }}>
        {getString('common.feature.upgradeRequired.title')}
      </Text>
      <Layout.Vertical spacing="small">
        <Text font={{ size: 'small' }} color={Color.GREY_700}>
          {getString('common.feature.upgradeRequired.description')}
          {featureDescription}
        </Text>
        {!isEmpty(requiredPlans) && (
          <Text font={{ size: 'small' }} color={Color.GREY_700}>
            {getString('common.feature.upgradeRequired.requiredPlans', { requiredPlans: requiredPlansStr })}
          </Text>
        )}
        <ExplorePlansBtn module={module} />
      </Layout.Vertical>
    </Layout.Vertical>
  )
}

export const FeatureWarningWithTooltip = ({ featureName, tooltipProps }: FeatureWarningProps): ReactElement => {
  const moduleType = useFeatureModule(featureName)
  const module = moduleType && (moduleType.toLowerCase() as Module)
  const tooltip = <FeatureWarningTooltip featureName={featureName} module={module} />
  return <WarningText tooltip={tooltip} tooltipProps={{ position: 'bottom-left', ...tooltipProps }} />
}

export const FeatureWarning = ({ featureName, warningMessage, className }: FeatureWarningProps): ReactElement => {
  const { getString } = useStrings()
  const featureDescription =
    warningMessage || FeatureDescriptor[featureName] ? FeatureDescriptor[featureName] : featureName

  const moduleType = useFeatureModule(featureName)
  const module = moduleType && (moduleType.toLowerCase() as Module)

  return (
    <Layout.Horizontal padding="small" spacing="small" className={cx(css.expanded, className)} flex>
      <WarningText />
      <Text font={{ variation: FontVariation.FORM_HELP }} color={Color.PRIMARY_10}>
        {getString('common.feature.upgradeRequired.description')}
        {featureDescription}
      </Text>
      <ExplorePlansBtn module={module} size={ButtonSize.SMALL} />
    </Layout.Horizontal>
  )
}

export const FeatureWarningBanner = (props: FeatureWarningProps): ReactElement => {
  return (
    <Layout.Horizontal flex className={css.warningBanner}>
      <FeatureWarning {...props} />
    </Layout.Horizontal>
  )
}
