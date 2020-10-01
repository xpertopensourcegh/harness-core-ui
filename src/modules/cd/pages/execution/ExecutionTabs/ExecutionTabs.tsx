import React from 'react'
import { Tabs } from '@blueprintjs/core'

import { ExecutionTab } from '../ExecutionConstants'

import css from './ExecutionTabs.module.scss'

export interface ExecutionTabsProps extends React.PropsWithChildren<{}> {
  currentTab: ExecutionTab
  onTabChange(tab: ExecutionTab): void
}

export default function ExecutionTabs(props: ExecutionTabsProps): React.ReactElement {
  const { currentTab, children, onTabChange } = props

  return (
    <Tabs
      id="execution-header-tabs"
      className={css.main}
      onChange={id => onTabChange(id as ExecutionTab)}
      selectedTabId={currentTab}
      renderActiveTabPanelOnly
    >
      <Tabs.Tab id={ExecutionTab.PIPELINE} title="Pipeline" />
      <Tabs.Tab id={ExecutionTab.INPUTS} title="Inputs" />
      <Tabs.Tab id={ExecutionTab.ARTIFACTS} title="Artifacts" />
      <Tabs.Expander />
      {children}
    </Tabs>
  )
}
