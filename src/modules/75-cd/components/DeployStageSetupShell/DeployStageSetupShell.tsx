import React from 'react'
import { Layout, Tabs, Tab, Button, Icon } from '@wings-software/uicore'
import cx from 'classnames'
import { Select } from '@blueprintjs/select'
import type { HarnessIconName } from '@wings-software/uicore/dist/icons/HarnessIcons'
import {
  getSelectStageOptionsFromPipeline,
  StageSelectOption
} from '@pipeline/components/PipelineStudio/CommonUtils/CommonUtils'
import type {
  ExecutionGraphAddStepEvent,
  ExecutionGraphEditStepEvent
} from '@pipeline/components/PipelineStudio/ExecutionGraph/ExecutionGraph'
import { DrawerTypes } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineActions'
import { PipelineContext, getStageFromPipeline, ExecutionGraph } from '@pipeline/exports'
import type { StageElementWrapper } from 'services/cd-ng'
import DeployInfraSpecifications from '../DeployInfraSpecifications/DeployInfraSpecifications'
import DeployServiceSpecifications from '../DeployServiceSpecifications/DeployServiceSpecifications'
import DeployStageSpecifications from '../DeployStageSpecifications/DeployStageSpecifications'
import i18n from './DeployStageSetupShell.i18n'
import css from './DeployStageSetupShell.module.scss'

const StageSelection = Select.ofType<StageSelectOption>()

export const MapStepTypeToIcon: { [key: string]: HarnessIconName } = {
  Deployment: 'pipeline-deploy',
  CI: 'pipeline-build-select',
  Approval: 'pipeline-approval',
  Pipeline: 'pipeline',
  Custom: 'pipeline-custom'
}

export default function DeployStageSetupShell(): JSX.Element {
  const stageNames: string[] = [i18n.serviceLabel, i18n.infraLabel, i18n.executionLabel]
  const [selectedTabId, setSelectedTabId] = React.useState<string>(i18n.serviceLabel)
  const layoutRef = React.useRef<HTMLDivElement>(null)
  const {
    state: {
      pipeline,
      pipelineView: {
        splitViewData: { selectedStageId = '', stageType },
        isSplitViewOpen
      },
      pipelineView
    },
    stagesMap,
    stepsFactory,
    updatePipeline,
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
    if (stageNames.indexOf(selectedStageId) !== -1) {
      setSelectedTabId(selectedStageId)
    }
  }, [selectedStageId, pipeline, isSplitViewOpen, stageNames])

  const handleTabChange = (data: string) => {
    setSelectedTabId(data)
  }
  const handleStageChange = (
    selectedStage: StageSelectOption,
    event?: React.SyntheticEvent<HTMLElement, Event> | undefined
  ) => {
    event?.preventDefault()
    event?.stopPropagation()
    const value = selectedStage.value.toString()
    const { stage } = getStageFromPipeline(pipeline, value)

    updatePipelineView({
      ...pipelineView,
      isSplitViewOpen: true,
      splitViewData: {
        ...pipelineView.splitViewData,
        selectedStageId: value,
        stageType: stage?.stage?.type
      }
    })
  }

  React.useEffect(() => {
    if (layoutRef.current) {
      const parent = layoutRef.current.parentElement
      if (parent) {
        parent.scrollTo(0, 0)
      }
    }
  }, [selectedTabId])

  React.useEffect(() => {
    if (selectedTabId === i18n.executionLabel) {
      const { stage: data } = getStageFromPipeline(pipeline, selectedStageId)
      if (data?.stage) {
        if (!data?.stage?.spec?.execution) {
          const openExecutionStrategy = stageType ? stagesMap[stageType].openExecutionStrategy : true
          // if !data?.stage?.spec?.execution and openExecutionStrategy===true show ExecutionStrategy drawer
          if (openExecutionStrategy) {
            updatePipelineView({
              ...pipelineView,
              isDrawerOpened: true,
              drawerData: {
                type: DrawerTypes.ExecutionStrategy
              }
            })
          }
        } else {
          // set default (empty) values
          // NOTE: this cannot be set in advance as data.stage.spec.execution===undefined is a trigger to open ExecutionStrategy for CD stage
          if (data?.stage?.spec?.execution) {
            if (!data.stage.spec.execution.steps) {
              data.stage.spec.execution.steps = []
            }
            if (!data.stage.spec.execution.rollbackSteps) {
              data.stage.spec.execution.rollbackSteps = []
            }
          }
        }
      }
    }
  }, [pipeline, selectedTabId, selectedStageId])

  const selectOptions = getSelectStageOptionsFromPipeline(pipeline)
  const selectedStage = getStageFromPipeline(pipeline, selectedStageId).stage

  return (
    <section className={css.setupShell} ref={layoutRef} key={selectedStageId}>
      <Layout.Horizontal
        spacing="small"
        className={cx(css.tabsContainer, { [css.tabExecution]: selectedTabId === i18n.executionLabel })}
      >
        <Tabs id="stageSetupShell" onChange={handleTabChange} selectedTabId={selectedTabId}>
          <Tab
            id={i18n.defaultId}
            panel={<DeployStageSpecifications />}
            title={
              <span className={cx(css.tab, css.stageDropDownTab)} onClick={e => e.stopPropagation()}>
                <Button
                  className={css.stageDropdownButton}
                  minimal
                  onClick={() => {
                    handleTabChange('default')
                  }}
                >
                  <Icon name={MapStepTypeToIcon[stageData?.type]} size={20} margin={{ left: 'small' }} />
                  {stageData?.name}
                </Button>
                <StageSelection
                  itemRenderer={(item, { modifiers: { disabled }, handleClick }) => (
                    <div key={item.value as string}>
                      <Button
                        icon={MapStepTypeToIcon[item.type]}
                        text={item.label}
                        disabled={disabled}
                        minimal
                        className={css.stageDropDown}
                        onClick={e => handleClick(e as React.MouseEvent<HTMLElement, MouseEvent>)}
                      />
                    </div>
                  )}
                  className={css.stageDropDown}
                  items={selectOptions}
                  onItemSelect={handleStageChange}
                  filterable={false}
                  popoverProps={{ minimal: true }}
                >
                  <Icon
                    className={css.stageDropdownButtonCaret}
                    name="pipeline-stage-selection-caret"
                    size={19}
                    margin={{ left: 'medium', right: 0 }}
                  />
                </StageSelection>
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
            panel={<DeployServiceSpecifications />}
          />
          <Tab
            id={i18n.infraLabel}
            title={
              <span className={css.tab}>
                <Icon name="yaml-builder-stages" height={20} size={20} />
                {i18n.infraLabel}
              </span>
            }
            panel={<DeployInfraSpecifications />}
          />
          <Tab
            id={i18n.executionLabel}
            title={
              <span className={css.tab}>
                <Icon name="yaml-builder-steps" height={20} size={20} />
                {i18n.executionLabel}
              </span>
            }
            panel={
              <ExecutionGraph
                allowAddGroup={true}
                hasRollback={true}
                hasDependencies={false}
                stepsFactory={stepsFactory}
                stage={selectedStage!}
                updateStage={() => {
                  updatePipeline(pipeline)
                }}
                onAddStep={(event: ExecutionGraphAddStepEvent) => {
                  updatePipelineView({
                    ...pipelineView,
                    isDrawerOpened: true,
                    drawerData: {
                      type: DrawerTypes.AddStep,
                      data: {
                        paletteData: {
                          entity: event.entity,
                          // isAddStepOverride: true,
                          isRollback: event.isRollback,
                          isParallelNodeClicked: event.isParallel
                        }
                      }
                    }
                  })
                }}
                onEditStep={(event: ExecutionGraphEditStepEvent) => {
                  updatePipelineView({
                    ...pipelineView,
                    isDrawerOpened: true,
                    drawerData: {
                      type: DrawerTypes.StepConfig,
                      data: {
                        stepConfig: {
                          node: event.node,
                          isStepGroup: event.isStepGroup,
                          addOrEdit: event.addOrEdit
                        }
                      }
                    }
                  })
                }}
              />
            }
          />
        </Tabs>
      </Layout.Horizontal>
      <Layout.Horizontal spacing="medium" padding="medium" className={css.footer}>
        <Button
          text={i18n.previous}
          icon="chevron-left"
          disabled={selectedTabId === i18n.defaultId}
          onClick={() => {
            updatePipeline(pipeline)
            setSelectedTabId(
              selectedTabId === i18n.executionLabel
                ? i18n.infraLabel
                : selectedTabId === i18n.infraLabel
                ? i18n.serviceLabel
                : i18n.defaultId
            )
          }}
        />

        <Button
          text={selectedTabId === i18n.executionLabel ? i18n.save : i18n.next}
          intent="primary"
          rightIcon="chevron-right"
          onClick={() => {
            updatePipeline(pipeline)
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
