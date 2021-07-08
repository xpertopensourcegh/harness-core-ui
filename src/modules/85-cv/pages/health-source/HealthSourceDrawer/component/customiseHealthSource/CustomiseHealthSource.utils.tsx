import React from 'react'
import AppDMonitringSource from '@cv/pages/health-source/connectors/AppDMonitringSource'
import type { updatedHealthSource } from '../../HealthSourceDrawerContent'

export const LoadSourceByType = ({
  type,
  data,
  onSubmit
}: {
  type: string
  data: any
  onSubmit: (formdata: any, healthSourceList: updatedHealthSource) => Promise<void>
}): JSX.Element => {
  switch (type) {
    case 'AppDynamics':
      return <AppDMonitringSource data={data} onSubmit={onSubmit} />
    default:
      return <></>
      break
  }
}

export const createHealthsourceList = (formData: any, healthSourcesPayload: updatedHealthSource) => {
  const healthSources = formData.healthSourceList
  // incase healthsource is editing replace eixting one
  const editModeHealthSource = healthSources
    ? healthSources.map((healthSource: { identifier: any }) => {
        if (healthSource.identifier === healthSourcesPayload.identifier) {
          return healthSourcesPayload
        } else {
          return healthSource
        }
      })
    : []

  const healthSourceList = formData?.isEdit
    ? editModeHealthSource // editMode
    : healthSources // previous health sources
    ? [...healthSources, healthSourcesPayload]
    : [healthSourcesPayload] // this is 1st HS of MS

  return healthSourceList
}
