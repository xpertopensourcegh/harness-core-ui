import React from 'react'
import { Layout, Tabs, Tab, Button, Icon } from '@wings-software/uikit'
import cx from 'classnames'
import type { StageElementWrapper } from 'services/cd-ng'
import { PipelineContext } from 'modules/cd/pages/pipelines/PipelineContext/PipelineContext'
import { getStageFromPipeline } from 'modules/cd/pages/pipelines/StageBuilder/StageBuilderUtil'
import ExecutionGraph from 'modules/cd/pages/pipelines/ExecutionGraph/ExecutionGraph'
import InfraSpecifications from '../InfraSpecifications/InfraSpecifications'
import ServiceSpecifications from '../ServiceSpecifications/ServiceSpecifications'
import i18n from './StageSetupShell.i18n'
import css from './StageSetupShell.module.scss'

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
      const { stage } = getStageFromPipeline(pipeline, selectedStageId)
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
          <Tab
            id={stageData?.name}
            disabled
            title={
              <span className={css.tab}>
                <Icon name="pipeline-deploy" size={20} />
                {`Stage: ${stageData?.name}`}
              </span>
            }
          />
          <Tab
            id={i18n.serviceLabel}
            title={
              <span className={css.tab}>
                <Icon name="service" height={20} size={20} />
                {i18n.serviceLabel}
              </span>
            }
            panel={<ServiceSpecifications />}
          />
          <Tab
            id={i18n.infraLabel}
            title={
              <span className={css.tab}>
                <Icon name="yaml-builder-stages" height={20} size={20} />
                {i18n.infraLabel}
              </span>
            }
            panel={<InfraSpecifications />}
          />
          <Tab
            id={i18n.executionLabel}
            title={
              <span className={css.tab}>
                <Icon name="yaml-builder-steps" height={20} size={20} />
                {i18n.executionLabel}
              </span>
            }
            panel={<ExecutionGraph />}
          />
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
