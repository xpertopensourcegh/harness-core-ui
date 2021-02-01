import React from 'react'
import { Container, Tabs, Tab, Layout, Color } from '@wings-software/uicore'
import { useStrings } from 'framework/exports'
import DelegateListing from './DelegateListing'
import DelegateConfigurations from './DelegateConfigurations'
import css from './DelegatesPage.module.scss'

export const DelegatesPage: React.FC = () => {
  const { getString } = useStrings()

  return (
    <Layout.Vertical height={'calc(100vh - 64px'} className={css.listPage}>
      <Container className={css.delegateTabs} background={Color.WHITE}>
        <Tabs id="delegateTabs">
          <Tab id="delegate" title={getString('delegate.delegates')} panel={<DelegateListing />} />
          <Tab
            id="delegateConfiguration"
            title={getString('delegate.delegateConfigurations')}
            panel={<DelegateConfigurations />}
          />
        </Tabs>
      </Container>
    </Layout.Vertical>
  )
}

export default DelegatesPage
