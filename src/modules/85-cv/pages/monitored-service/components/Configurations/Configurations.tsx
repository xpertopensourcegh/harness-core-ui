import { Container, Tab, Tabs } from '@wings-software/uicore'
import React from 'react'
import { useStrings } from 'framework/strings'
import Service from './components/Service/Service'
import css from './Configurations.module.scss'

export default function Configurations(): JSX.Element {
  const { getString } = useStrings()

  return (
    <Container className={css.configurationTabs}>
      <Tabs id="configurationTabs" defaultSelectedTabId={getString('service')}>
        <Tab id={getString('service')} title={getString('service')} panel={<Service />} />
        <Tab
          id={getString('pipelines-studio.dependenciesGroupTitle')}
          title={getString('pipelines-studio.dependenciesGroupTitle')}
          disabled
        />
      </Tabs>
    </Container>
  )
}
