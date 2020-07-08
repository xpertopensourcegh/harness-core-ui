import React from 'react'
import { Layout, Tabs, Tab, Button } from '@wings-software/uikit'
import i18n from './StageSetupShell.i18n'
import ServiceSpecifications from '../ServiceSpecifications/ServiceSpecifications'
import InfraSpecifications from '../InfraSpecifications/InfraSpecifications'
import css from './StageSetupShell.module.scss'
export default function StageSetupShell({ stageData }: any): JSX.Element {
  const [selectedTabId, setSelectedTabId] = React.useState(i18n.serviceLabel)

  return (
    <section className={css.setupShell}>
      <Layout.Horizontal spacing="small" className={css.tabsContainer}>
        <Tabs id="stageSetupShell" selectedTabId={selectedTabId}>
          <Tab id={stageData?.name} disabled title={`Stage: ${stageData?.name}`} />
          <Tab id={i18n.serviceLabel} title={i18n.serviceLabel} panel={<ServiceSpecifications />} />
          <Tab id={i18n.infraLabel} title={i18n.infraLabel} panel={<InfraSpecifications />} />
          <Tab id={i18n.executionLabel} title={i18n.executionLabel} disabled panel={<ServiceSpecifications />} />
        </Tabs>
      </Layout.Horizontal>
      <Layout.Horizontal spacing="medium" padding="xlarge">
        <Button
          text={i18n.previous}
          icon="chevron-left"
          disabled={selectedTabId === i18n.serviceLabel}
          onClick={() => setSelectedTabId(selectedTabId === i18n.infraLabel ? i18n.serviceLabel : i18n.infraLabel)}
        />

        <Button
          text={i18n.next}
          intent="primary"
          rightIcon="chevron-right"
          onClick={() => setSelectedTabId(selectedTabId === i18n.serviceLabel ? i18n.infraLabel : i18n.serviceLabel)}
        />
      </Layout.Horizontal>
    </section>
  )
}
