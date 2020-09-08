import React from 'react'
import { Layout, Tabs, Tab, Button, Icon } from '@wings-software/uikit'
import cx from 'classnames'
import type { StageElementWrapper } from 'services/cd-ng'
import { PipelineContext } from 'modules/cd/pages/pipeline-studio/PipelineContext/PipelineContext'
import { getStageFromPipeline } from 'modules/cd/pages/pipeline-studio/StageBuilder/StageBuilderUtil'
import ExecutionGraph from 'modules/cd/pages/pipeline-studio/ExecutionGraph/ExecutionGraph'
import InfraSpecifications from '../InfraSpecifications/InfraSpecifications'
import ServiceSpecifications from '../ServiceSpecifications/ServiceSpecifications'
import StageSpecifications from '../StageSpecifications/StageSpecifications'
import i18n from './StageSetupShell.i18n'
import css from './StageSetupShell.module.scss'

export default function StageSetupShell(): JSX.Element {
  // export default function StageSetupShell({ stageData }: { stageData: { name: string } }): JSX.Element {

  const stageNames: string[] = [i18n.serviceLabel, i18n.infraLabel, i18n.executionLabel]
  const [selectedTabId, setSelectedTabId] = React.useState<string>(i18n.serviceLabel)
  const {
    state: {
      pipeline,
      pipelineView: {
        splitViewData: { selectedStageId = '' },
        isSplitViewOpen
      },
      pipelineView
    },
    updatePipelineView
  } = React.useContext(PipelineContext)

  const [stageData, setStageData] = React.useState<StageElementWrapper | undefined>()

  React.useEffect(() => {
    if (selectedStageId && isSplitViewOpen) {
      const { stage } = getStageFromPipeline(pipeline, selectedStageId)
      const key = Object.keys(stage || {})[0]
      if (key && stage) {
        setStageData(stage[key])
      }
    }
    setSelectedTabId(stageNames.indexOf(selectedStageId) !== -1 ? selectedStageId : i18n.defaultId)
  }, [selectedStageId, pipeline, isSplitViewOpen])

  const handleTabChange = (data: string) => {
    setSelectedTabId(data)
  }

  return (
    <section className={css.setupShell}>
      <Layout.Horizontal
        spacing="small"
        className={cx(css.tabsContainer, { [css.tabExecution]: selectedTabId === i18n.executionLabel })}
      >
        <Tabs id="stageSetupShell" onChange={handleTabChange} selectedTabId={selectedTabId}>
          <Tab
            id={i18n.defaultId}
            panel={<StageSpecifications />}
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
      <Layout.Horizontal spacing="medium" padding="medium" className={css.footer}>
        <Button
          text={i18n.previous}
          icon="chevron-left"
          disabled={selectedTabId === i18n.defaultId}
          onClick={() =>
            setSelectedTabId(
              selectedTabId === i18n.executionLabel
                ? i18n.infraLabel
                : selectedTabId === i18n.infraLabel
                ? i18n.serviceLabel
                : i18n.defaultId
            )
          }
        />

        <Button
          text={selectedTabId === i18n.executionLabel ? i18n.save : i18n.next}
          intent="primary"
          rightIcon="chevron-right"
          onClick={() => {
            if (selectedTabId === i18n.executionLabel) {
              updatePipelineView({ ...pipelineView, isSplitViewOpen: false, splitViewData: {} })
            } else {
              setSelectedTabId(
                selectedTabId === i18n.defaultId
                  ? i18n.serviceLabel
                  : selectedTabId === i18n.serviceLabel
                  ? i18n.infraLabel
                  : i18n.executionLabel
              )
            }
          }}
        />
      </Layout.Horizontal>
    </section>
  )
}
