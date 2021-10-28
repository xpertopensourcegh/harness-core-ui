import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Color, Text } from '@wings-software/uicore'
import routes from '@common/RouteDefinitions'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { useStrings } from 'framework/strings'
import css from './HealthSourceDrawerHeader.module.scss'

export default function HealthSourceDrawerHeader({
  isEdit,
  shouldRenderAtVerifyStep,
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
  const history = useHistory()
  const { getString } = useStrings()
  const params = useParams<ProjectPathProps & { identifier: string }>()
  const { routeTitle } = breadCrumbRoute || { routeTitle: getString('cv.healthSource.backtoMonitoredService') }
  return (
    <>
      <Text
        className={css.breadCrumbLink}
        style={{ cursor: 'pointer' }}
        icon={'arrow-left'}
        iconProps={{ color: Color.PRIMARY_7, margin: { right: 'small' } }}
        color={Color.PRIMARY_7}
        onClick={() => {
          if (shouldRenderAtVerifyStep) {
            onClick?.()
            return
          }
          history.push(
            routes.toCVMonitoringServices({
              orgIdentifier: params.orgIdentifier,
              projectIdentifier: params.projectIdentifier,
              accountId: params.accountId
            })
          )
        }}
      >
        {routeTitle}
      </Text>
      <div className="ng-tooltip-native">
        <p>{isEdit ? getString('cv.healthSource.editHealthSource') : getString('cv.healthSource.addHealthSource')}</p>
      </div>
    </>
  )
}
