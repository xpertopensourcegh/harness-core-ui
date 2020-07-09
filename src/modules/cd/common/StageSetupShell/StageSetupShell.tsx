import React from 'react'
import { Layout, Tabs, Tab, Button } from '@wings-software/uikit'
import i18n from './StageSetupShell.i18n'
import ServiceSpecifications from '../ServiceSpecifications/ServiceSpecifications'
import InfraSpecifications from '../InfraSpecifications/InfraSpecifications'
import css from './StageSetupShell.module.scss'
import type { StageWrapper } from 'services/ng-temp'
import { PipelineContext } from 'modules/cd/pages/pipelines/PipelineContext/PipelineContext'
import { getStageFromPipeline } from 'modules/cd/pages/pipelines/StageBuilder/StageBuilderModel'

export default function StageSetupShell(): JSX.Element {
  const [selectedTabId, setSelectedTabId] = React.useState(i18n.serviceLabel)
  const {
    state: {
      pipeline,
      pipelineView: { selectedStageId, isSetupStageOpen }
    }
  } = React.useContext(PipelineContext)

  const [stageData, setStageData] = React.useState<StageWrapper | undefined>()

  React.useEffect(() => {
    if (selectedStageId && isSetupStageOpen) {
      const stage = getStageFromPipeline(pipeline, selectedStageId)
      const key = Object.keys(stage || {})[0]
      if (key && stage) {
        setStageData(stage[key])
      }
    }
  }, [selectedStageId, pipeline, isSetupStageOpen])

  return (
    <section className={css.setupShell}>
      <Layout.Horizontal spacing="small" className={css.tabsContainer}>
        <Tabs id="stageSetupShell" selectedTabId={selectedTabId}>
          <Tab id={stageData?.displayName} disabled title={`Stage: ${stageData?.displayName}`} />
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
