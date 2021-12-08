import React, { useContext, useCallback } from 'react'
import { SetupSourceTabsContext } from '@cv/components/CVSetupSourcesView/SetupSourceTabs/SetupSourceTabs'
import type { UpdatedHealthSource } from '../../HealthSourceDrawer/HealthSourceDrawerContent.types'
import { createAppDynamicsData, createAppDynamicsPayload } from './AppDHealthSource.utils'
import AppDMonitoredSource from './AppDHealthSource'

interface AppDynamicsHealthSource {
  data: any
  onSubmit: (formdata: any, UpdatedHealthSource: UpdatedHealthSource) => Promise<void>
}

export default function AppDHealthSourceContainer(props: AppDynamicsHealthSource): JSX.Element {
  const { data: sourceData, onSubmit } = props
  const { onPrevious } = useContext(SetupSourceTabsContext)

  const handleSubmit = useCallback(
    async (value: UpdatedHealthSource) => {
      const appDynamicsPayload = createAppDynamicsPayload(value)
      appDynamicsPayload && (await onSubmit(sourceData, appDynamicsPayload))
    },
    [sourceData]
  )

  return (
    <>
      <AppDMonitoredSource
        data={createAppDynamicsData(sourceData)}
        onSubmit={handleSubmit}
        onPrevious={() => onPrevious(sourceData)}
      />
    </>
  )
}
