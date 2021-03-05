import React from 'react'
import { Container } from '@wings-software/uicore'
import { SetupSourceLayout } from '@cv/components/CVSetupSourcesView/SetupSourceLayout/SetupSourceLayout'
import { SetupSourceTabs } from '@cv/components/CVSetupSourcesView/SetupSourceTabs/SetupSourceTabs'

export function NewRelicMonitoringSource(): JSX.Element {
  return (
    <SetupSourceTabs data={{}} tabTitles={['SemiAuto']} determineMaxTab={() => 1}>
      <SetupSourceLayout content={<Container background="var(--blue-500)" height={100} width={100} />} />
    </SetupSourceTabs>
  )
}
