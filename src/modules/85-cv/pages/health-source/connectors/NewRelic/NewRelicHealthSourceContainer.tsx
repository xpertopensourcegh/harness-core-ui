import React, { useContext, useCallback } from 'react'
import { SetupSourceTabsContext } from '@cv/components/CVSetupSourcesView/SetupSourceTabs/SetupSourceTabs'
import type { UpdatedHealthSource } from '../../HealthSourceDrawer/HealthSourceDrawerContent.types'
import { createNewRelicData, createNewRelicPayload } from './NewRelicHealthSourceContainer.util'
import NewRelicHealthSource from './NewRelicHealthSource'

interface NewRelicHealthSource {
  data: any
  onSubmit: (formdata: any, UpdatedHealthSource: UpdatedHealthSource) => Promise<void>
}

export default function NewrelicMonitoredSourceContainer(props: NewRelicHealthSource): JSX.Element {
  const { data: sourceData, onSubmit } = props
  const { onPrevious } = useContext(SetupSourceTabsContext)

  const handleSubmit = useCallback(
    async (formValues: UpdatedHealthSource) => {
      const newRelicPayload = createNewRelicPayload(formValues)
      if (newRelicPayload) {
        await onSubmit(sourceData, newRelicPayload)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sourceData]
  )

  return (
    <>
      <NewRelicHealthSource
        data={createNewRelicData(sourceData)}
        onSubmit={handleSubmit}
        onPrevious={() => onPrevious(sourceData)}
      />
    </>
  )
}
