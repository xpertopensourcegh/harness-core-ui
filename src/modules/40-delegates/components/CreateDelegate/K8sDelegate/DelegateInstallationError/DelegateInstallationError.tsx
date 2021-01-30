import React from 'react'

import { StepProps, Layout, Icon, Text, Color, Tabs, Tab } from '@wings-software/uicore'
import { useStrings } from 'framework/exports'
import CommonProblems from '../../CommonProblems/CommonProblems'

const DelegateInstallationError: React.FC<StepProps<null>> = () => {
  const { getString } = useStrings()
  return (
    <Layout.Vertical padding="large">
      <Layout.Horizontal spacing="small">
        <Icon name="warning-sign" color={Color.ORANGE_600} size={16} />
        <Text>{getString('delegate.delegateNotInstalled.title')}</Text>
      </Layout.Horizontal>
      <Layout.Horizontal spacing="small">
        <Tabs id="delegateNotInstalledTabs">
          <Tab
            id="tabId1"
            title={<Text>{getString('delegate.delegateNotInstalled.tabs.commonProblems.title')}</Text>}
            panel={<CommonProblems />}
          />
          <Tab
            id="tabId2"
            title={<Text>{getString('delegate.delegateNotInstalled.tabs.troubleshooting')}</Text>}
            panel={<div>Hello</div>}
          />
        </Tabs>
      </Layout.Horizontal>
    </Layout.Vertical>
  )
}

export default DelegateInstallationError
