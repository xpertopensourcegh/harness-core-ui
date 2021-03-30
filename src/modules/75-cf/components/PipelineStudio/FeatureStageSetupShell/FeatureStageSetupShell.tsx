import React from 'react'
import { Layout, Tabs, Tab, Button, Icon } from '@wings-software/uicore'
import cx from 'classnames'
import { set } from 'lodash-es'
import type {
  ExecutionGraphAddStepEvent,
  ExecutionGraphEditStepEvent,
  ExecutionGraphRefObj
} from '@pipeline/components/PipelineStudio/ExecutionGraph/ExecutionGraph'
import { DrawerTypes } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineActions'
import { PipelineContext, ExecutionGraph } from '@pipeline/exports'

import { AdvancedPanels } from '@pipeline/components/PipelineStudio/StepCommands/StepCommandTypes'
//import { useStrings } from 'framework/exports'
import FeatureInfraSpecifications from '../FeatureInfraSpecifications/FeatureInfraSpecifications'
import FeatureStageSpecifications from '../FeatureStageSpecifications/FeatureStageSpecifications'
import i18n from './FeatureStageSetupShell.i18n'
import css from './FeatureStageSetupShell.module.scss'

export default function FeatureStageSetupShell(): JSX.Element {
  const stageNames: string[] = [i18n.infraLabel, i18n.executionLabel]
  const [selectedTabId, setSelectedTabId] = React.useState<string>(i18n.infraLabel)
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
    updatePipeline,
    getStageFromPipeline,
    updatePipelineView
  } = React.useContext(PipelineContext)

  //const { getString } = useStrings()

  React.useEffect(() => {
    if (stageNames.indexOf(selectedStageId) !== -1) {
      setSelectedTabId(selectedStageId)
    }
  }, [selectedStageId, pipeline, isSplitViewOpen, stageNames])

  const handleTabChange = (data: string): void => {
    setSelectedTabId(data)
  }

  React.useEffect(() => {
    if (layoutRef.current) {
      layoutRef.current.scrollTo(0, 0)
    }
  }, [selectedTabId])

  React.useEffect(() => {
    const { stage: data } = getStageFromPipeline(selectedStageId)
    if (data) {
      let shouldUpdate = false
      if (!data?.stage?.spec?.execution?.steps) {
        set(data, 'stage.spec.execution.steps', [])
        shouldUpdate = true
      }

      if (shouldUpdate) {
        updatePipeline(pipeline)
      }
    }
  }, [pipeline, selectedStageId])

  const selectedStage = getStageFromPipeline(selectedStageId).stage
  const executionRef = React.useRef<ExecutionGraphRefObj | null>(null)
  const navBtns = (
    <Layout.Horizontal spacing="medium" padding="medium" className={css.footer}>
      <Button
        text={i18n.previous}
        icon="chevron-left"
        disabled={selectedTabId === i18n.defaultId}
        onClick={() => {
          updatePipeline(pipeline)
          setSelectedTabId(selectedTabId === i18n.executionLabel ? i18n.infraLabel : i18n.defaultId)
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
            setSelectedTabId(selectedTabId === i18n.defaultId ? i18n.infraLabel : i18n.executionLabel)
          }
        }}
      />
    </Layout.Horizontal>
  )

  return (
    <section
      ref={layoutRef}
      key={selectedStageId}
      className={cx(css.setupShell, { [css.tabsFullHeight]: selectedTabId === i18n.executionLabel })}
    >
      <Tabs id="stageSetupShell" onChange={handleTabChange} selectedTabId={selectedTabId} data-tabId={selectedTabId}>
        <Tab
          panelClassName="tabsfoo"
          id={i18n.defaultId}
          panel={<FeatureStageSpecifications>{navBtns}</FeatureStageSpecifications>}
          title={
            <span className={css.tab}>
              <Icon name="cd-main" height={20} size={20} />
              Stage Overview
            </span>
          }
        />
        <Tab
          id={i18n.infraLabel}
          title={
            <span className={css.tab}>
              <Icon name="yaml-builder-stages" height={20} size={20} />
              {i18n.infraLabel}
            </span>
          }
          panel={<FeatureInfraSpecifications>{navBtns}</FeatureInfraSpecifications>}
        />
        <Tab
          id={i18n.executionLabel}
          title={
            <span className={css.tab}>
              <Icon name="yaml-builder-steps" height={20} size={20} />
              {i18n.executionLabel}
            </span>
          }
          className={css.fullHeight}
          panel={
            <ExecutionGraph
              allowAddGroup={false}
              hasRollback={false}
              hasDependencies={false}
              stepsFactory={stepsFactory}
              ref={executionRef}
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
                        stepsMap: event.stepsMap,
                        onUpdate: executionRef.current?.stepGroupUpdated,
                        // isAddStepOverride: true,
                        isRollback: event.isRollback,
                        isParallelNodeClicked: event.isParallel,
                        hiddenAdvancedPanels: [AdvancedPanels.PreRequisites, AdvancedPanels.DelegateSelectors]
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
                        stepsMap: event.stepsMap,
                        onUpdate: executionRef.current?.stepGroupUpdated,
                        isStepGroup: event.isStepGroup,
                        isUnderStepGroup: event.isUnderStepGroup,
                        addOrEdit: event.addOrEdit,
                        hiddenAdvancedPanels: [AdvancedPanels.PreRequisites, AdvancedPanels.DelegateSelectors]
                      }
                    }
                  }
                })
              }}
            />
          }
        />
      </Tabs>
    </section>
  )
}
