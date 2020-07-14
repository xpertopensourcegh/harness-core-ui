import React from 'react'
import { Layout, Tabs, Tab, Button } from '@wings-software/uikit'
import i18n from './StageSetupShell.i18n'
import ServiceSpecifications from '../ServiceSpecifications/ServiceSpecifications'
import InfraSpecifications from '../InfraSpecifications/InfraSpecifications'
import css from './StageSetupShell.module.scss'
import cx from 'classnames'
import type { StageElementWrapper } from 'services/cd-ng'
import { PipelineContext } from 'modules/cd/pages/pipelines/PipelineContext/PipelineContext'
import { getStageFromPipeline } from 'modules/cd/pages/pipelines/StageBuilder/StageBuilderModel'
import ExecutionGraph from 'modules/cd/pages/pipelines/ExecutionGraph/ExecutionGraph'

export default function StageSetupShell(): JSX.Element {
  // export default function StageSetupShell({ stageData }: { stageData: { name: string } }): JSX.Element {
  const [selectedTabId, setSelectedTabId] = React.useState(i18n.serviceLabel)
  const {
    state: {
      pipeline,
      pipelineView: { selectedStageId, isSetupStageOpen }
    },
    updatePipelineView
  } = React.useContext(PipelineContext)

  const [stageData, setStageData] = React.useState<StageElementWrapper | undefined>()

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
      <Layout.Horizontal
        spacing="small"
        className={cx(css.tabsContainer, { [css.tabExecution]: selectedTabId === i18n.executionLabel })}
      >
        <Tabs id="stageSetupShell" selectedTabId={selectedTabId}>
          <Tab id={stageData?.name} disabled title={`Stage: ${stageData?.name}`} />
          <Tab id={i18n.serviceLabel} title={i18n.serviceLabel} panel={<ServiceSpecifications />} />
          <Tab id={i18n.infraLabel} title={i18n.infraLabel} panel={<InfraSpecifications />} />
          <Tab id={i18n.executionLabel} title={i18n.executionLabel} panel={<ExecutionGraph />} />
        </Tabs>
      </Layout.Horizontal>
      <Layout.Horizontal spacing="medium" padding="xlarge" style={{ position: 'absolute', bottom: 0 }}>
        <Button
          text={i18n.previous}
          icon="chevron-left"
          disabled={selectedTabId === i18n.serviceLabel}
          onClick={() => setSelectedTabId(selectedTabId === i18n.infraLabel ? i18n.serviceLabel : i18n.infraLabel)}
        />

        <Button
          text={selectedTabId === i18n.executionLabel ? i18n.save : i18n.next}
          intent="primary"
          rightIcon="chevron-right"
          onClick={() => {
            if (selectedTabId === i18n.executionLabel) {
              updatePipelineView({ isSetupStageOpen: false, selectedStageId: undefined })
            } else {
              setSelectedTabId(selectedTabId === i18n.serviceLabel ? i18n.infraLabel : i18n.executionLabel)
            }
          }}
        />
      </Layout.Horizontal>
    </section>
  )
}
