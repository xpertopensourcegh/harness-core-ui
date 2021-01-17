import React from 'react'
import { Layout, Tabs, Tab, Button, Icon } from '@wings-software/uicore'
import cx from 'classnames'
import { Select } from '@blueprintjs/select'
import set from 'lodash-es/set'
import get from 'lodash-es/get'
import type { HarnessIconName } from '@wings-software/uicore/dist/icons/HarnessIcons'
import {
  getSelectStageOptionsFromPipeline,
  StageSelectOption
} from '@pipeline/components/PipelineStudio/CommonUtils/CommonUtils'
import { PipelineContext, getStageFromPipeline, ExecutionGraph } from '@pipeline/exports'
import type { StageElementWrapper } from 'services/cd-ng'
import { DrawerTypes } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineActions'
import type {
  ExecutionGraphAddStepEvent,
  ExecutionGraphEditStepEvent
} from '@pipeline/components/PipelineStudio/ExecutionGraph/ExecutionGraph'
import {
  generateRandomString,
  STATIC_SERVICE_GROUP_NAME,
  StepType
} from '@pipeline/components/PipelineStudio/ExecutionGraph/ExecutionGraphUtil'
import { StepType as StepsStepType } from '@pipeline/components/PipelineSteps/PipelineStepInterface'
import { AdvancedPanels } from '@pipeline/components/PipelineStudio/StepCommands/StepCommandTypes'
import BuildInfraSpecifications from '../BuildInfraSpecifications/BuildInfraSpecifications'
import BuildStageSpecifications from '../BuildStageSpecifications/BuildStageSpecifications'
import i18n from './BuildStageSetupShell.i18n'
import css from './BuildStageSetupShell.module.scss'

const StageSelection = Select.ofType<StageSelectOption>()

export const MapStepTypeToIcon: { [key: string]: HarnessIconName } = {
  Deployment: 'pipeline-deploy',
  CI: 'pipeline-build-select',
  Approval: 'pipeline-approval',
  Pipeline: 'pipeline',
  Custom: 'pipeline-custom'
}

interface StagesFilledStateFlags {
  specifications: boolean
  infra: boolean
  execution: boolean
}

export default function BuildStageSetupShell(): JSX.Element {
  const stageNames: string[] = [i18n.defaultId, i18n.infraLabel, i18n.executionLabel]
  const [selectedTabId, setSelectedTabId] = React.useState<string>(i18n.defaultId)
  const [filledUpStages, setFilledUpStages] = React.useState<StagesFilledStateFlags>({
    specifications: false,
    infra: false,
    execution: false
  })
  const layoutRef = React.useRef<HTMLDivElement>(null)
  const {
    state: {
      pipeline,
      pipelineView: {
        splitViewData: { selectedStageId = '' },
        isSplitViewOpen
      },
      pipelineView
    },
    stepsFactory,
    updatePipelineView,
    updatePipeline
  } = React.useContext(PipelineContext)

  const [stageData, setStageData] = React.useState<StageElementWrapper | undefined>()

  React.useEffect(() => {
    // @TODO: add CI Codebase field check if Clone Codebase is checked
    // once it is added to BuildStageSpecifications (CI-757)
    const specifications = stageData?.name && stageData?.identifier
    const infra =
      stageData?.spec?.infrastructure?.spec?.connectorRef || stageData?.spec?.infrastructure?.useFromStage?.stage
    const execution = !!stageData?.spec?.execution?.steps?.length
    setFilledUpStages({ specifications, infra, execution })
  }, [
    stageData?.name,
    stageData?.identifier,
    stageData?.spec?.infrastructure?.spec?.connectorRef,
    stageData?.spec?.infrastructure?.useFromStage?.stage,
    stageData?.spec?.execution?.steps?.length
  ])

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
      if (parent && parent.scrollTo) {
        parent.scrollTo(0, 0)
      }
    }
  }, [selectedTabId])

  React.useEffect(() => {
    const { stage: data } = getStageFromPipeline(pipeline, selectedStageId)
    if (data) {
      if (!get(data, 'stage.spec.execution.steps', null)) {
        set(data, 'stage.spec.execution.steps', [])
      }
      if (!get(data, 'stage.spec.serviceDependencies', null)) {
        set(data, 'stage.spec.serviceDependencies', [])
      }
    }

    updatePipeline(pipeline)
  }, [])

  React.useEffect(() => {
    const { stage: data } = getStageFromPipeline(pipeline, selectedStageId)
    if (data) {
      if (data?.stage?.spec?.execution) {
        if (!data.stage.spec.execution.steps) {
          data.stage.spec.execution.steps = []
        }
        if (!data.stage.spec.serviceDependencies) {
          data.stage.spec.serviceDependencies = []
        }
      }
    }
  }, [pipeline, selectedStageId])

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
            panel={<BuildStageSpecifications />}
            title={
              <div className={cx(css.tab)}>
                <StageSelection
                  className={css.stageDropdown}
                  itemRenderer={(item, { modifiers: { disabled }, handleClick }) => (
                    <div>
                      <Button
                        icon={MapStepTypeToIcon[item.type]}
                        text={item.label}
                        disabled={disabled}
                        minimal
                        onClick={e => handleClick(e as React.MouseEvent<HTMLElement, MouseEvent>)}
                        className={css.stageDropdownOptions}
                      />
                    </div>
                  )}
                  items={selectOptions}
                  onItemSelect={handleStageChange}
                  filterable={false}
                  popoverProps={{ minimal: true }}
                >
                  <Button className={css.stageDropdownButton} minimal>
                    <Icon name={MapStepTypeToIcon[stageData?.type]} size={30} margin={{ right: 'small' }} />
                    {stageData?.name}
                    {filledUpStages.specifications ? null : (
                      <Icon
                        name="warning-sign"
                        height={10}
                        size={10}
                        color={'orange500'}
                        margin={{ left: 'small', right: 0 }}
                        style={{ verticalAlign: 'baseline' }}
                      />
                    )}
                    <Icon
                      className={css.stageDropdownButtonCaret}
                      name="pipeline-stage-selection-caret"
                      size={19}
                      margin={{ left: 'medium', right: 0 }}
                    />
                  </Button>
                </StageSelection>
              </div>
            }
          />
          <Icon
            name="chevron-right"
            height={20}
            size={20}
            margin={{ right: 'small', left: 'small' }}
            color={'grey400'}
            style={{ alignSelf: 'center' }}
          />
          <Tab
            id={i18n.infraLabel}
            title={
              <span className={css.tab}>
                <Icon name="yaml-builder-stages" height={20} size={20} />
                {i18n.infraLabel}
                {filledUpStages.infra ? null : (
                  <Icon
                    name="warning-sign"
                    height={10}
                    size={10}
                    color={'orange500'}
                    margin={{ left: 'small', right: 0 }}
                    style={{ verticalAlign: 'baseline' }}
                  />
                )}
              </span>
            }
            panel={<BuildInfraSpecifications />}
          />
          <Icon
            name="chevron-right"
            height={20}
            size={20}
            margin={{ right: 'small', left: 'small' }}
            color={'grey400'}
            style={{ alignSelf: 'center' }}
          />
          <Tab
            id={i18n.executionLabel}
            title={
              <span className={css.tab}>
                <Icon name="yaml-builder-steps" height={20} size={20} />
                {i18n.executionLabel}
                {filledUpStages.execution ? null : (
                  <Icon
                    name="warning-sign"
                    height={10}
                    size={10}
                    color={'orange500'}
                    margin={{ left: 'small', right: 0 }}
                    style={{ verticalAlign: 'baseline' }}
                  />
                )}
              </span>
            }
            panel={
              <ExecutionGraph
                allowAddGroup={false}
                hasRollback={false}
                hasDependencies={true}
                stepsFactory={stepsFactory}
                stage={selectedStage!}
                updateStage={() => {
                  updatePipeline(pipeline)
                }}
                onAddStep={(event: ExecutionGraphAddStepEvent) => {
                  if (event.parentIdentifier === STATIC_SERVICE_GROUP_NAME) {
                    updatePipelineView({
                      ...pipelineView,
                      isDrawerOpened: true,
                      drawerData: {
                        type: DrawerTypes.ConfigureService,
                        data: {
                          stepConfig: {
                            node: {
                              type: StepsStepType.Dependency,
                              name: name,
                              identifier: generateRandomString(name)
                            },
                            addOrEdit: 'add',
                            isStepGroup: false,
                            hiddenAdvancedPanels: [AdvancedPanels.FailureStrategy, AdvancedPanels.PreRequisites]
                          }
                        }
                      }
                    })
                  } else {
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
                            isParallelNodeClicked: event.isParallel,
                            hiddenAdvancedPanels: [AdvancedPanels.FailureStrategy, AdvancedPanels.PreRequisites]
                          }
                        }
                      }
                    })
                  }
                }}
                onEditStep={(event: ExecutionGraphEditStepEvent) => {
                  updatePipelineView({
                    ...pipelineView,
                    isDrawerOpened: true,
                    drawerData: {
                      type: event.stepType === StepType.STEP ? DrawerTypes.StepConfig : DrawerTypes.ConfigureService,
                      data: {
                        stepConfig: {
                          node: event.node,
                          isStepGroup: event.isStepGroup,
                          addOrEdit: event.addOrEdit,
                          hiddenAdvancedPanels: [AdvancedPanels.FailureStrategy, AdvancedPanels.PreRequisites]
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
          onClick={() => setSelectedTabId(selectedTabId === i18n.executionLabel ? i18n.infraLabel : i18n.defaultId)}
        />

        <Button
          text={selectedTabId === i18n.executionLabel ? i18n.save : i18n.next}
          intent="primary"
          rightIcon="chevron-right"
          onClick={() => {
            if (selectedTabId === i18n.executionLabel) {
              updatePipelineView({ ...pipelineView, isSplitViewOpen: false, splitViewData: {} })
            } else {
              setSelectedTabId(selectedTabId === i18n.defaultId ? i18n.infraLabel : i18n.executionLabel)
            }
          }}
        />
      </Layout.Horizontal>
    </section>
  )
}
