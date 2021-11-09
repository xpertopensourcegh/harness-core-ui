import React from 'react'
import { Color, Text } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import css from './HealthSourceDrawerHeader.module.scss'

export default function HealthSourceDrawerHeader({
  isEdit,
  breadCrumbRoute,
  onClick
}: {
  isEdit?: boolean
  onClick?: () => void
  shouldRenderAtVerifyStep?: boolean
  breadCrumbRoute?: {
    routeTitle: string
  }
}): JSX.Element {
  const { getString } = useStrings()
  const { routeTitle } = breadCrumbRoute || { routeTitle: getString('cv.healthSource.backtoMonitoredService') }
  return (
    <>
      <Text
        className={css.breadCrumbLink}
        style={{ cursor: 'pointer' }}
        icon={'arrow-left'}
        iconProps={{ color: Color.PRIMARY_7, margin: { right: 'small' } }}
        color={Color.PRIMARY_7}
        onClick={onClick}
      >
        {routeTitle}
      </Text>
      <div className="ng-tooltip-native">
        <p>{isEdit ? getString('cv.healthSource.editHealthSource') : getString('cv.healthSource.addHealthSource')}</p>
      </div>
    </>
  )
}
